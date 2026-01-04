---
title: "manjaro-setup"  
description: "manjaro-setup"
pubDatetime: 2022-02-07T04:00:00.000Z
tags: ["linux"]  
categories: ["work"]  
series: ["研究"]  
---

# manjaro 设置

切换到 manjaro 已经好几年， 有时换机器或者重装系统总有几个相同的步骤要设置，故写此文记录一下。
针对中文环境，版本为 Manjaro 21.2.3 Qonos KDE。

## 设置 manjaro 镜像源为中国

可以在 Pamac 图形界面中直接设置。

## 设置显示缩放

如果是高分辨率屏幕，可以在系统 > 显示  中设置全局缩放，这样看上去字体不会太小。

## 时间同步

虚拟机和宿主机时间相差 8 个小时，可以在 manjaro 时间设置页面 "勾选自动设定日期和时间",  启用时间同步后即可修复该问题。

## 安装中文输入法

```sh
#安装 Fcitx5主体、配置工具、输入法引擎及中文输入法模块，可参考 https://www.bilibili.com/read/cv14016623
sudo pacman -S fcitx5-im fcitx5-chinese-addons fcitx5-qt fcitx5-gtk

sudo vim ~/.pam_environment
#加入以下内容（中间是一个 Tab键，一般情况下只需要前三行）

GTK_IM_MODULE DEFAULT=fcitx
QT_IM_MODULE  DEFAULT=fcitx
XMODIFIERS    DEFAULT=\@im=fcitx
INPUT_METHOD  DEFAULT=fcitx
SDL_IM_MODULE DEFAULT=fcitx

#安装中文维基百科词库
sudo pacman -S fcitx5-pinyin-zhwiki
```

配置完成后，建议注销或重启一下。

## 安装 aur 助手

AUR 是针对基于 Arch 的 Linux 发行版用户的社区驱动的仓库，很多官方仓库没有收录的软件包要从 AUR安装。
安装 yay 后可以方便的从 AUR 安装软件。

```sh
sudo pacman -S yay
```

## 正常上网

v2raya 是优秀的正常上网工具，可以在 linux 环境下配置全局代理。

```sh
sudo pacman -S community/v2ray community/v2ray-domain-list-community community/v2ray-geoip
yay -S aur/v2raya-bin
```

## 修复 gitk 报错

```sh
# gitk 会报下面的错误, 安装 tk 依赖即可正常工作
# /usr/bin/gitk: 第 3 行：exec: wish：未找到

sudo pacman -S tk
```

## 安装开发工具

```sh
# 图形界面安装 vscode

yay -S goland goland-jre

yay -S intellij-idea-ultimate-edition intellij-idea-ultimate-edition-jre
```

## nodejs

```sh
sudo pacman -S nvm
echo 'source /usr/share/nvm/init-nvm.sh' >> ~/.zshrc
nvm install --lts
```

## 参考

- [Manjaro-KDE安装配置全攻略](https://zhuanlan.zhihu.com/p/114296129)
