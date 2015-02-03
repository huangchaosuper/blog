---
layout: post
title: "hana集群搭建"
date: 2015-02-02 18:04:00
categories: tech
tags: hana
---

本文主要介绍HANA的集群搭建俗称cluster

据说本人是中国区乃至亚洲区第一个将HANA cluster用于生产环境的人，不知道是不是真的，如果是的话，我很荣幸。

并不是说HANA cluster的技术含量多高，如果说至今搭建HANA cluster的人屈指可数的根本原因，应该是HANA在普及度不是很高的前提下cluster对机器要求非常高，我使用的4备1方案，单unit的内存为64×5=320G，没错320GB的内存集群是最小单元。

###修改机器名称

在这里，我们定义五台机器的名字为suhana1-5,domain忽略

suhana1作为主节点，suhana2-5作为从节点，另外suhana5作为standby备用机。

{% highlight Bash %}
vi /etc/HOSTNAME
hostname suhana1-5
{% endhighlight %}

###修改dns解析

>如果大家的测试环境没有dns解析的话，可以通过设置hosts文件进行修改，方法是在每个主机的`/etc/hosts`添加5台机器的名称与IP的对应关系

{% highlight Bash %}
vi /etc/resolv.conf
{% endhighlight %}

###配置时间服务器同步

`/etc/ntpd.conf`

{% highlight Bash %}
server 127.127.1.0              # local clock (LCL)
server ntp1
server ntp2
server ntp3
fudge  127.127.1.0 stratum 10   # LCL is unsynchronized
{% endhighlight %}

`service ntp restart`

###挂在数据分区盘

略，如果测试，可以使用本地磁盘，对于HANA生产环境来说，建议data和log分开，log采用xfs格式分区。

笔者将盘挂载到了`/hana`和`/hana/log`目录

###配置nfs服务器

`/etc/exports`

{% highlight Bash %}
/hana           suhana1,suhana2,suhana3,suhana4,suhana5(rw,sync,no_root_squash,no_all_squash)
/hana/log       suhana1,suhana2,suhana3,suhana4,suhana5(rw,sync,no_root_squash,no_all_squash)
{% endhighlight %}

`service nfsserver restart`

###HANA主节点安装

{% highlight Bash %}
cd /sapanw/hanaCD/**
./hdbinst --ignore=check_hardware,check_diskspace
{% endhighlight %}

###挂载nfs分区

由于主节点安装时间较长，可以同时做从节点的nfs挂载

`mkdir /hana/log -p`

`/etc/fstab`

{% highlight Bash %}
suhana1.prod.anw:/hana          /hana           nfs     defaults        0       1
suhana1.prod.anw:/hana/log      /hana/log       nfs     defaults        0       2
{% endhighlight %}

###HANA从节点安装agent

>HANA主节点安装完成后，所有挂载的从节点执行以下命令

{% highlight Bash %}
cd /hana/shared/P3R/global/hdb/saphostagent_setup/
./saphostexec -install
{% endhighlight %}

###添加通讯接口

HANA主节点安装完成后，使用hana studio连接主节点，并且添加interface。使用`.global`是有安全隐患的一种设置，请知晓

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/hana/interface.png">

下面进入关键的一步，添加从机器

###添加HANA主机

首先通过hana studio进行备份，因为hana cluster不是很稳定，并且不同大小的集群不能recover。

{% highlight Bash %}
cd /hana/shared/P3R/global/hdb/install/bin/
./hdbaddhost
{% endhighlight %}

不出意外的话，应该会报错，因此需要修改脚本源码

 - CPU个数未读到 或者 分母不为零的错误，需要修改`/hana/shared/P3R/exe/linuxx86_64/hdb/python_support/HanaHwCheck.py:70`,修改为`self.HWInfo['CPU Sockets']=12`

 - 硬件检测不通过的错误，需要修改`/hana/shared/P3R/exe/linuxx86_64/hdb/python_support/HanaHwCheck.py:341`，将`rc=0`注释掉


添加主机包括两种`worker`和`standby`，因为本次环境是4备1，因此需要3个worker和1个standby。

>HANA本身通过group user sapsys进行通讯，因此出现sapsys的groupid多台机器不匹配等问题，请使用`groupmod -g 123 sapsys`进行修改

###后记

对于hana cluster的risk我暂时列于此处:

 - The recovery operation must recovered to the same size cluster.
 - On NFS shared storage solution, NFS have single point risk.
 - HANA Cluster replication be supported, but the replication cluster size must not less than the size of the base cluster.
