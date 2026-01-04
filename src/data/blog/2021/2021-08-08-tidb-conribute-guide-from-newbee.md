---
title: "来自新手的 tidb 贡献指南"  
description: "来自新手的 tidb 贡献指南"
pubDatetime: 2021-08-08T04:00:08.000Z
tags: ["go", "tidb"]  
categories: ["work"]  
series: ["tidb"]  
---

学习 go 之后常年关注 go 生态， 除了 `docker`， `k8s` 这些云原生领域的顶梁柱， 国内的 newsql 数据库 `tidb` 也很快进入关注列表。
在对 `tidb` 有了更多的了解之后， 对它的兴趣也越大, 如:

- 云原生的 newsql 解决方案
- 完全开源，开放的生态和社区
- 在几年前选型时，就选择了 sql 层 go， 存储层 rust 的双语方案，魄力
- 国人做的。 **终于有国人在 `操作系统`, `数据库`, `编译器` 这 3 大基础软件领域做出了有一定成绩，且有完全自主知识产权的产品了(而不是各种魔改)!**

虽然我对它兴趣浓厚， 想深入的了解学习一下， 却没有想过要参与到它的开发中去, 最大的原因可能是认为`数据库的开发很难`，`我的 go 也刚学不久` 等，
直到我看到 [tison](https://github.com/tisonkun) 的一篇 vlog [一分钟成为 TiDB 贡献者](https://www.bilibili.com/video/BV1cM4y1T7D8),
我抱着试试的态度，开始了 tidb 的 contribute 之旅。

虽然只是开始，但也涨了不少知识，踩了一些坑，趁热写这么一篇文章，希望对后来的新人有帮助。

## 概述

tidb 分布式数据库是个庞大的系统，从核心到外围，可以大概分为:  

- tidb(go) + tikv(rust)，除了同名主仓库，还有好些依赖组件在他们各自的仓库
- 安装，监控，数据迁移等官方工具, 如 tiup, dm 等
- 文档
- 客户服务，论坛等

一个庞大的系统必然有各种各样任务，他们的难度是不一样的，小到修改一个错别字，写一篇使用心得，都可以算是贡献。
我的 contribute 之路也是从[一个小小的测试重构](https://github.com/pingcap/tidb/pull/26549)开始的。

## 前置条件

contribute 虽然可以很容易，但涉及到代码修改及提交合并等流程，以下前置知识还是需要的.

- **go** 需要有基本的 go 知识，能看懂，编辑，运行 go 代码
- **git** 熟悉 commit, pull, push, merge, checkout 等常用的 git 操作
- **github** 有 github 帐号，知道 github pull request 流程， 以及一个顺畅的网络。

一些关系数据库和分布式知识很有帮助，但前期的话关系也不大

## 如何找 issue

下面就是找到一个简单的 issue 进行开发工作。  
`tidb` 有一个友善，良好的社区，社区前辈各司其职，他们也意识到一些简单重复的工作，交给新人是双赢的:  

- 充分利用新人的力量，将专家们的时间从这些简单的任务中解放出来，专注于更高级别，难度更高的工作
- 新人们掌握了一定知识，获得了一定成就感，更愿意参与社区

写了上面这些是想告诉后来的新人们， 不要觉得太难而不敢参与， 也不要因为太容易而不愿意参与。
高楼大厦也是一块一块砖头砌起来的，正确的心态很重要。
我们新人这些细小的改进，也可以汇集成 tidb 宏伟蓝图中重要的一部分。

我的话比较幸运，不久前 tison 提了个[改进测试的提议](https://github.com/pingcap/tidb/issues/26022)，重构整个 tidb 的测试部分解决遗留的一些测试问题，
测试框架从 `gocheck` 迁移到 `testify`，这涉及到大量测试文件的重构，有不少工作是简单重复的任务，交给新人做非常合适。这应该也是他发那个 vlog 的初衷之一。

除此之外`tidb` 中的 issue 中有不少是标注为 `help wanted`, 这些表示这些是需要人帮忙的. 而一些被贴心的标注了 `good first issue` 的 issue, 这些表示对新人友好的。
此外， 还可以去论坛逛逛， 以及附录部分的官方文档 `tidb-dev-guide` 一定要看看。

找到 issue 后，可以留言 issue 的发起者讨论一下如何修改，没有问题的话，可以开始开发。
tidb 社区是我见过的反馈最快的开源社区之一，开发者很活跃，对新人也很友好。

## pr 流程

现在假设你找到了一个合适你的 issue，并完成了修改，准备提交 pr。pr 的全称是 pull request, 即把你的改动合并到主仓库的过程。
这里，我见识了科学严谨的 review 流程，这保证了代码的质量，从而也保证了 `tidb` 这艘大船只有很少的缺陷。

提交之前，你应该保证你的代码质量符合要求，如满足[TiDB Code Style and Quality Guide](https://pingcap.github.io/tidb-dev-guide/contribute-to-tidb/code-style-and-quality-guide.html),
经过了单元测试以及一些检查, 如 `make test`, `make check`.

然后就可以提交 pr，需要按照给定的模板认真填写，指导思想即让 reviewer 可以高效的 review， 这也有利于你的 pr 被合并。
tidb 的 ci 使用了机器人，会做比较细致的检查:

- 是不是第一次提交，是否签署了 CLA
- 标题和描述是不是满足要求
- pr 的大小是不是合适， 属于哪个兴趣小组
- 是否经过了测试和检查

此外，一般而言你的 pr 需要经过 2 个 reviewer 的批准才会被合并，他们会在你的代码做出精确到行的意见，你可以讨论修改。

这个 pr 流程充分利用了 github 的 `label`，`timeline`, `diff`等 review 特性，结合机器人，真正做到了简单高效易用，
大家可以细细体会 tidb 这套优雅的工程化的建设成果。这也是很难得的知识。

在经过机器人和 2 个 reviewer 的检查之后， 你做出相应修改， 没有问题的话你的第一关 pr 就完成了。
恭喜你， 成为 tidb 的 contributor。

## 进阶

接下来， 就是继续学习成长的过程。可以学习官方文档，阅读博客，操作一下 tidb 了解一些它的特性等。
随着对系统的熟悉，可以慢慢进行更高难度的开发，从一个新人成长为更高级别成员。

这也是我还在经历的过程，能参与 tidb 这么一个伟大的项目， 我很高兴，我相信我能学到很多， 贡献更多， 也收获更多。

这里， 也特别感谢 tidb 社区， 感谢 [tison](https://github.com/tisonkun) 带我入门及细心的指导。
我是 [feitian124](https://github.com/feitian124), 在 tidb 社区中同名，欢迎大家来交流。

## 附录

- [tidb-dev-guide](https://pingcap.github.io/tidb-dev-guide/contribute-to-tidb/introduction.html)
- [官方社区 asktug](https://asktug.com/)
- [开发者 internals](https://internals.tidb.io/)