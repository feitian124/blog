---
layout: post
title: "rails guide学习笔记1"
description: "rails guide学习笔记1"
pubDatetime: 2012-03-03T15:55:00.000Z
comments: true
tags: ["rails"]
categories: ["work"]
---

学习rails也有2，3个星期了。虽然有javaEE的使用经验，也较系统的提前学习了ruby，
不得不说学习起来还是有不少的难度。简单来说，ruby on raisl就相当于java中的
struts＋spring＋habinate，再加一个非常方便的代码生成工具。

同时，也建议初学者直接从RailsGuides官方文档作为学习的第一站，因为这里有对rails
方方面面的介绍，从怎么做到为什么这么做。以我为例，我学的第一本教材是那本著名的
《用rails进行敏捷开发》第4版（Agile Web Development），但由于没有一点概念，书中
说用rails new，generate，scaffold等时不知道他是想干什么，为什么他要这么做，只能跟
着书一步一步作，学习效果并不理想, 所有我只有fall back来看官方文档。也见解印证了我
的那个观点：官方文档永远是值得考虑认真学习的文档。

今天基本看完教材上model的部分,终于也能在学习中体验到爽的感觉。聪明的migrations,
聪明的验证和回调，聪明的实体关联，聪明的查询接口。ror的开发理念让很多东西都聪明起来，
当然，里面也有很多你一不注意就会犯错的小陷阱。比如哪些方法会触发回调，低性能的N＋1查
询问题等。我要在理解的基础上记忆的同时，增加实战经验。
   
