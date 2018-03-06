---
title: Mybatis(5)——与spring整合
categories:
  - Mybatis
tags:
  - Mybatis
date: 2018-02-27 16:26:53
---

整合spring
<!-- more -->
## 1、jar包
spring相关、mybatis、mybatis-srping整合包、数据库、数据库驱动、日志等

```xml
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
```

## 2、spring配置文件

在classpath下创建applicationContext.xml，定义数据库链接池、SqlSessionFactory。

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
	
	<!-- 开启注解、自动扫描 -->
	<context:annotation-config/>
	<context:component-scan base-package="com.topvision.ssm"/>

	<!-- 1、加载properties -->
	<!-- <context:property-placeholder location="classpath:jdbc.properties"/> -->
	<bean id="propertyConfigurer" class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
		<property name="locations">
			<list>
				<value>classpath:jdbc.properties</value>
			</list>
		</property>
	</bean>

	<!--2、 数据库C3P0 -->
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
	
	 <!-- 3.配置SqlSessionFactory对象 -->
	<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
		<!-- 注入数据库连接池 -->
		<property name="dataSource" ref="dataSource" />
		<!-- 配置MyBaties全局配置文件:mybatis-config.xml -->
		<property name="configLocation" value="classpath:sqlMapConfig.xml" />
		<!-- 扫描entity包 使用别名 -->
		<property name="typeAliasesPackage" value="com.topvision.ssm.domain" />
		<!-- 扫描sql配置文件:mapper需要的xml文件 -->
		<!-- <property name="mapperLocations" value="classpath:mapper/*.xml" /> -->
		<property name="mapperLocations" value="classpath*:com/topvision/ssm/dao/mapper/*.xml" />
	</bean>

	<!-- 4.配置扫描Dao接口包，动态实现Dao接口，注入到spring容器中 -->
	<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <!-- 注入sqlSessionFactory -->
		<property name="sqlSessionFactoryBeanName" value="sqlSessionFactory" />
		<!-- 给出需要扫描Dao接口包 -->
       	<property name="basePackage" value="com.topvision.ssm.dao" />
	</bean>
	
	<!-- 5、事务,开启注解事务 -->
	<tx:annotation-driven transaction-manager="transactionManager"/>
	<!-- 事务管理器 -->
	<bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
		<property name="dataSource" ref="dataSource"></property>
	</bean>	
	
</beans> 
```

## 3、mybatis配置文件

在classpath下新建sqlMapConfig.xml。

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
	<!--此处暂时不需要任何配置，基本配置已在applicationContext.xml的第三步中配置-->
</configuration>
```

## 4、jdbc.properties和log4j.properties

在classpath下新建这两个文件，注意参数。例如下方：

```xml
s2sm.jdbc.driverClass	= com.mysql.jdbc.Driver
s2sm.jdbc.url		 	= jdbc:mysql://localhost:3306/springdb
s2sm.jdbc.username		= root
s2sm.jdbc.password		= 123

s2sm.cpool.maxIdleTimeExcessConnections = 1800


##最常用配置
s2sm.cpool.initialPoolSize       = 50
#连接池初始化时创建的连接数,default : 3，取值应在minPoolSize与maxPoolSize之间
s2sm.cpool.minPoolSize           = 10
#连接池保持的最小连接数,default : 3
s2sm.cpool.maxPoolSize           = 100
#连接池中拥有的最大连接数，如果获得新连接时会使连接总数超过这个值则不会再获取新连接，而是等待其他连接释放，所以这个值有可能会设计地很大,default : 15
s2sm.cpool.acquireIncrement      = 5
#连接池在无空闲连接可用时一次性创建的新数据库连接数,default : 3



##管理连接池的大小和连接的生存时间

s2sm.cpool.maxIdleTime           = 3600
#连接的最大空闲时间，如果超过这个时间，某个数据库连接还没有被使用，则会断开掉这个连接。如果为0，则永远不会断开连接,即回收此连接。default : 0 单位 s。建议使用

s2sm.cpool.maxIdleTimeExcessConnections = 1800
#这个配置主要是为了快速减轻连接池的负载，比如连接池中连接数因为某次数据访问高峰导致创建了很多数据连接，但是后面的时间段需要的数据库连接数很少，需要快速释放，
#必须小于maxIdleTime。其实这个没必要配置，maxIdleTime已经配置了。default : 0 单位 s（不建议使用）

s2sm.cpool.idleConnectionTestPeriod           = 900
#每900秒检查所有连接池中的空闲连接

s2sm.cpool.maxConnectionAge      = 6000
#配置连接的生存时间，超过这个时间的连接将由连接池自动断开丢弃掉。当然正在使用的连接不会马上断开，而是等待它close再断开。配置为0的时候则不会对连接的生存时间进行限制。default : 0 单位 s（不建议使用）



##配置PreparedStatement缓存

s2sm.cpool.maxStatements=500
#连接池为数据源缓存的PreparedStatement的总数。由于PreparedStatement属于单个Connection,
#所以这个数量应该根据应用中平均连接数乘以每个连接的平均PreparedStatement
#来计算。同时maxStatementsPerConnection的配置无效。default : 0（不建议使用）

s2sm.cpool.maxStatementsPerConnection=30
#连接池为数据源单个Connection缓存的PreparedStatement数，这个配置比maxStatements更有意义，因为它缓存的服务对象是单个数据连接，
#如果设置的好，肯定是可以提高性能的。为0的时候不缓存。default : 0（看情况而论）



##重连相关配置 

s2sm.cpool.acquireRetryAttempts=5
#连接池在获得新连接失败时重试的次数，如果小于等于0则无限重试直至连接获得成功。default : 30（建议使用）

s2sm.cpool.acquireRetryDelay=1000
#两次连接中间隔时间，单位毫秒，连接池在获得新连接时的间隔时间。default : 1000 单位ms（建议使用）

s2sm.cpool.checkoutTimeout = 100
#配置当连接池所有连接用完时应用程序getConnection的等待时间。为0则无限等待直至有其他连接释放或者创建新的连接，
#不为0则当时间到的时候如果仍没有获得连接，则会抛出SQLException。其实就是acquireRetryAttempts*acquireRetryDelay。
#default : 0（与上面两个，有重复，选择其中两个都行）

s2sm.cpool.breakAfterAcquireFailure = false
#如果为true，则当连接获取失败时自动关闭数据源，除非重新启动应用程序。所以一般不用。default : false（不建议使用）


##其他

s2sm.cpool.autoCommitOnClose = false
#连接池在回收数据库连接时是否自动提交事务。如果为false，则会回滚未提交的事务，如果为true，则会自动提交事务。default : false（不建议使用）

s2sm.cpool.numHelperThreads=10
#c3p0是异步操作的，缓慢的JDBC操作通过帮助进程完成。扩展这些操作可以有效的提升性能 通过多线程实现多个操作同时被执行。Default: 3
```

```xml
#定义LOG输出级别  
log4j.rootLogger=info,Console,File  
#定义日志输出目的地为控制台  
log4j.appender.Console=org.apache.log4j.ConsoleAppender  
log4j.appender.Console.Target=System.out  
#可以灵活地指定日志输出格式，下面一行是指定具体的格式  
log4j.appender.Console.layout = org.apache.log4j.PatternLayout  
log4j.appender.Console.layout.ConversionPattern=[%c] - %m%n  
  
#文件大小到达指定尺寸的时候产生一个新的文件  
log4j.appender.File = org.apache.log4j.RollingFileAppender  
#指定输出目录  
log4j.appender.File.File = logs/ssm.log
#定义文件最大大小  
log4j.appender.File.MaxFileSize = 10MB  
#输出所有日志，如果换成DEBUG表示输出DEBUG以上级别日志  
log4j.appender.File.Threshold = ALL  
log4j.appender.File.layout = org.apache.log4j.PatternLayout  
log4j.appender.File.layout.ConversionPattern =[%p] [%d{yyyy-MM-dd HH\:mm\:ss}][%c]%m%n 
```

