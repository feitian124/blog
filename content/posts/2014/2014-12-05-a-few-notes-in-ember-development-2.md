---
layout: post
title: "ember 开发中的几个小坑 2"
date: 2014-12-05 19:47:57
---

1. 数组的 addObjects 方法不能对 undefined 的使用.

{% highlight javascript %}

//假如结果是 undefined 的
var nothing = this.store.get('nothing');
// 下面的代码会出错, 报 forEach 没有定义 
[].addObjects(nothing); 

{% endhighlight %}

原因是 addObjects 会期待形参中的对象有 forEach 方法, 个人觉得这里不要报错啥都不做比较好.

2. 看下面的例子:

{% highlight javascript %}

try {
  var nothing = this.store.get('nothing');
} catch (e) {
  alert('my god, 异步的异常捕捉不带, 咋整?')
}

{% endhighlight %}

`this.store.get` 返回的是 promise, 是一个异步的东东, 如果异步的回调出现问题, 比如 sideload 的数据不对时,
会抛出异常, 而且因为是异步的, 你还不能直接捕捉到, 暂时没想到好的办法, 只能让这部分不出现问题. 我碰到这个问题的原因是 sideload 的数据不完整,
通过修改数据完整性解决.

3. ember 中 controller 的 needs.
在 ember 中是使用 needs 来传递 依赖, 如果每个 controller 对象只有一个实例时, 没有问题. 但如果有多个实例呢, 比如下面这个代码.

{% highlight javascript %}

// PersonController

// BlogController
needs: ['person'],

actions: {

  submit: function() {
    // 下面获得的 person controller 可能是个全新的, 而不是你期望的
    this.get('controllers.person').send('submit');
  }
}

{% endhighlight %}

如果我在模板中 render 了多个 person, ember 不知道你 needs 的是哪一个 person controller,
然后就创了一个新的给你, 然后你就丢掉了上下文, 发现怎么逻辑不对..
{% highlight html %}
{% raw %}

{{#each person in team}}
  {{render 'person' person}}
{{/each}}

{% endraw %}
{% endhighlight %}