---
title: web.xml不同版本之间的差异
categories:
  - Web
tags:
  - Web
keyword:
  - servlet
  - web.xml
date: 2018-04-13 17:31:13
---

![此处输入图片的描述][1]

<!--more-->
Apache官方对各版本的解释：http://tomcat.apache.org/whichversion.html

The web.xml is a configuration file to describe how a web application should be deployed. Here’re 5 web.xml examples, just for self-reference.

 1. Servlet 4.0

    ```xml
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
        http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
        version="4.0" metadata-complete="true">
    </web-app>
    ```
 
 2. Servlet 3.1

    Java EE 7 XML schema, namespace is http://xmlns.jcp.org/xml/ns/javaee/
 
    ```xmk
    <web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee 
		 http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
         version="3.1">
    </web-app>
    ```
    
 3. Servlet 3.0

    Java EE 6 XML schema, namespace is http://java.sun.com/xml/ns/javaee
    Servlet3.0随J2EE6一起发布，web.xml配置文件中包含：
    默认页配置、session超时配置和错误提示页配置。
 
    ```xmk
    <web-app xmlns="http://java.sun.com/xml/ns/javaee"
	      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	      xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
	      http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd"
	      version="3.0">
    </web-app>
    ```
    
 4. Servlet 2.5

    Java EE 5 XML schema, namespace is http://java.sun.com/xml/ns/javaee
    2.5以上版本即可解决多个url不能映射到同一个servlet的问题。
 
    ```xml
    <web-app xmlns="http://java.sun.com/xml/ns/javaee"
	      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	      xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
	      http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	      version="2.5">
    </web-app>
    ```
    
 5. Servlet 2.4
    
    J2EE 1.4 XML schema, namespace is http://java.sun.com/xml/ns/j2ee
    2.4以上版本即可解决上面问题。
    但是2.4及以下版本会有一个问题：（多个url不能映射到同一个servlet）

    ```xml
    <web-app xmlns="http://java.sun.com/xml/ns/j2ee"
	      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	      xsi:schemaLocation="http://java.sun.com/xml/ns/j2ee 
	      http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd"
	      version="2.4">

    <display-name>Servlet 2.4 Web Application</display-name>
    </web-app>
    ```
    
 6. Servlet 2.3

    J2EE 1.3 DTD模式。这个xml文件太旧了，强烈推荐你升级。
    这个有个缺点：web-app里的标签有一定的顺序。
 
    ```xml
    <!DOCTYPE web-app PUBLIC
     "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"
     "http://java.sun.com/dtd/web-app_2_3.dtd" >
    
    <web-app>
      <display-name>Servlet 2.3 Web Application</display-name>
    </web-app>
    ```
 
 
 
 
 


  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/web/servletVersion.png
