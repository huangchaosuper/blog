---
layout: post
title: "基于irc的hubot搭建"
date: 2014-04-20 22:58:00
categories: work tech
tags: tools
---

[hubot][1]，一直感觉这个Geek的东西有其用武之地，但是至今也没有找到，先搭建起来，以备日后使用。

##nodejs和npm安装
[这里][2]有一个不错的资源，我就不再赘述了。

##hubot安装
完全follow[这个][3]步骤安装就可以了。不需要做额外的配置
{% highlight Bash %}
npm install -g hubot coffee-script
hubot --create myhubot
bin/hubot
{% endhighlight %}

##安装irc
当我按照上面的步骤安装完hubot之后，其只能在本机的shell下面做一些动作，感觉完全没有用处。可能很多人也和我一样，然后就止步了。

页面最后的Adapters却给了hubot一些转机。

我们可以在[这个页面][4]看到已经有很多人写了很多`Adapters`，其中还包括QQ，今天我主要搭建基于irc的聊天室

###未完待续～～～

HUBOT_IRC_SERVER=servername.domain \
  HUBOT_IRC_ROOMS="#robot" \
  HUBOT_IRC_NICK="Sara" \
  HUBOT_IRC_UNFLOOD="true" \
  bin/hubot -a irc --name sara

[1]: https://hubot.github.com/
[2]: https://gist.github.com/isaacs/579814
[3]: https://github.com/github/hubot/tree/master/docs
[4]: https://github.com/github/hubot/blob/master/docs/adapters.md