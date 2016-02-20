

# ImageBuf

[![Build Status](https://travis-ci.org/yefuwang/ImageBuf.svg?branch=master)](https://travis-ci.org/yefuwang/ImageBuf)

As of 02/12/2016, this software is not stable for production use yet. 

ImageBug accepts images from an external repository (e.g., amazon S3), caches it locally (both on hard drive and in memory), and serves it in memory. It acts as a transparent cache with the ability to make adjustments in between.  

<img src="https://s3.amazonaws.com/wangyefucom/imagebuf.jpg" height="300" />

ImageBuf is maintained by Yefu Wang. Yefu uses ImageBuf in his daughter's WordPress site at. 

## Typical Usage ImageBuf

As a father I take a lot of photos of my daughter. I store them in Amazon S3 with full size. I then run ImageBuf on my tiny instance of Amazon EC2. When my daughter's WordPress requests an image, my ImageBuf will automatically download it from Amazon S3, resize it, and serve it back. The resized image will be cached.

I do not want to store every photo locally (in my EC2 instance) becasue it incures a cost, and will need some effort to maintain it. I do not want to store resized images in Amazon S3 either, due to the maintaince effort. 

ImageBuf makes my photo sharing cheap and easy to maintain. Just drop the pics from my camera to Amazon S3, then I automatically get two URLs: a full-sized images through my S3 (https://s3.amazonaws.com/your_bucket/your_image.jpg), plus a resized image (http://your_domain/your_image.jpg). 

## Usage

node.js app.js OPTIONS
 Required Options:
    --portNumber [portNumber]
    --remotePath [remote_path]
 Optional options
    --resizeWidth  [width]
    --resizeHeight [height]
    --logFile [Path]


