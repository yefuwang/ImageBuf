var fs = require('fs');
var http = require('http');
var url = require('url');
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

var binRequest = require('request').defaults({
	  encoding: null
	}); //binary data should avoid the default encoding: http://stackoverflow.com/questions/14855015/getting-binary-content-in-node-js-using-request

var SourceServer = 'http://s3.amazonaws.com/ellen.wang';
var LocalFolder = '/tmp';

var LRU = require('lru-cache')
, options = { max: 100000000
            , length: function (n) { return n.length }}
, cache = LRU(options);


String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

var inMemBuffer = {};

//Build the in-memory buffers;
var diveSync = require("diveSync");
diveSync(LocalFolder, function(err, file) {
  if (err){
	  logger.debug('Error building in-memory buffer', err);
	  return;
  }
  if(file.endsWith('.resize')){
	  logger.debug(file);
	  try{
		  cache.set(file, fs.readFileSync(file, {encoding: null}));
	  }
	  catch(err){
		  logger.debug(err);
	  }
  }
});



var resizeAndServe = function (localfile, localfileResized, res){
	im.resize({
        srcPath: localfile,
        width: 800,
      }, function(err, stdout, stderr){
        if (err) throw err;
        logger.debug('Resized localfile');
        res.writeHead(200, {'Content-Type': 'image/jpeg' });

        cache.set(localfileResized, stdout);

        //Response ends and life continues
        res.end(stdout, 'binary');
		  fs.writeFile(localfileResized, stdout, 'binary', function(err) {logger.debug('write: ', localfileResized);});
      });
}

function mkdirP(folder){

        var parentFolder = path.dirname(folder);
        if(!fs.existsSync(parentFolder)){
		logger.debug('Parent folder does not exist. Making it');
                mkdirP(parentFolder);
        }
	else{
	}
        fs.mkdirSync(folder);
}


var onSourceRequestSucceed = function(body, localfile, res, localfileResized){
        var folder = path.dirname(localfile);
        logger.debug('Check folder:', folder);
        try{
        mkdirP(folder);
        }catch(err){}

        fs.writeFile(localfile, body, {encoding: null}, function(err) {
            if(err) {
                logger.debug(err);
            } else {
                logger.debug("The file was saved to: ", localfile );
                resizeAndServe(localfile, localfileResized, res);
            }
        });
}


var fileExists = function (path){
	try{
		return  fs.statSync(path).isFile;
	}
	catch(err){
		return false;
	}
}

var serveFromFileOrServer = function(res, filename, localfileResized, localfile, sourceURL){
	fs.readFile(localfileResized, function (err, data) {
		  if (err){
			  //From now on we can us syned APIs as we are already running in an async function
			  if(fileExists(localfile)){
				  logger.debug('LOCAL ORIGINAL');
				  resizeAndServe(localfile, localfileResized, res);
			  }
			  else{
				  logger.debug("Req: ", sourceURL);
				  binRequest(sourceURL, function (error, response, body) {
					  if (!error && response.statusCode == 200) {
						  onSourceRequestSucceed(body, localfile, res, localfileResized);
					  }
					  else{
						  logger.debug('404', filename);
						  res.writeHead(404);
						  res.end();
					  }
					})
			  }
		  }
		  else{ //localfileResized exists, read it out and send it back. 
			  logger.debug('LOCAL RESIZED');
			  cache.set(localfileResized, data);
			  res.writeHead(200, {'Content-Type': 'image/jpeg' });
			  res.end(data, 'binary');
		  }
		});
}

var CacheServer = require('./lib/cacheServer');
var cacheServer = new CacheServer(100000);
cacheServer.setLogger(logger);

http.createServer(cacheServer.serveRequest).listen(1337, '127.0.0.1');

logger.info('Server running at http://127.0.0.1:1337/');
