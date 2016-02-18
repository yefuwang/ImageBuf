/**
 * Created by Yefu on 2/16/2016.
 */
;(function(){
    module.exports = LocalFileServer;

    function LocalFileServer(path){
        this.load = load;
        this.path = path;
        this.setLogger = function(logger){
            this.logger = logger;
        }
        this.log = function(message, variable){
            if(logger){
                logger.debug(message,variable);
            }
        }
        this.setParent = function(parent){
            this.parent = parent;
        }

        this.setFilter = function(filter){
            this.filter = filter;
        }
    }

    var fs = require('fs');
    var binRequest = require('request').defaults({
        encoding: null
    }); //binary data should avoid the default encoding: http://stackoverflow.com/questions/14855015/getting-binary-content-in-node-js-using-request

    function getDataAndFilter(fileName, localFile, localfileResized, onSuccess, onError){
        if( ! fileExists(localfile)) {
            //The file requested not in the local hard drive, get it from external network.
            log("Req: ", sourceURL);
            binRequest(sourceURL, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var folder = path.dirname(localfile);
                    log('Check folder:', folder);
                    try{
                        mkdirP(folder);
                    }catch(err){}

                    fs.writeFile(localfile, body, {encoding: null}, function(err) {
                        if(err) {
                            log(err);
                        } else {
                            log("The file was saved to: ", localfile );
                        }
                    });
                }
            })
        }

        if (fileExists(localfile)) {
            log('LOCAL ORIGINAL');
            if(filter){
                filter(localfile, localfileResized);
            }
            else {
                fs.renameSync(localfile, localfileResized);
            }

            fs.readFile('localfileResized', function (err, data) {
                if (err) {
                    onError();
                }
                else{
                    onSuccess(data);
                }
        });
        }
        else{
            onError();
        }
    }

    function load(fileName, onSuccess, onError){
        //Assume the filename has been sanitized.
        var localfile = path;
        localfile = localfile.concat(filename);
        var localfileResized = localfile.concat('.resize');

        fs.readFile(localfileResized, function (err, data) {
            if(!err){
                log("Serving from a local filtered copy");
                onSuccess(data);
            }
            else {
                //From now on we can us syned APIs as we are already running in an async function
                //Finish it
                getDataAndFilter(fileName, localFile, localfileResized, onSuccess, onError);
            }
        });
    }

    function  fileExists (path){
        try{
            return  fs.statSync(path).isFile;
        }
        catch(err){
            return false;
        }
    }

})()
