/*!
 * ImageBuf
 * Copyright(c) 2015-2016 Yefu Wang http://WangYefu.com
 * MIT Licensed
 */

; (function () {
    var fs = require('fs');
    var http = require('http');
    var log4js = require('log4js');

    module.exports = ImageBuf;

    /**
     * Constructor for ImageBuf
     * @constructor
     * @param {Object} options         Options to constuct ImageBuf. Details:
     *                                    {String} 'remotePath':  [required] The base URL to the remote server
     *                                    {Number} 'portNumber':  [required] The port number used to create the server
     *                                    {String} 'memoryCacheSize': [Optional] The size of the cache, in bytes or with units. e.g. 1024000, 100MB,5TB. Default: 0, i.e. disabled
     *                                    {String} 'localFolder':     [Optional] The local folder to cache results. Default: create a random folder under system temp directory
     *                                    {String} 'logFile',  [Optional] Path to the log file
     *                                    {Number} 'resizeWidth' [Optional] The width to resize the image Default: no resize
     *                                    {Number} 'resizeHeight',[Optional] The height to resize the image Default: no resize
     * @param {function} onSuccess    call back to be invoked when the server is ready to accept reuqests
     */
    function ImageBuf(options, onSuccess) {

        //Begin setup logging
        if (options.logFile != undefined) {

            log4js.configure({
                appenders: [
                    { type: 'console' },
                    { type: 'file', filename: options.logFile, maxLogSize: 10240000, backups: 4, category: 'debug' }
                ],
                replaceConsole: true
            });

            var logger = log4js.getLogger('debug');
            logger.setLevel('DEBUG');
            process.on('uncaughtException', function (err) {
                // log error
                logger.fatal(err);
            });

            log4js.replaceConsole();
            console.log("Logging begins at " + options.logFile);
        }
        //End setup logging

        if (options.portNumber == undefined || options.remotePath == undefined) {
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

        var startListening = function (thisObj) {
            thisObj.server = http.createServer(cacheServer.serveRequest.bind(cacheServer)).listen(options.portNumber, '127.0.0.1');
            console.log('Server running at http://127.0.0.1:' + options.portNumber);
            thisObj.closeServer = function () {
                thisObj.server.close();
            };

            if (onSuccess != undefined) {
                onSuccess();
            }
        }

        if (options.resizeWidth != undefined || options.resizeHeight != undefined) {
            //Setting up resizing filter. But, check if gm is installed first!
            var thisObj = this;
            imageBufUtils.detectGraphicsMagic(function () {
                //On Found;
                var ImageMagicFilter = require('./imageMagicFilter');
                var imageMagticFilter = new ImageMagicFilter(options.resizeWidth, options.resizeHeight);
                remoteFileServer.setFilter(imageMagticFilter);
                startListening(thisObj);
            },
                function () {
                    console.log("gm is not installed. Ignoring all resizing parameters");
                    startListening(thisObj);
                }
            );
        }
        else {
            startListening(this);
        }
    }
})();
