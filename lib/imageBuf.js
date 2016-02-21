/**
 * Created by Yefu on 2/21/2016.
 */

;(function(){
    var fs = require('fs');
    var http = require('http');
    var log4js = require('log4js');

    module.exports = ImageBuf;

    function ImageBuf(options){

//Begin setup logging
        if(options.logFile != undefined){

            log4js.configure( {appenders: [
                { type: 'console' },
                { type: 'file', filename: options.logFile, maxLogSize: 10240000, backups:4, category: 'debug' 	}
            ],
                replaceConsole: true
            }) ;

            var logger = log4js.getLogger('debug');
            logger.setLevel('DEBUG');
            process.on('uncaughtException', function(err) {
                // log error
                logger.fatal(err);
            });

            log4js.replaceConsole();
            console.log("Logging begins at " +options.logFile);
        }
//End setup logging

        if(options.portNumber == undefined || options.remotePath == undefined){
            console.log("Required commandline: --portNumber, --remotePath");
            process.exit(1);
        }

        console.log('Start');
        var imageBufUtils = require('./imageBufUtils');

        var cacheSize = imageBufUtils.parseSize(options.memoryCacheSize);

        var CacheServer = require('./cacheServer');
        var cacheServer = new CacheServer(cacheSize);

        var LocalFileServer = require('./localFileServer');
        var localFileServer = new LocalFileServer(options.localFolder);
        cacheServer.setParent(localFileServer);

        var RemoteFileServer = require('./remoteFileServer');
        var remoteFileServer = new RemoteFileServer(options.remotePath);
        localFileServer.setParent(remoteFileServer);

        var startListening = function(thisObj){
            thisObj.server = http.createServer(cacheServer.serveRequest.bind(cacheServer)).listen(options.portNumber, '127.0.0.1');
            console.log('Server running at http://127.0.0.1:'+options.portNumber);
            thisObj.closeServer = function(){
                thisObj.server.close();
            };
        }

        if(options.resizeWidth != undefined || options.resizeHeight != undefined) {
            //Setting up resizing filter. But, check if gm is installed first!
            var thisObj = this;
            imageBufUtils.detectGraphicsMagic(function(){
                //On Found;
                var ImageMagicFilter = require('./imageMagicFilter');
                var imageMagticFilter = new ImageMagicFilter(options.resizeWidth, options.resizeHeight);
                remoteFileServer.setFilter(imageMagticFilter);
                startListening(thisObj);
                },
            function(){
                console.log("gm is not installed. Ignoring all resizing parameters");
                startListening(thisObj);
            }
            );
        }
        else{
            startListening(this);
        }
    }
})();
