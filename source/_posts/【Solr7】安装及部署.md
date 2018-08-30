---
title: 【Solr7】安装及部署
categories:
  - 全文搜索
tags:
  - Solr
keyword:
  - Solr
date: 2018-08-30 13:54:31
updated: 2018-08-30 13:54:31
---


本博客使用的版本为 **7.2.1**。有关Solr的详细介绍及使用，参见[Solr中国官方文档][1]。
<!--more-->

## 1、概述

Solr 是Apache下的一个顶级开源项目，采用Java开发，它是基于Lucene的全文搜索服务。
solr可以实现全文检索功能（索引、搜索），solr是可以独立运行在tomcat等web容器中。
Solr不提供构建UI的功能，Solr提供了一个管理界面，通过管理界面可以查询Solr的配置和运行情况。
Solr主要对外提供索引和搜索服务。
下面是一个如何将 Solr 集成到应用程序中的示例：
![此处输入图片的描述][2]

    
## 2、系统要求

您可以在任何系统中安装 Solr，但是这些系统中必须有适用的 Java 运行时环境（JRE），具体介绍如下文所述。

目前，这包括 Linux，MacOS / OS X 和 Microsoft Windows。

Java 要求
您将需要 1.8 或更高版本的 Java 运行时环境（JRE）。在命令行中，检查您的 Java 版本，如下所示：

```cmd
$ java -version
java version "1.8.0_60"
Java(TM) SE Runtime Environment (build 1.8.0_60-b27)
Java HotSpot(TM) 64-Bit Server VM (build 25.60-b23, mixed mode)
```

## 3、下载安装

Solr 可从 Solr 网站获取。您可以在此下载最新版本的 Solr：https://lucene.apache.org/solr/mirrors-solr-latest-redir.html。

Solr 有三个独立的软件包：

 - solr-7.0.0.tgz：适用于 Linux / Unix / OSX 系统
 - solr-7.0.0.zip：适用于 Microsoft Windows 系统
 - solr-7.0.0-src.tgz：Solr 源代码包。如果您想在 Solr 上开发而不使用官方的 Git 存储库，这将非常有用。
 

下载解压 Solr 之后，您将会看到以下的目录和文件：
![解压目录][3]

 - bin 

    此目录中包含几个重要的脚本，这些脚本将使使用 Solr 更容易。

    solr 和 solr.cmd 
    这是Solr 的控制脚本，也称为bin/solr（对于 * nix）或者bin/solr.cmd（对于 Windows）。这个脚本是启动和停止 Solr 的首选工具。您也可以在运行 SolrCloud 模式时创建集合或内核、配置身份验证以及配置文件。

    post 
    Post Tool，它提供了用于发布内容到 Solr 的一个简单的命令行界面。

    solr.in.sh 和 solr.in.cmd 
    这些分别是为 * nix 和 Windows 系统提供的属性文件。在这里配置了 Java、Jetty 和 Solr 的系统级属性。许多这些设置可以在使用bin/solr或者bin/solr.cmd时被覆盖，但这允许您在一个地方设置所有的属性。

    install_solr_services.sh 
    该脚本用于 * nix 系统以安装 Solr 作为服务。在 “将Solr用于生产 ” 一节中有更详细的描述。

 - contrib 
    Solr 的contrib目录包含 Solr 专用功能的附加插件。 

 - dist 
    该dist目录包含主要的 Solr .jar 文件。

 - docs 
    该docs目录包括一个链接到在线 Javadocs 的 Solr。

 - example 
    该example目录包括演示各种 Solr 功能的几种类型的示例。有关此目录中的内容的详细信息，请参阅下面的 Solr 示例。

 - licenses 
    该licenses目录包括 Solr 使用的第三方库的所有许可证。

 - server 
    此目录是 Solr 应用程序的核心所在。此目录中的 README 提供了详细的概述，但以下是一些特点：

    Solr 的 Admin UI（server/solr-webapp）
    Jetty 库（server/lib）
    日志文件（server/logs）和日志配置（server/resources）。有关如何自定义 Solr 的默认日志记录的详细信息，请参阅配置日志记录一节。
    示例配置（server/solr/configsets）

## 4、运行

Solr的运行分为单机运行和集群运行，这里以单机为例：

1. 在bin目录下执行bin/solr start     

此命令会启动solr应用服务器默认端口为8983，如果想指定端口号启动可以加参数–p例 如：solr start –p 8888.
```cli
D:\Modules\Solr\solr-7.2.1\bin>solr.cmd start
Waiting up to 30 to see Solr running on port 8983
Started Solr server on port 8983. Happy searching!
```
如图这句提示出现后证明服务启动成功(启动过程中如果打印java异常堆栈log4j2.xml 文件名、目录名或卷标语法不正确。没有关系不妨碍我们正常使用solr可以忽略此问题)，接下来在浏览器输入http://localhost:8983/solr可以进入Admin UI界面验证是否启动成功。
 
2.常用命令
 
    solr start –p 端口号 单机版启动solr服务
    solr restart –p 端口号 重启solr服务
    solr stop –p 端口号关闭solr服务
    solr create –c name 创建一个core实例(core概念后面介绍)
    
    
## 5、创建core实例

core简介：
简单说core就是solr的一个实例，一个solr服务下可以有多个core，每个core下都有自己的索引库和与之相应的配置文件，所以在操作solr创建索引之前要创建一个core，因为索引都存在core下面。

 core创建：
 core的创建方式有很多种一下列出两种比较方便的。
 
 1. 在bin目录下执行solr create –c name，创建一个core
 ![此处输入图片的描述][4]
 2. 手动创建文件夹，在solr admin管理页面添加
    在solr home即solr-x.x.x/server/solr下，创建一个文件夹，名字为core的名字
    复制同路径下的 configsets下任意文件夹下的conf目录到刚创建的core目录中
    在管理页面，添加core,对应更改


## 6、添加中文分词器

中文分词器有很多种，使用最多的是IK分词器，solr自带一个中文分词器，但没有IK好用。

[solr7版本的ik分词器下载地址][5]
[solr7版本的ik分词器作者的GitHUb][6]

详细配置过程参见 上述github库说明。

## 7、参考

[solr7.3 环境搭建 配置中文分词器 ik-analyzer-solr7 详细步骤][7]
[Solr7.2.1环境搭建和配置ik中文分词器][8]


  [1]: https://www.w3cschool.cn/solr_doc/solr_doc-t3642fkr.html
  [2]: https://7n.w3cschool.cn/attachments/image/20171103/1509691910631328.png
  [3]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/solr/fileSystem.png
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/solr/createCore.png
  [5]: http://search.maven.org/#search%7Cga%7C1%7Ccom.github.magese
  [6]: https://github.com/magese/ik-analyzer-solr7
  [7]: https://blog.csdn.net/u011052863?t=1
  [8]: https://www.cnblogs.com/mengjinluohua/p/8439546.html
