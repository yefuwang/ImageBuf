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
            imageBufUtils.parseSize('15k').should.equal(15*1024);
            imageBufUtils.parseSize('15kb').should.equal(15*1024);
            imageBufUtils.parseSize('15KB').should.equal(15*1024);
        });
        it("Size in MB", function(){
            imageBufUtils.parseSize('1000M').should.equal(1000*1024*1024);
            imageBufUtils.parseSize('15m').should.equal(15*1024*1024);
            imageBufUtils.parseSize('15mb').should.equal(15*1024*1024);
            imageBufUtils.parseSize('15MB').should.equal(15*1024*1024);
        });
        it("Size in GB", function(){
            imageBufUtils.parseSize('1000G').should.equal(1000*1024*1024*1024);
            imageBufUtils.parseSize('15g').should.equal(15*1024*1024*1024);
            imageBufUtils.parseSize('15gb').should.equal(15*1024*1024*1024);
            imageBufUtils.parseSize('15GB').should.equal(15*1024*1024*1024);
        });
        it("Empty size", function(){
            imageBufUtils.parseSize().should.equal(0);
        });
    });
});