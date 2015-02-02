---
layout: post
title: "hana备份和清理自动化"
date: 2015-02-02 14:09:00
categories: tech
tags: hana
---

本文主要介绍HANA的每天自动备份和删除N天前的数据的方法

###HANA手动备份和删除备份

在这里我就不做过多赘述，通过HANA Studio可以很轻松的完成数据库的备份和恢复还有删除备份，这里就做一下截图吧

<img class="img-responsive img-thumbnail" src="{{ site.url }}/resources/hana/hanastudio.png">

###HANA自动备份和清理

#####创建用户

在HANA STUDIO中的SQL console里创建用户并赋予`backup admin`权限

> 如果只做备份不做清理可以只赋予`backup operater`权限

执行以下语句创建用户

{% highlight mysql %}
create user <Backup User Name> password "<Password>";
alter user <Backup User Name> DISABLE PASSWORD LIFETIME;
grant backup admin to <Backup User Name>;
{% endhighlight %}

使用`hdbuserstore`加密用户名和密码

{% highlight Bash %}
hdbuserstore set USER4BACKUP localhost:3<Instance Number>15 <Backup User Name> <Password>
{% endhighlight %}

#####创建自动备份脚本backup.sh

>change to PIDadm user

{% highlight Bash %}
#!/bin/sh
#/* Backup script */
source $HOME/.bashrc
date="$(date +"%Y-%m-%d")"
time="$(date +"%Y-%m-%d %H:%M:%S")"
backup="backup data using file ('$date')"
echo "daily backup  :"  $time  "Start" >> $DIR_INSTANCE/backup.log
$DIR_EXECUTABLE/hdbsql -U USER4BACKUP -x $backup 
time="$(date +"%Y-%m-%d %H:%M:%S")"
echo "daily backup  :"  $time  "End" >> $DIR_INSTANCE/backup.log
time="$(date +"%Y-%m-%d %H:%M:%S")"
{% endhighlight %}

#####将脚本加入cronjob

{% highlight Bash %}
30 05 * * * /usr/bin/sh /usr/sap/NDB/HDB00/BackupScript.sh 2>>  /usr/sap/NDB/HDB00/backup.log
{% endhighlight %}

至此，HANA的自动备份完成，如果读者想做一些扩展，基于以上描述也是非常简单，我们项目是在备份之后，同步到远程存储

######备份自动清理

由于HANA官方对于自动清理只支持基于backupID，所以首先要查询满足条件的backupID，然后进行脚本删除

获取backupID的sql如下：

{% highlight mysql %}
"select top 1 REPLACE(BACKUP_ID,',','') as A from M_BACKUP_CATALOG where ENTRY_TYPE_NAME='complete data backup' and UTC_START_TIME <= ADD_DAYS(CURRENT_UTCDATE,-7) order by UTC_END_TIME desc"
{% endhighlight %}

经过shell处理后的脚本如下：

{% highlight Bash %}
sql="select top 1 REPLACE(BACKUP_ID,',','') as A from M_BACKUP_CATALOG where ENTRY_TYPE_NAME='complete data backup' and UTC_START_TIME <= ADD_DAYS(CURRENT_UTCDATE,-7) order by UTC_END_TIME desc"
backupid=`$DIR_EXECUTABLE/hdbsql -U USER4BACKUP  -x $sql | grep \" | sed -e 's/\"//g'`
echo $backupid
{% endhighlight %}

获取了$backupid之后，就很容易获取清理数据了

{% highlight Bash %}
if [ -z $backupid ]
then
        echo "backupid not found"
else
        sql="BACKUP CATALOG DELETE ALL BEFORE BACKUP_ID $backupid COMPLETE"
        $DIR_EXECUTABLE/hdbsql -U USER4BACKUP -x $sql
fi
{% endhighlight %}

将这一段也加入到BackupScript.sh，备份和清理就算完成了