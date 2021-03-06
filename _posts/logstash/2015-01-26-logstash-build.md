---
layout: post
title: "kibana4 beta3 build"
date: 2015-01-26 14:58:00
categories: tech
tags: logstash elasticsearch kibana
---

kibana4 在beta2阶段还是一个 angularjs 前端配上一个 sinatra 写的 proxyserver. 当时有一个疑问，为什么后台要用ruby的sinatra不用nodejs的express. 现如今到了beta3阶段, sinatra 已经完全被 express 取代.

对于kibana4-beta2的源码安装我在这里做一下简单介绍：

 - 安装nodejs环境
 
 - 下载 kibana 4 源码
 
 `git clone https://github.com/elasticsearch/kibana.git kibana4`

 - 安装 bower 工具

 `npm install -g bower`

 - 执行下面的脚本update.sh

{% highlight Bash %}
git pull
bower install --allow-root
cd /opt/kibana/src/server
bundle install
cd /opt/kibana/src/kibana/bower_components/lesshat/build
for i in `find ../../../ -name '[a-z]*.less'|grep -v bower_components`;do
    ../../../../../node_modules/grunt-contrib-less/node_modules/less/bin/lessc $i ${i/.less/.css/}
done
cd ../../../../server/
{% endhighlight %}

> 其中lessc编译器的路径可能有变化，使用`find`查找


对于kibana4-beta3的源码安装：假设根目录在/opt/kibana

 - 安装nodejs环境
 
 - 下载 kibana 4 源码
 
 `git clone https://github.com/elasticsearch/kibana.git kibana4`

 - 安装 bower 工具

 `npm install -g bower`

 - 修改 package.json 文件 并复制到`/opt/kibana/src/server`

{% highlight JavaScript %}
 {
  "name": "kibana",
  "description": "Kibana is an open source (Apache Licensed), browser based analytics and search dashboard for Elasticsearch. Kibana is a snap to setup and start using. Kibana strives to be easy to get started with, while also being flexible and powerful, just like Elasticsearch.",
  "keywords": [
    "kibana",
    "elasticsearch",
    "logstash",
    "analytics",
    "visualizations",
    "dashboards",
    "dashboarding"
  ],
  "private": false,
  "version": "4.0.0-beta3",
  "main": "src/server/app.js",
  "homepage": "http://www.elasticsearch.org/overview/kibana/",
  "bugs": "https://github.com/elasticsearch/kibana/issues",
  "license": "Apache-2.0",
  "author": "Rashid Khan <rashid.khan@elasticsearch.com>",
  "contributors": [
    "Spencer Alger <spencer.alger@elasticsearch.com>",
    "Chris Cowan <chris.cowan@elasticsearch.com>",
    "Joe Fleming <joe.fleming@elasticsearch.com>",
    "Lukas Olson <lukas.olson@elasticsearch.com>"
  ],
  "scripts": {
    "test": "grunt test",
    "start": "node ./src/server/bin/kibana.js",
    "server": "node ./src/server/bin/kibana.js",
    "precommit": "grunt hintStagedFiles"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/elasticsearch/kibana.git"
  },
  "dependencies": {
    "ansicolors": "^0.3.2",
    "body-parser": "~1.10.1",
    "bunyan": "^1.2.3",
    "commander": "^2.6.0",
    "compression": "^1.3.0",
    "cookie-parser": "~1.3.3",
    "debug": "~2.1.1",
    "express": "~4.10.6",
    "glob": "^4.3.2",
    "http-proxy": "^1.8.1",
    "jade": "~1.8.2",
    "js-yaml": "^3.2.5",
    "less-middleware": "1.0.x",
    "lodash": "^2.4.1",
    "morgan": "~1.5.1",
    "serve-favicon": "~2.2.0"
  },
  "license": "Apache 2.0",
  "bugs": {
    "url": "https://github.com/elasticsearch/kibana/issues"
  }
}
{% endhighlight %}

 - 执行`npm install`

 - 执行下面的脚本update.sh

{% highlight Bash %}
git pull
bower install --allow-root
cd /opt/kibana/src/server
bundle install
cd /opt/kibana/src/kibana/bower_components/lesshat/build
for i in `find ../../../ -name '[a-z]*.less'|grep -v bower_components`;do
    ../../../../../node_modules/grunt-contrib-less/node_modules/less/bin/lessc $i ${i/.less/.css/}
done
cd ../../../../server/
{% endhighlight %}

 - 修改`/opt/kibana/src/server/bin/kibana.sh`文件

{% highlight Bash %}
 #!/bin/sh
SCRIPT=$0

# SCRIPT may be an arbitrarily deep series of symlinks. Loop until we have the concrete path.
while [ -h "$SCRIPT" ] ; do
  ls=$(ls -ld "$SCRIPT")
  # Drop everything prior to ->
  link=$(expr "$ls" : '.*-> \(.*\)$')
  if expr "$link" : '/.*' > /dev/null; then
    SCRIPT="$link"
  else
    SCRIPT=$(dirname "$SCRIPT")/"$link"
  fi
done

DIR=$(dirname "${SCRIPT}")/..
NODE=/usr/bin/node
SERVER=/opt/kibana/src/server/bin/kibana.js

CONFIG_PATH="/opt/kibana/src/server/config/kibana.yml" NODE_ENV="production" exec "${NODE}" ${SERVER} ${@}
{% endhighlight %}


>[Kibana4](https://github.com/huangchaosuper/kibana)

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/logstash.png">