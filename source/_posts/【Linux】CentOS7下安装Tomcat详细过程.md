---
title: 【Linux】CentOS7下安装Tomcat详细过程
categories:
  - Linux
tags:
  - Linux
keyword:
  - linux tomcat
date: 2018-07-24 08:34:48
updated: 2018-07-24 08:34:48
---

安装步骤概述.
<!--more-->

## 1、安装 JDK

具体步骤见  [【Linux】CentOS7下安装JDK详细过程][1]

## 2、安装 Tomcat

### 2.1 下载Tomcat

官方下载地址：[tomcat9官方下载地址][2]

![tomcat9][3]

在命令窗口键入：

```cli
wget http://mirror.bit.edu.cn/apache/tomcat/tomcat-9/v9.0.10/bin/apache-tomcat-9.0.10.tar.gz
```

或者windows下载后，上传到Linux服务器

### 2.2 解压

在命令窗口键入：

```cli
tar -zxvf apache-tomcat-9.0.10.tar.gz
```

## 3、执行

 1. 进入bin目录 cd /usr/java/tomcat9/bin
 2. 启动 ./startup.sh
    
    ```cli
    [root@localhost bin]# ./startup.sh 
    Using CATALINA_BASE:   /usr/java/tomcat9
    Using CATALINA_HOME:   /usr/java/tomcat9
    Using CATALINA_TMPDIR: /usr/java/tomcat9/temp
    Using JRE_HOME:        /usr/java/jdk1.8.0_181/jre
    Using CLASSPATH:       /usr/java/tomcat9/bin/bootstrap.jar:/usr/java/tomcat9/bin/tomcat-juli.jar
    Tomcat started.
    ```
 3. 访问服务器ip地址  服务器ip:8080
 

## 4、tomcat启动后外网无法访问

iptables防火墙设置参考文章地址：
[CentOS7.4 关闭firewall防火墙，改用iptables][4]
[CentOS之——CentOS7安装iptables防火墙][5]

 1. 查看防火墙状态

    ```cli
    service iptables status
    ```

 2. 添加8080端口允许外网访问

    ```cli
    /sbin/iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
    ```

 3. 保存规则设定

    ```cli
    service iptables save
    ```

 4. 重启防火墙

    ```cli
    service iptables restart
    ```


    


  [1]: https://www.zybuluo.com/MrXiao/note/1219090
  [2]: https://tomcat.apache.org/download-90.cgi
  [3]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/Linux/dowlondTomcat.png
  [4]: https://blog.csdn.net/u010071211/article/details/79244404
  [5]: https://blog.csdn.net/l1028386804/article/details/50779761