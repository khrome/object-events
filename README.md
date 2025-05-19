object-events.js
================

[![NPM version](https://img.shields.io/npm/v/object-events.svg)]()
[![npm](https://img.shields.io/npm/dt/object-events.svg)]()

Is an Object extension class which adds asynchronous functions to Objects as well as firing events on field change

    import { EventedObject } from 'object-events';
    var myObject = new EventedObject();

events
------

*change* : fired any time a field is altered

members
------

get : get a value

    myObject.get('user.first.name');

set : set a value

    myObject.set('user.address.postalcode', '94063');

emitter functions
-----------------

EventedObjects are also [Emitters](http://docs.nodejitsu.com/articles/getting-started/control-flow/what-are-event-emitters) but have an expanded syntax from [@environment-safe/event-emitter](https://github.com/@environment-safe/event-emitter) and the additional `.when()` call.

    myObject.on('change', function(event){ });
    myObject.once('change', function(event){ });
    myObject.off('change', function(event){ });
    myObject.emit('change'[, arguments]);

async functions
---------------

forEach : execute serially

    myObject.forEachEmission(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forAll : execute all jobs in parallel

    myObject.forAllEmissions(function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
forEachBatch : execute all jobs in parallel up to a maximum #, then queue for later

    myObject.forAllEmissionsInPool(poolSize, function(item, index, done){
        somethingAsynchronous(function(){
            done();
        });
    }, function(){
        //we're all done!
    });
    
utility functions
-----------------

map : map each field in the object

    new EventedObject({a:1, b:2}).map(function(value){return value+1}) //returns {a:2, b:3};
    
filter : filter fields from an object

    new EventedObject({a:1, b:2}).filter(function(value){return value == 1}) //returns {a:1};
    
EventedObject.is : is the provided object an instance of EventedArray

    EventedObject.is(new EventedObject()); //returns true
    EventedObject.is({}) //returns false
    

Testing
-------

Run the legacy commonjs test suite
```bash
npm run require-test
```
Run the es module tests to test the root modules
```bash
npm run import-test
```
to run the same test inside the browser with graphical results:

```bash
npm run browser-test
```
to run the same test headless in a browser with commandline results:
```bash
npm run headless-<browser>-test
```
where `<browser>` is one of `firefox`, `safari` or `chrome`
(add `-- --open --head` to open the browsers process for investigation)

Enjoy,

-Abbey Hawk Sparrow