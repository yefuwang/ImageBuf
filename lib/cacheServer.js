/**
 * Created by Yefu on 2/16/2016.
 */
;(function () {
    if (typeof module === 'object' && module.exports) {
        module.exports = CacheServer;
    } else {
        // just set the global for non-node platforms.
        this.CacheServer = CacheServer;
    }

    function CacheServer(sizeLimit_r) {
        this.serveRequest = serveRequest;
        this.setParent = function(parent){
            this.parent = parent;
        }

        this.sizeLimit = sizeLimit_r;
        this.setLogger = function(logger){
            this.logger = logger;
        }
        this.log = function(message, variable){
            if(logger){
                logger.debug(message,variable);
            }
        }

        var LRU = require('lru-cache');
        var options = { max: this.sizeLimit, length: function (n) { return n.length }}
        this.cache = LRU(options);
    }

    function serveRequest(req, res){
        var request = url.parse(req.url, true);
        var filename = request.pathname;
        var sourceURL = SourceServer.concat(filename);
        var localfile = LocalFolder.concat(filename);
        var localfileResized = localfile.concat('.resize');

        //See if it is in the in-memory buffer first
        if(cache.has(localfileResized)) {
            log('[MEMORY]', localfileResized);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.end(cache.get(localfileResized), 'binary');
        }
        else{
            parent.load(fileName,
                function(content){
                    cache.set(localfileResized, content);
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
