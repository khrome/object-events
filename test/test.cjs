var should = require("should");
var EventedObject = require('../src/legacy.cjs');

var poolSize = 2;

describe('object-events', function(){

    describe('sets values', function(){
        
        it('deep value', function(){
            var ob = new EventedObject();
            ob.set('user.name.first', 'Ed');
            ob.user.name.first.should.equal('Ed');
            ob.get('user.name.first').should.equal('Ed');
            ob.set('user.name.last', 'Beggler');
            ob.user.name.last.should.equal('Beggler');
            ob.get('user.name.last').should.equal('Beggler');
        });
    
    });
    
    describe('fires change events', function(){
        
        it('from .set()', function(complete){
            var ob = new EventedObject();
            var changes = 0;
            ob.on('change', function(event){
                changes++;
            });
            setTimeout(function(){
                changes.should.equal(2);
                complete();
            }, 50);
            ob.set('user.name.first', 'Ed');
            ob.set('user.name.last', 'Beggler');
        });
    
    });
    
    describe('uses forEachEmission', function(){
        
        it('to only perform one action at a time', function(complete){
            var ob = new EventedObject({
                aKey : 'some value',
                anotherKey : 'some other value',
                oneMoreKey : 'yet more'
            });
            var count = 0;
            ob.forEachEmission(function(key, value, done){
                count++;
                count.should.equal(1);
                setTimeout(function(){
                    count--;
                    done();
                }, 50);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses forAllEmissions', function(){
        
        it('to perform all actions in parallel', function(complete){
            var ob = new EventedObject({
                aKey : 'some value',
                anotherKey : 'some other value',
                oneMoreKey : 'yet more'
            });
            var count = 0;
            var lastCount = 0;
            ob.forAllEmissions(function(key, value, done){
                count++;
                count.should.be.above(lastCount);
                lastCount = count;
                setTimeout(function(){
                    count--;
                    done();
                }, 50);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('uses forAllEmissionsInPool', function(){
        
        it('to perform N actions in parallel', function(complete){
            var ob = new EventedObject({
                aKey : 'some value',
                anotherKey : 'some other value',
                oneMoreKey : 'yet more'
            });
            var count = 0;
            ob.forAllEmissionsInPool(poolSize, function(key, value, done){
                count++;
                count.should.be.above(0);
                count.should.be.below(poolSize+1);
                setTimeout(function(){
                    count--;
                    done();
                }, 50);
            }, function(){
                count.should.equal(0);
                complete();
            });
        });
    
    });
    
    describe('self identifies', function(){
        
        it('it is an Object', function(){
            var ob = new EventedObject();
            (typeof ob === 'object').should.equal(true);
        });
        
        it('it is an EventedObject', function(){
            var ob = new EventedObject();
            (EventedObject.is(ob)).should.equal(true);
        });
        
        it('an Object is not an EventedObject', function(){
            EventedObject.is({}).should.equal(false);
        });
        
    });
    
});