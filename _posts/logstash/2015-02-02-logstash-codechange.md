---
layout: post
title: "kibana4修改自动刷新时间"
date: 2015-02-02 11:51:00
categories: tech
tags: logstash elasticsearch kibana
---

kibana4 在beta3的release package里面还没有加入自动刷新功能，源码级别已经支持。但是不支持默认值修改。

找到文件目录~/kibana/plugins/kibana

修改文件 `_timepicker.js:18` 的 `$scope.timefilter.refreshInterval = { value : 0, display : 'Off' };` 为 `$scope.timefilter.refreshInterval = { value : 300000, display: '5 minutes'};`

代码逻辑也很简单，代码初次加载时会调用./plugins/kibana/index.js

执行以下三段代码

{% highlight JavaScript %}
          var mixinLocals = { $scope: $scope, notify: notify };
          $injector.invoke(require('plugins/kibana/_init'), self, mixinLocals);
          $injector.invoke(require('plugins/kibana/_apps'), self, mixinLocals);
          $injector.invoke(require('plugins/kibana/_timepicker'), self, mixinLocals);
{% endhighlight %}

当调用`_timepicker`时，会将`refreshInterval`写入`sessionStory`

{% highlight JavaScript %}
sessionStorage.set('refreshInterval', refreshInterval);
{% endhighlight %}

具体这个`refreshInterval`是一个怎样的对象呢？

大家可能注意到`refreshInterval`是通过`timefilter`对象传入,实际上并不是

{% highlight JavaScript %}
    $scope.$watch('timefilter.refreshInterval', function (refreshInterval) {
      if (refreshInterval != null && _.isNumber(refreshInterval.value)) {
        sessionStorage.set('refreshInterval', refreshInterval);
      } else {
        //$scope.timefilter.refreshInterval = { value : 0, display : 'Off' };
        $scope.timefilter.refreshInterval = { value : 300000, display: '5 minutes'};
      }
    });
{% endhighlight %}

开始必然为空，然后通过上面的代码将其初始化。

对于`refreshInterval`的格式，大家可以进行全文检索匹配，如果大家也比较熟悉kibana的结构的话，可以直接找到`components\timepicker`，`refresh_intervals.js`就是大家希望找到的内容了

{% highlight JavaScript %}
define(function (require) {
  var module = require('modules').get('kibana');

  module.constant('refreshIntervals', [
    { value : 0, display: 'Off', section: 0},

    { value : 5000, display: '5 seconds', section: 1},
    { value : 10000, display: '10 seconds', section: 1},
    { value : 30000, display: '30 seconds', section: 1},
    { value : 45000, display: '45 seconds', section: 1},

    { value : 60000, display: '1 minute', section: 2},
    { value : 300000, display: '5 minutes', section: 2},
    { value : 900000, display: '15 minutes', section: 2},
    { value : 1800000, display: '30 minutes', section: 2},

    { value : 3600000, display: '1 hour', section: 3},
    { value : 7200000, display: '2 hour', section: 3},
    { value : 43200000, display: '12 hour', section: 3},
    { value : 86400000, display: '1 day', section: 3}
  ]);

});
{% endhighlight %}

其实这个数据直接保存在`kibana`这个module中。

综上所述，只需要修改一行代码`_timepicker.js:18` 的 `$scope.timefilter.refreshInterval = { value : 0, display : 'Off' };` 修改为 `$scope.timefilter.refreshInterval = { value : 300000, display: '5 minutes'};`便可以满足我们的需求了。