/*!
 * ImageBuf image fileter
 * Copyright(c) 2015-2016 Yefu Wang http://WangYefu.com
 * MIT Licensed
 */


/*
This package current uses gm for graphic manipulation. In the future it should be replaced to a different module.
The drawback of this one is that, it requires the source image to be on the disk. not in memory.
*/

;(function(){
    module.exports = ImageMagicFilter;
    var gm = require('gm');

    /**
     * Constructor for ImageMagicFilter
     * @constructor
     * @param {number} resizeX  The width to resize the image
     * @param {number} resizeY  The height to resize the image
     */
    function ImageMagicFilter(resizeX, resizeY){
        if(resizeX) {
            this.resizeX = resizeX;
            console.log("Starting resizing filter: " + this.resizeX );
        }
        this.filter = filter;
    }

    /**
    * Take the file name to the image, and create a resized image.
    * @function
    * @param {string} filename   Path to the original file
    * @param {filterSuccessCallBack} onSuccess   The callback function to be invoked when done.
    * @param {filterErrorCallBack} onError   The callback function to be invoked when any error condition occurs.
    */
    function filter(fileName, onSuccess, onError){
        gm(fileName)
            .resize (this.resizeX)
            .toBuffer('JPG', function (err, buffer) {
                if (err){
                    onError();
                }
                else {
                    onSuccess(buffer);
                }
            });
    }
})();

/**
 * The callback function to be invoked when the filter succeeds.
 * @callback filterSuccessCallBack
 * @param {Buffer} buffer   The buffer containing the result image
 */

/**
 * The callback function to be invoked when the filter fails.
 * @callback filterErrorCallBack
 */

