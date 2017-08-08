---
title: DCloud 离线打包之Android Studio
categories:
  - DCloud
tags:
  - MUI
  - Android Studio
  - 离线打包
date: 2017-08-08 16:35:55
---

DCloud 官方文档对于一个没有接触过Android开发的人来说相当的坑爹，以下是根据本人开发过程整理的Android Studio离线打包完整记录，对每一个步骤讲解非常详细，没有接触过AS也没有任何影响。
<!--more-->

## 1. 预备环境

 1. AndroidStudio开发环境,要求安装Android4.0或以上（API 14）SDK。安装方法自行百度。
 2. 下载HBuilder离线打包Android版SDK（[5+ SDK下载][1]）。

## 2. 5+ SDK目录说明

 - **HBuilder-Hello**：离线打包演示应用；
 - **HBuilder-Integrate**: 5+ SDK 集成和插件开发示例；
 - **libs**：SDK库文件目录；
 - **Feature列表.xls**：Android平台各扩展Feature API对应的permission；

## 3. 搭建AS工程结构

### 3.1 打开AS，创建一个空项目。
![新建工程][2]
![不添加Activity][3]

### 3.2 导入5+ SDK中的示例工程
![导入Module][4]<br/>
![选择5+ SDK示例工程][5]
下面是AS工程的结构
![目录结构][6]

### 3.3 将示例工程的main目录替换到app目录下的main
![替换目录][7]

删除导入的module，即HBuilder-Hello。
删除步骤：

 1. 点击AS左上角  File → Project Structure
 2. 弹出框中左下角选中要删除的Module,然后点击弹出框左上角的“-”删除，随后点击右下角OK键
 3. 在工程中选中要删除的Module,点击键盘Delete

## 4. 文件配置

**根据Feature-Android.xml添加项目包依赖**

### 4.1 删除多余文件

 1. 删除app/src/main/assets 下的所有图片
 2. 清空app/src/mami/res    下所有目录，不要删除目录
 3. 清空app/src/main/jniLibs下所有目录，不要删除目录
 4. 删除app/src/main/java   下的目录，保留RInformation
 5. 删除app/src/main/iflytek 目录，若使用讯飞语音可保留
 6. 编辑apps.HelloH5.www目录为apps.XXX.www,XXX为自己的项目名,固定写法。删除www下所有文件。


### 4.2 添加基础jar包

从Android-SDK@1.9.9.30983_20170414\Android-SDK\SDK\libs下拷贝jar包到工程libs包下。

 - **android-support-v4.jar**(运行环境包含了这个包，若运行时报错则将这个包删除)
 - **json_simple-1.1.jar** 没有找到，但好像已经包含在其他几个包中
 - **nineoldandroids-2.4.0.jar** 在SDK中的名字叫my-nineoldandroids-2.4.0.jar
 - **pdr.jar**
 - **my-imageloader.jar**
 - **ui.jar**
 - **nativeui.jar**

在在Modules Dependencies中加入这些包，操作方法：选中包，点击鼠标右键。

![此处输入图片的描述][8]

### 4.3 修改AndroidManifest.xml

删除现有文件中的**application**节点和所有的**uses-permission** 
根据**Feature-Android.xml**文档添加相应的activity和uses-permission,并修改文件头部的package为自己的包名,versionCode和versionName自定义修改。

### 4.4 添加资源文件

严格对照**Feature-Android.xml**添加相关资源文件

### 4.5 将HBuilder中开发的项目全部复制到apps.XXX.www目录下

## 5. 参数修改

有4个文件需要注意：

 - apps.XXX.www包下：manifest.json文件                 ***MJ***
 - src/main包下：AndroidManifest.xml文件               ***AM***
 - src/main/assets/data包下：dcloud_control.xml文件    ***DC***
 - src/main/res/values包下：String.xml文件             ***STR***

**项目名**

 ***MJ*** id = apps.XXX.www中的XXX = ***DC*** appid
 
**版本名称**

***MJ*** version.name = ***AM*** android:versionName = ***DC*** appver

**版本Code**

***MJ*** version.code = ***AM*** android:versionCode

**APP对外显示名称**

***MJ*** name = ***STR*** app_name

**基座号码**

***DC*** version = 下载的5+ SDK目录上的一长串数字编号，如*1.9.9.30983*

## 6. APP图标和启动背景

**图标**

AndroidManifest.xml文件的application节点下的***android:icon="@drawable/icon"***设置了图标的名字为icon，可自行更改。将切好的图放置到src/main/res包下对应的drawable目录即可。

**背景图**

默认名为splash.png，切好图放置到对应的drawable目录中即可。

## 7. 签名文件 ##
Android Studio生成

 1. 打开Android Studio的build目录，进入Generate Signed APK子菜单!
 ![sdf][9]
 2. 点击新建，进入创建页，按提示填写!
 ![新建签名文件][10]

 ![输入说明][11]
 3. 填写完成自动返回上一菜单并自动填充相关参数
 4. 点击next即可生成

## 8. 查看签名文件SHA-1、MD5 ##

 1. 打开cmd,进入签名文件目录
 2. 在控制台输入命令
    debug.keystore：命令为：keytool -list -v -keystore debug.keystore
    自定义的 keystore：命令为：keytool -list -v -keystore apk的keystore
    自定义的 jks：命令为：keytool -list -v -keystore apk的jks
    ![keystore命令][12]
 


  [1]: http://ask.dcloud.net.cn/article/103
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_StartNewProject.png
  [3]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_NoActivity.png
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_importModule.png
  [5]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_selectExample.png
  [6]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_catalog.png
  [7]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_replace.png
  [8]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/DCloud/AS_dependencies.png
  [9]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/generateKey_step1.png
  [10]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/generateKey_step2.png
  [11]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/generateKey_step3.png
  [12]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/keytool.png
