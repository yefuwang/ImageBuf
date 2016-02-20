var fs = require('fs');
var http = require('http');
var commandLineArgs = require('command-line-args');

var cli = commandLineArgs([
	{ name: 'memoryCacheSize', alias: 'm', type: String },
    { name: 'localFolder', alias: 'f', type: String },
    { name: 'remotePath', alias: 'r', type: String },
    { name: 'logFile', alias: 'l', type: String },
    { name: 'portNumber', alias: 'p', type: Number }
]);

var options = cli.parse();

//Begin setup logging
if(options.logFile != undefined){
	var log4js = require( "log4js" );
	log4js.configure( {appenders: [
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
}
//End setup logging

if(options.portNumber == undefined || options.remotePath == undefined){
	console.log("Required commandline: --portNumber, --remotePath");
	process.exit(1);
}

logger.debug('Start');
var imageBufUtils = require('./lib/imageBufUtils');

var cacheSize = imageBufUtils.parseSize(options.memoryCacheSize);

var CacheServer = require('./lib/cacheServer');
var cacheServer = new CacheServer(100000000);
cacheServer.setLogger(logger);

var LocalFileServer = require('./lib/localFileServer');
var localFileServer = new LocalFileServer();
localFileServer.setLogger(logger);
cacheServer.setParent(localFileServer);

var RemoteFileServer = require('./lib/remoteFileServer');
var remoteFileServer = new RemoteFileServer(options.remotePath);
remoteFileServer.setLogger(logger);
localFileServer.setParent(remoteFileServer);

var ImageMagicFilter = require('./lib/imageMagicFilter');
var imageMagticFilter = new ImageMagicFilter(800);
remoteFileServer.setFilter(imageMagticFilter);

http.createServer(cacheServer.serveRequest.bind(cacheServer)).listen(options.portNumber, '127.0.0.1');

logger.info('Server running at http://127.0.0.1:1337/');
