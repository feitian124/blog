---
layout: post
title: "pipeline in rails3.1+"
date: 2012-12-02 16:22
comments: true
categories: rails
---
 pipeline 是rails3.1后引进的一个很有用的特性，它可以：
 1. 将你的 js，css 等静态资源 compile 到一个文件，减少了浏览器到服务器取这些资源时的连接数量；
 2. 压缩这个加工后的文件，并添加时间戳，减少了文件体积及加载次数；
 3. 可以放在 app,lib,vendor 的 asset 目录下，方便管理, 同时也让你可以用 help 方法方便的访问这些 resource；
 
 以 js 文件举例子, 在app/asset/javascript中有一个 application.js 文件，它的内容如下:
```
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//
//= require jquery
//= require jquery_ujs
//= require twitter/bootstrap
//= require sequence.jquery-min.js
//= require_tree .
```

很简单，你可以将`app/assets/javascripts`, `lib/assets/javascripts`, `vendor/assets/javascripts`想象成一个逻辑目录，
然后 rails 的 pipeline 引擎会到逻辑目录里去找这个文件中提到的 js 文件，然后 compile 到application.js里面去。**但是有个例外，在上面
的例子中，require_tree不会到逻辑目录里去找，而是只到'app/assets/javascripts'里去找。**

<pre>
The require_tree directive tells Sprockets to recursively include all JavaScript files in the specified directory into the output. These paths must be specified relative to the manifest file. You can also use the require_directory directive which includes all JavaScript files only in the directory specified, without recursion.
</pre>

希望能帮到一些人, 不会像我一样错误的理解一个知识点，浪费2个小时找js文件为什么没有。。。

 <!-- more -->
