/**
 * Created by Yefu on 2/17/2016.
 */

;(function(){
    module.exports = RemoteFileServer;
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

    var binRequest = require('request').defaults({
        encoding: null
    }); //binary data should avoid the default encoding: http://stackoverflow.com/questions/14855015/getting-binary-content-in-node-js-using-request
    var temp = require('temp').track();
    var fs = require('fs');

    function load(fileName, onSuccess, onError){
        var remotePath = baseURL + fileName;
        log("Req: ", remotePath);
        binRequest(sourceURL, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if(!filter) {
                    var result = temp.openSync({suffix: '.jpg'});
                    fs.write(result.fd);
                    fs.close(result.fd);
                    var filtered = filter.filter(result.path);
                    onSuccess(filtered);
                    fs.unlinkSync(result.path);
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
