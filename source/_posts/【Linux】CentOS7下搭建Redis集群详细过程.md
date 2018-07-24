---
title: 【Linux】CentOS7下搭建Redis集群详细过程
categories:
  - Linux
tags:
  - Linux
keyword:
  - linux redis cluster
date: 2018-07-24 08:35:19
updated: 2018-07-24 08:35:19
---
Redis-cluster集群方案从redis3.0版本开始支持，本文仅做基本的集群搭建介绍。

<!--more-->

## 1、下载编译Reids

```cli
//创建安装包文件夹
mkdir /usr/local/packages
//创建redis安装目录
mkdir /usr/local/redis

//下载安装包
cd /usr/local/packages
wget http://download.redis.io/releases/redis-4.0.1.tar.gz

//解压到安装目录
tar -zxvf redis-4.0.1.tar.gz -C /usr/local/redis

//编译
cd /usr/local/redis/redis-4.0.1
make
make install
```
注意：在执行make的是时候确保包含了编译所需的工具包。阿里云Centos7.0 编译没有问题直接通过

安装成功后，在/usr/local/redis/redis-4.0.1/src目录下会有编译后的文件，并且在/usr/local/bin目录下生成redis有关的指令文件。

![此处输入图片的描述][2]

## 2、节点规划

规划创建6个redis实例，3主3从，简单起见，均在同一机器上，规划端口为6380 ~ 6385。

在 /usr/local  下创建/redis/redis-cluster文件夹，并在其中创建6380-6385 6个文件夹

```cli
[root@localhost redis-cluster]# mkdir 6380
[root@localhost redis-cluster]# mkdir 6381
[root@localhost redis-cluster]# mkdir 6382
[root@localhost redis-cluster]# mkdir 6383
[root@localhost redis-cluster]# mkdir 6384
[root@localhost redis-cluster]# mkdir 6385
```

## 3、配置修改

拷贝一份配置文件到当前目录

```cli
[root@localhost redis-cluster]# cp ../redis-4.0.1/redis.conf ./
```

修改属性，cope6份分别放在6个文件夹中，注意更改端口号

```cli
port 6380   //端口
daemonize yes   //后台启动模式
pidfile /var/run/redis-6380pid //开启daemonize需要配置
cluster-enabled yes     //cluster模式
cluster-config-file nodes-6380.conf     //日志文件名
cluster-node-timeout 5000   //请求超时时间，5s
appendonly  yes     //aof日志开启  有需要就开启，它会每次写操作都记录一条日志

bind 192.168.86.130 //服务器ip
```

## 4、启动redis

简便起见，创建集群启动脚本

```cli
[root@localhost redis-cluster]#vim start-all.sh 
```
输入一下内容并保存

```cli
redis-server /usr/local/redis/redis-cluster/redis-6380/redis.conf
redis-server /usr/local/redis/redis-cluster/redis-6381/redis.conf
redis-server /usr/local/redis/redis-cluster/redis-6382/redis.conf
redis-server /usr/local/redis/redis-cluster/redis-6383/redis.conf
redis-server /usr/local/redis/redis-cluster/redis-6384/redis.conf
redis-server /usr/local/redis/redis-cluster/redis-6385/redis.conf
```

赋予该脚本可执行权限：

```cli
chmod +x start-all.sh
```

同样，创建集群关闭脚本，并赋予相同权限，内容如下

```cli
[root@localhost redis-cluster]#vim stop-all.sh 
```

```cli
redis-cli -h 192.168.86.130 -p 6380 shutdown
redis-cli -h 192.168.86.130 -p 6381 shutdown
redis-cli -h 192.168.86.130 -p 6382 shutdown
redis-cli -h 192.168.86.130 -p 6383 shutdown
redis-cli -h 192.168.86.130 -p 6384 shutdown
redis-cli -h 192.168.86.130 -p 6385 shutdown
```

启动redis,执行启动脚本：

```cli
./start-all.sh
```

查看redis启动情况：


    [root@localhost redis-cluster]# ps -ef | grep redis
    root       3241      1  0 02:33 ?        00:00:00 redis-server 192.168.86.130:6380 [cluster]
    root       3243      1  0 02:33 ?        00:00:00 redis-server 192.168.86.130:6381 [cluster]
    root       3248      1  0 02:33 ?        00:00:00 redis-server 192.168.86.130:6382 [cluster]
    root       3256      1  0 02:33 ?        00:00:00 redis-server 192.168.86.130:6383 [cluster]
    root       3261      1  0 02:33 ?        00:00:00 redis-server 192.168.86.130:6384 [cluster]
    root       3266      1  0 02:33 ?        00:00:00 redis-server 192.168.86.130:6385 [cluster]
    root       3271   2600  0 02:33 pts/0    00:00:00 grep --color=auto redis

## 5、Ruby环境

redis集群管理工具redis-trib.rb依赖ruby环境，首先需要安装ruby环境。

```cli
yum install ruby
yum install rubygems
```

拷贝redis-3.0.0.gem至/usr/local下
执行：

```cli
gem install /usr/local/redis
```

若报如下错误，则是ruby版本过低,需要安装一个高于2.2.2版本的ruby。

```cli
ERROR:  Error installing redis:
        redis requires Ruby version >= 2.2.2.
```

具体过程参考：

## 6、启动集群

拷贝redis-trib.rb到 redis目录下

```cli
cp /usr/local/redis/redis-4.0.1/src/redis-trib.rb /usr/local/redis/redis-cluster
```

进入redis-cluster目录下，执行集群脚本：

```cli
./redis-trib.rb create --replicas 1 192.168.86.130:6380 192.168.86.130:6381 192.168.86.130:6382 192.168.86.130:6383 192.168.86.130:6384  192.168.86.130:6385
```
简单解释一下这个命令：调用 ruby 命令来进行创建集群，`--replicas 1` 表示主从复制比例为 1:1，即一个主节点对应一个从节点；然后，默认给我们分配好了每个主节点和对应从节点服务，以及 solt 的大小，因为在 Redis 集群中有且仅有 16383 个 solt ，默认情况会给我们平均分配，当然你可以指定，后续的增减节点也可以重新分配。
随便找一个节点测试试


```cli
[root@localhost redis-cluster]# redis-cli -h 192.168.86.130 -p 6382 -c
192.168.86.130:6382> set b 100
-> Redirected to slot [3300] located at 192.168.86.130:6380
OK
192.168.86.130:6380>  
```


## 参考

[配置文件说明][3]
[redis详解][4]


  [1]: https://blog.csdn.net/chinabestchina/article/details/80672560
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/Linux/makeRedis.png
  [3]: https://www.cnblogs.com/zr520/p/5056972.html
  [4]: https://blog.csdn.net/hjm4702192/article/details/80518922