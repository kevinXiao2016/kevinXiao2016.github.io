---
title: Android Studio打包
date: 2017-05-19 12:54:43
categories:
	- course
tags:
	- android
	- apk打包
---
这篇博客介绍打包相关
<!-- more -->
## 签名文件 ##
Android Studio生成

 1. 打开Android Studio的build目录，进入Generate Signed APK子菜单!
 ![sdf][1]
 2. 点击新建，进入创建页，按提示填写!
 ![新建签名文件][2]

 ![输入说明][3]
 3. 填写完成自动返回上一菜单并自动填充相关参数
 4. 点击next即可生成

## 查看签名文件SHA-1、MD5 ##

 1. 打开cmd,进入签名文件目录
 2. 在控制台输入命令
    debug.keystore：命令为：keytool -list -v -keystore debug.keystore
    自定义的 keystore：命令为：keytool -list -v -keystore apk的keystore
    自定义的 jks：命令为：keytool -list -v -keystore apk的jks
    ![keystore命令][4]
 
 
 


  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/generateKey_step1.png
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/generateKey_step2.png
  [3]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/generateKey_step3.png
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/keytool.png