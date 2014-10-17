---
layout: post
title: "[3]Docker的Hello World应用"
date: 2014-10-17 22:20:00
categories: tech
tags: devops docker
---

Docker是做什么的呢？ docker允许你在容器内运行应用程序，你只需要执行`docker run`既可。

#Docker的Hello World应用

##Hello World

让我们开始吧

```
$ sudo docker run huangchaosuper/ubuntu:v2 /bin/echo 'Hello world'
Hello world
```

长时间的等待后，你将会启动起来第一个容器！

刚才发生了什么呢？让我们来回想一下刚才执行的命令吧。

首先是`docker`，这个是你希望执行的二进制程序。

然后是`run`，这个是用来指定容器名称的命令，和容器名称分开。

下一个重要的关键字是`huangchaosuper/ubuntu:v2`。这个指定你的容器资源名称，docker叫做镜像，如果本机存在这个镜像，那么将会本机直接启动，如果本机未存在这个镜像，第一步将会从docker hub下载指定镜像。

然后是告诉Docker你需要在里面运行的指令：

```
/bin/echo 'Hello world'
```

当我们的容器被创建，并且执行了`/bin/echo` 后，我们将会看到如下输出

```
Hello World
```

我们的容器接下来发生了什么呢？好吧，我们的容器在执行完你传入的命令后，退出了！

#容器交互

让我们试一试下面的命令

```
$ sudo docker run -t -i huangchaosuper/ubuntu:v2 /bin/bash
root@af8bae53bdd3:/#
```

我们发现，系统以root用户进入了`af8bae53bdd3`，并且停留在了标准输出控制台。

我们试一试`pwd`命令，看究竟是什么状况？

```
root@af8bae53bdd3:/# pwd

root@af8bae53bdd3:/# ls
bin boot dev etc home lib lib64 media mnt opt proc root run sbin srv sys tmp usr var
```

没错，我们进入容器内部了。

如果我们想从容器内部出来，应该如何做呢？使用`exit`或者Ctrl+D就可以了

```
root@af8bae53bdd3:/# exit
```

当我们推出的时候，因为没有应用程序正在执行，所以容器自动停止了。

#长挂容器

由于上面已经介绍，当我们推出容器后，容器会自动停止，但是我们有的时候希望容器仍然继续执行，这里就要提到守护进程

我们接下来运行下面的命令行：

```
$ sudo docker run -d huangchaosuper/ubuntu:v2 /bin/sh -c "while true; do echo hello world; sleep 1; done"
1e5535038e285177d5214659a068137486f96ee5c2e85a4ac52dc83f2ebe4147
```

其中`-d`的意思为告诉docker后台执行。这个很长的字符串`1e5535038e285177d5214659a068137486f96ee5c2e85a4ac52dc83f2ebe4147`是docker的执行码，暂时用不到，接下来说的稍微短一点的从containerID，也就是容器ID，会在接下来的使用中给我们提供便利。

我们可以利用containid查看后台的Helloworld守护进程。

首先，让我们确保我们的容器还在执行，我们可以使用`docker ps`命令，这个命令是查询后台长挂进程装太的。

```
$ sudo docker ps
CONTAINER ID  IMAGE         COMMAND               CREATED        STATUS       PORTS NAMES
1e5535038e28  huangchaosuper/ubuntu:v2  /bin/sh -c 'while tr  2 minutes ago  Up 1 minute        insane_babbage
```

这里你可以看到容器的信息，`docker ps`将会返回container ID：`1e5535038e28`。
同时还有别名`insane_babbage`。

`这个别名是随机产生的昵称` 说不定能碰到你的名字，请留意：）

好了，我们现在知道容器正在执行，但是我们怎么能知道他究竟做了些什么呢？我们可以使用`docker logs`命令，让我们使用别名查看一下吧

```
$ sudo docker logs insane_babbage
hello world
hello world
hello world
. . .
```

`docker logs`命令可以回传标准控制台输出。

#重新回到容器内

如果你想再进入刚才的容器，你应该使用`docker attache`命令

```
$sudo docker attache insane_babbage
```

#停止容器

到此位置，我们可以停止我们的守护进程了，让我们使用`docker stop`命令行。

```
$ sudo docker stop insane_babbage
insane_babbage
```

`docker stop`命令行告诉Docker，我们希望结束掉容易，所以容器会安全退出。

让我们再来利用`docker ps`看一下容器的状态。

```
$ sudo docker ps
CONTAINER ID  IMAGE         COMMAND               CREATED        STATUS       PORTS NAMES
```

已经没有东西了。没错，我们停止了容器。下一张我们将会更详细的介绍容易的操作。