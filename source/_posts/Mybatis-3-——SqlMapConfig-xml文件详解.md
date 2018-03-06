---
title: Mybatis(3)——SqlMapConfig.xml文件详解
categories:
  - Mybatis
tags:
  - Mybatis
date: 2018-02-27 16:23:39
---
MyBatis 的配置文件包含了会深深影响MyBatis行为的设置（settings）和属性（properties）信息。
<!--more-->

SqlMapConfig.xml中配置的内容和顺序如下：

 - properties(属性)
 - settings（全局配置参数）
 - typeAliases(类型别名)
 - typeHandlers（类型处理器）
 - objectFactory（对象工厂）
 - plugins（插件）
 - environments(环境)
    - environment 环境变量
        - transactionManager 事务管理器
        - dataSource 数据源
 - databaseIdProvider(数据库厂商标识)
 - mappers（映射器）

## 1、Properties

这些属性都是可外部配置且可动态替换的，既可以在典型的 Java 属性文件中配置，亦可通过 properties 元素的子元素来传递。例如：
在工程的classpath下新建jdbc.properties文件。

```properties
jdbc.driverClass	= com.mysql.jdbc.Driver
jdbc.url		 	= jdbc:mysql://localhost:3306/springdb?characterEncoding=utf-8
jdbc.username		= root
jdbc.password		= 123
```
在sqlMapConfig.xml中配置如下：
```xml
<properties resource="jdbc.properties">
	<property name="username" value="dev_user"/>
	<property name="password" value="123456"/>
</properties>
```
其中的属性就可以在整个配置文件中使用来替换需要动态配置的属性值。比如:

```xml
<!-- 数据库连接池 -->
<dataSource type="POOLED">
	<property name="driver" value="${jdbc.driverClass}" />
    <property name="url" value="${jdbc.url}" />
	<property name="username" value="${jdbc.username}" />
    <property name="password" value="${jdbc.password}" />
</dataSource>
```

注意： MyBatis 将按照下面的顺序来加载属性：

 - 在 properties 元素体内定义的属性首先被读取。
 - 然后会读取properties 元素中resource或 url加载的属性，它会覆盖已读取的同名属性。
 - 最后读取parameterType传递的属性，它会覆盖已读取的同名属性。

因此，通过parameterType传递的属性具有最高优先级，resource或 url 加载的属性次之，最低优先级的是 properties 元素体内定义的属性。

## 2、settings
这是 MyBatis 中极为重要的调整设置，它们会改变MyBatis的运行时行为。下表描述了设置中各项的意图、默认值等。

参数 | 描述 | 有效值 | 默认值
- | :-: | :-: | :-:
cacheEnabled | 该配置影响的所有映射器中配置的缓存的全局开关 | true/false |true
Hermione Granger | Gryffindor | 100 
Draco Malfoy | Slytherin | 90

具体配置见[Mybatis 3][1]。


## 3、typeAliases

类型别名是为 Java 类型设置一个短的名字。它只和XML配置有关，存在的意义仅在于用来减少类完全限定名的冗余。
mybatis自身已经支持了部分数据类型的别名，如：
别名 | 映射的类型
:-: | :-: 
_byte | byte
_long |	long
_short | short

 更多见[Mybatis 3][2]。
 
 当然，我们需要自定义别名：
 
```xml
<typeAliases>
    <!-- 单个别名定义 -->
    <typeAlias alias="book" type="com.topvision.maven.mybatis.domain.Book"/>
    <!-- 批量别名定义，扫描整个包下的类，别名为类名（首字母大写或小写都可以） -->
    <package name="com.topvision.maven.mybatis.domain"/>
    <package name="其它包"/>
</typeAliases>
```

## 4、typeHandlers

类型处理器用于java类型和jdbc类型映射，如下:

```xml
<select id="findUserById" parameterType="int" resultType="user">
    select * from user where id = #{id}
</select>
```
mybatis自带的类型处理器基本上满足日常需求，不需要单独定义。

## 5、environments

```xml
<!-- 和spring整合后 environments配置将废除 -->
<environments default="development">
	<environment id="development">
		<!-- 使用jdbc事务管理 -->
		<transactionManager type="JDBC" />
		<!-- 数据库连接池 -->
		<dataSource type="POOLED">
			<property name="driver" value="${jdbc.driverClass}" />
			<property name="url" value="${jdbc.url}" />
			<property name="username" value="${jdbc.username}" />
			<property name="password" value="${jdbc.password}" />
		</dataSource>
	</environment>
</environments>
```

## 6、mappers

既然 MyBatis 的行为已经由上述元素配置完了，我们现在就要定义SQL映射语句了。但是首先我们需要告诉 MyBatis 到哪里去找到这些语句。Java在自动查找这方面没有提供一个很好的方法，所以最佳的方式是告诉MyBatis到哪里去找映射文件。你可以使用相对于类路径的资源引用， 或完全限定资源定位符（包括 file:/// 的 URL），或类名和包名等。例如：

 1. 使用相对于类路径的资源

    ```xml
    <mapper resource="sqlmap/User.xml" />
    ```
    
 2. 使用完全限定路径

    ```xml
    <mapper url="file:///D:\workspace_spingmvc\mybatis_01\config\sqlmap\User.xml" />
    ```

 3. 使用mapper接口类路径
 
    ```xml
    <mapper class="com.topvision.mybatis.mapper.UserMapper"/>
    ```
    注意：此种方法要求mapper接口名称和mapper映射文件名称相同，且放在同一个目录中.
    
 4. 注册指定包下的所有mapper接口

    ```xml
    <package name="com.topvision.mybatis.mapper"/>
    ```
    
    注意：此种方法要求mapper接口名称和mapper映射文件名称相同，且放在同一个目录中。


  [1]: http://www.mybatis.org/mybatis-3/zh/configuration.html#settings
  [2]: http://www.mybatis.org/mybatis-3/zh/configuration.html#typeAliases