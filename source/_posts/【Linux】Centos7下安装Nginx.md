---
title: 【Linux】Centos7下安装Nginx
categories:
  - Linux
tags:
  - Linux
  - Nginx
keyword:
  - nginx
date: 2018-06-13 13:03:57
updated: 2018-06-13 13:03:57
---
Nginx 是 C语言 开发，建议在 Linux 上运行，当然，也可以安装 Windows 版本，本篇则使用 CentOS 7 作为安装环境。

<!-- more -->

## 1、配置环境

Nginx 是 C语言 开发，建议在 Linux 上运行，当然，也可以安装 Windows 版本，本篇则使用 CentOS 7 作为安装环境。

 1. gcc 安装
    安装 nginx 需要先将官网下载的源码进行编译，编译依赖 gcc 环境，如果没有 gcc 环境，则需要安装：
    
    ```cli
    yum install -y gcc-c++
    ```
 
 2. PCRE pcre-devel 安装
    PCRE(Perl Compatible Regular Expressions) 是一个Perl库，包括 perl 兼容的正则表达式库。nginx 的 http 模块使用 pcre 来解析正则表达式，所以需要在 linux 上安装 pcre 库，pcre-devel 是使用 pcre 开发的一个二次开发库。nginx也需要此库。命令：

    ```cli
    yum install -y pcre pcre-devel
    ```

 3.  zlib 安装
    zlib 库提供了很多种压缩和解压缩的方式， nginx 使用 zlib 对 http 包的内容进行 gzip ，所以需要在 Centos 上安装 zlib 库。

    ```cli
    yum install -y zlib zlib-devel
    ```

 4. OpenSSL 安装
    OpenSSL 是一个强大的安全套接字层密码库，囊括主要的密码算法、常用的密钥和证书封装管理功能及 SSL 协议，并提供丰富的应用程序供测试或其它目的使用。
nginx 不仅支持 http 协议，还支持 https（即在ssl协议上传输http），所以需要在 Centos 安装 OpenSSL 库。
    
    ```cli
    yum install -y openssl openssl-devel
    ```

## 2、安装Nginx

 1. 下载.tar.gz

    ```cli
    wget -c https://nginx.org/download/nginx-1.14.0.tar.gz   
    ```

 2. 解压

    ```clivi
    tar -zxvf nginx-1.14.0.tar.gz 
    cd nginx-1.14.0
    ```
    
 3. 配置
 
    3.1 使用默认配置
    
    ```cli
    ./configure
    ```
    
    3.2 自定义配置（推荐）
    

        ./configure \
        --prefix=/usr/local/nginx \
        --conf-path=/usr/local/nginx/conf/nginx.conf \
        --pid-path=/usr/local/nginx/conf/nginx.pid \
        --lock-path=/var/lock/nginx.lock \
        --error-log-path=/var/log/nginx/error.log \
        --http-log-path=/var/log/nginx/access.log \
        --with-http_gzip_static_module \
        --http-client-body-temp-path=/var/temp/nginx/client \
        --http-proxy-temp-path=/var/temp/nginx/proxy \
        --http-fastcgi-temp-path=/var/temp/nginx/fastcgi \
        --http-uwsgi-temp-path=/var/temp/nginx/uwsgi \
        --http-scgi-temp-path=/var/temp/nginx/scgi
  
    
    <font color="red">注意：上边将临时文件目录指定为/var/temp/nginx，需要在/var下创建temp及nginx目录</font>
    
    ```cli
    mkdir -p /var/temp/nginx
    ```
    
    
 4. 编译安装

    ```cli
    <!--编译-->
    make
    <!--安装-->
    make install
    ```
    
 5. 开启pid-path
    
    ```cli
    <!--进入安装目录-->
    cd /usr/local/nginx
    
    <!--编辑nginx.conf-->
    vi conf/nginx.conf
    
    <!--开启pid，并设值-->
    pid /usr/local/nginx/logs/nginx.pid;
    
    <!--创建目录-->
    mkdir /usr/local/nginx/logs
    ```

 
## 3、启动Nginx

 1. 启动

    ```cli
    /usr/local/nginx/sbin/nginx 
    ```

    ![此处输入图片的描述][1]
    
 2. 停止
 
    ```cli
    /usr/local/nginx/sbin/nginx -s stop
    ```
    
    推荐下面这条命令：
    ```cli
    /usr/local/nginx/sbin/nginx -s quit
    ```

 3. 重启
    
    ```cli
    /usr/local/nginx/sbin/nginx -s reload
    ```
    
 4. 配置文件位置

    ```cli
    /usr/local/nginx/sbin/nginx -t
    ```
    
## 4、开机启动

参照这篇文章：[CentOS7+Nginx设置Systemctl restart nginx.service服务][2]

    启动nginx服务
    systemctl start nginx.service　
    
    设置开机自启动
    systemctl enable nginx.service
    
    停止开机自启动
    systemctl disable nginx.service
    
    查看服务当前状态
    systemctl status nginx.service
    
    重新启动服务
    systemctl restart nginx.service　
    
    查看所有已启动的服务
    systemctl list-units --type=service

## 5、问题汇总

 1. window无法访问虚拟机的nginx服务

    首先确认windows是否能ping通linux，确认可以的情况下，很有可能是linux的防火墙开启且屏蔽了80端口。参照 [CentOS7.4 关闭firewall防火墙，改用iptables][3] 这篇文章设置，改用iptables，并放开80端口。
 



  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/nginx/nginx_start.png
  [2]: https://blog.csdn.net/qq_36441027/article/details/80636526
  [3]: https://blog.csdn.net/u010071211/article/details/79244404