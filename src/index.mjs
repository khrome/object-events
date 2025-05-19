import { ExtendedEmitter } from '@environment-safe/event-emitter';
import * as asyncobjects from 'async-objects';

//TODO: switch to accessor lib
function field(root, name, value){
    if(typeof name == 'string') return field(root, name.split('.'), value);
    var current = root;
    var fieldName;
    while(name.length){
        fieldName = name.shift();
        if(!current[fieldName]){
            if(value) current[fieldName] = {};
            else return undefined;
        }
        if(!name.length){
            if(value) current[fieldName] = value;
            return current[fieldName];
        }else current = current[fieldName];
    }
    return undefined;
}

function objectField(obj, field, value){
    Object.defineProperty(obj, field, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: value
    });
}

export const EventedObject = function EventedObject(progenitor, wrap){
    var object = progenitor || {};
    var events = new ExtendedEmitter();
    objectField(object, '__construct__ ', EventedObject);
    /*[add getters and setters to generate events]*/
    objectField(object, 'get', function(fieldName){
        return field(object, fieldName);
    });
    objectField(object, 'set', function(fieldName, value){
        if(wrap) item = wrap(item);
        var val = field(object, fieldName);
        var newValue = field(object, fieldName, value);
        if(val != newValue) events.emit('change', {field : fieldName, value : value, previous : val});
    });
    
    /*[attach AsyncObject methods to generate events]*/
    [
        'forAll', 'forEachBatch', 'forEach', 'merge', 
        'map', 'interleave', 'random', 'filter'//, 'erase'
    ].forEach(function(fieldName){
        objectField(object, fieldName, function(){
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this);
            return asyncobjects[fieldName].apply(asyncobjects, args);
        });
    });
    
    /*[attach emitter methods]*/
    objectField(object, 'on', function(){
        return events.on.apply(events, arguments);
    });
    objectField(object, 'once', function(){
        return events.once.apply(events, arguments);
    });
    objectField(object, 'off', function(){
        return events.off.apply(events, arguments);
    });
    objectField(object, 'emit', function(){
        return events.emit.apply(events, arguments);
    });
    objectField(object, 'setMaxListeners', function(number){
        return events.emitter.setMaxListeners?events.emitter.setMaxListeners(number):undefined;
    });
    return object;
}
EventedObject.is = function(obj){
    return obj && obj['__construct__ '] === EventedObject;
};