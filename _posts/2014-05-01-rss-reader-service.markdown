---
layout: post
title: "RSS Reader Service正式发布"
date: 2014-05-01 14:07:00
categories: tech
tags: rss
---

2014年5月1日，[RSS Reader Service][1]正式发布。

##简介

不可否认，现在已经进入了信息爆炸时代，人们已经很难从种类繁多的信息中抽取出对自己有用的那一部分。

`RSS Reader Service`应运而生，作为一个服务，其旨在为大家输出分析后的信息。

我们的口号是:"玩转大数据，玩转爆炸的信息时代"

##截图

>BLOG集成效果图,[DEMO][2]

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/rss_reader_service_ui.png">

##集成

大家可能已经发现，我的blog是构建在github上的静态站点，但是站点内包含很多静态站点不具有的交互功能。

没错，这就需要与各种服务集成，接下来，让我带大家一步一步的完成`RSS Reader Service`的集成

####简单集成

>准备

请确保你的blog支持`jquery`,`bootstrap`和`knockoutjs`,如果不支持请到相应的官方网站下载最新版本

jquery [官网][3],
bootstrap [官网][4],
knockoutjs [官网][5]

>集成

将以下代码copy到您的html网页中

{% highlight Html %}
<div id="rss_reader" class="list-group" data-bind="foreach: docs">
  <a data-bind="attr: { href: link}" target='_blank' class="list-group-item"><span class="label label-primary" data-bind="text: typeId"></span> <span class="badge" data-bind="text: author"></span><span data-bind="text: title"></span></a>
</div>
<ul class="pager">
  <li class="previous"><a href="#" id="rss_reader_all">all</a></li>
  <li class="previous"><a href="#" id="rss_reader_news">news</a></li>
  <li class="previous"><a href="#" id="rss_reader_tech">tech</a></li>
  <li class="previous"><a href="#" id="rss_reader_entertainment">entertainment</a></li>
  <li class="next"><a href="#" id="rss_reader_next">&rarr;</a></li>
  <li class="next"><a href="#" id="rss_reader_first">&Omega;</a></li>
  <li class="next"><a href="#" id="rss_reader_preview">&larr;</a></li>
</ul>
{% endhighlight %}

创建js文件rss_reader.js,并将以下代码copy其中

{% highlight JavaScript %}
$(document).ready(function () {
	var rssReaderViewModel = new viewModel();
	ko.applyBindings(rssReaderViewModel);
	rssReaderViewModel.tech();
	$("#rss_reader_all").click({ handler: rssReaderViewModel.all });
	$("#rss_reader_news").click({ handler: rssReaderViewModel.news });
	$("#rss_reader_tech").click({ handler: rssReaderViewModel.tech });
	$("#rss_reader_entertainment").click({ handler: rssReaderViewModel.entertainment });
	$("#rss_reader_preview").click({ handler: rssReaderViewModel.preview });
	$("#rss_reader_first").click({ handler: rssReaderViewModel.first });
	$("#rss_reader_next").click({ handler: rssReaderViewModel.next });
});

function viewModel() {
	var self = this;
	var rangeFrom=0;
	var rangeSize=8;
	var typeId="tech";
	self.docs = ko.observableArray([]);
	self.all = function () {
		typeId=null;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.tech = function () {
		typeId="tech";
		rangeFrom=0;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.entertainment = function () {
		typeId="entertainment";
		rangeFrom=0;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.news = function () {
		rangeFrom=0;
		typeId="news";
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.preview = function () {
		if(rangeFrom<=0){
			rangeFrom = 0;
		}else{
			rangeFrom = rangeFrom-rangeSize;
		}
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.first = function () {
		rangeFrom = 0;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.next = function () {
		rangeFrom = rangeFrom+rangeSize;
		self.getInformationFromRssReader(rangeFrom,rangeSize,typeId);
	};
	self.getInformationFromRssReader = function(rangeFrom,rangeSize,typeId){
		var queryCondition = new Object();
		queryCondition.from=rangeFrom;
		queryCondition.to=rangeFrom+rangeSize;
		if(!typeId){}else{
			queryCondition.typeId = typeId;
		}
		$.ajax({
			url:"http://huangchaosuper.duapp.com/service/rss/read",
			data:queryCondition,
			async:true,
			crossDomain : true,
			dataType: "json", 
			success: function (data) {     
				self.docs(data.docs);
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) { 
				alert(errorThrown); 
			} 
		});
	};
}
{% endhighlight %}

确保以下javascript包引入网页，可能大家已经注意到了，我的js资源是通过`bower`安装的，详情参考[bower官网][6]

{% highlight Html %}
<script src="/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<script src="/bower_components/knockout.js/knockout.js"></script>
<script src="/js/rss_reader.js"></script>
{% endhighlight %}

>如果哪里没有介绍的很清楚，大家可以直接到[github][7]查看我的源代码


####RESTful API集成

`RSS Reader Service`提供唯一简单API进行集成

大家可以将`RSS Reader Service`集成到侧边栏，手机App等

{% highlight JavaScript %}
http://huangchaosuper.duapp.com/service/rss/read?from=0&to=1&typeId=news
{% endhighlight %}

>typeId:现在有效的typeId包括`news`,`tech`和`entertainment`

>from&to:表示读取记录起始位置点,`from=0&to=1`代表读取首条记录

####写在最后

如果谁想把自己的feed/rss资源并入`RSS Reader Service`欢迎留言或邮件&rArr;huangchaosuper@gmail.com

`RSS Reader Service`

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/rss_reader_service.png">

[1]: http://huangchaosuper.duapp.com/service
[2]: {{site.url}}/geek.html
[3]: http://jquery.com
[4]: http://getbootstrap.com
[5]: http://knockoutjs.com/
[6]: http://bower.io/
[7]: https://github.com/huangchaosuper/blog
