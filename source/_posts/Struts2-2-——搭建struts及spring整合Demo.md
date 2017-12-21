---
title: Struts2（2）- 搭建struts及spring整合Demo
categories:
  - Struts2
tags:
  - Struts2
date: 2017-12-20 16:51:15
---
简单介绍struts2整合spring项目的搭建。
<!--more-->

![工程结构图][1]

## 1、创建maven工程，引入jar依赖

pom.xml文件如下，maven相关知识请参看[maven学习][2]。
属性：设置版本等信息
依赖管理：锁定依赖jar包的具体版本
依赖：

 1. spring:
 2. struts2
 3. mybatis
 4. mysql驱动
 5. c3p0
 6. slf4j
 7. junit、jstl
 8. servlet jsp

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/maven-v4_0_0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<groupId>com.topvision</groupId>
	<artifactId>s2sm</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>s2sm Maven Webapp</name>
	<url>http://maven.apache.org</url>
	
	<!-- 属性 -->
	<properties>
		<spring.version>4.3.12.RELEASE</spring.version>
		<mybatis.version>3.4.5</mybatis.version>
		<struts.version>2.3.24.1</struts.version>
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
				<groupId>org.apache.struts</groupId>
				<artifactId>struts2-core</artifactId>
				<version>${struts.version}</version>
			</dependency>
			<dependency>
				<groupId>org.apache.struts</groupId>
				<artifactId>struts2-spring-plugin</artifactId>
				<version>${struts.version}</version>
			</dependency>
			<dependency>
				<groupId>org.apache.struts</groupId>
				<artifactId>struts2-json-plugin</artifactId>
				<version>${struts.version}</version>
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
		
		<!-- Struts -->
		<dependency>
			<groupId>org.apache.struts</groupId>
			<artifactId>struts2-core</artifactId>
		</dependency>
		<dependency>
			<groupId>org.apache.struts</groupId>
			<artifactId>struts2-spring-plugin</artifactId>
		</dependency>
		<dependency>
			<groupId>org.apache.struts</groupId>
			<artifactId>struts2-json-plugin</artifactId>
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
    			<version>2.5</version>
				<configuration>
					<source>1.8</source>
					<target>1.8</target>
					<encoding>UTF-8</encoding>
				</configuration>
			</plugin>
		</plugins>

		<finalName>s2sm</finalName>
	</build>
</project>

```

## 2、配置web.xml

 1. 配置spring监听器

    ```xml
    <!-- applicationContext对象仅加载一次，在服务器器启动时加载 -->
    <listener>
    	<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
    </listener>
    <context-param>
    	<param-name>contextConfigLocation</param-name>
    	<param-value>classpath:/config/applicationContext*.xml</param-value>
    </context-param>
    ```

 2. 配置struts2核心过滤器

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
    ```

 3. 设置编码，防止乱码

    ```xml
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
    ```

 4. 设置首页

    ```xml
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

## 3、applicationContext.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:tool="http://www.springframework.org/schema/tool"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xsi:schemaLocation="
		http://www.springframework.org/schema/beans 
		http://www.springframework.org/schema/beans/spring-beans-3.2.xsd
		http://www.springframework.org/schema/context 
		http://www.springframework.org/schema/context/spring-context.xsd
		http://www.springframework.org/schema/tx 
		http://www.springframework.org/schema/tx/spring-tx.xsd
		http://www.springframework.org/schema/aop 
		http://www.springframework.org/schema/aop/spring-aop.xsd
		http://www.springframework.org/schema/tool
		http://www.springframework.org/schema/tool/spring-tool-3.2.xsd
		">
	<!-- 开启注解配置Bean -->
	<!-- 设置扫描包路径 -->
	<context:annotation-config/>
	<context:component-scan base-package="com.topvision"/>
	
	<!-- 开启注解事务 -->
	<tx:annotation-driven transaction-manager="transactionManager"/>
	<!-- 事务管理器 -->
	<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource"></property>
	</bean>	
	<!-- 数据库C3P0 -->
	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="driverClass" value="${s2sm.jdbc.driverClass}"/>
		<property name="jdbcUrl" value="${s2sm.jdbc.url}"/>
		<property name="user" value="${s2sm.jdbc.username}"/>
		<property name="password" value="${s2sm.jdbc.password}"/>
		
        <property name="initialPoolSize" value="${s2sm.cpool.initialPoolSize}" />
        <property name="minPoolSize" value="${s2sm.cpool.minPoolSize}" />
        <property name="maxPoolSize" value="${s2sm.cpool.maxPoolSize}" />
        <property name="acquireIncrement" value="${s2sm.cpool.acquireIncrement}" />
        <property name="maxIdleTime" value="${s2sm.cpool.maxIdleTime}"/>
        <property name="acquireRetryAttempts" value="${s2sm.cpool.acquireRetryAttempts}"/>
        <property name="acquireRetryDelay" value="${s2sm.cpool.acquireRetryDelay}"/>
	</bean>
	
	<!-- 加载properties -->
	<!-- <context:property-placeholder location="classpath:jdbc.properties"/> -->
	<bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<property name="locations">
			<list>
				<value>classpath:/config/*.properties</value>
			</list>
		</property>
	</bean>
	
</beans>
```

## 4、Action编写

```java
@Controller
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class LoginAction extends BaseAction{
    private static final long serialVersionUID = -4442251270114214406L;
    private String username;
    private String password;

    public String loginTest() {
        String key = username + ":" + password;
        ActionContext context2 = ActionContext.getContext(); 
        context2.put("key", key);
        return SUCCESS;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
```

## 5、配置struts.xml

struts.xml文件路径要与struts2核心过滤器中配置的路径一致，默认在classpath下即可。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE struts PUBLIC
	"-//Apache Software Foundation//DTD Struts Configuration 2.3//EN"
	"http://struts.apache.org/dtds/struts-2.3.dtd">

<struts>
    <!-- 所有匹配*.action的请求都由struts2处理 -->
    <constant name="struts.action.extension" value="tv,mb" />
    <!-- 主题  simple,xhtml,css_xhtml和ajax-->
	<constant name="struts.ui.theme" value="simple"/>
	
    <!-- 是否启用开发模式 -->
    <constant name="struts.devMode" value="true" />
    <!-- struts配置文件改动后，是否重新加载，有助于开发 -->
    <constant name="struts.configuration.xml.reload" value="true" />
    <!-- 每次HTTP请求系统都重新加载资源文件，有助于开发 -->
    <constant name="struts.i18n.reload" value="true" />
    <!-- 设置浏览器是否缓存静态内容,开发是设为false,部署后true -->
    <constant name="struts.serve.static.browserCache" value="false" />
	<!-- Content Model : ((package | include | bean | constant)*, unknown-handler-stack?) -->
    
	<package name="login" namespace="/aaa" extends="struts-default">
		<action name="loginTest" class="com.topvision.s2sm.login.action.LoginAction" method="loginTest">
			<result>/WEB-INF/jsp/login/login.jsp</result>
		</action>
	
	</package>

</struts>
```

## 6、测试

 1. 首页设置
    
    ```jsp
    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Insert title here</title>
    </head>
    <body>
    <a href="aaa/loginTest.tv?username=中文&password=123">请点击这个链接</a><br>  
    </body>
    </html>
    ```
 2. login.jsp

    ```jsp
    <%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
    <%@ taglib prefix="s" uri="/struts-tags" %>
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>成功</title>
    </head>
    <body>
    <h2>跳转成功</h2>
    <s:property value="@java.lang.Integer@MAX_VALUE"/>
    <s:property value="username"/>
    <s:property value="password"/>
    <s:debug></s:debug>
    </body>
    </html>
    ```
    


  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/s2sm.png
  [2]: https://www.zybuluo.com/mdeditor#772562