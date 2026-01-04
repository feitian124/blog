---
title: "我的一些小点子"
description: "我的一些小点子"
pubDatetime: 2021-02-01T15:26:08.000Z
draft: true
---

## 服装店版本
日历功能：
1. 显示接下来的大事件，比如圣诞节，双11等，合理安排货品和库存，或换机。
2.显示接下来的天气，自动上架和调整显示权重。

##　简书文章导出备份
来到简书后写了几篇文章，然后意识到备份文章及转换成不同的格式，是一个较普遍的需求，研究了一下简书自带的导出功能较简单，于是打算练练手，完成这么一个小产品。

## tidb 学习系列

1.  coprocessor on unistore
https://docs.google.com/document/d/1LIMuHv1wcI1VgfWo8KQK9RPlPXzoAuJHNy4Est1paF4/edit?pli=1#heading=h.efxhx09hxyyo

2.  statistics
https://github.com/pingcap/tidb-dev-guide/pull/70

## 博客联盟

最近整理自己的博客, 主要使用 hugo 等静态生成器方案, 发现还是欠缺一些基础服务, 或者不太好用:

1. 计数和统计, 可以在页面展示的. 只发现了不蒜子计数器.

2. 评论. 可以整合 disqus, gitalk 等.

3. 博客的发现和互访.  目前只能通过搜索引擎, 但是个人站点权重会很低. 所以想做个类似微服务`服务注册和发现`或者 `p2p` 似的可以互相发现, 访问的东西.

4. rss (简易信息聚合)?

5. 可以支持文件(markdown) 或 数据库生成页面,  且 seo  友好, 即 url 和页面静态化

6. 可以对外提供 api.

7. 通过类似 robots.txt 的东西验证网址所有权

经查找, 发现网上有类似的项目, 如 [B3log](https://ld246.com/article/1546941897596).

博客联盟 goblog 有几层含义:

1. 为静态站点提供计数, 评论,  发现服务的服务, 通过 topcoder.club/goblog 提供服务

2. 一个独立博客系统

