---
title: "数据库变更管理工具 flyway"
date: 2020-10-18 23:26:08
tags: ["flyway"]
categories: ["work"]
---

## Flyway的工作模式
Flyway可以对数据库进行升级，从任意一个版本升级到最新的版本。但是升级的依据是用户自己编写的sql脚本，用户自己决定每一个版本的升级内容。

Flyway不限定脚本里面的内容，但是对脚本文件的名称有一定的要求：
```shell script
V1__Initial_Setup.sql
V2__First_Changes.sql
V2.1__Refactoring
```

其中的文件名由以下部分组成，除了使用默认配置外，某些部分还可自定义规则:
- prefix: 可配置，前缀标识，默认值V表示Versioned，R表示Repeatable
- version: 标识版本号，由一个或多个数字构成，数字之间的分隔符可用点.或下划线_; 不允许多个脚本文件有相同的版本号。
- separator: 可配置，用于分隔版本标识与描述信息，默认为两个下划线__
- description: 描述信息，文字之间可以用下划线或空格分隔
- suffix: 可配置，后续标识，默认为.sql

使用Flyway升级，flyway会自动创建一张历史记录表： **flyway_schema_history**。
这张表记录了每一次升级的记录，包括已经执行了哪些脚本，脚本的文件名，内容校验和，执行的时间和结果：

flyway在升级数据库的时候，会检查已经执行过的版本对应的脚本是否发生变化，包括脚本文件名，以及脚本内容。
如果flyway检测到发生了变化，则抛出错误，并终止升级。
如果已经执行过的脚本没有发生变化，flyway会跳过这些脚本，依次执行后续版本的脚本，并在记录表中插入对应的升级记录。
所以，flyway总是幂等的，而且可以支持跨版本的升级。

如果你好奇，flyway如何检查脚本文件的内容是否有修改。
你可以注意以下记录表中有一个字段checksum，它记录了脚本文件的校验和。flyway通过比对文件的校验和来检测文件的内容是否变更。
使用上面的方式，升级一个空的数据库，或者在一直使用flyway升级方案的数据库上进行升级，都不会又问题。

但是，如果在已有的数据库引入flyway，就需要一些额外的工作。
flyway检测数据库中是否有历史记录表，没有则代表是第一次升级。此时，flyway要求数据库是空的，并拒绝对数据库进行升级。
你可以设置baseline-on-migrate参数为true，flyway会自动将当前的数据库记录为V1版本，然后执行升级脚本。
这也表示用户所准备的脚本中，V1版本的脚本会被跳过，只有V1之后的版本才会被执行。

## h2 控制台
```shell script
maven clean package
java -cp  target/demo-0.0.1-SNAPSHOT/WEB-INF/lib/h2*.jar org.h2.tools.Server
# 看到图形界面后 http://127.0.1.1:8082 改变jdbc url 为 jdbc:h2:file:/home/ming/learn/https_demo/h2data
# 用户名 sa, 秘密为空
```

## 命令
所有的命令，以如下的格式执行：  
mvn flyway:{flyway-command}

### migrate
mvn flyway:migrate  
这个命令会搜索默认的脚本目录，检测并根据结果选择执行升级脚本。

### clean
mvn flyway:clean  
这个命令会清除指定schema下所有的对象，包括table、view、triggers...，让schema变成空的状态。

### info
mvn flyway:info  
这个命令显示指定schema的升级状态，当前的数据库的版本信息。

### validate
mvn flyway:validate  
这个命令用于校验，范围包括已升级的脚本是否改名，已升级的脚本内容是否修改。所有针对已升级的脚本进行的改动都会导致校验失败。
执行migrate会自动进行校验，如果失败将不会做任何的migrate。
flyway希望用户提供的脚本是稳定的，以免造成额外的复杂性和混乱。

### baseline
mvn flyway:baseline  
baseline用于将当前数据库标记为baseline，并记录version为1。这表示用户继续执行migrate命令时，会自动跳过V1版本对应的脚本。

## 可重复的
Repeatable migrations are very useful for managing database objects whose definition can then simply be
maintained in a single file in version control. Instead of being run just once, they are (re-)applied every time
their checksum changes.

They are typically used for:

- (Re-)creating views/procedures/functions/packages/…
- Bulk reference data reinserts

Now let’s create a repeatable migration to manage a view of the person table.
With Flyway’s default naming convention, the filename will be similar to the regular migrations,
except for the V prefix which is now replaced with a R and the lack of a version.

```shell script
R__People_view.sql
```

## 回滚
Undo migrations are the opposite of regular versioned migrations.
An undo migration is responsible for undoing the effects of the versioned migration with the same version.
Undo migrations are optional and not required to run regular versioned migrations.

Now let’s create undo migrations for these two applied versioned migrations.
With Flyway’s default naming convention, the filenames will be identical to the regular migrations,
except for the V prefix which is now replaced with a U.

```shell script
U2__Add_people.sql
U1__Create_person_table.sql
```

## 思考，多分支数据库
若项目有多个团队同时开发不同的功能，需要新建多个分支，并且都会涉及到数据库Schema更改，当后期Merge时，
Migration的版本如何控制并且不会产生数据库更改的冲突呢？

解决方案：如果两个分支的数据库更改有冲突，要么最初数据库设计不合理，要么目前数据库更改不合理，所以需要团队进行全局考虑和协调。
而针对数据库在同一段时间有修改，但不会造成冲突的情况，通常实际项目中主要存在这样的情况，那可以设置flyway.out-of-order=true，
这样允许当v1和v3已经被应用后，v2出现时同样也可以被应用。其实在本地使用内存数据库不会存在该问题，因为数据库所有对象会自动清除掉，
而在local或dev中使用真实数据库时可遇到这样的问题，因此需要注意一下了。
另外，值得一提的是Flyway的参数ignore-failed-future-migration默认为true，使用情形为：当Rollback数据库更改到旧版本，
而metadata表中已存在了新版本时，Flyway会忽略此错误，只会显示警告信息。

## 参考
- [flywaydb.org](https://flywaydb.org/getstarted/firststeps/maven)
- [Flyway：数据库版本迁移工具的介绍](https://www.jianshu.com/p/b321dafdfe83)
- [快速掌握和使用Flyway](https://blog.waterstrong.me/flyway-in-practice/)
