---
title: spring(1)——框架简介
categories:
  - Java
  - Spring
tags:
  - Spring
date: 2017-06-12 13:19:16
---

这篇博客介绍了spring框架的组成及应用
<!--more-->
## 1.什么是spring框架？
spring是一个轻量级的JAVA开发框架，由Rod Johnson创建。spring对应用对象（如javaBean）的生命周期进行管理，它是一个“粘合平台”，将很多技术粘合在一起，形成一个整体，使每个组件发挥最大功效。

## 2.架构概述
![spring架构][1]

 -  核心容器
    - spring-bean是整个核心，Bean的定义、Bean 的创建以及对Bean的解析。
    - spring-context是bean关系集合，也就是IOC容器
    - spring-core发现、维护和管理变之间的关系
    - spring-expression是EL遍地是语言的扩展，支持设置和获取对象属性，调用对象方法，操作数组、集合等。
 - 面向切面编程（AOP）和工具（Instruementation）
    - Spring AOP模块提供了满足AOP Alliance规范的实现，还整合了AspectJ这种AOP语言级的框架。通过AOP能降低耦合。
 - 消息
    - spring-messaging模块为集成messaging api和消息协议提供支持。
 - 数据访问集成
    - 事务模块：该模块用于Spring管理事务，只要是Spring管理对象都能得到Spring管理事务的好处，无需在代码中进行事务控制了，而且支持编程和声明性的事务管理。
    - JDBC模块：提供了一个JBDC的样例模板，使用这些模板能消除传统冗长的JDBC编码还有必须的事务控制，而且能享受到Spring管理事务的好处。
    - ORM模块：提供与流行的“对象-关系”映射框架的无缝集成，包括hibernate、JPA、MyBatis等。而且可以使用Spring事务管理，无需额外控制事务。
    - OXM模块：提供了一个对Object/XML映射实现，将Java对象映射成XML数据，或者将XML数据映射成java对象，Object/XML映射实现包括JAXB、Castor、XMLBeans和XStream。
    - JMS模块：用于JMS(Java Messaging Service)，提供一套 “消息生产者、消息消费者”模板用于更加简单的使用JMS，JMS用于用于在两个应用程序之间，或分布式系统中发送消息，进行异步通信。
 - web集成
    - 该模块建立在AoolicationContext模块之上，提供了Web应用的功能。如文件上传、FreeMarker等。
    - Spring可以整合Struts2等MVC框架。Spring自己提供了MVC框架Spring MVC。
 - Test
    - Spring可以用非容器依赖的编程方式进行几乎所有的测试工作，支持JUnit和TestNG等测试框架。

## 3.资源包整理
[spring资源下载链接][2]

- 核心
    - spring-beans-4.2.5.RELEASE.jar
    - spring-context-4.2.5.RELEASE.jar
    - spring-context-support-4.2.5.RELEASE.jar
    - spring-core-4.2.5.RELEASE.jar
    - spring-expression-4.2.5.RELEASE.jar
- AOP
    - spring-aop-4.2.5.RELEASE.jar
    - spring-aspects-4.2.5.RELEASE.jar
    - spring-instrument-4.2.5.RELEASE.jar
    - spring-instrument-tomcat-4.2.5.RELEASE.jar
    - spring-messaging-4.2.5.RELEASE.jar
- WEB
    - spring-web-4.2.5.RELEASE.jar
    - spring-websocket-4.2.5.RELEASE.jar
    - spring-webmvc-4.2.5.RELEASE.jar
    - spring-webmvc-portlet-4.2.5.RELEASE.jar
- DATA
    - spring-jdbc-4.2.5.RELEASE.jar
    - spring-jms-4.2.5.RELEASE.jar
    - spring-orm-4.2.5.RELEASE.jar
    - spring-oxm-4.2.5.RELEASE.jar
    - spring-tx-4.2.5.RELEASE.jar
- TEST
    - spring-test-4.2.5.RELEASE.jar
- LOG
    - commons-logging-1.1.1.jar
    - commons-logging
    - log4j-1.2.15.jar

  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/Spring/spring.png
  [2]: http://maven.springframework.org/release/org/springframework/spring