---
title: 【Linux】更新yum源 改成阿里云源
categories:
  - Linux
tags:
  - Linux
keyword:
  - yum
date: 2018-08-31 09:36:30
updated: 2018-08-31 09:36:30
---

更新yum源 改成阿里云源

<!-- more -->

## 1、备份

```cmd
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

## 2、更换源

 - Centos5

    ```cmd
    wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
    ```
    或者
    ```cmd
    curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
    ```
    

 - CentOS 6

    ```cmd
    wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
    ```
    或者
    ```cmd
    curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
    ```
    
 - CentOS 7

    ```cmd
    wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
    ```
    或者
    ```cmd
    curl -o /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
    ```
    
## 3、清理并生成缓存

```cmd
yum clean all
yum makecache
```

## 4、yum基本语法

### 4.1 语法

yum [options] [command] [package ...]
参数：
options：可选，包括-h（帮助），-y（安装过程中提示全部选yes），-q（不显示安装过程）
command：要进行的操作
package：操作的对象

### 4.2 常用命令

1）列出所有可更新的软件清单命令：yum check-update
2）更新所有软件命令：yum update
3）仅安装指定的软件命令：yum install <package_name>
4）仅更新指定的软件命令：yum update <package_name>
5）列出所有可安裝的软件清单命令：yum list，list后面可以接各种参数，详情请man yum
6）删除软件包命令：yum remove <package_name>
7）查找软件包 命令：yum search <keyword>
8）清除缓存命令:

    yum clean packages: 清除缓存目录下的软件包
    yum clean headers: 清除缓存目录下的 headers
    yum clean oldheaders: 清除缓存目录下旧的 headers
    yum clean, yum clean all (= yum clean packages; yum clean oldheaders):清除缓存目录下的软件包及旧的headers
 

