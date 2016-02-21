/**
 * Created by Yefu on 2/21/2016.
 */
var assert = require('assert');
var should = require('should');
var imageBuf = require('../lib/imageBuf');
var binRequest = require('request').defaults({encoding: null });
var express = require('express');


describe('ImageBuf Integration with no resizing',function(){
    before(function(){
        this.remoteServer = express();
        this.remoteServer.use(express.static('test'));
        this.remoteServerCloseHandle = this.remoteServer.listen(1338);

        var options={
            remotePath:'http://127.0.0.1:1338',
            portNumber:'1337',
            memoryCacheSize:'10MB'
            //resizeWidth:'800'
        };
        this.server = new imageBuf(options);
    });

    after(function(){
        this.server.closeServer();
        this.remoteServerCloseHandle.close();
    });

    describe('http request',function(){

        this.timeout(5000);

        it("First Request", function(done){
            binRequest('http://127.0.0.1:1337/TestImage.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                console.log(error);
                console.log(body.length);
                response.statusCode.should.equal(200);
                assert(body.length!=0)
                body.length.should.equal(4726121);
                done();
            });
        });

        it("Second Request: etag not used ", function(done){
            console.log("Before the 2nd ");
            binRequest('http://127.0.0.1:1337/TestImage.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                response.statusCode.should.equal(200);
                console.log(body.length);
                body.length.should.not.equal(0);
                done();
            });
        });

        it("File does not exist ", function(done){
            console.log("Before the 2nd ");
            binRequest('http://127.0.0.1:1337/TestImage_does_not_exist.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                response.statusCode.should.equal(404);
                console.log(body.length);
                body.length.should.equal(0);
                done();
            });
        });
    });
});

describe('ImageBuf Integration with resizing',function(){
    before(function(){
        this.remoteServer = express();
        this.remoteServer.use(express.static('test'));
        this.remoteServerCloseHandle = this.remoteServer.listen(1338);

        var options={
            remotePath:'http://127.0.0.1:1338',
            portNumber:'1336',
            memoryCacheSize:'10MB',
            resizeWidth:'800'
        };
        this.server = new imageBuf(options);
    });

    after(function(){
        this.server.closeServer();
        this.remoteServerCloseHandle.close();
    });

    describe('http request',function(){

        this.timeout(5000);

        it("First Request", function(done){
            binRequest('http://127.0.0.1:1336/TestImage.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                console.log(error);
                console.log(body.length);
                response.statusCode.should.equal(200);
                assert(body.length!=0)
                body.length.should.equal(83485);
                done();
            });
        });

        it("Second Request: etag not used ", function(done){
            console.log("Before the 2nd ");
            binRequest('http://127.0.0.1:1336/TestImage.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                response.statusCode.should.equal(200);
                console.log(body.length);
                body.length.should.not.equal(0);
                done();
            });
        });

        it("File does not exist ", function(done){
            console.log("Before the 2nd ");
            binRequest('http://127.0.0.1:1336/TestImage_does_not_exist.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                response.statusCode.should.equal(404);
                console.log(body.length);
                body.length.should.equal(0);
                done();
            });
        });
    });
});

