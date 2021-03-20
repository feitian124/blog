---
layout: post
title: "ember 路由中几个常用方法的执行顺序"
date: 2014-11-19 23:32:12 +0800
categories: work
tags:
---

ember 中 route 指明了你应用的状态, 也提供了几个很常用的方法用来切换状态. 其中最常用的有三个钩子方法:

- model.  获得 model 供 controller 使用.  
- beforeModel. 在 model 方法前执行.
- afterModel. 在 model 方法后执行.

三个方法都会处理 promise, 使用起来很方便. 比如在 beforeModel 中判断用户是否登录, 没登录就跳转至登录页面等.

还有一个常用方法是 setupController, 该方法在 controller 的 init 方法后 调用.

我们知道 application route 总是会执行的, 那么它和其他的 route 会是怎样的执行顺序呢? 今天我刚好碰到了这个问题.

假设我们有 application route, application controller; 还有 users route, users controller, 那么你访问 user
路由时, 这些方法的执行顺序是怎么样的呢? 有点出乎我的意外, 是如下的顺序:

{% highlight javascript %}
application model
users model 

application controller init
application route setupController

users controller init
users route setupController 
{% endhighlight %}

也就是说 model 相关的方法最先执行, 然后依次是各自的 init 和 setupController.