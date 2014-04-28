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

##安装irc-adapter
我们可以在[这个页面][4]看到已经有很多人写了很多`Adapters`，其中还包括QQ，今天我主要搭建基于irc的聊天室
按照[这个页面][5]的介绍安装hubot-irc的`Adapter`,注意，这里只是Adapter，如果要想让其工作，我们还要搭建irc-server

##搭建irc-server
这里我选择的是[UnrealIRCd][6],包括windows版本和Linux版本，但是windows版本缺少cloak.dll, 虽然可以网上下载，但是出于安全考虑，我移到了Linux版本。

在Linux上面需要首先下载源代码，首先在子目录./config，然后再在根目录./config`估计也是当前版本的bug`

需要让irc-server执行需要创建并修改配置文件。这里不赘述了，直接上[文件][7]

另外还需要在根目录创建2个文件`ircd.motd.fr`和`ircd.rules.fr`,内容为空。


##开启irc-hubot机器人
{% highlight Bash %}
HUBOT_IRC_SERVER=servername.domain \
  HUBOT_IRC_ROOMS="#robot" \
  HUBOT_IRC_NICK="Sara" \
  HUBOT_IRC_UNFLOOD="true" \
  bin/hubot -a irc --name sara
{% endhighlight %}

[1]: https://hubot.github.com/
[2]: https://gist.github.com/isaacs/579814
[3]: https://github.com/github/hubot/tree/master/docs
[4]: https://github.com/github/hubot/blob/master/docs/adapters.md
[5]: https://github.com/nandub/hubot-irc
[6]: http://unrealircd.com/
[7]: {{ site.url }}/resources/unrealircd.conf