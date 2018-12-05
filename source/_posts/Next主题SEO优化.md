---
title: Next主题SEO优化
categories:
  - Blog
tags:
  - Next
keyword:
  - next主题
  - next优化
  - seo优化
  - next主题优化
date: 2018-12-05 17:27:16
updated: 2018-12-05 17:27:16
---

写完了博客，结果在网上搜不到，不能被更多的人看见，岂不是很没有成就感？本文将结合百度搜索来进行seo优化。

![百度站长统计][1]
<!--more-->

**本文基于 NexT v6.3.0**

## 1、让百度收录你的站点

我们首先要做的就是让各大搜索引擎收录你的站点，我们在刚建站的时候各个搜索引擎是没有收录我们网站的，在搜索引擎中输入site:<域名>,如果如下图所示就是说明我们的网站并没有被百度收录。我们可以直接点击下面的“提交网址”来提交我们的网站。

![此处输入图片的描述][2]

登录[百度站长平台][3],在站点管理中点击添加网站然后输入你的站点地址，建议输入的网站为www开头的，不要输入github.io的，因为github是不允许百度的spider爬取github上的内容的，所以如果想让你的站点被百度收录，只能使用自己购买的域名。
![添加网站][4]

在选择完网站的类型之后需要验证网站的所有权，验证网站所有权的方式有三种：文件验证、html标签验证和cname解析验证，使用哪一种方式都可以，都是比较简单的，但是一定要注意，使用文件验证文件存放的位置需要放在source文件夹下，如果是html文件那么hexo就会将其编译，所以必须要加上的layout:false，这样就不会被hexo编译。（如果验证文件是txt格式的就不需要），其他两种方式也是很简单的，我个人推荐文件验证和cname验证，cname验证最为简单，只需加一条解析就好。

## 2、首页title优化

更改index.swig文件
文件路径是your-hexo-site\themes\next\layout，将下面代码

```cli
{% block title %}{{ title }}{% if theme.index_with_subtitle and subtitle %} &mdash; {{ subtitle }}{% endif %}{% endblock %}
```

改成

```cli
{% block title %}{{  keywords  }}{{ title }}{% if theme.index_with_subtitle and subtitle %} &mdash; {{ subtitle }}{% endif %}{% endblock %}
```


## 3、文章链接优化

HEXO默认的文章链接形式为**domain/year/month/day/postname**，默认就是一个四级url，并且可能造成url过长，对搜索引擎是十分不友好的，我们可以改成 **domain/postname** 的形式。编辑站点_config.yml文件，修改其中的permalink字段改为permalink: :title.html即可。

```cli
# 博客文章的 URL 结构，请务必写文章之前就想好！
# 详细参数请查看：https://hexo.io/docs/permalinks.html
#permalink: :year/:month/:day/:title/
permalink: :title.html
permalink_defaults:
```
## 4、设置关键字

 1. 设置hexo博客关键字
 
    在博客根目录下找到 config.yml 文件，在所示地方添加keywords: 关键字1,关键字2,关键字3…，采用英文逗号隔开，注意keywords与关键词之间的空格。

    ```cli
    # Site
    title: 温故而知新
    subtitle: 
    description: 天下事有难易乎？<br/>为之，则难者亦易矣；<br/>不为，则易者亦难矣。
    author: 肖悦
    language: zh-CN
    timezone: 
    keywords: Java,Database,Springboot,next
    ```

 2. 设置文章关键字

    在文章里面加入keywords，如下所示：
    
    ```cli
    title: ###
    date: ###
    categories: ###
    tags: ###
    keywords: ###
    description: ###
    ```
 
## 5、设置Sitemap

### 5.1 安装sitemap站点地图自动生成插件

我们需要使用npm自动生成网站的sitemap，然后将生成的sitemap提交到百度和其他搜索引擎。

```cli
npm install hexo-generator-sitemap --save
npm install hexo-generator-baidu-sitemap --save
```

### 5.2 在站点配置文件中添加Sitemap配置

```cli
sitemap:
  path: sitemap.xml
baidusitemap:
  path: baidusitemap.xml
```

### 5.3 在站点配置文件中修改url为带www的域名

```cli
#url: https://kevinXiao2016.github.io
url: https://www.greateman.top
```

### 5.4 生成Sitemap

```cli
hexo clean && hexo d -g 
```
执行上面的命令(起作用的是hexo -g)，在your-hexo-site\public 目录下会生成sitemap.xml文件和baidusitemap.xml文件。

![sitemap文件][5]

可以通过 http://yourBlogSite/baidusitemap.xml 查看该文件是否生成，其中sitemap.xml文件是搜索引擎通用的文件，baidusitemap.xml是百度专用的sitemap文件。

## 6、百度搜索优化
![链接导入][6]

    如何选择链接提交方式 
    1、主动推送：最为快速的提交方式，推荐您将站点当天新产出链接立即通过此方式推送给百度，以保证新链接可以及时被百度收录。 
    2、自动推送：最为便捷的提交方式，请将自动推送的JS代码部署在站点的每一个页面源代码中，部署代码的页面在每次被浏览时，链接会被自动推送给百度。可以与主动推送配合使用。 
    3、sitemap：您可以定期将网站链接放到sitemap中，然后将sitemap提交给百度。百度会周期性的抓取检查您提交的sitemap，对其中的链接进行处理，但收录速度慢于主动推送。 
    4、手动提交：一次性提交链接给百度，可以使用此种方式。
    
![链接导入方式][7]

### 6.1 主动推送(实时)

 1. 安装npm插件
    
    ```cli
    npm install hexo-baidu-url-submit --save
    ```

 2. 在站点配置文件中添加配置
 
    ```cli
    baidu_url_submit:
        count: 10 # 提交最新的10个链接
        host: www.greateman.top # 在百度站长平台中注册的域名
        token: 8OGYpxowYnhgVsUM # 请注意这是您的秘钥,所以请不要把博客源代码发布在公众仓库里!
        path: baidu_urls.txt # 文本文档的地址， 新链接会保存在此文本文档里
    ```
    token所在位置：用户中心>站点管理>链接提交>主动推送
    ![此处输入图片的描述][8]

 3. 在站点配置文件中添加deploy

    ```cli
    deploy:
        - type: baidu_url_submitter 
    ```
    如下图所示：
    ![百度push][9]
 
### 6.2 自动推送

对于Next主题，在主题配置文件下设置,将baidu_push设置为true：

```cli
# Enable baidu push so that the blog will push the url to baidu automatically which is very helpful for SEO
baidu_push: true
```

### 6.3 sitemap

我们将第4步中生成的Sitemap文件提交到百度就可以了~ 

![此处输入图片的描述][10]


## 7、谷歌搜索优化

 1. 注册Google Search Console，添加你的域名后，如下图所示
 2. 进行站点验证，验证的方式和百度的方式相同
 3. 测试robots.txt
 4. 提交站点地图
 5. 点击左侧的Google 抓取方式
 6. 提交谷歌索引


  [1]: http://pj973z6ct.bkt.clouddn.com/baiduSite.png
  [2]: http://pj973z6ct.bkt.clouddn.com/site.png
  [3]: https://ziyuan.baidu.com/
  [4]: http://pj973z6ct.bkt.clouddn.com/addSite.png
  [5]: http://pj973z6ct.bkt.clouddn.com/generaterSitemap.png
  [6]: http://pj973z6ct.bkt.clouddn.com/importLinks.png
  [7]: http://pj973z6ct.bkt.clouddn.com/linkTypes.png
  [8]: http://pj973z6ct.bkt.clouddn.com/baiduToken.png
  [9]: http://pj973z6ct.bkt.clouddn.com/deployBaidu.png
  [10]: http://pj973z6ct.bkt.clouddn.com/pushSitemap.png
