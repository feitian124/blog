---
layout: post
title: "ember 中 extend 的小坑: prototype"
description: "ember 中 extend 的小坑: prototype"
pubDatetime: 2014-11-05T14:28:29.000Z
---

ember 中我们用 `extend` 来扩展一个类, 它的工作机制非常类似 prototype. 开发中我几次碰到下面这个问题,
才开始重视这个知识点, 因为平常 `ember` 很好用太容易忽略这些小问题了.

{% highlight javascript %}
var Post = Ember.Object.extend({
  comments: []
}

var good1 = Post.create({comments: []});
var good2 = Post.create({comments: []});

var bad1 = Post.create();
var bad2 = Post.create();

var comment = Comment.create()

good1.get('comments').pushObject(comment);
// good2.get('comments') is []

bad1.get('comments').pushObject(comment);
// bad2.get('comments') is [comment]
{% endhighlight %}

如上述, Post 类有个 `comments` 属性, 如果你往 good 1 和 2 里面加评论, 没有问题.
但如果你往 bad 1 和 2 里面加评论, 它们的评论会同时出现在两个 post 里面!

原因是创建 bad post 时, 没有传入 comments 属性, 所以它们是共享类的 comments 属性的;
可以简单把这种情况下创建的 post 的 comments 是 prototype 的.

解决方法有两个:

- create 时传入 comments.
- 在 init 方法里面 set comments.

下面是 extend 的源码, 可以看到它用到了 reopen, 有兴趣的可以研究下.

{% highlight javascript %}
extend: function extend() {
    var Class = makeCtor();
    var proto;
    Class.ClassMixin = Mixin.create(this.ClassMixin);
    Class.PrototypeMixin = Mixin.create(this.PrototypeMixin);

    Class.ClassMixin.ownerConstructor = Class;
    Class.PrototypeMixin.ownerConstructor = Class;

    reopen.apply(Class.PrototypeMixin, arguments);

    Class.superclass = this;
    Class.__super__  = this.prototype;

    proto = Class.prototype = o_create(this.prototype);
    proto.constructor = Class;
    generateGuid(proto);
    meta(proto).proto = proto; // this will disable observers on prototype

    Class.ClassMixin.apply(Class);
    return Class;
  }
{% endhighlight %}
