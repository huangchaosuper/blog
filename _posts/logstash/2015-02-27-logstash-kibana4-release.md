---
layout: post
title: "kibana4修改源码，使用Groovy脚本"
date: 2015-02-27 10:59:00
categories: tech
tags: logstash elasticsearch kibana
---

kibana4在过年前发布RC1版本，年后就正式Release出4.0。速度好快！言归正传，本篇介绍使用kibana4注入Groovy脚本。

在beta阶段，kibana4是可以在`settings->Indices->scripted fields`中添加自定义scripts,并且允许Groovy脚本，这一点满足了我们一个需求：在elasticsearch存储的类型为字符串但是需要按照数值类型进行聚合。

对于以上需求，可以采用重新创建索引的方式解决，但是由于大量的历史数据和未来的需求不确定性，这种方式必然不能用于生产环境，调研一下倒是无妨，在这里就不做赘述。

我们最终使用Groovy脚本注入的方式解决这个问题。

Groovy脚本注入，由于安全问题，elasticsearch默认为关闭状态。elasticsearch集群需要在每一个node上将脚本功能打开，否则也可以将脚本写入node主机的特定目录。

修改`/etc/elasticsearch/elasticsearch.yml`添加以下配置信息

{% highlight Bash %}
script.disable_dynamic: false
{% endhighlight %}

> 是否需要重启不记得了。不行就重启下各个节点吧

待聚合字段为`duration`字符串类型，在`settings->Indices->scripted fields`中`Add Scripted Field`。名称随便写，例如`duration_number`，script写入`Double.parseDouble(doc['duration'].value)`，如下图所示。

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/logstash/kibana4.png">

按理来说，就如此简单，但是估计kibana开发团队从安全性考虑，在正式Release时禁用掉了Groovy脚本。有利有弊，因此我们需要修改一下源代码。

修改`/opt/kibana4/src/public/index.js`(正式Release的压缩版)或者`kibana-4.0\src\kibana\plugins\settings\sections\indices\scripted_fields\index.js`(github源码版)，找到这段代码`lang: 'expression'`替换为以下代码即可

{% highlight JavaScript %}
var field = _.defaults($scope.scriptedField, {
        type: 'number',
        lang: 'groovy'
      });
{% endhighlight %}

因为是前端代码，修改后不需要重新启动。大功告成，这个功能有很强的扩展性，不用说大家也都清楚了吧。