/**
 * Created by Yefu on 2/17/2016.
 */

;(function(){
    modules.exports = ImageMagicFilter;

    function ImageMagicFilter(resizeX){
        if(resizeX) {
            this.resizeX = resizeX;
        }

        this.filter = filter;
    }

    var im = require('imagemagick');

    function filter(fileName, filteredFileName){
        im.resize({
            srcPath: localfile,
            width: this.resizeX,
        }, function(err, stdout, stderr){
            if (err) throw err;
            fs.writeFile(filteredFileName, stdout, 'binary', function(err) {logger.debug('write: ', filteredFileName);});
        });
    }
})();
