---
layout: post
title: "1、Docker的安装"
date: 2014-10-16 22:25:00
categories: tech
tags: devops docker
---


Docker支持主流的所有操作系统，这里以Ubuntu为例，如果需要其他环境，请留言回复

#Ubuntu

Docker支持以下版本的Ubuntu：

- Ubuntu Trusty 14.04 (LTS) (64-bit)
- Ubuntu Precise 12.04 (LTS) (64-bit)
- Ubuntu Raring 13.04 and Saucy 13.10 (64 bit)

#Ubuntu Trusty 14.04 (LTS) (64-bit)

Ubuntu Trusty 是3.13.0的内核，docker的安装版本为0.9.1，所有的引用资源都在Ubuntu的库中，相对容易很多。

`Ubuntu(和Debian) 在早期版本中，包名为docker，所以现在的报名是docker.io`

##安装

安装最新版本的Ubuntu包不一定是最新版本的Docker包(这个大家都明白，应用程序包要稍微滞后一点)

```
$ sudo apt-get update
$ sudo apt-get install docker.io
$ sudo ln -sf /usr/bin/docker.io /usr/local/bin/docker
$ sudo sed -i '$acomplete -F _docker docker' /etc/bash_completion.d/docker.io
```
如果你想安装最新版本的docker.io也是可以的。

首先，检测系统是否安装apt-transport-https这个包，如果不存在，则需要首先安装

```
[ -e /usr/lib/apt/methods/https ] || {
  apt-get update
  apt-get install apt-transport-https
}
```

然后添加Docker的repository的key

```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 36A1D7869245C8950F966E92D8576A8BA88D21E9
```

添加Docker的repository到我们的apt sources list中，并更新lxc-docker包

```
$ sudo sh -c "echo deb https://get.docker.io/ubuntu docker main\
> /etc/apt/sources.list.d/docker.list"
$ sudo apt-get update
$ sudo apt-get install lxc-docker
```

`其实也有一个简单的方法，那就是使用curl，不过理论上这种方法会有安全隐患`

```
$ curl -sSL https://get.docker.io/ubuntu/ | sudo sh
```

#验证

```
$ sudo docker run -i -t ubuntu /bin/bash
```

这个步骤将会从dockerhub下载ubuntu的最新image然后启动image生成实例，并进入bash脚本状态。

`这个过程需要漫长的等待，国内的资源有的时候还会被墙，大家自备vpn或者代理吧`

#代理设置

这里多说一句，关于代理设置，docker是有专门的文件设置的，路径为`/etc/default/docker.io` 



















