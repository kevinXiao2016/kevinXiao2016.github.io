---
title: hexo+github搭建个人博客
date: 2017-04-27 18:54:43
categories:
	- Blog
tags:
  - Next
	- Blog
keyword:
	- hexo
	- next
  - github
---
## 1.前言
使用github pages服务搭建博客的好处有：
1.全是静态文件，访问速度快；
2.免费方便，不用花一分钱就可以搭建一个自由的个人博客，不需要服务器不需要后台；
3.可以随意绑定自己的域名，不仔细看的话根本看不出来你的网站是基于github的；
4.数据绝对安全，基于github的版本管理，想恢复到哪个历史版本都行；
5.博客内容可以轻松打包、转移、发布到其它平台；
<!-- more -->

### 1.1准备工作

 - 创建github账号       [github注册地址][1]
 - 安装node.js、npm     [node.js下载地址][2]
 - 安装git for windows  [git下载地址][3]
 
**本文所使用的环境**

 - windows7
 - git@1.9.5
 - node.js@6.10.2
 - hexo@3.7

## 2.搭建github博客
### 2.1创建仓库
登陆github,打开新建页面，如图
![步骤一][4]
![步骤二][5]
新建仓库名必须为**你的用户名.github.io**,假如说你的用户名是test,那仓库名为test.github.io,将来的博客访问地址就是http://test.github.io 了，是不是很方便？
由此可见，每一个github账户最多只能创建一个这样可以直接使用域名访问的仓库。

**几个注意的地方：**

1.注册的邮箱一定要验证，否则不会成功；
2.仓库名字必须是：username.github.io，其中username是你的用户名；
3.仓库创建成功不会立即生效，需要过一段时间，大概10-30分钟，或者更久

###2.2绑定域名

这一步不是必须，若不绑定则可用默认的http://xxx.github.io来访问;

[hexo博客关联域名，部署到coding][6]

## 3.配置SSH key

为什么要配置这个呢？因为你提交代码肯定要拥有你的github权限才可以，但是直接使用用户名和密码太不安全了，所以我们使用ssh key来解决本地和服务器的连接问题。
在电脑任意位置进入**git bash**。

```cli
$ cd ~/.ssh #检查本机已存在的ssh密钥
``` 

如果提示：No such file or directory 说明你是第一次使用git

```cli
ssh-keygen -t rsa -C "邮件地址"
```

然后连续3次回车，最终会生成一个文件在用户目录下，打开用户目录，找到**.ssh\id_rsa.pub**文件，文本编辑器打开并复制里面的内容，打开你的github主页，进入个人设置 -> SSH and GPG keys -> New SSH key：将刚复制的内容粘贴到key那里，title随便填，保存。

![步骤三][7]

**测试是否设置成功**

```
$ ssh -T git@github.com # 注意邮箱地址不用改
```

如果提示Are you sure you want to continue connecting (yes/no)?，输入yes，然后会看到：

Hi xiaoyue! You've successfully authenticated, but GitHub does not provide shell access.

看到这个信息说明SSH已配置成功！

测试Coding的连接：

```
$ ssh -T git@git.coding.net # 注意邮箱地址不用改
```

此时你还需要配置：

```
$ git config --global user.name "kevinXiao2016"// 你的github用户名，非昵称
$ git config --global user.email  "xxx@qq.com"// 填写你的github注册邮箱
```

## 4.使用hexo写博客
### 4.1hexo简介
Hexo是一个简单、快速、强大的基于 Github Pages 的博客发布工具，支持Markdown格式，有众多优秀插件和主题。

官网： http://hexo.io
github: https://github.com/hexojs/hexo
###4.2原理
由于github pages存放的都是静态文件，博客存放的不只是文章内容，还有文章列表、分类、标签、翻页等动态内容，假如每次写完一篇文章都要手动更新博文目录和相关链接信息，相信谁都会疯掉，所以hexo所做的就是将这些md文件都放在本地，每次写完文章后调用写好的命令来批量完成相关页面的生成，然后再将有改动的页面提交到github。

**注意事项**

 1. 很多命令既可以用Windows的cmd来完成，也可以使用git bash来完成，但是部分命令会有一些问题，为避免不必要的问题，建议全部使用git bash来执行；
 2. hexo不同版本差别比较大，网上很多文章的配置信息都是基于2.x的，所以注意不要被误导；
 3. hexo有2种_config.yml文件，一个是根目录下的全局的_config.yml，一个是各个theme下的；

**安装hexo**

```
$ npm install -g hexo
```

npm更换淘宝镜像，提升下载速度

```
临时使用：npm config set registry https://registry.npm.taobao.org
永久使用：npm config set registry https://registry.npm.taobao.org
验证：npm config get registry
```

**初始化**

在电脑的某个地方新建一个名为hexo的文件夹（名字可以随便取），比如我的是*F:\Workspaces\hexo*，由于这个文件夹将来就作为你存放代码的地方，所以最好不要随便放。

```
$ cd /f/Workspaces/hexo/
$ hexo init
```

hexo会自动下载一些文件到这个目录，包括node_modules。继续执行下面两条命令

```
$ hexo g # 生成
$ hexo s # 启动服务
```

执行以上命令之后，hexo就会在public文件夹生成相关html文件，这些文件将来都是要提交到github去的。

**hexo s**是开启本地预览服务，打开浏览器访问 http://localhost:4000 即可看到内容，很多人会碰到浏览器一直在转圈但是就是加载不出来的问题，一般情况下是因为端口占用的缘故，因为4000这个端口太常见了，解决端口冲突问题请参考这篇文章：

http://blog.liuxianan.com/windows-port-bind.html

第一次初始化的时候hexo已经帮我们写了一篇名为 Hello World 的文章，默认的主题比较丑。

## 5.配置主题
### 5.1更换主题
既然默认主题很丑，那我们别的不做，首先来替换一个好看点的主题。这是 [官方主题](https://hexo.io/themes/)。
个人比较喜欢的主题：[hexo-theme-next](https://github.com/iissnan/hexo-theme-next) 和[hexo-theme-yilia](https://github.com/litten/hexo-theme-yilia)
以next主题为例，首先clone这个主题：

进入之前建立的hexo目录，在git bash中执行clone命令

`$ git clone https://github.com/iissnan/hexo-theme-next.git themes/next`

下载的主题到了hexo>theme文件夹下。
修改##hexo##根目录下的**_config.yml**文件中的**theme: landscape**改为**theme: yilia**，然后重新执行**hexo g**来重新生成静态文件，**hexo s**部署到本地，**localhost:4000**预览博客效果。

如果出现一些莫名其妙的问题，可以先执行**hexo clean**来清理一下public的内容，然后再来重新生成和发布。


  [1]: https://github.com/
  [2]: https://nodejs.org/en/download/
  [3]: https://git-scm.com/downloads
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/newRepository.png
  [5]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/step2.png
  [6]: https://greateman.top/hexo%E5%8D%9A%E5%AE%A2%E5%85%B3%E8%81%94%E5%9F%9F%E5%90%8D%EF%BC%8C%E9%83%A8%E7%BD%B2%E5%88%B0coding.html
  [7]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/step3.png