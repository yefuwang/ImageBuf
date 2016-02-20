/**
 * Created by Yefu on 2/17/2016.
 */

;(function(){
    module.exports = ImageMagicFilter;
    var gm = require('gm');

    function ImageMagicFilter(resizeX){
        if(resizeX) {
            this.resizeX = resizeX;
        }
        this.filter = filter;
    }

    function filter(fileName, onSuccess, onError){
        gm(fileName)
            .resize (this.resizeX)
            .toBuffer('PNG', function (err, buffer) {
                if (err){
                    onError();
                }
                else {
                    onSuccess(buffer);
                }
            });
    }
})();
