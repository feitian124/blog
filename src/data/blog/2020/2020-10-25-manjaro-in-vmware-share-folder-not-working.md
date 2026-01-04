---
title: "vmware中manjaro与宿主机window10不共享目录的解决办法"
description: "vmware中manjaro与宿主机window10不共享目录的解决办法"
pubDatetime: 2020-10-25T04:53:10.000Z
tags: ["manjaro", "vmware"]
categories: ["work"]

---
买了[新电脑 r7000](2020-06-05-618-buy-computer-for-coding.md)后，我在 VMware 中装了 manjaro 作为日常开发，
这样我即可以同时使用 windows 和 linux 下面的软件，挺好，满足我的需求。

但碰到一个问题，在 VMware 设置了共享目录不工作，网上有人说是原生 vmware-tools 对 manjaro 支持不好，需要打 [patch](https://github.com/rasa/vmware-tools-patches)；也有人说用自带的 open-vm-tools 即可，但我试了各种方案都不行。最后只能用在 windows 中用 ftp 软件往 manjaro 中读写文件。

今天有时间又折腾了一下，这次ok了，我们只需要如下设置就可以使用挂载的共享文件

### manjaro 中获得宿主机共享目录名
```
/usr/bin/vmware-hgfsclient
# 下面是我这里的输出，你那可能不同
vmwareShare
```

### manjaro 创建挂载目录
```
mkdir -p /mnt/hgfs
```

### 将宿主机共享目录挂载到虚拟机中
```
sudo ./vmhgfs-fuse -o allow_other -o auto_unmount .host:/vmwareShare /mnt/hgfs
```

我这边就ok，我的相关软件版本分别是：
- window 10
- VMware 15.5.6 build-16341506
- Manjaro 20.1.1 Mikah

## 参考
[VMware-tools安装以及找不到共享文件夹的解决办法](https://blog.csdn.net/bjarnecpp/article/details/95899425)