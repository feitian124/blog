---
layout: post
title: "ubuntu 12.04 创建启动器"
date: 2012-07-14 01:03
comments: true
categories: work
---

最近又想折腾下android，所有在ubuntu下弄了下开发环境。
值得一提的是，ubuntu下如果你要在命令行里能使用你的
命令，你需要将可执行文件路径加进`$PATH`, 那如果你想在
桌面启动一个应用程序，怎么办呢？

很简单，看我添加`eclipse`的例子：
先添加一个文件`/usr/share/applications/eclipse.desktop`
内容类似如下:
```
[Desktop Entry]
Version=1.0
Name=eclipse
Exec=/home/ming/applications/eclipse/eclipse
Terminal=false
Icon=/home/ming/applications/eclipse/icon.xpm
Type=Application
Categories=Development
```


my development enviroment
-------------
java Develop Kit 1.7  
-----------
installed in `/usr/lib/jvm/jdk1.7.0_05`, configred in `.bashrc`

eclipse 4.2 
----------
installed in  `/home/ming/applications/eclipse`,
added a luncher to `/usr/share/applications/eclipse.desktop`

android SDK 
----------
/home/ming/applications

