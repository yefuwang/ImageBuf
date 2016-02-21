/**
 * Created by Yefu on 2/20/2016.
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

exports.sanitize = function(url){
    return url.replace(/\.\./g, '').replace(/[:@#$%]/g, '');
};

exports.formatLog = function (req){
    try {
        var now = new Date()
        return now.toLocaleDateString() + ' ' + now.toLocaleTimeString() + ': ' + req.method + ' ' + req.url + ' ' + req.headers['user-agent'] + req.connection.remoteAddress;
    }
    catch(err){}
    return " ";
};

