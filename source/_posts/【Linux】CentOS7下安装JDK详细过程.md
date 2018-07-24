---
title: 【Linux】CentOS7下安装JDK详细过程
categories:
  - Linux
tags:
  - Linux
keyword:
  - linux jdk
date: 2018-07-24 08:34:31
updated: 2018-07-24 08:34:31
---
Linux上一般会安装Open JDK,关于OpenJDK和JDK的区别：[【JDK和Open JDK】平常使用的JDK和Open JDK有什么区别][1]。

<!--more-->

## 1、卸载系统自带的OpenJDK以及相关的java文件

### 1.1 在命令窗口键入：
    
```cli
java -version
```

![java -version][2]
    
可以看到系统自带的OpenJDK版本信息。
    
### 1.2 在命令窗口键入：

```cli
rpm -qa | grep java
```
    命令说明：
    rpm 　　管理套件    
    -qa 　　使用询问模式，查询所有套件
    grep　　查找文件里符合条件的字符串
    java 　　查找包含java字符串的文件

![此处输入图片的描述][3]

以上文件中：下面这几个可以删除

    java-1.7.0-openjdk-1.7.0.111-2.6.7.8.el7.x86_64
    java-1.8.0-openjdk-1.8.0.102-4.b14.el7.x86_64
    java-1.8.0-openjdk-headless-1.8.0.102-4.b14.el7.x86_64
    java-1.7.0-openjdk-headless-1.7.0.111-2.6.7.8.el7.x86_64

以下文件可以不用删除

    python-javapackages-3.4.1-11.el7.noarch
    tzdata-java-2016g-2.el7.noarch
    javapackages-tools-3.4.1-11.el7.noarch
    
    
### 1.3 在命令窗口键入：
 
```cli
su
```

输入密码，进入超级用户角色
    

### 1.4 在命令窗口键入：
    
```cli
rpm -e --nodeps java-1.7.0-openjdk-1.7.0.111-2.6.7.8.el7.x86_64
rpm -e --nodeps java-1.8.0-openjdk-1.8.0.102-4.b14.el7.x86_64
rpm -e --nodeps java-1.8.0-openjdk-headless-1.8.0.102-4.b14.el7.x86_64
rpm -e --nodeps java-1.7.0-openjdk-headless-1.7.0.111-2.6.7.8.el7.x86_64
```

    命令介绍：
    rpm 　　　　管理套件  
    -e　　　　　删除指定的套件
    --nodeps　　不验证套件档的相互关联性
    

### 1.5  检查是否已经删除成功
 
在命令窗口键入：

```cli
java -version
```

![此处输入图片的描述][4]

代表已经删除成功了。
    
## 2、安装 Sun JDK
    
**【注意】:JDK安装在哪个用户下，就是给哪个用户使用**

### 2.1 下载

当前最新版本下载地址：http://www.oracle.com/technetwork/java/javase/downloads/index.html
历史版本下载地址：　　http://www.oracle.com/technetwork/java/javase/archive-139210.html
　　
 
在命令窗口键入：
    
```cli
wget http://download.oracle.com/otn-pub/java/jdk/8u181-b13/96a7b8442fe848ef90c96a2fad6ed6d1/jdk-8u181-linux-x64.tar.gz?AuthParam=1531986242_deb391e0a43953c12051f2d1eae8afad
```

或者windows下载后，使用xftp工具上传到Linux服务器。

### 2.2 解压

将jdk-8u181-linux-x64.tar.gz文件拷贝一份到/usr/java

```cli
cp jdk-8u181-linux-x64.tar.gz /usr/java
```

进入 /usr/java 目录，解压

```cli
cd /usr/java
tar -zxvf jdk-8u181-linux-x64.tar.gz 
```

### 2.3 配置环境变量

使用vim /etc/profile 编辑profile文件

```cli
vim /etc/profil
```

向文件里面追加以下内容：

```cli
#set java environment
JAVA_HOME=/usr/java/jdk1.8.0_181
JRE_HOME=$JAVA_HOME/jre
PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib
export JAVA_HOME JRE_HOME PATH CLASSPATH
```

    注释：
    
    JAVA_HOME指明JDK安装路径，就是刚才安装时所选择的路径，此路径下包括lib，bin，jre等文件夹（tomcat，Eclipse的运行都需要依靠此变量）。
    
    CLASSPATH为java加载类(class or lib)路径，只有类在classpath中，java命令才能识别，设：.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar:$JRE_HOME/lib。CLASSPATH变量值中的.表示当前目录
    
    PATH使得系统可以在任何路径下识别java命令，设为：$JAVA_HOME/bin:$JRE_HOME/bin。
    
    特别注意：环境变量值的结尾没有任何符号，不同值之间用:隔开（windows中用;）。
 
### 2.4 使配置文件生效

在命令窗口键入：
    
```cli
source /etc/profile
```

### 2.5 测试配置是否成功

在命令窗口键入：
    
```cli
java -version
```

如下显示，则配置成功

```cli
[root@localhost java]# java -version
java version "1.8.0_181"
Java(TM) SE Runtime Environment (build 1.8.0_181-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.181-b13, mixed mode)
```



    

    


  [1]: http://www.cnblogs.com/sxdcgaq8080/p/7487369.html
  [2]: https://images2017.cnblogs.com/blog/978388/201709/978388-20170907223117179-1206697422.png
  [3]: https://images2017.cnblogs.com/blog/978388/201709/978388-20170907223341444-542280232.png
  [4]: https://images2017.cnblogs.com/blog/978388/201709/978388-20170907230232522-1003727369.png