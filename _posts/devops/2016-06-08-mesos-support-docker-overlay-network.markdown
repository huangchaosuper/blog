---
layout: post
title: "Mesos如何支持docker overlay 网络"
date: 2016-06-08 22:03:00
categories: tech
tags: mesos overlay docker
---

Mesos docker overlay network,mesos如何支持docker的overlay网络拓扑结构呢？就让此文成为国内首发吧。

>概念

Mesos是一个资源管理框架，支持但不仅限于支持docker容器。docker在早期版本1.8之前，对跨主机通讯存在很大问题，针对此问题涌现出了一批第三方开源解决方案和整体调度方案，比较典型的就是k8s的flannel（可能大家要反驳我，k8s和flannel是松耦合关系，我从k8s的contributor也同样得到这样的回复，但是如果你尝试真正拆解flannel的时候，你会发现kubeproxy和flannel的耦合度过高，而且至我写这篇文章时没有找到相关文档，也许只有k8s的contributor和一
小撮特别精通k8s的人掌握了这项技术吧）。

mesos相比较k8s来说，还是更加轻量级，耦合度更低一些，换句话说就是可塑性更强。化归正题，mesos本身不管网络拓扑结构，在docker1.9之前mesos对docker管理的这个硬伤，导致很多公司放弃了mesos来调度docker容器。mesos其实支持docker1.9之后的原生overlay network。

>如何实现

大家可参考[这篇文章](http://www.tuicool.com/articles/UJJJFjU)，搭建docker集群和enable docker overlay network。

大家可参考[这篇文章](http://my.oschina.net/endeavour/blog/490697),搭建mesos环境。

因为mesos依赖zookeeper，并且docker overlay network依赖zookeeper，etcd和consul三选一。因为要集成，所以选择zookeeper最佳

剩下的问题就是如果用mesos（marathon）启动一个docker overlay network的container

其实只需要将docker的network选择为“BRIDGE”然后将自定义docker参数的值设置为“{"key": "net", "value": "your-overlay-network"}”即可。

是不是很简单，可是真的没人知道 ^-^



>总结

对于k8s+flannel和mesos+docker-overlay-network的孰优孰劣，不用我多说了吧，亲儿子肯定占便宜。况且mesos不仅支持docker容器调度，还支持非容器调度。
