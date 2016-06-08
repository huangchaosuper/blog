---
layout: post
title: "在ubuntu上编译安装tair"
date: 2016-05-27 22:13:00
categories: tech
tags: alibaba
---

报名参加了[2016阿里中间件性能挑战赛],基于官方教程，做了一个ubuntu版本的tair编译安装教程

>官方版

https://bbs.aliyun.com/read/279531.html?spm=5176.bbsl254.0.0.ChNxgg

>ubuntu版本

#####安装必要的依赖包

```Shell
apt-get install subversion automake autoconf libtool gdb zlib1g.dev libboost-dev
```


#####checkout svn 源代码

```Shell
cd /opt
svn checkout http://code.taobao.org/svn/tb-common-utils/trunk/ tb-common-utils
svn checkout http://code.taobao.org/svn/tair/trunk/ tair
```

ps:下载的代码有个错误：具体是tbsys/src/tblog.cpp中323行代码:需要将CLogger::CLogger& CLogger::getLogger()改为CLogger& CLogger::getLogger()

#####编译安装

```Shell
mkdir /opt/tblib
export TBLIB_ROOT=/opt/tblib
export CPLUS_INCLUDE_PATH=/opt/tb-common-utils/tbnet/src:/opt/tb-common-utils/tbsys/src
cd ~/tb-common-utils
bash build.sh

cd ~/tair
./bootstrap.sh
./configure --with-release=yes
make
make install
```

###至此。发现安装不下去了。。。