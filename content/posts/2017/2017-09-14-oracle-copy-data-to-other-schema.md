---
title: "oracle 复制数据到其他 schema"
date: 2017.09.14 14:06:17
---

开发中经常遇到复制数据的需求，比如有开发环境，测试环境，模拟生产环境等；又或者同一项目服务不同的客户。

比如现有schema user1，将它的数据复制到 schema user2 中。

## 第一步导出数据

```shell
exp user1/password@127.0.0.1:1521/orcl OWNER=user1 FILE=/tmp/user1_data.dmp
```
这一步一般没有问题，然后将数据导入到 user2。

## 第二步骤导入数据
```shell
imp user2/user2@127.0.0.1:1521/orcl fromuser=user1 touser=user2 file=/tmp/user1_data.dmp;
```
请使用 user2 作为登录用户，如果使用 user1，则需要 dba 权限：
> IMP-00007: must be a DBA to import objects to another user's account

还可能遇到如下问题：
> EXP-00091: Exporting questionable statistics.

这是服务器端编码和客户端编码不一致造成的，可将客户端编码设置为何服务器端一致，如下：
```shell
SQL> select userenv('language') from dual;

USERENV('LANGUAGE')

--------------------------------------------------------------------------------

AMERICAN_CHINA.AL32UTF8

SQL> exit

Disconnected from Oracle Database 11g Enterprise Edition Release 11.2.0.1.0 - 64bit Production

With the Partitioning, OLAP, Data Mining and Real Application Testing options

[oracle@~]$ export NLS_LANG=AMERICAN_CHINA.AL32UTF8 

```