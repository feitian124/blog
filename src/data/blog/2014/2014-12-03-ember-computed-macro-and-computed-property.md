---
layout: post
title: "ember computed macro and computed property"
description: "ember computed macro and computed property"
pubDatetime: 2014-12-03T10:30:25.000Z
---

最近项目在 ie8 下面碰到性能问题, 费了近一个星期, 终于弄好了.

第一步, 确定原因出在哪. 为排除其他因素, 我建了个很简单的 [repo](https://github.com/feitian124/ember-problems), 来看 ie8 下面 ember 的性能到底咋样,
有兴趣的可以去下载下来跑一跑. 实验很简单, 2个 model:

{% highlight javascript %}

//post
export default DS.Model.extend({
  text: DS.attr('string'),
  comments: DS.hasMany('comment'),
  
  isReaded: false
});

// comment
export default DS.Model.extend({
  text: DS.attr('string'),
  isReaded: false
});

{% endhighlight %}

然后在 模板里直接打印.

{% highlight html %}
{% raw %}
    <ul>
    {{#each}}
      <li>{{text}} <br/>
        {{#each comment in comments}}
          {{comment.text}} <br/>
        {{/each}}
      </li> 
    {{/each}}
    </ul>
{% endraw %}
{% endhighlight %}

结果令人比较失望, 即使是这种最简单的输出, 没有事件处理, 没有什么交互逻辑, 每个 post 包含 2 个 comments 时, 70 个 post 就会报 `long running script` 警告. 或者如果没有 comments, 大约 210 个 post 时, 会报 'long-running script' 警告.

在我真正的项目中, 由于交互的逻辑, 包含的组件数量都多些, 数组的元素中包含超过 20 个元素时, 渲染这个数组 ie8 就会警告.

我们的 ember 版本是 ember 1.7.0, ember-data 1.0.0beta10.

也就是说, ember 在 ie8 下面性能比较差, 不小心很容易就告警了. 但我写代码时, 一开始没怎么考虑性能问题, 比如如下代码:

{% highlight javascript %}
//post
export default DS.Model.extend({
  text: DS.attr('string'),
  comments: DS.hasMany('comment'),
  
  sortedComments: function() {
    return this.get('comments').slice(1).sortBy('id');
  }.property('comments.@each')

  isReaded: false
});
{% endhighlight %}

`sortedComments`是个计算属性, 每当 comments 变化时, `comments.@each`会使得 sortedComments 跟踪 comments 的变化并重新计算自己的值.
问题是, 如果一次新增 10 个 comment 的话,  @each 指示符会让 sortedComments 计算自己 10 次, 然后导致 view 层也被渲染 10 此次. 特别是通过
`加载更多` 操作, 使得数组中的元素个数达到几十个时, 整个的重新渲染数组, ie8 下就铁定报警告了.

那有什么办法呢,没有什么别的办法, 计算属性天生就是这样的, 那我能想到的就是自己维护一个数组而不通过计算属性.

一番重构, 功能是完成了, 但代码复杂度剧增, 增删改都要自己维护, 确实费力不讨好. 

这时, 发现了 Ember.arrayComputed 还要其它基于它的 Ember.computed 宏方法,
它们很多就是为处理计算数组而存在的. 基本原理是这些宏方法底层都基于一个数组, 新增和删除时,都基于原数组操作, 这样变化的只是数组的个别元素, 而不是整个数组,
故 view 层也不会重新渲染整个数组. 只是这方面 ember 的文档说的太简单了, 一直以为 computed macro 和 computed property 是同一个东西, 前者相当于一个语法糖而言, 实际不是的, 前者更像是为 `计算数组` 准备的.

修改后的代码像下面这样:

{% highlight javascript %}
//post
export default DS.Model.extend({
  text: DS.attr('string'),
  comments: DS.hasMany('comment'),
  
  sortedComments: Ember.computed.sort('comments', function(a, b){
    if(a.get('id') > b.get('id')) {
      return -1;
    } else if(a.get('id') < b.get('id')) {
      return 1;
    }
    return 0;
  });

  isReaded: false
});
{% endhighlight %}

按这种方法, 再重构回去, ember在 ie8 下面的性能问题, 也基本得到了控制.