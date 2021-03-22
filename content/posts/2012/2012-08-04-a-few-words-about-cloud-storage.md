---
layout: post
title: "云存储"
date: 2012-08-04 15:33:00
comments: true
categories: ["resources"]
tags: ["moment"]
---

写博客有时想放一些图片，就想到了云储存。平常也关注了下，但没认真考察过。
首先说一下访问云的方式，从严格到开放的顺序：
 
1. 需要登录他们的网站或者客户端，才能使用。既没有任何API。
2. 有特定API，且是需要验证。如php，ios等。
3. 有通用API，如json，uri等，但是会跳转到他们的网站。（外链 - Direct link:download)
4. 通过url直接访问。（直链 - Direct link:streaming)

然后看一下收费，基本都是这种存储 + 流量 分开付费的方式。

然后我们看看一些云存储服务商。 

1. 先说互联网老大，google storage,支持1，2，3种访问方式，到2012年底前，以下免费：
```
    5 GB of storage
    25 GB of download data (20 GB to Americas and EMEA*; 5 GB to Asia-Pacific)
    25 GB of upload data (20 GB to Americas and EMEA*; 5 GB to Asia-Pacific)
    30,000 GET, HEAD requests
    3,000 PUT, POST, GET bucket, GET service requests
```

2. opendrive *
   5G的免费存储，支持1，2，3种访问方式，通过交换链接，可以支持第4种访问方式加少量流量。
   适合写博客的我。<a href="http://www.opendrive.com" title="OpenDrive - Online storage, backup and file management">OpenDrive</a>

3. 华为dbank
   提供较高性价比的直链服务。0.48/g，比google和有拍都便宜。

4. 有拍
   支持1，2，3，4种访问方式，无免费配额。听说服务稳定，价格适中。
5. 盛大云
   支持1，2，无免费版，仿亚马逊的，现在提够很多云服务。
6. 金山快盘 *
   注册送5G，支持1，2，3种访问方式。免费使用。
7. skydrive *
   之前是25G，现在注册只有5G了。支持1，2，3种访问方式。有免费配额。
8. dropbox
   和skydrive类似。
9. ubuntu one *
   我用ubuntu，所以也用上了这个。5G免费配额。
10. amazon s3
   知道它是老大，可惜一直被墙，无缘使用。

   *表示已经试用。
   ------
