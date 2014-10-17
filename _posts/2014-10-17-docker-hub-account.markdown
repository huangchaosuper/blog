---
layout: post
title: "[2]Docker的安装"
date: 2014-10-17 21:35:00
categories: tech
tags: devops docker
---


#Docker Hub的使用

这一节主要是快速介绍[Docker Hub](https://hub.docker.com/),包括创建账户.

Docker Hub是一个Docker的中心资源服务，Docker Hub可以更加有利于我们彼此合作获取更加丰富的Docker Image资源，它提供一下服务：

- Docker 镜像存管
- 用户管理
- 镜像自动编译和工作流式触发
- 和Gitub、Bitucket集成

在你使用Docker Hub之前，你需要首先注册和创建帐号，别担心，非常简单。

#创建Docker Hub帐号

这里有两种方法方便你创建帐号

- 通过网页创建
- 通过命令行创建

##通过网页创建

这里就不赘述了，直接登录http://docker.io就可以直接创建。

##通过命令行创建

我们可以创建Docker Hub帐号的命令行为`docker login`

```
$sudo docker login
```

接下来按照提示将用户名，密码和邮箱输入即可。