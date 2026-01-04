---
title: "前端画图调研"  
description: "前端画图调研"
pubDatetime: 2021-09-12T03:00:08.000Z
tags: ["canvas", "svg"]  
categories: ["work"]  
series: ["前端"]  
---

最近公司有个项目有电力图方面的图形编辑和可视化需求， 包括：

1. 图元（设备、线、文字等）的编辑(拖曳,分布,组合)、保存、查找等操作.
2. 图的编辑(拖曳,分布,组合)、保存、查找等操作
3. 图与档案运行状态的联动
4. 通过配置的档案信息自动生成监视图形。

我做了一些调研并基于此做了一些开发工作， 目前还算成功，把调研过程和成果简单分享一下。

## 调研

支持现代浏览器(chrome, firefox), 不支持 ie8 和 ie11
需要: 2d, canvas, webgl, 画布状态,
不需要: 3d, 碰撞检测, 游戏引擎

主要考虑流行度成熟度(star)， 商业友好(license),  特性满足需求， 生态好， 学习成本低(文档好)。
经考察， 最终选择 topology 这个开源项目， 加 nuxtjs 实现.

![architecture](/images/2021-09-13-web-draw.png ':size=600')

### 开源软件

学习和开发成本, 自有产权

- [topology, 可视化在线绘图工具](https://github.com/le5le-com/topology), 2.7k star, license MIT
[基于开源内核实现的绘图编辑器topology-vue 使用指南](https://juejin.cn/post/6900758398816485383)

- [X6 是 AntV 旗下的图编辑引擎](https://github.com/antvis/X6), 1.6k star, license MIT
[antv家族](https://antv.gitee.io/zh)

- [pixi.js, The HTML5 Creation Engine](https://github.com/pixijs/pixi.js), 32.4k star, license MIT

- [https://github.com/fanrax/circuitDiagram](https://github.com/fanrax/circuitDiagram), cli 开源, web 编辑器不开源, 网站上有很多不错的元器件图
https://www.circuit-diagram.org/circuits

- [mxGraph, client side JavaScript diagramming library](https://github.com/process-analytics/mxgraph), 6k star, license 未知, Archived

- [基于VUE的web组态:组态，拓扑图，拓扑编辑器](https://github.com/phynos/WebTopo), 0.2k star, license MIT

- [http://www.jtopo.com/demo/statictis.html](http://www.jtopo.com/demo/statictis.html), 没仓库, 文档欠缺, 示例
[https://github.com/wenyuan/jtopo_topology](https://github.com/wenyuan/jtopo_topology)

- [Powerful SVG-Editor](https://github.com/SVG-Edit/svgedit), 4.2k star, license MIT

- [the SVG Editor](https://github.com/methodofaction/Method-Draw), 1.9k star, license MIT

### 商业软件

内置组件, 开箱即用, 收费, 无产权

- [qunee 一套基于HTML5的网络图组件](http://doc.qunee.com/index.html), 授权给单个项目、单个域名、含半年支持和升级服务, 永久授权 ￥30,000

- [ThingJS 是物联网可视化PaaS开发平台](https://store.thingjs.com/projects),  1个在线开发VIP(年)  +  1个项目离线部署(永久), ￥15,798

- [https://gojs.net.cn/index.html](https://gojs.net.cn/index.html), 单个开发者授权, 终身授权，仅限一个开发者使用, ￥23,067

- [https://www.hightopo.com/demo/electric-bling/index.html](https://www.hightopo.com/demo/electric-bling/index.html), 价格未知
[HT for Web 表单手册](https://www.hightopo.com/guide/guide/core/treetableview/examples/example_structure.html)

## 参考资料
- [电力系统一次系统接线图设计与要求](https://wenku.baidu.com/view/0e79d52a964bcf84b9d57b63.html)
- [变电站一次接线图详解，值得收藏](http://www.360doc.cn/mip/906506133.html)
- [最火前端Web组态软件(可视化)](https://blog.csdn.net/yb305/article/details/109118748)
- [开源HTML5拓扑图绘制工具](https://www.zhihu.com/question/41026400)

- demo_cnblogs.html
[一次接线图使用svg开发](https://www.cnblogs.com/LcxSummer/p/12396999.html)

- https://mychartguide.com/best-circuit-diagram-makers/
