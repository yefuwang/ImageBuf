/**
 * Created by Yefu on 2/17/2016.
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
            if (!error && response.statusCode == 200) {
                if(typeof thisObj.filter!= 'undefined') {
                    var result = temp.openSync({suffix: '.jpg'});
                    fs.writeSync(result.fd, body, 0, body.length);
                    fs.close(result.fd);
                    thisObj.filter.filter(result.path, function(buffer){
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
        })
    }
})();
