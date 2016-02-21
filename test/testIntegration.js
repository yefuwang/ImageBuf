/**
 * Created by Yefu on 2/21/2016.
 */
var assert = require('assert');
var should = require('should');
var imageBuf = require('../lib/imageBuf');
var binRequest = require('request').defaults({encoding: null });

describe('ImageBuf Integration',function(){

    before(function(){
        var options={
            remotePath:'http://s3.amazonaws.com/ellen.wang',
            portNumber:'1337',
            memoryCacheSize:'10MB',
            resizeWidth:'800'
        };
        this.server = new imageBuf(options);
    });

    after(function(){
        this.server.closeServer();
    });

    describe('http request',function(){

        this.timeout(5000);

        it("First Request", function(done){
            binRequest('http://127.0.0.1:1337/2015/dec/birthday/DSC_0002.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                console.log(error);
                console.log(body.length);
                response.statusCode.should.equal(200);
                assert(body.length!=0)
                body.length.should.equal(4994102);
                done();
            });
        });

        it("Second Request: etag not used ", function(done){
            console.log("Before the 2nd ");
            binRequest('http://127.0.0.1:1337/2015/dec/birthday/DSC_0002.JPG', function (error, response, body) {
                console.log('Status:' + response.statusCode);
                response.statusCode.should.equal(200);
                console.log(body.length);
                body.length.should.not.equal(0);
                done();
            });
        });
    });
});

