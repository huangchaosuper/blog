---
layout: post
title: "kibana4修改源码，修改起始页的时间"
date: 2015-05-30 10:59:00
categories: tech
tags: logstash elasticsearch kibana
---

kibana4的默认搜索时间是15分钟之前至现在，今天介绍一下如何修改这个默认配置

kibana4的默认搜索时间是hardcode在代码中，不可配置。因此我们要找到相应的js代码。并修改它就可以了。

代码路径`kibana-master\src\kibana\components\timefilter\timefilter.js:30`

```javascript
      var timeDefaults = {
        from: 'now-15m',
        to: 'now'
      };
```

修改为希望的时间即可，如果想显示今天的数据，修改为以下
```javascript
      var timeDefaults = {
        from: 'now/d',
        to: 'now/d'
      };
```
