---
layout: post
title: "javascript callback(回调)"
date: 2014-05-27 19:18:02
comments: true
categories: work 
---

最近在做前端开发工作,所以写了不少javascript代码.一直对javascript有成见,从前觉得就是浏览器里面做做跑马灯效果,做做验证啊等不严肃的语言. 现在看来我错了,javascript社区很活跃, 从jquery到前端mvc,到后端nodejs, grunt等, javascript的威力越来越强大.


javascript是单线程的语言,很多事件处理需要用到回调,从而也需要保留上下文,故又大量使用必包.最近自己用javascript的这些特性解决了一个碰到的难题,我对javascript的理解也开始上了一个台阶.

场景很简单,我需要在页面上面用canvas画多个图片,故需要在draw函数之前让image对象提前准备好.可是图片的加载都是异步的,我只能在onload回调函数中知晓图片加载完成; 我可以在onload里面维护一个计数器,然后判断计数器如果达到图片个数,我就知道所有图片加载好了.

然后我可以执行一个函数, 可是这个函数我现在还没有呢, 又或者我想图片加载完之后可以按需调用我需要的函数,怎么办呢? 只能用必包.

具体看代码:

{% highlight javascript %}
  /* --------------- call back codes, for example:
     loadImages(['1.gif', '2.gif', '3.gif']).done(function(images){
       alert(images.length);                     //alerts 3
       alert(images[0].src+" "+images[0].width); //alerts '1.gif 220'
     })
   */
  loadImages: function(arr){
    var imgs=[];
    var cnt=0;
    var oneLoaded = function(){
      cnt++;
      if (cnt === arr.length){
        allLoaded(imgs);
      }
    };
    var allLoaded=function(){};
    arr.forEach(function(item){
      var tmp = new Image();
      tmp.src = item;
      tmp.onload = function(){ oneLoaded(); };
      tmp.onerror = function(){ console.log(tmp.src, ' failed to load!'); };
      imgs.push(tmp);
    });
    //return blank object with done() method
    return {
      done:function(f){
        allLoaded=f || allLoaded;
      }
    };
  }
{% endhighlight %}
