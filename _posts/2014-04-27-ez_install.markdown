---
layout: post
title:  "windows Python2.7下安装ez_install"
date:   2014-04-27 22:41:12
categories: tech
tags: Python
---

ez_install是windows下Python的包管理工具，类似于linux的pip。

##安装步骤
到http://pypi.python.org/pypi/setuptools按照相应的版本进行安装

我的系统是windows8 所以在powershell中执行下面的shell脚本`官方文档有个小错误，我这里帮忙fix了一下`
{% highlight Bash %}
(Invoke-WebRequest https://bitbucket.org/pypa/setuptools/raw/bootstrap/ez_setup.py).Content | ./python.exe -
{% endhighlight %}

##修复Python2的bug
如果你不幸的和我一样，本地安装的是Python2，你将会遇到`UnicodeDecodeError: 'ascii' codec can't decode byte 0xb0 in position 1: ordinal not in range(128)`的错误

接下来让我们一起来fix这个bug

>定位到目录`%Python27%\Lib\site-packages`

>创建文件`sitecustomize.py`，并添加以下代码
{% highlight Python %}
import sys
sys.setdefaultencoding("cp1251")
{% endhighlight %}


###问题得到解决:)