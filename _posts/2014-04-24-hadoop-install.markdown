---
layout: post
title: "hadoop 2.4.0 集群安装全记录"
date: 2014-04-24 12:58:00
categories: work tech
tags: tools installation
---

之前一直在说Hadoop，也用了一些基于Hadoop的产品，但是对于Hadoop本身，或者说纯净的Hadoop一直没有折腾。所以利用了几天课余时间搭建了4台机器的Hadoop集群

##准备
首先部署了4台redhat x64机器，机器名分别为 `M1,S1,S2,S3...`
>M1:NameNode，SecondNameNode，ResourceManager

>S1:DataNode,NodeManager

>S2:DataNode,NodeManager

>S3:DataNode,NodeManager

以上分配可能有些问题，日后再改咯

##卸载OpenJDK
由于RH本身自带OpenJDK，但是和SunJDK还是有些细微差别，为了保证万无一失，这里卸载自带的OpenJDK
```shell
<!-- 切换到管理员帐户 -->
sudo -s
<!-- 查看java版本，是否为OpenJDK -->
java --version
<!-- 查看系统中安装的所有java包，并逐一删除 -->
rpm -qa|grep java
rpm -e --nodeps java-1.7.0-openjdk-devel-1.7.0.25-2.3.10.4.el6_4.x86_64
rpm -e --nodeps java-1.5.0-gcj-1.5.0.0-29.1.el6.x86_64
rpm -e --nodeps java-1.6.0-openjdk-1.6.0.0-1.62.1.11.11.90.el6_4.x86_64
rpm -e --nodeps java-1.7.0-openjdk-1.7.0.25-2.3.10.4.el6_4.x86_64
rpm -e --nodeps java-1.6.0-openjdk-devel-1.6.0.0-1.62.1.11.11.90.el6_4.x86_64
```

##安装Sun JDK
首先从Oracle下载最新的jdk安装包`rpm`，我写此文章的时候已经是java8了
```shell
<!--我的下载目录为/home/huanchao/downloads-->
cd /home/huanchao/downloads
rpm -i jdk-8u5-linux-x64.rpm
```

##创建hadoop用户和组，构建hadoop文件结构
当然，如果大家在自己的帐号下，或者`root`帐号下创建也是完全可以，不过不够专业，而且会有安全风险，这里不多赘述
```shell
<!--创建hadoop用户和组-->
useradd -m -s /bin/bash -U hadoop
<!--切换到hadoop用户-->
su hadoop
cd /home/hadoop
mkdir downloads
cd downloads
<!--从官网将最新的hadoop2.4.0.tar.gz包下载到/home/hadoop/downloads/目录下，并解压-->
tar -xzvf hadoop-2.4.0.tar.gz
<!--切换回root账户-->
exit
<!--将解压后的文件目录移动到系统的opt目录下，我这里使用的是cloudhost，SAN存储-->
mv /home/hadoop/downloads/hadoop-2.4.0 /opt/cloudhost/hadoop-2.4.0
<!--创建软连接-->
ln -s /opt/cloudhost/hadoop-2.4.0/ /opt/cloudhost/hadoop
cd /opt/cloudhost/hadoop/etc/hadoop
<!--创建logs目录，并赋予hadoop用户权限-->
mkdir /opt/cloudhost/logs/hadoop
cd /opt/cloudhost/logs
chown -R hadoop:hadoop hadoop
```

##添加环境变量
切换回`hadoop`用户
>编辑`/home/hadoop/.bashrc`
```content
export JAVA_HOME=/usr/java/default/
export PATH=$PATH:$JAVA_HOME/bin
export CLASSPATH=$JAVA_HOME/lib/*.jar:$JAVA_HOME/jre/lib/*.jar

export HADOOP_HOME=/opt/cloudhost/hadoop
export PATH=$PATH:$HADOOP_HOME/bin
export PATH=$PATH:$HADOOP_HOME/sbin
export HADOOP_LOG_DIR=/opt/cloudhost/logs/hadoop
export YARN_LOG_DIR=$HADOOP_LOG_DIR
```

##RSA免密码配置
这一步是必须的，也是最繁琐的:(
>在用户`hadoop`的工作目录下`/home/hadoop/`执行`ssh-keygen`，一路回车

如果没什么异常，会生成此文件`/home/hadoop/.ssh/id_rsa.pub`
```shell
<!--创建authorized_keys 或者 #cat id_dsa.pub >> ~/.ssh/authorized_keys-->
cp /home/hadoop/.ssh/id_rsa.pub /home/hadoop/.ssh/authorized_keys
<!--切换到root用户-->
exit
<!--把此文件copy到处，供分发给S1，S2和S3-->
cp /home/hadoop/.ssh/id_rsa.pub /home/huanchao/id_rsa.pub
```
S1，S2，S3分别执行以上操作，可以通过下面代码进行验证
```shell
ssh M1
```

##修改hadoop配置文件
>hadoop#/opt/cloudhost/hadoop/etc/hadoop/core-site.xml
```vim
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
        <property>
                <name>fs.defaultFS</name>
                <value>hdfs://M1:9000/</value>
                <description>The name of the default file system. A URI whose scheme
                        and authority determine the FileSystem implementation. The uri's
                        scheme determines the config property (fs.SCHEME.impl) naming the
                        FileSystem implementation class. The uri's authority is used to
                        determine the host, port, etc. for a filesystem.</description>
        </property>
        <property>
                <name>dfs.replication</name>
                <value>3</value>
        </property>
        <property>
                <name>hadoop.tmp.dir</name>
                <value>/opt/cloudhost/hadoop/tmp/hadoop-${user.name}</value>
                <description>A base for other temporary directories.</description>
        </property>
</configuration>
```
>hadoop#/opt/cloudhost/hadoop/etc/hadoop/hdfs-site.xml
```vim
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
        <property>
                <name>dfs.namenode.name.dir</name>
                <value>/opt/cloudhost/hadoop/hdfs/name</value>
                <description>Path on the local filesystem where the NameNode stores
                        the namespace and transactions logs persistently.</description>
        </property>
        <property>
                <name>dfs.datanode.data.dir</name>
                <value>/opt/cloudhost/hadoop/hdfs/data</value>
                <description>Comma separated list of paths on the local filesystem of a DataNode where it should store its blocks.</description>
        </property>
        <property>
                <name>dfs.permissions</name>
                <value>false</value>
        </property>
</configuration>
```
>hadoop#/opt/cloudhost/hadoop/etc/hadoop/yarn-site.xml
```vim
<?xml version="1.0"?>
<configuration>
        <property>
                <name>yarn.resourcemanager.resource-tracker.address</name>
                <value>M1:8031</value>
                <description>host is the hostname of the resource manager and
                        port is the port on which the NodeManagers contact the Resource Manager.
                </description>
        </property>
        <property>
                <name>yarn.resourcemanager.scheduler.address</name>
                <value>M1:8030</value>
                <description>host is the hostname of the resourcemanager and port is
                        the port
                        on which the Applications in the cluster talk to the Resource Manager.
                </description>
        </property>
        <property>
                <name>yarn.resourcemanager.scheduler.class</name>
                <value>org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler</value>
                <description>In case you do not want to use the default scheduler</description>
        </property>
        <property>
                <name>yarn.resourcemanager.address</name>
                <value>M1:8032</value>
                <description>the host is the hostname of the ResourceManager and the
                        port is the port on
                        which the clients can talk to the Resource Manager.
                </description>
        </property>
        <property>
                <name>yarn.nodemanager.local-dirs</name>
                <value>${hadoop.tmp.dir}/nodemanager/local</value>
                <description>the local directories used by the nodemanager</description>
        </property>
        <property>
                <name>yarn.nodemanager.address</name>
                <value>0.0.0.0:8034</value>
                <description>the nodemanagers bind to this port</description>
        </property>
        <property>
                <name>yarn.nodemanager.resource.cpu-vcores</name>
                <value>1</value>
                <description></description>
        </property>
        <property>
                <name>yarn.nodemanager.resource.memory-mb</name>
                <value>2048</value>
                <description>Defines total available resources on the NodeManager to be made available to running containers</description>
        </property>
        <property>
                <name>yarn.nodemanager.remote-app-log-dir</name>
                <value>${hadoop.tmp.dir}/nodemanager/remote</value>
                <description>directory on hdfs where the application logs are moved to </description>
        </property>
        <property>
                <name>yarn.nodemanager.log-dirs</name>
                <value>${hadoop.tmp.dir}/nodemanager/logs</value>
                <description>the directories used by Nodemanagers as log directories</description>
        </property>
        <property>
                <name>yarn.application.classpath</name>
                <value>$HADOOP_HOME,$HADOOP_HOME/share/hadoop/common/*,
               $HADOOP_HOME/share/hadoop/common/lib/*,
               $HADOOP_HOME/share/hadoop/hdfs/*,$HADOOP_HOME/share/hadoop/hdfs/lib/*,
               $HADOOP_HOME/share/hadoop/yarn/*,$HADOOP_HOME/share/hadoop/yarn/lib/*,
               $HADOOP_HOME/share/hadoop/mapreduce/*,$HADOOP_HOME/share/hadoop/mapreduce/lib/*</value>
                <description>Classpath for typical applications.</description>
        </property>
        <!-- Use mapreduce_shuffle instead of mapreduce.suffle (YARN-1229)-->
        <property>
                <name>yarn.nodemanager.aux-services</name>
                <value>mapreduce_shuffle</value>
                <description>shuffle service that needs to be set for Map Reduce to run </description>
        </property>
     <property>
            <name>yarn.nodemanager.aux-services.mapreduce.shuffle.class</name>
            <value>org.apache.hadoop.mapred.ShuffleHandler</value>
     </property>
     <property>
            <name>yarn.scheduler.minimum-allocation-mb</name>
            <value>256</value>
     </property>
     <property>
            <name>yarn.scheduler.maximum-allocation-mb</name>
            <value>6144</value>
     </property>
     <property>
            <name>yarn.scheduler.minimum-allocation-vcores</name>
            <value>1</value>
     </property>
     <property>
            <name>yarn.scheduler.maximum-allocation-vcores</name>
            <value>3</value>
     </property>
</configuration>
```
>hadoop#/opt/cloudhost/hadoop/etc/hadoop/mapred-site.xml
```vim
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
     <property>
          <name>mapreduce.framework.name</name>
          <value>yarn</value>
          <description>Execution framework set to Hadoop YARN.</description>
     </property>
     <property>
          <name>mapreduce.map.memory.mb</name>
          <value>512</value>
          <description>Larger resource limit for maps. default 1024M</description>
     </property>
     <property>
          <name>mapreduce.map.cpu.vcores</name>
          <value>1</value>
          <description></description>
     </property>
     <property>
          <name>mapreduce.reduce.memory.mb</name>
          <value>512</value>
          <description>Larger resource limit for reduces.</description>
     </property>
     <property>
          <name>mapreduce.reduce.shuffle.parallelcopies</name>
          <value>5</value>
          <description>Higher number of parallel copies run by reduces to fetch outputs from very large number of maps.</description>
     </property>
     <property>
          <name>mapreduce.jobhistory.address</name>
          <value>M1:10020</value>
          <description>MapReduce JobHistory Server host:port, default port is 10020.</description>
     </property>
     <property>
          <name>mapreduce.jobhistory.webapp.address</name>
          <value>M1:19888</value>
          <description>MapReduce JobHistory Server Web UI host:port, default port is 19888.</description>
     </property>
</configuration>
```
>hadoop#/opt/cloudhost/hadoop/etc/hadoop/slaves
```vim
S1
S2
S3
```

##配置网络
当然你可以选择配置iptables，因为我不是这方面的专家，直接把防火墙关闭了
```shell
<!--临时关闭-->
sudo service iptables stop
sudo service ip6tables stop
<!--永久关闭-->
sudo chkconfig iptables off
sudo chkconfig ip6tables off
```

##分发配置文件
```shell
<!--在主节点m1上将上面配置好的程序文件，复制分发到各个从节点上-->
scp -r /opt/cloudhost/hadoop/etc/hadoop hadoop@S1:/opt/cloudhost/hadoop/etc/
scp -r /opt/cloudhost/hadoop/etc/hadoop hadoop@S2:/opt/cloudhost/hadoop/etc/
scp -r /opt/cloudhost/hadoop/etc/hadoop hadoop@S3:/opt/cloudhost/hadoop/etc/
```

##格式化NameNode
在M1上执行
```shell
hadoop namenode -format
```

##启动HDFS集群
>验证：http://M1:50070/
```shell
/opt/cloudhost/hadoop/sbin/start-dfs.sh
```

##启动Yarn集群
```shell
/opt/cloudhost/hadoop/sbin/start-yarn.sh
```
>ResourceManager验证：http://m1:8088/

>NodeManager验证：http://s1:8042/ `S2,S3`均可验证

##启动JobHistory服务
>当然，你可以不启动这个服务
```shell
cd /opt/cloudhost/hadoop/sbin/
mr-jobhistory-daemon.sh start historyserver
```
>JobHistory Server验证：http://M1:19888

##查看进程
```shell
jps
```

##集群验证
>使用hadoop自带的wordcount进行验证
```shell
<!--在HDFS下创建目录-->
hadoop fs -mkdir -p /data/wordcount
hadoop fs -mkdir -p /output/
<!--上传需要wordcount的文件，这里随便找了一些文件-->
hadoop fs -put /opt/cloudhost/hadoop/etc/hadoop/*.xml /data/wordcount/
hadoop fs -ls /data/wordcount
<!--执行wordcount实例-->
hadoop jar /opt/cloudhost/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.4.0.jar wordcount /data/wordcount /output/wordcount
```

###以上为所有步骤，转载请注明出处huangchaosuper.github.io/blog
