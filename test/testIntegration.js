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
        it("First Request", function(){
            binRequest('http://127.0.0.1:1337/2015/dec/birthday/DSC_0002.JPG', function (error, response, body) {
                //console.log(response);
                error.should.equal(false);
                response.statusCode.should.equal(200);
                body.length.should.notEqual(0);
            });
        });
    });
});

