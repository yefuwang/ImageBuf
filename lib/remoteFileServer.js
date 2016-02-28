/*!
 * ImageBuf remote filer server
 * Copyright(c) 2015-2016 Yefu Wang http://WangYefu.com
 * MIT Licensed
 */

;(function(){
    module.exports = RemoteFileServer;

    var binRequest = require('request').defaults({encoding: null }); //binary data should avoid the default encoding: http://stackoverflow.com/questions/14855015/getting-binary-content-in-node-js-using-request
    var temp = require('temp');
    var fs = require('fs');

    function RemoteFileServer(baseURL){
        this.baseURL = baseURL;
        this.load = load;

        this.setFilter = function(filter){
            this.filter = filter;
        };
    }

    function load(fileName, onSuccess, onError){
        var remotePath = this.baseURL + fileName;
        var thisObj = this;
        binRequest(remotePath, function (error, response, body) {
            //console.log(response);
            if (!error && response.statusCode == 200) {
                if(typeof thisObj.filter!= 'undefined') {
                    var result = temp.openSync({suffix: '.jpg'});
                    fs.writeSync(result.fd, body, 0, body.length);
                    fs.close(result.fd);
                    console.log('Before filtering: size = '+body.length);
                    body = null; // a hint to the GC to collect this piece of memory.
                    thisObj.filter.filter(result.path, function(buffer){
                        console.log('After filtering: size = ' + buffer.length);
                        onSuccess(buffer);
                        fs.unlinkSync(result.path);
                    } , onError);
                }
                else{
                    onSuccess(body);
                }
            }
            else{
                onError();
            }
        });
    }
})();
