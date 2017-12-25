---
title: Struts2(1)——基本认识
categories:
  - Struts2
tags:
  - Struts2
date: 2017-12-20 10:46:08
---
Struts2就是一个web层框架，并且是使用MVC设计模式实现的的一个框架，之前使用的是Serlvet+JSP来开发web项目，现在用Struts2框架来替代他，那Struts2到底有哪些优点呢？那就需要我们自己来研究它了.
请求    -----------　　Servlet      --------------  JSP　　　　serlvet+JSP

请求    -----------    Action 　　  --------------  JSP　　　　Struts

<!-- more -->

## 1.工作原理

![struts2][1]

请求在struts2框架中的处理流程大概可以分为以下几步：

 1. 客户端初始化一个指向servlet容器(例如Tomcat)的请求
 2. 该请求经过一系列的过滤器（Filter）（这些过滤器中有一个叫做ActionContextCleanUp的可选过滤器，这个过滤器对于Struts2和其他框架的集成很有帮助，例如：SiteMesh Plugin）
 3. 然后FilterDispather(StrutsPrepareAndExecuteFilter)被调用，询问ActionMapper来决定这个请是否需要调用某个Action。
 4. 如果ActionMapper决定需要调用某个Action，FilterDispatcher把请求的处理交给ActionProxy.
 5. ActionProxy通过ConfigurationManager询问框架的配置文件，找到需要调用的Action类 ,这里，我们一般是从struts.xml配置中读取。
 6. ActionProxy创建一个ActionInvocation的实例
 7. ActionInvocation实例使用命名模式来调用，在调用Action的过程前后，涉及到相关拦截器（Intercepter）的调用。
 8. 一旦Action执行完毕，ActionInvocation负责根据struts.xml中的配置找到对应的返回结果。返回结果通常是（但不总是，也可能是另外的一个Action链）一个需要被表示的JSP或者FreeMarker的模版。在表示的过程中可以使用Struts2 框架中继承的标签。在这个过程中需要涉及到ActionMapper

**在上述过程中所有的对象（Action，Results，Interceptors等）都是通过ObjectFactory来创建的。**
 
 
## 2.配置文件

|配置文件的名称|位置|主要内容|说明|
| -------------|----|--------|----|
|default.properties|struts2-core-2.3.15.3.jar/org/apache/struts2/default.properties|一些参数配置|程序员不能直接修改的|
|struts-default.xml|struts2-core-2.3.15.3.jar/struts-default.xml|一些参数配置|程序员不能直接修改的|
|struts.xml|应用的classpath中|struts的配置文件|程序员使用的|
|struts.properties|应用的classpath中|struts的参数配置文件|程序员使用的|
|web.xml|WEB-INF/web.xml|应用的配置文件|给过滤器配置参数|

以上配置文件在应用被启动的时候就完成了加载；而且有加载的顺序要求。<font color="red">后面的配置会覆盖掉前面配置文件中相同的信息。</font>

### 2.1 default.properties

|参数名称|参数的默认值|说明|
|---|---|---|
|struts.i18n.encoding|UTF-8|框架使用的默认编码|
|struts.action.extension|action|进入框架核心的uri的后缀。多个值用逗号分隔|
|struts.serve.static.browserCache|true|告诉客户端要不要缓存静态的资源|
|struts.configuration.xml.reload|被注释掉了：建议true|每当xml配置文件被修改后，不需要重新加载应用就能够使配置生效。适合开发阶段|
|struts.devMode|false|是否是开发模式。开发阶段应该设置为true|

如何修改他们的默认值呢？
struts.xml:通过该文件来进行修改
```XML
<!--通过constant元素覆盖掉之前配置文件参数的默认值-->
<constant name="struts.devMode" value="true" />
```

### 2.2 struts-default.xml

![struts-default.xml][2]

 这个文件定义了action返回结果类型，struts的拦截器，以及一些其他默认配置。

### 2.3 struts.xml

 - 作用：希望程序员能够按照分包的思想管理你的动作配置
 - 属性：
 
    - name:必须要的，给包取一个名字。唯一。
    - extends：当前包需要继承的父包的名称。框架希望程序员能够用面向对象的方式管理你的包。子包能够继承父包中的所有配置。自己写的包一般情况下要继承一个name=struts-default的包（它在struts-default.xml中）
    - abstract：把包声明成抽象包。没有任何<action>子元素的package就可以声明为抽象的包。
    - namespace：名称空间。默认值是""（空字符串）。名称空间+动作名称：构成了动作的访问路径。

### 2.4 struts.properties

这个文件是struts2框架的全局属性文件，也是自动加载的文件。该文件包含了系列的key-value对。该文件完全可以配置在struts.xml文件中，使用constant元素。下面是这个文件中一些常见的配置项及说明。

```xml
### 指定加载struts2配置文件管理器，默认为org.apache.struts2.config.DefaultConfiguration
### 开发者可以自定义配置文件管理器，该类要实现Configuration接口，可以自动加载struts2配置文件。
# struts.configuration=org.apache.struts2.config.DefaultConfiguration

### 设置默认的locale和字符编码
# struts.locale=en_US
struts.i18n.encoding=UTF-8


### 指定struts的工厂类
# struts.objectFactory = spring

### 指定spring框架的装配模式
### 装配方式有: name, type, auto, and constructor (name 是默认装配模式)
struts.objectFactory.spring.autoWire = name

### 该属性指定整合spring时，是否对bean进行缓存，值为true or false,默认为true.
struts.objectFactory.spring.useClassCache = true

### 指定类型检查
#struts.objectTypeDeterminer = tiger
#struts.objectTypeDeterminer = notiger

### 该属性指定处理 MIME-type multipart/form-data，文件上传
# struts.multipart.parser=cos
# struts.multipart.parser=pell
struts.multipart.parser=jakarta
# 指定上传文件时的临时目录，默认使用 javax.servlet.context.tempdir 
struts.multipart.saveDir=
struts.multipart.maxSize=2097152

### 加载自定义属性文件 (不要改写struts.properties!)
# struts.custom.properties=application,org/apache/struts2/extension/custom

### 指定请求url与action映射器，默认为org.apache.struts2.dispatcher.mapper.DefaultActionMapper
#struts.mapper.class=org.apache.struts2.dispatcher.mapper.DefaultActionMapper

### 指定action的后缀，默认为action
struts.action.extension=action

### 被 FilterDispatcher使用
### 如果为 true 则通过jar文件提供静态内容服务. 
### 如果为 false 则静态内容必须位于 <context_path>/struts
struts.serve.static=true

### 被 FilterDispatcher使用
### 指定浏览器是否缓存静态内容，测试阶段设置为false，发布阶段设置为true.
struts.serve.static.browserCache=true

### 设置是否支持动态方法调用，true为支持，false不支持.
struts.enable.DynamicMethodInvocation = true

### 设置是否可以在action中使用斜线，默认为false不可以，想使用需设置为true.
struts.enable.SlashesInActionNames = false

### 是否允许使用表达式语法，默认为true.
struts.tag.altSyntax=true


### 设置当struts.xml文件改动时，是否重新加载.
### - struts.configuration.xml.reload = true
### 设置struts是否为开发模式，默认为false,测试阶段一般设为true.
struts.devMode = false

### 设置是否每次请求，都重新加载资源文件，默认值为false.
struts.i18n.reload=false

###标准的UI主题
### 默认的UI主题为xhtml,可以为simple,xhtml或ajax
struts.ui.theme=xhtml
###模板目录
struts.ui.templateDir=template
#设置模板类型. 可以为 ftl, vm, or jsp
struts.ui.templateSuffix=ftl

###定位velocity.properties 文件.  默认 velocity.properties
struts.velocity.configfile = velocity.properties

### 设置velocity的context.
struts.velocity.contexts =

### 定位toolbox.
struts.velocity.toolboxlocation=

### 指定web应用的端口.
struts.url.http.port = 80
### 指定加密端口
struts.url.https.port = 443
### 设置生成url时，是否包含参数.值可以为: none, get or all
struts.url.includeParams = get

### 设置要加载的国际化资源文件，以逗号分隔.
# struts.custom.i18n.resources=testmessages,testmessages2

### 对于一些web应用服务器不能处理HttpServletRequest.getParameterMap()
### 像 WebLogic, Orion, and OC4J等，须设置成true,默认为false.
struts.dispatcher.parametersWorkaround = false

### 指定freemarker管理器
#struts.freemarker.manager.classname=org.apache.struts2.views.freemarker.FreemarkerManager

### 设置是否对freemarker的模板设置缓存
### 效果相当于把template拷贝到 WEB_APP/templates.
struts.freemarker.templatesCache=false

### 通常不需要修改此属性.
struts.freemarker.wrapper.altMap=true

### 指定xslt result是否使用样式表缓存.开发阶段设为true,发布阶段设为false.
struts.xslt.nocache=false

### 设置struts自动加载的文件列表.
struts.configuration.files=struts-default.xml,struts-plugin.xml,struts.xml

### 设定是否一直在最后一个slash之前的任何位置选定namespace.
struts.mapper.alwaysSelectFullNamespace=false
```

### 2.5 web.xml

配置struts2的核心过滤器和spring的加载器。
这里针对struts2相关配置作介绍。

```xml
<!-- Struts2核心过滤器 -->
<filter>
	<filter-name>struts2</filter-name>
	<filter-class>org.apache.struts2.dispatcher.ng.filter.StrutsPrepareAndExecuteFilter</filter-class>
	<!-- 指定action所在包路径 -->
	<init-param>  
       	<param-name>actionPackages</param-name>  
       	<param-value>com.topvision</param-value>  
   	</init-param>
   	<!-- 指定struts.xml文件路径，默认classpath下 -->
   	<init-param>
   		<param-name>filterConfig</param-name>
   		<param-value>classpath:struts.xml</param-value>
   	</init-param>
</filter>
<!-- 设置url过滤 -->
<filter-mapping>
	<filter-name>struts2</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>

<!-- 编码 -->
<filter>
	<filter-name>encodingFilter</filter-name>
	<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
	<init-param>
		<param-name>encoding</param-name>
		<param-value>UTF-8</param-value>
	</init-param>
</filter>
<filter-mapping>
	<filter-name>encodingFilter</filter-name>
	<url-pattern>/*</url-pattern>
</filter-mapping>
<!-- 404错误跳转 -->
<error-page>
	<error-code>404</error-code>
	<location>/error.jsp?code=404</location>
</error-page>
<!-- 首页设置 -->
<welcome-file-list>
	<welcome-file>index.html</welcome-file>
	<welcome-file>index.htm</welcome-file>
	<welcome-file>index.jsp</welcome-file>
	<welcome-file>default.html</welcome-file>
	<welcome-file>default.htm</welcome-file>
	<welcome-file>default.jsp</welcome-file>
</welcome-file-list>
```


    



 
 
 


  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/struts2.png
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/struts-default.xml.png