---
title: "git 读取对象 XXX 失败: 错误的消息"
date: 2020-11-05 08:00:57
tags: ["git", "devops"]
categories: ["work"]
---

今天早早来到办公室，准备大干一场，谁知道git出现问题。

## 准备更新代码
准备切换到公共分支更新代码

```
❯ git checkout dev
M	dev.properties
切换到分支 'dev'
fatal: 读取对象 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47 失败: 错误的消息
❯ git status
位于分支 dev
fatal: 读取对象 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47 失败: 错误的消息

```
切换成功，但是 git 提示 `fatal: 读取对象 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47 失败: 错误的消息`，用了好多年 git 第一次碰到这个错误。用 `git log`看历史记录，只能看到最近的7, 8个提交，然后也是上面这个错误。

## 定位问题
网上找了一通，似乎没有人碰到过这个问题
```
❯ git fsck --full
error: 不能 mmap .git/objects/82/27d7402106a51b5fedad7bcb2fba73ba6d7e3f: 错误的消息
error: 8227d7402106a51b5fedad7bcb2fba73ba6d7e3f：对象损坏或丢失：.git/objects/82/27d7402106a51b5fedad7bcb2fba73ba6d7e3f
error: 不能 mmap .git/objects/84/97288737064b6239b8c3029db78fa60e228286: 错误的消息
error: 8497288737064b6239b8c3029db78fa60e228286：对象损坏或丢失：.git/objects/84/97288737064b6239b8c3029db78fa60e228286
error: 不能 mmap .git/objects/98/26f8edc0708b4da83e0ef11c7d2067c0de43b3: 错误的消息
error: 9826f8edc0708b4da83e0ef11c7d2067c0de43b3：对象损坏或丢失：.git/objects/98/26f8edc0708b4da83e0ef11c7d2067c0de43b3
error: 不能 mmap .git/objects/c7/2f18fb5b1c2780f18afd7b2a0ce15d15984a47: 错误的消息
error: c72f18fb5b1c2780f18afd7b2a0ce15d15984a47：对象损坏或丢失：.git/objects/c7/2f18fb5b1c2780f18afd7b2a0ce15d15984a47
正在检查对象目录: 100% (256/256), 完成.
正在检查对象: 100% (24134/24134), 完成.
error: HEAD：无效的引用日志条目 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47
error: HEAD：无效的引用日志条目 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47
error: refs/heads/dev_wf98v6.5_webapp_pengyun：无效的引用日志条目 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47
error: refs/heads/dev_wf98v6.5_webapp_pengyun：无效的引用日志条目 c72f18fb5b1c2780f18afd7b2a0ce15d15984a47
损坏的链接来自于  commit 483075be14df76aa322be01fa224fb0684522eb0
              到  commit c72f18fb5b1c2780f18afd7b2a0ce15d15984a47
悬空 commit 4601a227873ebb732e7c7a66dabc308c46dd0def
悬空 commit 46065508f3301c3f03b88b4d24e1b8bb08fc6ce9
悬空 blob 530866c442ce94034913f18a803dbea2464c250c
悬空 blob 900885df426628b9f552b22c8801e15dca1256ad
悬空 blob 4e094c30c9df01549920ac74c54ce5f7e5090438
悬空 blob 6a0aa26d4d448b88b4765bef7ec0115b12c68c83

```
用 `git fsck` 命令检查， 确实有几个错误，但不知道错误原因，更谈不上怎么修复。**由于我本地分支已经提交到远程**，我打算删掉本地仓库重建

## 删除本地仓库
```
❯ rm -rf .git
rm: 无法删除 '.git/objects/82/27d7402106a51b5fedad7bcb2fba73ba6d7e3f': 错误的消息
rm: 无法删除 '.git/objects/98/26f8edc0708b4da83e0ef11c7d2067c0de43b3': 错误的消息
rm: 无法删除 '.git/objects/84/97288737064b6239b8c3029db78fa60e228286': 错误的消息
rm: 无法删除 '.git/objects/c7/2f18fb5b1c2780f18afd7b2a0ce15d15984a47': 错误的消息

```

嗯？有几个文件删除不了，莫非是文件系统出了问题?继续检查
```
❯ cd objects
❯ ls
82  84  98  c7
❯ tree
.
├── 82
├── 84
├── 98
└── c7

4 directories, 0 files
❯ cd 82
❯ ls -al
ls: 无法访问 '27d7402106a51b5fedad7bcb2fba73ba6d7e3f': 错误的消息
总用量 8
drwxr-xr-x 2 ming ming 4096 11月  5 07:39 .
drwxr-xr-x 6 ming ming 4096 11月  5 07:39 ..
-????????? ? ?    ?       ?             ? 27d7402106a51b5fedad7bcb2fba73ba6d7e3f

```
**问题基本确定**， 文件 27d7402106a51b5fedad7bcb2fba73ba6d7e3f 不知道什么原因损坏了，用 ls 命令也读取不了。看来并不是 git 的问题。

```
❯ rm -f 27d7402106a51b5fedad7bcb2fba73ba6d7e3f
rm: 无法删除 '27d7402106a51b5fedad7bcb2fba73ba6d7e3f': 错误的消息
❯ stat 27d7402106a51b5fedad7bcb2fba73ba6d7e3f
stat: cannot statx '27d7402106a51b5fedad7bcb2fba73ba6d7e3f': 错误的消息
```
再次实验，强制删除和尝试看 inode 信息也看不到。

会不会什么进程占用着？重启一下试下。
```
❯ pwd
/home/ming/projects/webapp/.git/objects/82
❯ ls -al
总用量 12
drwxr-xr-x 2 ming ming 4096 11月  5 07:39 .
drwxr-xr-x 6 ming ming 4096 11月  5 07:39 ..
-r--r--r-- 1 ming ming   73 11月  3 19:45 27d7402106a51b5fedad7bcb2fba73ba6d7e3f
❯ cd ..
❯ cd ..
❯ cd ..
❯ rm -rf .git

```
居然成功了，下面可以重新拉取了。

## 重建仓库

```
❯ git init .
已初始化空的 Git 仓库于 /home/ming/projects/webapp/.git/
❯ git remote add origin http://gitlab.my.dev/webapp.git
❯ git fetch
remote: Enumerating objects: 22542, done.
remote: Counting objects: 100% (22542/22542), done.
remote: Compressing objects: 100% (7230/7230), done.
remote: Total 22542 (delta 11803), reused 22163 (delta 11497), pack-reused 0
接收对象中: 100% (22542/22542), 9.18 MiB | 11.46 MiB/s, 完成.
处理 delta 中: 100% (11803/11803), 完成.
❯ git checkout dev_ming
分支 'dev_ming' 设置为跟踪来自 'origin' 的远程分支 'dev_ming'。
切换到一个新分支 'dev_ming'

```
至此， 恢复完成。

## 总结
我的情况比较理想，所有代码下班前已经提交到远程备份，这也是个好的实践。然后 root case 只找到一半，文件系统出问题导致 git 读取不了文件报错，重启之后出问题的问题及正常删除。

