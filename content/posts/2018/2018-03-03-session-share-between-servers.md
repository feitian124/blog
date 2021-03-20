---
title: "分布式集群Session共享"
date: 2018-03-03 23:38:08
tags: ["devops", "shell"]
categories: ["work"]
---

## 解决方法
1.  Session Sticky
让负载均衡器能够根据每次的请求的会话标识来进行请求的转发，这样就能保证每次都能落到同一台服务器上面。
2. Session Replication
即 session 复制，一般应用容器都支持 Session Replication 的方式。这种方式开销大，只适合几台机器的场景。
3. Session数据集中存储
是对方案 2 的优化，Session数据不保存到本机而且存放到一个集中存储的地方，如 redis。
4. Cookie Based
所有 session 数据放在 cookie 中。
每种方式的具体原理及优缺点，可以查看附录1. 可以发现， 大多数情况下，方法 3 最优。

## session基于redis共享有两种基本的方案
1. 基于容器自身的扩展，比如tomcat的session-manage，以及
 https://github.com/jcoleman/tomcat-redis-session-manager. 

2. 基于spring-session的方案. spring-session的好处不仅仅是session共享，它还可以与容器解耦，应用于多终端session共享，websocket，restful api等场景。

## 环境
- jdk 8 意味着老的 jar 包不能用
- tomcat 8.5
- spring 5
- spring boot 2
- maven 依赖管理。建立公司内部的私服。

技术选型要有一定的前瞻性，带来的好处大于学习成本。
 
## 参考资料
1. 分布式集群Session共享 http://blog.csdn.net/jerome_s/article/details/52658946
2. 单点登录实现（spring session+redis完成session共享）
https://www.cnblogs.com/hujunzheng/p/6395966.html
3. 使用nexus3搭建私有仓库 https://www.jianshu.com/p/dbeae430f29d
