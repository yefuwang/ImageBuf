
const imageBuf = require('./lib/imageBuf');

let options = {
	remotePath: process.env.REMOTE_PATH,
	portNumber: process.env.PORT_NUMBER,
	memoryCacheSize: process.env.MEMORY_CACHE_SIZE,
	localFolder:process.env.LOCAL_FOLDER,
	logFile:process.env.LOG_FILE,
	resizeWidth:process.env.RESIZE_WIDTH,
	resizeHeight:process.env.RESIZE_WIDTH
};

console.log("Env: ", JSON.stringify(options));

var server = new imageBuf (options);
