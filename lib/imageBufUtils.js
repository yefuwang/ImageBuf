/*!
 * ImageBuf Utils
 * Copyright(c) 2015-2016 Yefu Wang http://WangYefu.com
 * MIT Licensed
 */


/**
 * Parse a size with units to bytes, e.g., 5MB to 5*1024*1024 bytes
 * @function
 * @param {String} strSize  The size with or without units. If without units, it is treated as bytes
 * @returns {Number} size in bytes
 */
exports.parseSize = function(strSize){
    if(strSize == undefined)
        return 0;
    if(!isNaN(strSize))
        return parseInt(strSize);
    var units={'K':1024, 'k':1024, 'KB':1024, 'Kb':1024, 'kb':1024,
               'M':1024*1024, 'm':1024*1024, 'MB':1024*1024, 'mb':1024*1024,'Mb':1024*1024,
               'gb':1024*1024*1024,'g':1024*1024*1024, 'GB':1024*1024*1024, 'G':1024*1024*1024, 'Gb':1024*1024*1024,
               'tb':1024*1024*1024*1024,'t':1024*1024*102*1024, 'TB':1024*1024*1024*1024, 'T':1024*1024*1024*1024, 'Tb':1024*1024*1024*1024};
    for(var u in units){
        var index = strSize.indexOf(u);
        if( index !=  -1){
            var num = strSize.substring(0, index);
            if(isNaN(num)){
                return -1;
            }
            else {
                return (+num)*units[u];
            }
        }
    }
    return -1;
};

/**
 * Sanitize a request URL to prevent people from doing evil things.
 * @function
 * @param {String} url  The source UTL
 * @returns {String} The sanitized URL.
 */
exports.sanitize = function(url){
    return url.replace(/\.\./g, '').replace(/[:@#$%]/g, '');
};

/**
 * Extract information from a request object for logging
 * @function
 * @param {ClientRequest} req    The request object.
 * @returns {String} The information to be logged.
 */
exports.formatLog = function (req){
    try {
        var now = new Date()
        return now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + ': ' + req.method + ' ' + req.url + ' ' + req.headers['user-agent'] + req.connection.remoteAddress;
    }
    catch(err){}
    return " ";
};

/**
 * Detects if GraphicsMagic has been installed
 * @function
 * @param {function} onFound   Simple callback to be invoked when GraphicsMagic is detected
 * @param {function} onNotFound   Simple callback to be invoked when GraphicsMagic is not detected
 */
exports.detectGraphicsMagic = function( onFound, onNotFound ){
    var exec = require('child_process').exec;
    exec("gm -help", function (error, stdout, stderr) {
        if(error){
            if(onNotFound!=undefined) {
                onNotFound();
            }
        }
        else{
            if(onFound!=undefined){
                onFound();
            }
        }
    });
}
