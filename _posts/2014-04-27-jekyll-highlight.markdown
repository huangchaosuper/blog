---
layout: post
title: "Jekyll代码高亮Troubeshooting"
date: 2014-04-20 22:58:00
categories: tech
tags: jekyll
---

提交带有code的代码片段时，发现Jekyl的lhighlight失效。经过持续3个小时的折腾，终于搞明白原理，并且把这个问题fix了

最终总结起来，问题也很简单，就是`pygments.rb`惹得祸

>我用了最新版本的pygments.rb(0.5.4),问题是这个版本存在bug，需要degrade到0.5.0
{% highlight Bash %}
gem uninstall pygments.rb
gem install pygments.rb --version "=0.5.0"
{% endhighlight %}

>pygments.rb需要python支持，我的系统是windows也安装了python。当安装ez_install的时候，发现python2存在bug，果断换为python3。当通过ez_install安装完pygments，在jekyll中了一个pygments的错误，是因为pygments只被支持与python2. 这就出现了鸡生蛋的问题。于是，重新安装会python2，然后fix了ez_install的bug，具体步骤请参看[ez_install]({{site.url}}/2014/04/27/ez_install/)。

