/**
 * Created by Yefu on 2/20/2016.
 */


var assert = require('assert');
var should = require('should');
var imageBufUtils = require('../lib/imageBufUtils');


describe('ImageBufUtils',function(){
    describe('parseSize',function(){
        it("Size in Bytes", function(){
            imageBufUtils.parseSize(1000).should.equal(1000);
            imageBufUtils.parseSize('1000').should.equal(1000);
        });
        it("Size in KB", function(){
            imageBufUtils.parseSize('1000K').should.equal(1000*1024);
        });
    });
});