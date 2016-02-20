/**
 * Created by Yefu on 2/16/2016.
 */
;(function () {
    module.exports = CacheServer;
    var url = require('url');
    var LRU = require('lru-cache');

    function CacheServer(sizeLimit_r) {
        this.setParent = function(parent){
            this.parent = parent;
        }

        this.sizeLimit = sizeLimit_r;
        var options = { max: this.sizeLimit, length: function (n) { return n.length }}
        this.cache = LRU(options);
    }

    CacheServer.prototype.serveRequest = function (req, res){
        var request = url.parse(req.url, true);
        var filename = request.pathname;

        //See if it is in the in-memory buffer first
        if(this.sizeLimit!=0 && this.cache.has(filename)) {
            console.log('[MEMORY]', filename);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(this.cache.get(filename), 'binary');
        }
        else{
            var thisObj = this;
            this.parent.load(filename,
                function(content){
                    if(thisObj.sizeLimit!=0) {
                        var setResult = thisObj.cache.set(filename, content);
                    }
                    res.writeHead(200, {'Content-Type': 'image/jpeg'});
                    res.end(content, 'binary');
                },
                function(){
                    res.writeHead(404, {'Content-Type': 'image/jpeg' });
                    res.end();
                }
            );
        }
    }
})()
