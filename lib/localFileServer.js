/**
 * Created by Yefu on 2/16/2016.
 */
;(function(){
    module.exports = LocalFileServer;

    var fs = require('fs');
    var temp = require('temp');

    function LocalFileServer(path){
        if(path) {
            this.path = path;
        }
        else {

            this.path = temp.mkdirSync();
        }
        this.setLogger = function(logger){
            this.logger = logger;
        }
        this.log = function(message, variable){
            if(typeof this.logger!= 'undefined'){
                this.logger.debug(message,variable);
            }
        }
        this.setParent = function(parent){
            this.parent = parent;
        }

        this.setFilter = function(filter){
            this.filter = filter;
        }
    }

    LocalFileServer.prototype.load =  function (fileName, onSuccess, onError){
        //Assume the filename has been sanitized.
        var localfile = this.path;
        localfile = localfile.concat(fileName);
        var localfileResized = localfile.concat('.resize');
        this.log("Checking " + localfileResized);
        fs.readFile(localfileResized, function (err, data) {
            if(!err){
                this.log("Serving from a local filtered copy");
                onSuccess(data);
            }
            else {
                //From now on we can us syned APIs as we are already running in an async function
                //Finish it
                if(typeof this.parent != 'undefined'){
                    this.parent.load(fileName, function(cont){
                        fs.writefile(localfileResized, cont);
                        onSuccess(cont);
                    }, onError)
                }
                else{
                    onError();
                }
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
