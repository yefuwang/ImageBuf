/**
 * Created by Yefu on 2/20/2016.
 */

exports.parseSize = function(strSize){
    if(strSize == undefined)
        return 0;
    if(!isNaN(strSize))
        return parseInt(strSize);

}