

# ImageBuf

[![Build Status](https://travis-ci.org/yefuwang/ImageBuf.svg?branch=master)](https://travis-ci.org/yefuwang/ImageBuf)
[![Coverage Status](https://coveralls.io/repos/github/yefuwang/ImageBuf/badge.svg?branch=dev)](https://coveralls.io/github/yefuwang/ImageBuf?branch=dev)

ImageBug accepts images from an external repository (e.g., amazon S3), caches it locally (both on hard drive and in memory), and serves it in memory. It acts as a transparent cache with the ability to make adjustments in between.

<img src="https://s3.amazonaws.com/wangyefucom/imagebuf.jpg" height="300" />

## Why Using ImageBuf? 

### An example

As a father I take a lot of photos of my daughter. I store them in Amazon S3 with full size. I then run ImageBuf on my tiny instance of Amazon EC2. When my daughter's WordPress requests an image, my ImageBuf will automatically download it from Amazon S3, resize it, and serve it back. The resized image will be cached.

I do not want to store every photo locally (in my EC2 instance) becasue it incures a cost, and will need some effort to maintain it. I do not want to store resized images in Amazon S3 either, due to the maintaince effort. 

ImageBuf makes my photo sharing cheap and easy to maintain. Just drop the pics from my camera to Amazon S3, then I automatically get two URLs: a full-sized images through my S3 (https://s3.amazonaws.com/your_bucket/your_image.jpg), plus a resized image (http://your_domain/your_image.jpg). 

###Advantages over directly serving images

Compared to directly serving from a local storage, using ImageBuf has these advantages:

* Lower cost. External storages like Amazon S3 is typically cheaper than local storage systems like Amazon EBS. Also, as most images will be served from the in-memory cache, the disk IO operations will be significantly reduced while Amazon AWS charges for disk IO operations. 
* Safe. You server will not have write permision to the external storage. You will not expose the address of your external server to the world. 
* Easier to maintain. You do not need to worry about resizing your images for the web manually. 

## Usage

ImageBuf uses graphicsmagick for image resizing. If graphicsmagick is not installed correctly, resizing will be disabled. To install graphicsmagick on ubuntu, run:

sudo apt-get install graphicsmagick

For windows,install [graphicsmagick](http://www.graphicsmagick.org/) and make sure you have the executable of gm on your PATH. Verify by running gm in your command line.

Run ImageBuf under node.js:
<pre>
nodejs app.js OPTIONS

 Required Options:

    --portNumber [portNumber]     The port number that the web server will be hosted on.
    --remotePath [remote_path]

 Optional options

    --resizeWidth  [width]
    --resizeHeight [height]
    --logFile [Path]
    --memoryCacheSize [Size]     The amount of memory that ImageBuf uses as a in-memory cache.
                                 The format can be: 1024, 1000KB. 128MB, etc.Default: 0
</pre>

##Requirements on Node.js

ImageBuf requires node.js version 0.10 or later.Version 0.6 and 0.8 do not pass my unit tests.
For all tested versions, click this icon: [![Build Status](https://travis-ci.org/yefuwang/ImageBuf.svg?branch=master)](https://travis-ci.org/yefuwang/ImageBuf).Generally, the latest version of node.js will work.

##Design

ImageBuf uses etag to help the caching of images.

##Future work

ImageBuf is still under development.All suggestions and comments are very much appreciated.

