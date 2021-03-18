---
layout: post
title: "ember 开发中的几个小坑"
date: 2014-11-10 23:19:50 +0800
categories: work
tags:
---

### 不能在 ember 项目中任意创建目录
一次折腾项目时想整合 ember 和 express, 在 ember 项目下建了一个 server 目录, 然后 ember start 就报错了.
查了好几个小时没找到原因, 后来才知 server 目录被保留用来存放 mock 相关的文件. ember 和 ember-cli 对目录结构和命名规范均有严格要求,
开发时要注意.

### http-mock 和 http-proxy 在 ember-cli 0.46版本中有问题, 不能一起工作.
具体代码是 `server/index.js` 中的如下几行, 即 bodyParser 将 request 从 stream 转换成了 object, connect-restreamer 将 object
转换回 stream, 但是转换时似乎格式方面有些问题, 所以把两部分同时注释掉之后解决问题. 看我提的这个 [issue](https://github.com/stefanpenner/ember-cli/issues/2424).

{% highlight javascript %}
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  // proxy expects a stream, but express will have turned
  // the request stream into an object because bodyParser
  // has run. We have to convert it back to stream:
  // https://github.com/nodejitsu/node-http-proxy/issues/180
  app.use(require('connect-restreamer')());
{% endhighlight %}

### ie8 下面 jquery 的 click 事件 event.which 的坑

在一个功能中我们在 click 事件中用 event.which 来判断用户按下哪个键, 从而实现禁用右键.
但是在其余浏览器下 event.which 的值都是1, ie8 下面缺是 0, jquery 不认为这是一个 [bug](http://bugs.jquery.com/ticket/12699) 
却建议尽量使用 event.which, 确实有点坑. 解决方法, 使用 event.button 即可.

{% highlight javascript %}
   // should use event.button for click event in ie8
    // see http://bugs.jquery.com/ticket/12699
    if(event.button !== 0) {
      return false;
    }
{% endhighlight %}