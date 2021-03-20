---
layout: post
title: "create logo with inkscape"
date: 2012-08-04 12:25:00
comments: true
categories: resources
---

   最近想为我的域名www.yunnuy.com做一个小logo，于是到网上找了个画矢量图的工具。由于我用的unbutu，在软件中心
矢量类排名第一的就是inkscape了，所以下载了下来，看了点资料，开始动手。
 
   灵感来源与google play中的一些图标，总体思路是方块中放一些文字。 

 1.首先建立一个rectangle，调整他的fill(即中间填充部分)及stroke(即边框)。我调粗了stroke，并改为圆角。

 2.文字部分我打算用一个灵动一些的Y加两个规矩的un，这样不至于单调。不用找艺术字，用brush工具，画出一个Y出来，我画了3笔(3个object)，这样有泼墨的感觉，然后group起来，变成一个object。
 
 3.输入un，选择字体，字号和颜色。这时最大字体也达不到我的要求，我就把un做group操作，之后就可以像个普通对象那样缩放了。 

 4.将y un调整位置，并group。
 
 5.现在有2个object了，一个是框，另一个是3个字yun。我需要把3个字放进框里，我试验了之间拖进去，这样的效果好像是在框里面写两个字，颜色会改变。我想到了layer。我将字移动到另一个layer，然后移动到框中。最后group起来。 

 6.基本形态还不错，但是显得有点单调。再给它加个类似阴影的衬拖。类似第1步，建一个square，调整fill和stroke，然后放在layer2，并移到我图形的右下角落。 

 这样我的第一个log就建好了。学了2个小时左右吧，肯定不是最好的实现方式，但基本也满足我个性化logo的需求了。感谢开源，给我们带来这样便利的工具。