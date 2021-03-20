---
layout: post
title: "my first gem"
date: 2012-07-11 23:11:00
comments: true
categories: work
---

学了大半年的rails，却还没写过自己到gem，我这个吉他新手，还老需要去翻教材，找一些和弦是如何按的，
于是我决定写一个简单的gem，用来查找这些和弦。思路：  

 1.  将常用和弦以yaml的形式存到文件中  
 2.  设计一个简单的和弦类，它的`to_s`方法显示改和弦，像这样
```
	am
|--0--|-----|-----|-----|-----|
|-----|--1--|-----|-----|-----|
|-----|-----|--3--|-----|-----|
|-----|-----|--2--|-----|-----|
|--0--|-----|-----|-----|-----|
|--0--|-----|-----|-----|-----|

```
 3.  用rake显示多个或指定和弦

我们可以用bundle来新建一个gem，他会替我们生成一个骨架`bundle gem guitar_chords`.  
我的gem是下面这个样子
```
$ tree
.
├── Gemfile
├── Gemfile.lock
├── guitar_chords.gemspec
├── lib
│   ├── guitar_chords
│   │   ├── guitar_chord.rb
│   │   ├── guitar_chords.yml
│   │   └── version.rb
│   └── guitar_chords.rb
├── LICENSE
├── Rakefile
├── README.md
└── spec
    ├── guitar_chords_spec.rb
    └── spec_helper.rb
```
我尝试用SPEC进行TDD，虽然才写了几个test case，却也能在重构时帮我快速找出不少问题。  
配置spec时，碰到一些依赖方面的问题，对于module，require之后才能include。然后路径
的问题，特别是相对路径，如果你在`guitar_chord.rb`中写`guitar_chords/guitar_chords.yml`的
话，不一定能找到，因为当前目录是你调用`spec`时所在的目录，并不是`guitar_chord.rb`的目录。
然后慢慢去翻书，找别人的代码参考，终于实现了个大概。


TODO：  
 1. rake部分  
 2. 用单例模式，在第一次加载`guitar_chords.rb`时load所有的和弦对象。  
你可以查看源码，见<a href="https://github.com/feitian124/guitar_chords">这里</a>

