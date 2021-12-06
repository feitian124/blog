---
title: "tidb tools"  
date: 2021-12-05 20:00:00
tags: ["tidb"]  
categories: ["work"]  
series: ["研究"]  
---

很开心最近以不错的成绩过了 tidb 的 [PCTA](https://learn.pingcap.com/learner/exam-market/list?category=PCTA) 认证,  该认证是 tidb 的基础运维能力认证. 除了理解 tidb 的基本概念, 使用 tiup 部署管理集群, 还有很大一块就是学会使用TiDB生态工具，进行数据迁移和校验，例如：数据迁入、全量导出、全量导入、备份恢复、校验等等。

它们的特性更有不同, 如上游下游是啥, 速度和数据量, 是否需要停机或者只读, 是否支持异构, 兼容的版本, 是否需要额外部署组件等, 理解它们的异同及各自的使用场景,
是考试中容易丢分的点,  故结合 301 视频和官方文档, 稍作整理如下.

## BR

BR 全称 backup & restore, 是 tidb 分布式备份恢复的命令行工具, 用于对 tidb 集群进行数据备份和恢复.  BR 属于物理备份，数据由 TiKV 从各个 region 的 leader 生成 SST 格式的 KV 数据，它是专用的 TiDB 格式，不能用于 MySQL 的还原。TiKV 进行数据还原时，没有固定的节点对应关系，所有的节点都需要访问完整的数据，所以 BR 最好使用 NFS/S3 共享存储存储。支持按库, 表过滤, 支持全量增量, 支持限速.

## Dumpling

数据导出工具 dumpling 可以把存储在 tidb/mysql 中的数据导出为 sql 或者 csv,  可以用于完成逻辑上的全量备份或者导出. 它的速度较慢，备份的 SQL 文件（由一系列 SQL 语句组件）既可以用于 TiDB 也可以兼容 MySQL 数据库，可以还原数据库备份时的状态

## Lightning

TiDB Lightning 是一个用于将全量数据导入到 TiDB 集群的工具, 它支持 CSV 和 SQL 文件，支持选择只导入某个  SCHEMA 或者全部的数据，支持断点续传功能并可将断点存储在其他数据库中. 使用 TiDB Lightning 导入数据到 TiDB 时，有三种模式：

- local 模式：TiDB Lightning 将数据解析为有序的键值对，并直接将其导入 TiKV。这种模式一般用于导入大量的数据（TB 级别）到新集群，但在数据导入过程中集群无法提供正常的服务。
- importer 模式：和 local 模式类似，但是需要部署额外的组件 tikv-importer 协助完成键值对的导入。对于 4.0 以上的目标集群，请优先使用 local 模式进行导入。
- tidb 模式：以 TiDB/MySQL 作为后端，这种模式相比 local 和 importer 模式的导入速度较慢，但是可以在线导入，同时也支持将数据导入到 MySQL。

## DM

TiDB Data Migration (DM) 是一体化的数据迁移任务管理工具，支持从与 MySQL 协议兼容的数据库（MySQL、MariaDB、Aurora MySQL）到 TiDB 的数据迁移.
支持全量数据的迁移和增量数据的复制, 支持 `Block & allow lists`, `Binlog event filter`, `Table routing` 等配置.
通过 tiup 部署，分为 Master 集群管理组件和 worker 工作组件，和 dmctl 管理工具.

## Binlog

TiDB Binlog 是一个用于收集 TiDB 的 binlog，并提供准实时备份和同步功能的商业工具. TiDB Binlog 集群由 Pump 和 Drainer 两个组件组成。一个 Pump 集群中有若干个 Pump 节点。TiDB 实例连接到各个 Pump 节点并发送 binlog 数据到 Pump 节点。Pump 集群连接到 Drainer 节点，Drainer 将接收到的更新数据转换到某个特定下游（例如 Kafka、另一个 TiDB 集群或 MySQL 或 MariaDB Server）指定的正确格式。

## TiCDC

TiCDC 是一款通过拉取 TiKV 变更日志实现的 TiDB 增量数据同步工具，具有将数据还原到与上游任意 TSO 一致状态的能力，同时提供开放数据协议 (TiCDC Open Protocol)，支持其他系统订阅数据变更.

TiCDC 运行时是一种无状态节点，通过 PD 内部的 etcd 实现高可用。TiCDC 集群支持创建多个同步任务，向多个不同的下游进行数据同步。你可以选择随新集群一起部署 TiCDC，也可以对原有 TiDB 集群新增 TiCDC 组件.
