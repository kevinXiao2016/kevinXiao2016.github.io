---
title: Spring MVC(1)——入门
categories:
  - Java
  - Spring
tags:
  - SpringMVC
date: 2018-03-06 15:11:40
---
Spring MVC全称是Spring Web MVC,是spring框架中的一部分，与struts一样是一个表现层框架。

Spring MVC是当前最优秀的MVC框架，自从Spring2.5版本发布后，由于支持注解配置，易用性有了大幅度的提高。Spring3.0更加完善，实现了对Struts2的超越。现在越来越多的开发团队选择了Spring MVC。
<!--more-->

![此处输入图片的描述][2]
## 1、Spring MVC与Struts2对比!

 1. 加载机制：SpringMVC入口是servlet,Struts2入口是filter;[servlet与filter区别][3]
 2. 性能：SpringMVC优于Struts2
    Struts2基于类设计，每次请求实例化一个action对象，对应一个request上下文；
    SpringMVC基于方法设计，每次请求实例化一个方法对象，每个方法独享request上下文。
 3. 参数传递：
    Struts2使用类变量接收参数，多个方法共享；
    SpringMVC使用请求参数获取，方法独享
 4. 框架继承：spring MVC和Spring是无缝(无缝：无须数据格式转换，直接访问来自数据源数据格式)的。从这个项目的管理和安全上也比Struts2高。
 5. 拦截机制：spring mvc用的是独立的AOP方式实现，而struts2有自己的interceptor机制，这样导致了struts2的配置文件量又比spring mvc大。
 6. Restful架构实现：
    spring mvc用的是独立的AOP方式实现，而struts2有自己的interceptor机制，这样导致了struts2的配置文件量又比spring mvc大；
    spring mvc用的是独立的AOP方式实现，而struts2有自己的interceptor机制，这样导致了struts2的配置文件量又比spring mvc大。

## 2、SpringMVC运行流程
![此处输入图片的描述][4]

 1. 用户发送请求至前端控制器DispatcherServlet
 2. DispatcherServlet收到请求调用HandlerMapping处理器映射器查找Handler。
 3. 处理器映射器根据请求url找到具体的处理器，生成处理器对象及处理器拦截器(如果有则生成)一并返回给DispatcherServlet。
 4. DispatcherServlet通过HandlerAdapter处理器适配器调用处理器
 5. HandlerAdapter调用处理器Handler
 6. Handler执行完成返回ModelAndView
 7. HandlerAdapter将Handler执行结果ModelAndView返回给DispatcherServlet
 8. DispatcherServlet将ModelAndView传给ViewReslover视图解析器，ViewReslover根据逻辑视图名解析View
 9. ViewReslover返回View
 10. DispatcherServlet对View进行渲染视图（即将模型数据填充至request域）。
 11. DispatcherServlet响应用户

从以上流程可以看出几个主要的部件：

 1. 前端控制器DispatcherServlet(SpringMVC提供)
    作用：接收请求，相应结果
    有了前端控制器减少各各组件之间的耦合性，前端控制器相关于中央调度器
 2. 处理器映射器HandlerMapping(SpringMVC提供)
    作用：根据url查找Handler，比如：根据xml配置、注解方式查找Handler
 3. 处理器适配器HandlerAdapter(SpringMVC提供)
    作用：执行Handler
    不同类型的Handler有不同的HandlerAdapter，好处可以通过扩展HandlerAdapter支持更多类型的Handler。
 4. 处理器Handler（<span style="color:red">由程序员开发</span>）
    作用：业务处理
    实现开发中又称为controller即后端控制器
    Handler的开发按照HandlerAdapter的接口规则去开发。
    Handler处理后的结果是ModelAndView，是springmvc的底层对象，包括Model和view两个部分。view中只包括一个逻辑视图名（为了方便开发起一个简单的视图名称）。
 5. ViewReslover视图解析（springmvc框架提供）
    作用：根据逻辑视图名创建一个View对象（包括真实视图物理地址）
    针对不同类型的view有不同类型的ViewReslover，常用的有jsp视图解析器即jstlView
 6. View视图（<span style="color:red">由程序员开发</span>）
    作用：将模型数据填充进来(将model数据填充到request域)显示给用户
    view是一个接口，实现类包括：jstlView、freemarkerView，pdfView

## 3、案例搭建

使用maven构建基本工程结构

### 3.1 创建web项目

### 3.2 设置jdk版本及servlet环境
细节参见[Maven学习与基本使用][5]

### 3.3 导入jar包,设置pom

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.topvision.maven</groupId>
	<artifactId>ssm</artifactId>
	<packaging>war</packaging>
	<version>0.0.1-SNAPSHOT</version>
	<name>ssm Maven Webapp</name>
	<url>http://maven.apache.org</url>

	<!-- 属性 -->
	<properties>
		<spring.version>4.3.12.RELEASE</spring.version>
		<mybatis.version>3.4.5</mybatis.version>
	</properties>

	<!-- 锁定版本 -->
	<dependencyManagement>
		<dependencies>
            <dependency>
            	<groupId>org.springframework</groupId>
            	<artifactId>spring-context</artifactId>
            	<version>${spring.version}</version>
            </dependency>
            <dependency>
            	<groupId>org.springframework</groupId>
            	<artifactId>spring-aspects</artifactId>
            	<version>${spring.version}</version>
			</dependency>
            <dependency>
            	<groupId>org.springframework</groupId>
            	<artifactId>spring-orm</artifactId>
            	<version>${spring.version}</version>
            </dependency>
            <dependency>
            	<groupId>org.springframework</groupId>
            	<artifactId>spring-test</artifactId>
            	<version>${spring.version}</version>
            </dependency>
            <dependency>
            	<groupId>org.springframework</groupId>
            	<artifactId>spring-web</artifactId>
            	<version>${spring.version}</version>
            </dependency>
            <dependency>
            	<groupId>org.springframework</groupId>
            	<artifactId>spring-webmvc</artifactId>
            	<version>${spring.version}</version>
            </dependency>
            <dependency>
            	<groupId>org.mybatis</groupId>
            	<artifactId>mybatis</artifactId>
				<version>${mybatis.version}</version>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<!-- Spring -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-test</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-context</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-aspects</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-orm</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-webmvc</artifactId>
		</dependency>
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>3.8.1</version>
			<scope>test</scope>
		</dependency>

		<!-- mybatis -->
		<dependency>
			<groupId>org.mybatis</groupId>
			<artifactId>mybatis</artifactId>
		</dependency>
		<dependency>
			<groupId>org.mybatis</groupId>
			<artifactId>mybatis-spring</artifactId>
			<version>1.3.1</version>
		</dependency>

		<!-- mysql驱动 -->
		<dependency>
			<groupId>mysql</groupId>
			<artifactId>mysql-connector-java</artifactId>
			<version>5.1.6</version>
			<scope>runtime</scope>
		</dependency>

		<!-- c3p0 -->
		<dependency>
			<groupId>c3p0</groupId>
			<artifactId>c3p0</artifactId>
			<version>0.9.1.2</version>
		</dependency>
		<!-- slf4j -->
		<dependency>
			<groupId>org.slf4j</groupId>
			<artifactId>slf4j-log4j12</artifactId>
			<version>1.7.2</version>
		</dependency>
		<!-- junit -->
		<dependency>
			<groupId>junit</groupId>
			<artifactId>junit</artifactId>
			<version>4.9</version>
			<scope>test</scope>
		</dependency>
		<!-- jstl -->
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>jstl</artifactId>
			<version>1.2</version>
		</dependency>

		<!-- servlet jsp -->
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>servlet-api</artifactId>
			<version>2.5</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>javax.servlet</groupId>
			<artifactId>jsp-api</artifactId>
			<version>2.0</version>
			<scope>provided</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
					<encoding>UTF-8</encoding>
				</configuration>
			</plugin>
		</plugins>

		<finalName>ssm</finalName>
	</build>
</project>
```

### 3.4 配置前端控制器

关键：在web.xml配置springmvc的前端控制器

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns="http://java.sun.com/xml/ns/javaee" xmlns:web="http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd"
	id="WebApp_ID" version="2.5">
	
	
	<servlet>
		<servlet-name>springDispatcherServlet</servlet-name>
		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
		<init-param>
		    <!--若不配置此项，默认加载/WEB-INF/[servlet的名字]-servlet.xml-->
			<param-name>contextConfigLocation</param-name>
			<param-value>classpath:springmvc.xml</param-value>
		</init-param>
		<load-on-startup>1</load-on-startup>
	</servlet>
	<servlet-mapping>
		<servlet-name>springDispatcherServlet</servlet-name>
		<!--
		*.action或*.do等等，以其结尾的url由springmvc来解析
		/ 所有请求都由springmvc解析，单静态资源的请求（html,css,js）由其解析是不对的
		/* 此种配置方式不对，当转到jsp页面，springmvc会去解析jsp页面路径地址，无法解析成功
		-->
		<url-pattern>*.action</url-pattern>
	</servlet-mapping>
</web-app>
```

### 3.5 配置处理器映射器

在3.4设置的地址下新建对应的xml文件，一般在classpath下新建springmvc.xml

在springmvc.xml中配置处理器映射器。（有多种）

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:mvc="http://www.springframework.org/schema/mvc"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
	xsi:schemaLocation="http://www.springframework.org/schema/beans 
		http://www.springframework.org/schema/beans/spring-beans-3.0.xsd 
		http://www.springframework.org/schema/mvc 
		http://www.springframework.org/schema/mvc/spring-mvc-3.0.xsd 
		http://www.springframework.org/schema/context 
		http://www.springframework.org/schema/context/spring-context-3.0.xsd 
		http://www.springframework.org/schema/aop 
		http://www.springframework.org/schema/aop/spring-aop-3.0.xsd 
		http://www.springframework.org/schema/tx 
		http://www.springframework.org/schema/tx/spring-tx-3.0.xsd">
		
		<!-- 处理器映射器,选择其中之一即可-->
		<!--根据handel的名字来匹配url-->
	    <bean class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"/>
	    
	    <!--升级版-->
	    <!--根据handel的id来匹配url-->
	    <bean class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
		<property name="mappings">
			<props>
				<prop key="/ItemsList2.action">itemsController</prop>
				<prop key="/ItemsList3.action">itemsController</prop>
			</props>
		</property>
	</bean>
</beans>
```

### 3.6 配置处理器适配器

开发Handel必须按照处理器适配器接口规则去开发，先要确定使用哪个处理器适配器。
此处使用SimpleControllerHandlerAdapter。

```xml
<!-- 处理器适配器 -->
<bean class="org.springframework.web.servlet.mvc.SimpleControllerHandlerAdapter"/>
```
通过源码分析得出：
```java
public boolean supports(Object handler) {
	return (handler instanceof Controller);
}
```
只要实现了Controller接口的bean，SimpleControllerHandlerAdapter都可以去执行。

还有一个非注解适配器***HttpRequestHandlerAdapter***，只要实现***HttpRequestHandler***接口即可。

### 3.7 开发及配置Handel

```java
public class ItemsController1 implements Controller {

    @Override
    public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
        // 调用service查询商品信息
        // 这里不调用service使用静态数据模拟
        List<Items> itemsList = new ArrayList<Items>();

        Items items_2 = new Items();
        items_2.setName("苹果手机");
        items_2.setPrice(9688f);
        items_2.setDetail("iphoneX苹果手机！");

        itemsList.add(items_1);
        itemsList.add(items_2);
        
        ModelAndView modelAndView = new ModelAndView();
        //此方法相当于request.setAttribute(arg0, arg1)
        modelAndView.addObject(itemsList);
        //指定视图地址
        modelAndView.setViewName("/WEB-INF/jsp/itemsList.jsp");

        return modelAndView;
    }
}
```

### 3.8 配置视图解析器

使用jsp视图解析器，在springmvc.xml中配置如下：

```xml
<!-- ViewResolver -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
	<!--设置统一的前后缀-->
	<property name="prefix" value="/WEB-INF/jsp/"/>
	<property name="suffix" value=".jsp"/>
</bean>
```

更改Handle代码，使用逻辑视图名:

```java
//指定视图地址
//modelAndView.setViewName("/WEB-INF/jsp/itemsList.jsp");
modelAndView.setViewName("itemList");
```

### 3.9 配置jsp视图

在web-inf/jsp下，创建itemList.jsp

## 4、注解开发

### 4.1 注解的处理器映射器和适配器

注解的处理器映射器：
spring3.1之前使用org.springframework.web.servlet.mvc.annotation.DefaultAnnotationHandlerMapping
spring3.1之后使用org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

注解的处理器适配器：
spring3.1之前使用
org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter
3.1之后使用
org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter

在springmvc.xml中配置：

```xml
<!-- 注解的处理器映射器和适配器 -->
<!-- 
<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"/>
<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter" />
-->
<!-- 简写 -->
<mvc:annotation-driven/>
```

### 4.2 注解开发Handle

注解处理器映射器和注解处理器适配器要配对使用，对标记@controller注解类中的标记有@RequestMapping方法进行映射和执行。
@controller标记此类是一个控制器
@RequestMapping：对url和Handler中的方法进行映射。

```java
@Controller
public class ItemsController2 {

    @RequestMapping("/itemsList4")
    public ModelAndView itemList4() {
        // 调用service查询商品信息
        // 这里不调用service使用静态数据模拟
        List<Items> itemsList = new ArrayList<Items>();

        Items items_1 = new Items();
        items_1.setName("联想笔记本");
        items_1.setPrice(6000f);
        items_1.setDetail("ThinkPad T430 联想笔记本电脑！");

        Items items_2 = new Items();
        items_2.setName("苹果手机");
        items_2.setPrice(5000f);
        items_2.setDetail("iphone6苹果手机！");

        itemsList.add(items_1);
        itemsList.add(items_2);

        ModelAndView modelAndView = new ModelAndView();
        // 此方法相当于request.setAttribute(arg0, arg1)
        modelAndView.addObject(itemsList);
        // 指定视图地址
        // modelAndView.setViewName("/WEB-INF/jsp/itemsList.jsp");
        modelAndView.setViewName("itemsList");

        return modelAndView;
    }
}
```

### 4.3 在spring容器中配置Handle

为方便配置，采用注解扫描的方式。

```xml
<!-- 可以扫描标记有@controller、@service、@repository、@component的bean -->
<context:component-scan base-package="com.topvision.ssm"></context:component-scan>
```


  [1]: https://kevinxiao2016.github.io/2018/02/24/Spring-MVC-1-%E2%80%94%E2%80%94%E5%85%A5%E9%97%A8/
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/SpringMVC/springFramework.png
  [3]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/SpringMVC/flow.png
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/SpringMVC/flow.png
  [5]: https://www.zybuluo.com/MrXiao/note/772562