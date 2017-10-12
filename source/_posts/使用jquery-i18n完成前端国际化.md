---
title: 使用jquery.i18n完成前端国际化
categories:
  - Web
tags:
  - 国际化
date: 2017-08-31 13:15:33
---
本文对 jQuery 国际化插件 jQuery.i18n.properties 进行了介绍，并用实际例子介绍了如何使用 jQuery.i18n.properties 插件实现 Web 前端的国际化。总结起来，jQuery.i18n.properties 具有轻量级（压缩后仅 4kb）、简单易用等特点，但是作为一个普及度不高的轻量级插件，不一定适用于大型的或对效率要求极高的场景。
<!--more-->
## 1. 简介

jQuery.i18n.properties 是一款轻量级的 jQuery 国际化插件。与 Java 里的资源文件类似，jQuery.i18n.properties 采用 .properties 文件对 JavaScript 进行国际化。jQuery.i18n.properties 插件根据用户指定的（或浏览器提供的 ）语言和国家编码（符合 ISO-639 和 ISO-3166 标准）来解析对应的以“.properties”为后缀的资源文件。

利用资源文件实现国际化是一种比较流行的方式，例如 Android 应用就可以采用以语言和国家编码命名的资源文件来实现国际化。jQuery.i18n.properties 插件中的资源文件以“.properties”为后缀，包含了区域相关的键值对。我们知道，Java 程序也可以使用以 .properties 为后缀的资源文件来实现国际化，因此，当我们要在 Java 程序和前端 JavaScript 程序中共享资源文件时，这种方式就显得特别有用。jQuery.i18n.properties 插件首先加载默认的资源文件（例如：strings.properties），然后加载针对特定语言环境的资源文件（例如：strings_zh.properties），这就保证了在未提供某种语言的翻译时，默认值始终有效。开发人员可以以 JavaScript 变量（或函数）或 Map 的方式使用资源文件中的 key。

总的来说，jQuery.i18n.properties 有一下一些特点：

 1. 使用 Java 标准的 .properties 文件作为资源文件，资源文件命名有以下三种格式：

    ```javascript
    basename_properties 
    basename_language.properties 
    basename_language_country.properties
    ```
 2. 使用 ISO-639 作为语言编码标准，ISO-3166 作为国家名称编码标准
 3. 按顺序加载默认资源文件和指定语言环境的资源文件，保证默认值始终可用
 4. 未指定语言环境时使用浏览器提供的语言
 5. 可以在资源字符串中使用占位符（例如：hello= 你好 {0}! 今天是 {1}。）
 6. 资源文件中的 Key 支持命名空间（例如：com.company.msgs.hello = Hello!）
 7. 支持跨行的值
 8. 可以以 JavaScript 变量（或函数）或 Map 的方式使用资源文件中的 Key

## 2. API

jQuery.i18n.properties 的 API 非常简单，只有少数几个 API，即 jQuery.i18n.properties()、jQuery.i18n.prop()、jQuery.i18n.browserLang()。当然，和其他 jQuery 插件一样，我们也可以采用 $.i18n.properties()、$.i18n.prop() 和 $.i18n.browserLang() 的形式使用这用这些 API。

### 2.1 jQuery.i18n.properties(setting)

该方法加载资源文件，其中 settings 是配置加载选项的一系列键值对，各配置项的具体描述如表 1 所示。

**表 1. settings**
选项| 描述 | 类型 | 可选
-------|----------
name | 资源文件的名称，例如 strings 或 [strings1,strings2]，前者代表一个资源文件，后者代表资源文件数组。| String或String[] | 否
path | 资源文件所在目录的路径 | String | 是
mode | 加载模式：“vars”表示以JavaScript变量或函数的形式使用资源文件中的Key，“map”表示以 Map 的方式使用资源文件中的Key，“both”表示可以同时使用两种方式。如果资源文件中的 Key 包含 JavaScript 的关键字，则只能采用“map”。默认值是“vars”。 | String | 是
language | ISO-639 指定的语言编码（如：“en”表示英文、“zh”表示中文），或同时使用ISO-639 指定的语言编码和ISO-3166指定的国家编码（如：“en_US”，“zh_CN”等）。如果不指定，则采用浏览器报告的语言编码。 | String | 是
cache | 指定浏览器是否对资源文件进行缓存，默认为 false。 | boolean | 是
encoding | 加载资源文件时使用的编码。默认为 UTF-8。 | String | 是
callback | 	代码执行完成时运行的回调函数 | function | 是

jQuery.i18n.properties() 的使用方法如清单 1 所示。

清单 1. jQuery.i18n.properties() 用法

```javascript
jQuery.i18n.properties({ 
   name:'strings',// 资源文件名称
   path:'bundle/',// 资源文件所在目录路径
   mode:'both',// 模式：变量或 Map 
   language:'pt_PT',// 对应的语言
   cache:false, 
   encoding: 'UTF-8', 
   callback: function() {// 回调方法
   } 
});
```

### 2.2 jQuery.i18n.prop(key)

该方法以 map 的方式使用资源文件中的值，其中 key 指的是资源文件中的 key。当 key 指定的值含有占位符时，可以使用 jQuery.i18n.prop(key,var1,var2 … ) 的形式，其中 var1,var2 …对各占位符依次进行替换。例如资源文件中有“msg_hello= 您好 {0}，今天是 {1}。”的键值对，则我们可以采用“jQuery.i18n.prop( ‘ msg_hello ’ , ’小明’ , ’星期一’ );”的形式使用 msg_hello。

### 2.3 jQuery.i18n.browserLang() 

用于获取浏览浏览器的语言信息，这里不再单独介绍。

## 3. 示例

### 3.1 建立资源文件

如下图所示：
![工程结构][1]

在 i18n 目录下创建 strings_en.properties 和，stirngs_zh.properties 两个资源文件，其中 strings_en.properties 对应英文翻译，如清单 2 所示；string_zh.properties 对应中文翻译，如清单 3 所示。

清单 2. stirngs_en.properties

```properties
loginTitle              = Login NM3000
username                = username
usernameEnter           = please enter username
password                = password
passwordEnter           = please enter password
autoLogin               = AutoLogin
login                   = Login
copyright               = Topvision All Rights Reserved
```

清单3. strings_zh.properties

```properties
loginTitle             = 登录NM3000
username                = 用户名
password                = 密码
autoLogin               = 自动登录
login                   = 登录
```

### 3.2 引用插件
和其他 jQuery 插件一样，jQuery.i18n.properties插件依赖jQuery，因此我们首先需要引用 jQuery。jQuery.i18n.properties 对 jQuery 的版本没有明确要求。我们使用清单 4 所示的方式在 index.html 中引用 jQuery 和 jQuery.i18n.properties 插件。
 
 清单 4. 引用 jQuery.i18n.properties
```javascript
<script type="text/javascript" src="../../lib/jquery/jquery.min.js"></script>
<script type="text/javascript" src="../../lib/jquery/jquery.i18n.properties-min-1.0.9.js"></script>
```

### 3.3 使用

```javascript
$(function() {
    lang = (jQuery.i18n.browserLang().substring(0, 2)); //默认从浏览器语言读取
    jQuery.i18n.properties({
        name: 'strings',
        path: '../../i18n/', //资源文件路径
        mode: 'map', //用Map的方式使用资源文件中的值
        language: 'en',
        callback: function() { //加载成功后设置显示内容
            $('#title').html($.i18n.prop('loginTitle'));
            ...
        }
    });
})
```

## 4. 注意事项

### 4.1 资源文件命名

 var lang = jQuery.i18n.browserLang() 获取的语言是zh-CN、en-US格式，
 jQuery.i18n.properties 默认的资源文件命名方式为“zh_CN”、“en_US”的形式
 
 设置插件语言的时候一定要和资源文件的语言代码一致，否则无法解析。
 
## 5. 总结

本文对 jQuery 国际化插件 jQuery.i18n.properties 进行了介绍，并用实际例子介绍了如何使用 jQuery.i18n.properties 插件实现 Web 前端的国际化。总结起来，jQuery.i18n.properties 具有轻量级（压缩后仅 4kb）、简单易用等特点，但是作为一个普及度不高的轻量级插件，不一定适用于大型的或对效率要求极高的场景。

  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/web/jqueryi18n%E7%A4%BA%E4%BE%8B%E5%B7%A5%E7%A8%8B%E7%9B%AE%E5%BD%95.png