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
        it("Return 200", function(){
            var cacheServer = new CacheServer();
            cacheServer.setParent(mockParentSuccess);
            cacheServer.serveRequest({url:'http://fake.com/fake2.jpg'}, { writeHead:function(code, headObj){
                code.should.equal(200);
            },end:function(content, type){
                content.should.equal("Mocked Object Success");
            } });
        });
    });
});
