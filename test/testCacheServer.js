/**
 * Created by Yefu on 2/20/2016.
 */

var assert = require('assert');
var should = require('should');

var CacheServer = require('../lib/cacheServer');

// Mocked object to feed data to the local cache
var mockParentSuccess={
    load:function(fileName, onSuccess, onError){
        onSuccess("Mocked Object Success");
    },
}

describe('CacheServer',function(){
    describe('Cache can be disabled',function(){

        it("Cache Size: 0", function(){
            var cacheServer = new CacheServer();
            cacheServer.setParent(mockParentSuccess);
            cacheServer._lastReqFromMemory.should.equal(false);

            cacheServer.serveRequest({url:'http://fake.com/fake2.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });

            cacheServer._lastReqFromMemory.should.equal(false);

            //Request the same thing again, it should not be from the memory because the cache size is 0:

            cacheServer.serveRequest({url:'http://fake.com/fake2.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            }, setHeader:function(){} }
            );

            cacheServer._lastReqFromMemory.should.equal(false);
        });

        it("Cache Size: 25", function(){
            var cacheServer = new CacheServer(25);
            cacheServer.setParent(mockParentSuccess);
            cacheServer._lastReqFromMemory.should.equal(false);

            cacheServer.serveRequest({url:'http://fake.com/fake2.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });

            cacheServer._lastReqFromMemory.should.equal(false);

            //Request the same thing again, it should be from the memory because the cache size is enough:
            cacheServer.serveRequest({url:'http://fake.com/fake2.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });

            cacheServer._lastReqFromMemory.should.equal(true);

            cacheServer.serveRequest({url:'http://fake.com/fake3.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });
            cacheServer.serveRequest({url:'http://fake.com/fake4.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });
            cacheServer.serveRequest({url:'http://fake.com/fake5.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });
            cacheServer.serveRequest({url:'http://fake.com/fake3.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });
            cacheServer.serveRequest({url:'http://fake.com/fake4.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });
            cacheServer.serveRequest({url:'http://fake.com/fake5.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });

            cacheServer.serveRequest({url:'http://fake.com/fake2.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);

            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            },setHeader:function(){} });

            cacheServer._lastReqFromMemory.should.equal(false);

        });
    });
});
