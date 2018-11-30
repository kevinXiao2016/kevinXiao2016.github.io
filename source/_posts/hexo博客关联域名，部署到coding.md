---
title: hexo博客关联域名，部署到coding
categories:
  - Blog
tags:
  - Blog
keyword:
  - next
date: 2018-07-16 18:13:14
updated: 2018-11-30 16:13:14
---

使用了一段时间在github上搭建的hexo个人博客空间，使用markdown写博客既方便，展示出来的样式也还算满意，唯一的缺点就是域名 github.io 总觉得有点累赘，另外就是访问速度比较慢，今天就试着来解决这两个：把访问域名替换成自己的域名,访问站点指向国内的coding.net

<!-- more -->

## 1、购买一个私人域名

[阿里云域名推荐引擎][1]，根据自己的需求购买一个专属域名，以本人域名为例：greateman.top

## 2、Coding上建库

### 2.1 注册Coding.net账号

打开[Coding.net官网][2]，注册一个个人账号

### 2.2 新建项目

注意项目名与注册用的账户名一致，这里我用的是 kevinXiao2016
![此处输入图片的描述][3]

### 2.3 添加公钥

上面设置完毕之后点击创建项目，然后点击设置->部署公钥->新建部署公钥，之前部署到Github上的时候，本地目录 C\User(中文为用户)\(电脑用户名)\.ssh 目录下会有 github.rsa.pub 公钥文件，打开然后复制里面的内容，直接贴在这里的公钥框中： 
![此处输入图片的描述][4]


        记得要勾选 授予推送权限 ，否则在后面运行hexo d时会提示错误：
        Coding.net Tips : [Deploy key is not allowed to push!]
        fatal: Could not read from remote repository.
        原因就是没有推送权限。
    
打开Git命令窗口Git Bash，输入一下指令：

```cli
ssh -T git@git.coding.NET
```

假如出现以下输出结果，表示公钥绑定成功：

```cli
xy@xy-PC MINGW64 ~
$ ssh -T git@git.coding.NET
Coding 提示: Hello kevinXiao2016, You've connected to Coding.net via SSH. This is a deploy key.
kevinXiao2016，你好，你已经通过 SSH 协议认证 Coding.net 服务，这是一个部署公钥
```

### 2.4 绑定个人域名

点击设置->Pages服务，绑定自己购买的域名。

![此处输入图片的描述][5]


### 2.5 解析域名

登陆阿里云

![此处输入图片的描述][6]

![此处输入图片的描述][7]

如红框中所示，添加两条记录，记录值处的ip为 coding上仓库的ip，可以ping 仓库地址得到，仓库地址为 用户名.coding.me

![此处输入图片的描述][8]

## 3、修改hexo配置

### 3.1 关联coding仓库

打开hexo本地的配置文件 _config.yml，修改 deploy 的配置内容，这里设置了运行hexo d之后部署的目的地址，原本只有Github地址，现在添加多Coding.net的地址，其中kevinXiao2016是注册该平台的 用户名：

![此处输入图片的描述][9]

### 3.2 创建Statifile

在source目录下新建一个文件，命名为Statifile，不带文件后缀。

### 3.3 部署博客

打开命令行窗口，定位到当前hexo项目的根目录下，运行以下指令将本地博客部署到Github和Coding.net上：

```cli
hexo clean && hexo d -g
```

假如提交成功，在命令行会输出：

![此处输入图片的描述][10]

## 4、访问

一切准备完毕，此时便可以通过域名访问博客啦。


  [1]: https://wanwang.aliyun.com/?spm=5176.8709316.1146454.770.eb3d5f29ozu1GL
  [2]: https://coding.net/
  [3]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/createCodingReposity.png
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/gongyao.png
  [5]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/bingdomain.png
  [6]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/jiexi.png
  [7]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/adddomainjiexi.png
  [8]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/pingIp.png
  [9]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/deployRepository.png
  [10]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/deployResult.png
