---
title: 基于MUI及Html5+开发app
date: 2017-04-28 17:07:22
categories:
    - course
tags:
    - MUI
    - html5+
---
这边博客简要介绍了使用MUI和5+开发APP的流程
<!-- more -->
## MUI简介
[MUI官网](http://dev.dcloud.net.cn/mui/)&nbsp&nbspMUI是最接近原生APP体验的高性能前端框架，不依赖任何第三方JS库，以iOS平台UI为基础，补充部分Android平台特有的UI控件。

## 工具
- [HBilder](http://www.dcloud.io/)
- [5+ SDK](http://ask.dcloud.net.cn/article/103)
- Android Studio + Android SDK

## html5+简介
[HTML5+规范](http://www.html5plus.org/doc/h5p.html)

## 开发步骤

    1.在Hbuilder中创建移动app项目
    2.在manifest.json文件中按照提示配置app相关信息，包括权限选择，这个地方和下面将要提到的androidManifest.xml文件是相互独立的
    3.新建View文件夹编写html，新建js、css文件夹放置对应文件
    4.若使用5+相关的东西,如下操作： 
      - 在5+ SDK中，对应Feature-Android.xls文件，使用哪个模块，就在xls文件中找到对应模块
      - 将文件中提到的相关文件从5+ SDK中的HBuilder-Integrate工程中找到，并移入android工程中
    5.参照[5+ API](http://www.html5plus.org/doc/h5p.html),编写相关代码
    
## 调试
调试可使用真机调试和模拟调试，建议真机调试，涉及到5+的代码只能在真机上运行。
