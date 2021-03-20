---
layout: post
title: "ie8警告: 长时间运行的脚本使得页面没有响应, 是否终止?"
date: 2014-11-24 18:43:25
---

今天测试项目在 ie8 下面的表现, 出现了如下警告:

A script on this page is causing Internet Explorer to run slowly. If it continues to run, your computer may become unresponsive. Do you want to abort the script?

之前并没有出现这个问题, 大概调了一下, 抛出错误的地方是 ember view 模块系统库里面的一个方法, findChildById, 它会递归调用自己. 页面数据并不多,
大概就是 20 个数组, 每个数组 2 个元素. 联想到 taobao 等页面那么多元素也未见报这个错误, 大概率是我们的代码哪里有问题. 那问题出在哪呢? 什么情况下
ie8 会报这个错误呢? 翻看了一些博客已经 MSDN 上的一些文章, 大概找到答案:

Internet Explorer determines that a script is long-running by the total amount of statements the JScript engine has executed. By default, the value is 5 million statements and can be altered via a registry setting. When your script exceeds this maximum number of statements, you’ll get this dialog.

如果一个脚本执行了 500 万行语句还没完结, ie8 就认为这个脚本是 long-running 的, 并抛出上述警告.
另一点时, 虽然 ie8 下报这个警告的概率更大, 其它浏览器如 firefox, safari, chrome 等在脚本运行超过某个阈值时也会抛这个警告.

如果确实是你脚本的逻辑太复杂, 可以将逻辑拆分到 setTimeout 里面, 从而避免这个警告. 

大概知道了它是啥意思, 一个 ember 编译后的文件是挺大的, 有近 10 万行, 但有不少是在回调里面, 效果应该和 setTimeout 类似. 一个 1 万行的逻辑执行了
500 次, 也有500万个语句了, 所以也会报这个错吗? 

不懂的地方还是不少, 只能继续借助 google 和 debugger 慢慢调了, ie 真是前端杀手~


参考:

* http://www.nczonline.net/blog/2009/01/05/what-determines-that-a-script-is-long-running/  
* http://support.microsoft.com/kb/175500
