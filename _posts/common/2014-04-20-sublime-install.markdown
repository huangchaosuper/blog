---
layout: post
title: "安装sublime编辑器"
date: 2014-04-20 22:58:00
categories: work
tags: tools
---

今天无意中知道了sublime这个编辑器，经过初步考察，感觉非常适合我。下面我将我使用的插件列表罗列在这里，方便更换工作环境之用

下载地址 [sublime text 2][1]

首先安装插件管理工具：[Package Control][2],安装方法很多，其实manual的方法属于万金油

安装完Package Control之后，就可以进行其他插件的智能安装了

##插件：
>AndyJS2：javascript 智能提示插件

>AnglarJS：anglarJS 智能提示插件

>ApacheHive：Hive 智能提示插件

>Auto Encoding for Ruby：Ruby的自动填充encoding头工具

>BracketHighlighter：括号匹配高亮提示插件，算是对高亮的增强吧

>CloseAllButThis：就是字面意思，因为在notepad++一直用这个功能，所以也安装了

>DocBlockr：注释的帮助插件，可以不用那么费劲的写代码注释了

>JsFormat:可能和AndyJS2有所重复。

>Sublimerge Pro：文件比较工具，这个工具应该是很实用

>Terminal：我的最爱，可以直接使用快捷键contro+T呼叫出控制台

##右键菜单：
>运行中输入 regedit 打开注册表

>在HKEY_CLASSES_ROOT/*/shell/ 下新建’项’ ,名称自己觉得.我用的是Sublime Text

>在 Sublime Text 下 新建’项’ 名字:command (这个貌似不可以修改)

>点击  command ,在右边的(默认),双击填入下面的值: 
>>D:\Program Files\Sublime Text 2\sublime_text.exe "%1"

##截图 :)

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/sublime.png">


  [1]: http://www.sublimetext.com/2
  [2]: https://sublime.wbond.net/installation