var fs = require('fs');
var http = require('http');

var im = require('imagemagick');
var path=require('path');

//Begin setup logging
var log4js = require( "log4js" );
log4js.configure( {
	  appenders: [
	              { type: 'console' },{
	                type: 'file', 
	                filename: 'imagebuf.log',
	                maxLogSize: 10240000,
	                backups:4,
	                category: 'debug' 
	              }
	            ],
	            replaceConsole: true
	          }) ;
	          
var logger = log4js.getLogger('debug');
logger.setLevel('DEBUG');
process.on('uncaughtException', function(err) {
    // log error 
	logger.fatal(err);
});
//End setup logging

logger.debug('Start');

var CacheServer = require('./lib/cacheServer');
var cacheServer = new CacheServer(100000);
cacheServer.setLogger(logger);

var LocalFileServer = require('./lib/localFileServer');
var localFileServer = new LocalFileServer();
localFileServer.setLogger(logger);
cacheServer.setParent(localFileServer);

var RemoteFileServer = require('./lib/remoteFileServer');
var remoteFileServer = RemoteFileServer('http://s3.amazonaws.com/ellen.wang');

http.createServer(cacheServer.serveRequest.bind(cacheServer)).listen(1337, '127.0.0.1');

logger.info('Server running at http://127.0.0.1:1337/');
