var commandLineArgs = require('command-line-args');
var imageBuf = require('./lib/imageBuf');

var cli = commandLineArgs([
    { name: 'remotePath',       alias: 'r', type: String }, // Required
    { name: 'portNumber',      alias: 'p', type: Number },  // Required
	{ name: 'memoryCacheSize', alias: 'm', type: String }, // Optional
    { name: 'localFolder',      alias: 'f', type: String }, // Optional
    { name: 'logFile',          alias: 'l', type: String }, // Optional
    { name: 'resizeWidth',     alias: 'w', type: Number},  // Optional
    { name: 'resizeHeight',    alias: 'h', type: Number}   // Optional
]);

var options = cli.parse();
var server = new imageBuf (options);
 
