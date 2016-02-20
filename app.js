var fs = require('fs');
var http = require('http');
var commandLineArgs = require('command-line-args');
var log4js = require( "log4js" );

var cli = commandLineArgs([
	{ name: 'memoryCacheSize', alias: 'm', type: String },
    { name: 'localFolder',      alias: 'f', type: String },
    { name: 'remotePath',       alias: 'r', type: String },
    { name: 'logFile',          alias: 'l', type: String },
    { name: 'portNumber',      alias: 'p', type: Number },
    { name: 'resizeWidth',     alias: 'w', type: Number},
    { name: 'resizeHeight',    alias: 'h', type: Number}
]);

var options = cli.parse();

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
var imageBufUtils = require('./lib/imageBufUtils');

var cacheSize = imageBufUtils.parseSize(options.memoryCacheSize);

var CacheServer = require('./lib/cacheServer');
var cacheServer = new CacheServer(cacheSize);

var LocalFileServer = require('./lib/localFileServer');
var localFileServer = new LocalFileServer(options.localFolder);
cacheServer.setParent(localFileServer);

var RemoteFileServer = require('./lib/remoteFileServer');
var remoteFileServer = new RemoteFileServer(options.remotePath);
localFileServer.setParent(remoteFileServer);

if(options.resizeWidth != undefined || options.resizeHeight != undefined) {
    //Setting up resizing filter. But, check if gm is installed first!
    var exec = require('child_process').exec;
    exec("gm -help", function (error, stdout, stderr) {
        if(error){
            console.log("gm is not installed. Ignoring all resizing parameters");
        }
        else{
            var ImageMagicFilter = require('./lib/imageMagicFilter');
            var imageMagticFilter = new ImageMagicFilter(options.resizeWidth, options.resizeHeight);
            remoteFileServer.setFilter(imageMagticFilter);
        }
    });
}

http.createServer(cacheServer.serveRequest.bind(cacheServer)).listen(options.portNumber, '127.0.0.1');

console.log('Server running at http://127.0.0.1:'+options.portNumber);
