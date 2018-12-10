---
title: Mybatis(4)——Mapper.xml映射文件
categories:
  - Java
  - Mybatis
tags:
  - Mybatis
date: 2018-02-27 16:24:43
---
Mapper.xml映射文件中定义了操作数据库的sql，每个sql是一个statement，映射文件是mybatis的核心。
<!--more-->

SQL 映射文件有很少的几个顶级元素（按照它们应该被定义的顺序）：

cache – 给定命名空间的缓存配置。
cache-ref – 其他命名空间缓存配置的引用。
resultMap – 是最复杂也是最强大的元素，用来描述如何从数据库结果集中来加载对象。
parameterMap – 已废弃！老式风格的参数映射。内联参数是首选,这个元素可能在将来被移除，这里不会记录。
sql – 可被其他语句引用的可重用语句块。
insert – 映射插入语句
update – 映射更新语句
delete – 映射删除语句
select – 映射查询语句
下一部分将从语句本身开始来描述每个元素的细节。


## 1、parameterType(输入类型)

### 1.1 传递简单类型

```xml
<!-- 根据名称模糊查询用户信息 -->
<select id="selectUserByName" parameterType="string" resultType="user">
   select * from user where username like '%${value}%'
</select>

<!-- 根据id查询用户信息 -->
<select id="selectUserById" parameterType="int" resultType="user">
   select * from user where userId = #{id}
</select>
```

### 1.2 传递pojo

Mybatis使用ognl表达式解析对象字段的值，如下例子：

```xml
<!-- 传递pojo对象综合查询用户信息 -->
<select id="findUserByUser" parameterType="user" resultType="user">
   select * from user where id=#{id} and username like '%${username}%'
</select>
```

id 和 username 都是 User对象里面的属性字段。


### 1.3 传递pojo包装对象

```java
public class QueryVo {
	
	private User user;
	
	//自定义用户扩展类
	private UserCustom userCustom;

```
```xml
<!-- 传递pojo包装对象综合查询用户信息 -->
<select id="findUserList" parameterType="queryVo" resultType="user">
   select * from user where id=#{user.id} and username like '%${user.username}%'
</select>
```
### 1.4 传递hashmap

```xml
<!-- 传递hashmap综合查询用户信息 -->
<select id="findUserByHashmap" parameterType="hashmap" resultType="user">
    select * from user where id=#{id} and username like '%${username}%'
</select>
```

id和username是map的key

## 2、resultType(输出类型)

**输出简单类型，输出pojo,输出pojo列表（list），输出hashmap**

输出pojo对象和输出pojo列表在sql中定义的resultType是一样的。
返回单个pojo对象要保证sql查询出来的结果集为单条，内部使用session.selectOne方法调用，mapper接口使用pojo对象作为方法返回值。

返回pojo列表表示查询出来的结果集可能为多条，内部使用session.selectList方法，mapper接口使用List<pojo>对象作为方法返回值。

输出pojo对象可以改用hashmap输出类型，将输出的字段名称作为map的key，value为字段值。

## 3、resultMap

resultType可以指定pojo将查询结果映射为pojo，但需要pojo的属性名和sql查询的列名一致方可映射成功。
如果sql查询字段名和pojo的属性名不一致，可以通过resultMap将字段名和属性名作一个对应关系 ，resultMap实质上还需要将查询结果映射到pojo对象中。
resultMap可以实现将查询结果映射为复杂类型的pojo，比如在查询结果映射对象中包括pojo和list实现一对一查询和一对多查询。


## 4、动态sql

通过mybatis提供的各种标签方法实现动态拼接sql。

### 4.1 if

```xml
<!-- 传递pojo综合查询用户信息 -->
<select id="findUserList" parameterType="user" resultType="user">
	select * from user 
	where 1=1 
	<if test="id!=null and id!=''">
	    and id=#{id}
	</if>
	<if test="username!=null and username!=''">
	    and username like '%${username}%'
	</if>
</select>
```

### 4.2 where

```xml
<select id="findUserList" parameterType="user" resultType="user">
	select * from user 
	<where>
    	<if test="id!=null and id!=''">
    	    and id=#{id}
    	</if>
    	<if test="username!=null and username!=''">
    	    and username like '%${username}%'
    	</if>
	</where>
</select>
```

where 元素知道只有在一个以上的if条件有值的情况下才去插入“WHERE”子句。而且，若最后的内容是“AND”或“OR”开头的，where 元素也知道如何将他们去除。

### 4.3 choose, when, otherwise
有些时候，我们不想用到所有的条件语句，而只想从中择其一二。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```

### 4.4 foreach

向sql传递数组或List，mybatis使用foreach解析，如下：

 1. 通过pojo传递list
 
    ```xml
    <if test="ids!=null and ids.size>0">
        <foreach collection="ids" open=" and id in(" close=")" item="id" separator="," >
        #{id}
        </foreach>
    </if>
    ```
 
 2. 传递单个List

    ```xml
	<select id="selectUserByList" parameterType="java.util.List" resultType="user">
		select * from user
		<where>
			<!-- 传递List，List中是pojo -->
			<if test="list!=null">
				<foreach collection="list" item="item" open="and id in("
					separator="," close=")">
					#{item.id}
				</foreach>
			</if>
		</where>
	</select>
    ```

 3. 传递单个数组（数组中是pojo）

    ```xml
    <!-- 传递数组综合查询用户信息 -->
	<select id="selectUserByArray" parameterType="Object[]" resultType="user">
		select * from user
		<where>
			<!-- 传递数组 -->
			<if test="array!=null">
				<foreach collection="array" index="index" item="item" open="and id in("
					separator="," close=")">
					#{item.id}
				</foreach>
			</if>
		</where>
	</select>
    ```

 4. 传递单个数组（数组中是字符串类型）
 
    ```xml
    <!-- 传递数组综合查询用户信息 -->
	<select id="selectUserByArray" parameterType="Object[]" resultType="user">
		select * from user
		<where>
			<!-- 传递数组 -->
			<if test="array!=null">
				<foreach collection="array" index="index" item="item" open="and id in("
					separator="," close=")">
					#{item}
				</foreach>
			</if>
		</where>
	</select>
    ```
    

 5. SQL片段

    感觉实际开发中不怎么使用，不利于维护。
    


## 5、#{}与\${}

 1. #{}实现的是向prepareStatement中的预处理语句中设置参数值，sql语句中#{}表示一个占位符即?。使用占位符#{}可以有效防止sql注入，在使用时不需要关心参数值的类型，mybatis会自动进行java类型和jdbc类型的转换。#{}可以接收简单类型值或pojo属性值，如果parameterType传输单个简单类型值，#{}括号中可以是value或其它名称
 2. \${}和#{}不同，通过\${}可以将parameterType传入的内容拼接在sql中且不进行jdbc类型转换,\${}可以接收简单类型值或pojo属性值，如果parameterType传输单个简单类型值，\${}括号中只能是value，使用\${}不能防止sql注入。
 3. 模糊查询时，推荐使用\${}

    ```xml
    <!-- 根据名称模糊查询用户信息 -->
    <select id="selectUserByName" parameterType="string" resultType="user">
        select * from user where username like '%${value}%'
    </select>
    ```

 4. order by排序，如果将列名通过参数传入sql，根据传的列名进行排序，应该写为：
ORDER BY \${columnName}
如果使用#{}将无法实现此功能。