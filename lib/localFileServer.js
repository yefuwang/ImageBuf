/**
 * Created by Yefu on 2/16/2016.
 */
;(function(){
    module.exports = LocalFileServer;

    var fs = require('fs');
    var temp = require('temp');
    var path=require('path');

    function LocalFileServer(localPath){
        if(typeof localPath != 'undefined') {
            this.localPath = localPath;
        }
        else {
            this.localPath = temp.mkdirSync();
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

    LocalFileServer.prototype.mkdirP = function(folder){
        if(fs.existsSync(folder)){
            return;
        }
        var parentFolder = path.dirname(folder);
        if(!fs.existsSync(parentFolder)){
            this.log('Parent folder does not exist. Making it');
            this.mkdirP(parentFolder);
        }
        else{
        }
        fs.mkdirSync(folder);
    }

    LocalFileServer.prototype.load =  function (fileName, onSuccess, onError){
        //Assume the filename has been sanitized.
        var localfile = this.localPath;
        localfile = localfile.concat(fileName);
        var localfileResized = localfile.concat('.resize');
        this.log("Checking " + localfileResized);

        var thisObj = this;
        fs.readFile(localfileResized, function (err, data) {
            if(!err){
                thisObj.log("Serving from a local filtered copy");
                onSuccess(data);
            }
            else {
                //From now on we can use syned APIs as we are already running in an async function
                //Finish it
                if(typeof thisObj.parent != 'undefined'){
                    thisObj.log("Loading from parent " );
                    thisObj.parent.load(fileName, function(cont){
                        thisObj.mkdirP(path.dirname(localfileResized));
                        fs.writeFile(localfileResized, cont); // Possible thread collision!
                        onSuccess(cont);
                    }, onError)
                }
                else{
                    thisObj.log("Parent does not exist" );
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
