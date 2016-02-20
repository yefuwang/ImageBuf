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
        this.setLogger = function(logger){
            this.logger = logger;
        };
        this.log = function(message, variable){
            if(typeof logger != 'undefined'){
                logger.debug(message,variable);
            }
        };
        this.setFilter = function(filter){
            this.filter = filter;
        };
    }

    function load(fileName, onSuccess, onError){
        var remotePath = this.baseURL + fileName;
        this.log("Req: ", remotePath);
        var thisObj = this;
        binRequest(remotePath, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(typeof thisObj.filter!= 'undefined') {
                    var result = temp.openSync({suffix: '.jpg'});
                    console.log(body);
                    fs.writeSync(result.fd, body, 0, body.length);
                    fs.close(result.fd);
                    thisObj.filter.filter(result.path, onSuccess, onError);
                   // fs.unlinkSync(result.path);
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
