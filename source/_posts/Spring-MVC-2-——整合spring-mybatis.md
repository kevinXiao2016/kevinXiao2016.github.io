---
title: Spring MVC(2)——整合spring-mybatis
categories:
  - Java
  - Spring
tags:
  - SpringMVC
date: 2018-03-06 15:46:58
---

这边博客介绍了springmvc与spring及mybatis的继承。
<!--more-->

## 1、整合思路

**dao层：**

    mybatis+spring
    目标：
    使用spring对sqlSessionFactory进行管理
    使用spring和mybatis整合包中的mapper扫描器对mapper接口进行扫描生成代理对象。
    
**service层：**
	
    spring
    目标：
    让spring管理service类，将mapper代理对象注入到service对象中。
    spring要对service方法执行进行事务控制

**controller层：**
	
	springmvc+spring
	目标：
	使用注解处理器映射器和适配器进行开发Handler
	Handler使用组件扫描方式在spring容器中进行注册
	
## 2、工程搭建

### 2.1 创建maven web工程
### 2.2 设置jar包依赖(pom设置)

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
		<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
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
			<version>4.12</version>
			<scope>test</scope>
		</dependency>
		<dependency>
            <groupId>org.hamcrest</groupId>
            <artifactId>hamcrest-library</artifactId>
            <version>1.3</version>
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

### 2.3 配置service

加入spring。

#### 2.3.1 web.xml

配置spring监听器，设置spring核心文件的位置。

```xml
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
	version="3.1" metadata-complete="true">
	
	<!-- applicationContext对象仅加载一次，在服务器器启动时加载 -->
	<listener>
		<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
	</listener>
	<context-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>classpath:applicationContext.xml</param-value>
	</context-param>
	
</web-app>
```

#### 2.3.2 spring核心文件

依据上一步的设置，在classpath下新建applicationContext.xml

设置spring约束的文件头

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:mvc="http://www.springframework.org/schema/mvc" xmlns:tx="http://www.springframework.org/schema/tx"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd  
        http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.3.xsd  
        http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.3.xsd  
        http://www.springframework.org/schema/mvc http://www.springframework.org/schema/mvc/spring-mvc-4.3.xsd  
        http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.3.xsd">
        
</beans> 
```

 1. 开启注解功能，并设置扫描路径
 
 ```xml
 <!-- 1、开启注解、自动扫描 -->
 <context:annotation-config />

 <context:component-scan base-package="com.topvision.ssm">
    <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller" />
 </context:component-scan>
 ```
 
 <font color="red">
 **注意：**
 在配置扫描路径时，要避免对Controller注解的扫描，目的是将该注解所标识的bean交给springmvc管理而不是spring管理。
 </font>
 
 2. 加载属性文件，如数据库配置文件
 
 ```xml
 <!-- 2、加载properties -->
	<!-- <context:property-placeholder location="classpath:jdbc.properties"/> -->
	<bean id="propertyConfigurer"
		class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<property name="locations">
			<list>
				<value>classpath:jdbc.properties</value>
			</list>
		</property>
	</bean>
 ```
 
 依上在classpath下新建jdbc.properties文件。
 
 ```propertiies
 s2sm.jdbc.driverClass	= com.mysql.jdbc.Driver
 s2sm.jdbc.url		 	= jdbc:mysql://localhost:3306/springdb
 s2sm.jdbc.username		= root
 s2sm.jdbc.password		= 123
 ```
 
 3. 设置数据源

 ```xml
 <!--3、 数据库C3P0 -->
<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
	<property name="driverClass" value="${s2sm.jdbc.driverClass}" />
	<property name="jdbcUrl" value="${s2sm.jdbc.url}" />
	<property name="user" value="${s2sm.jdbc.username}" />
	<property name="password" value="${s2sm.jdbc.password}" />

	<property name="initialPoolSize" value="${s2sm.cpool.initialPoolSize}" />
	<property name="minPoolSize" value="${s2sm.cpool.minPoolSize}" />
	<property name="maxPoolSize" value="${s2sm.cpool.maxPoolSize}" />
	<property name="acquireIncrement" value="${s2sm.cpool.acquireIncrement}" />
	<property name="maxIdleTime" value="${s2sm.cpool.maxIdleTime}" />
	<property name="acquireRetryAttempts" value="${s2sm.cpool.acquireRetryAttempts}" />
	<property name="acquireRetryDelay" value="${s2sm.cpool.acquireRetryDelay}" />
</bean>
 ```
 
 4. 设置SqlSessionFactory

 ```xml
<!-- 4、配置SqlSessionFactory对象 -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
	<!-- 注入数据库连接池 -->
	<property name="dataSource" ref="dataSource" />
	<!-- 配置MyBaties全局配置文件:mybatis-config.xml -->
	<property name="configLocation" value="classpath:sqlMapConfig.xml" />
	<!-- 扫描entity包 使用别名 -->
	<property name="typeAliasesPackage" value="com.topvision.ssm.domain" />
	<!-- 扫描sql配置文件:mapper需要的xml文件 -->
	<!-- <property name="mapperLocations" value="classpath:mapper/*.xml" /> -->
	<property name="mapperLocations"
		value="classpath*:com/topvision/ssm/dao/mapper/*.xml" />
</bean>
 ```

 5. 扫描Dao层接口

 ```xml
<!-- 5、配置扫描Dao接口包，动态实现Dao接口，注入到spring容器中 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
	<!-- 注入sqlSessionFactory -->
	<property name="sqlSessionFactoryBeanName" value="sqlSessionFactory" />
	<!-- 给出需要扫描Dao接口包 -->
	<property name="basePackage" value="com.topvision.ssm.dao" />
</bean>
 ```

 6. Spring事务

 ```xml
<!-- 5、事务,开启注解事务 -->
<tx:annotation-driven transaction-manager="transactionManager" />
<!-- 事务管理器 -->
<bean id="transactionManager"
	class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
	<property name="dataSource" ref="dataSource"></property>
</bean>
 ```
 
 ### 2.4 配置Dao
 
 根据上面SqlSessionFactory的设置，在classpath下新建SqlMapConfig.xml。
 
    ```xml
    <?xml version="1.0" encoding="UTF-8" ?>
    <!DOCTYPE configuration
    PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-config.dtd">
    
    <configuration>
    
    </configuration>
    ```
    
### 2.5 整合Controller

#### 2.5.1 配置springmvc前端控制器

```xml
<servlet>
	<servlet-name>springmvc</servlet-name>
	<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	<!--设置springmvc核心文件路径-->
	<init-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>classpath:spring-mvc.xml</param-value>
	</init-param>
</servlet>
<servlet-mapping>
	<servlet-name>springmvc</servlet-name>
	<!--
	*.action,*.do等，以其结尾的url交由springmvc管理
	/ 所有请求交由springmvc，但静态资源（css,js等）交由springmvc是不对的
	/* 此种配置不正确，当请求为jsp页面时，springmvc无法解析
	-->
	<url-pattern>*.do</url-pattern>
</servlet-mapping>
```

#### 2.5.2 springmvc核心文件

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


	<!-- 可以扫描标记有@controller、@service、@repository、@component的bean -->
	<context:component-scan base-package="com.topvision.ssm.controller">
		<context:include-filter type="annotation"
			expression="org.springframework.stereotype.Controller" />
	</context:component-scan>

	<!-- 注解的处理器映射器和适配器 -->
	<!-- <bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping"/> 
		<bean class="org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter" 
		/> -->
	<!-- 简写 -->
	<mvc:annotation-driven />

	<!-- ViewResolver -->
	<bean
		class="org.springframework.web.servlet.view.InternalResourceViewResolver">
		<property name="prefix" value="/WEB-INF/jsp/" />
		<property name="suffix" value=".jsp" />
	</bean>

	<!--静态资源默认servlet配置 (1)加入对静态资源的处理：js,gif,png (2)允许使用"/"做整体映射 -->
	<!-- <mvc:default-servlet-handler/> -->

</beans>
```

#### 2.5.3 开发Controller

```java
<!--该注解标识handler-->
@Controller
public class Controller1 {

    @Autowired
    private BookService bookService;
    
    <!--该注解标识请求路径-->
    @RequestMapping("/queryBook")
    public ModelAndView getBookById() {

        Book book = bookService.findById(1000l);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("book", book);
        modelAndView.setViewName("bookDetail");
        return modelAndView;
    }

}
```
