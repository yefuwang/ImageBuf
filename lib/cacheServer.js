/**
 * Created by Yefu on 2/16/2016.
 */
;(function () {
    module.exports = CacheServer;
    var url = require('url');
    var LRU = require('lru-cache');
    var ibUtils = require('./imageBufUtils');
    var log4js = require( "log4js" );
    var logger = log4js.getLogger('debug');
    var etag = require('etag')


    function CacheServer(sizeLimit_r) {
        this.setParent = function(parent){
            this.parent = parent;
        }

        if( sizeLimit_r!= undefined) {
            this.sizeLimit = (+sizeLimit_r);
        }
        else {
            this.sizeLimit = 0;
        }

        var options = { max: this.sizeLimit, length: function (n) { return n.length; }}
        this.cache = LRU(options);

        //Probe for unit testing
        this._lastReqFromMemory = false;
    }

    CacheServer.prototype.serveRequest = function (req, res){

        logger.debug(ibUtils.formatLog(req) );
        var request = url.parse(req.url, true);
        var filename = ibUtils.sanitize(request.pathname);

        //See if it is in the in-memory buffer first
        if(this.sizeLimit!=0 && this.cache.has(filename)) {
            var etagVal = etag(this.cache.get(filename));
            if(req.headers != undefined && req.headers['if-none-match'] == etagVal){
                logger.debug('304: ');
                res.setHeader('Cache-Control','public, max-age=2592000');
                res.setHeader('ETag', etagVal);
                res.writeHead(304);
                res.end();
            }
            else {
                logger.debug('[MEMORY]', filename);
                res.setHeader('Cache-Control','public, max-age=2592000');
                res.setHeader('ETag', etagVal);
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.end(this.cache.get(filename), 'binary');
                this._lastReqFromMemory = true;
            }
        }
        else{
            var thisObj = this;
            this.parent.load(filename,
                function(content){
                    if(thisObj.sizeLimit!=0) {
                        var setResult = thisObj.cache.set(filename, content);
                    }
                    res.setHeader('Cache-Control','public, max-age=2592000');
                    res.setHeader('ETag', etag(content));
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.end(content, 'binary');
                    content=null; // a hint to GC
                },
                function(){
                    res.writeHead(404, {'Content-Type': 'image/jpeg' });
                    res.end();
                }
            );
            this._lastReqFromMemory = false;
        }
    }
})()
