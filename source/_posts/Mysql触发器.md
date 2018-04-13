---
title: Mysql触发器
categories:
  - Mysql
tags:
  - Mysql
  - 数据库
keyword:
  - Mysql
  - 触发器
date: 2018-02-13 09:34:00
---
触发器（TRIGGER）是MySQL的数据库对象之一，从5.0.2版本开始支持。它和函数比较相似，也需要声明和执行，但是它不用程序或人工调用，而是由事件驱动的。

那么，什么是触发器？
    
在MySQL Server里面也就是对某一个表的一定的操作，触发某种条件（Insert,Update,Delete 等），从而自动执行的一段程序。从这种意义上讲触发器是一个特殊的存储过程
<!--more-->

## 1、语法

```sql
CREATE TRIGGER trigger_name
trigger_time trigger_event
ON tbl_name
FOR EACH ROW 
trigger_body              
```

 - trigger_name：触发器的名称，不能与已经存在的触发器重复；
 - trigger_time：{ BEFORE | AFTER }，表示在事件之前或之后触发；
 - trigger_event:：{ INSERT |UPDATE | DELETE }，触发该触发器的具体事件；
 - tbl_name：该触发器作用在tbl_name上；
 - trigger_body：sql语句

你必须拥有相当大的权限才能创建触发器（CREATE TRIGGER），如果你已经是Root用户，那么就足够了。这跟SQL的标准有所不同。

## 2、实例

创建学生表

```sql
CREATE TABLE `student` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `classId` int(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

创建班级表

```sql
CREATE TABLE `class` (
  `id` int(5) NOT NULL,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```

创建插入触发器

```sql
CREATE TRIGGER tri_insert
AFTER INSERT 
ON student
FOR EACH ROW
BEGIN
  DECLARE c INT;
  SET c = (SELECT num from class WHERE id = new.classId);
  UPDATE class SET num = c + 1 WHERE id = new.classId;
END
```

插入一条数据到student表，class表对应的班级学生数+1

## 3、变量详解

MySQL 中使用 DECLARE 来定义一局部变量，该变量只能在 BEGIN … END 复合语句中使用，并且应该定义在复合语句的开头，

即其它语句之前，语法如下：

```sql
DECLARE var_name[,...] type [DEFAULT value]
```

 - var_name 为变量名称，同 SQL 语句一样，变量名不区分大小写；
 - type 为 MySQL 支持的任何数据类型；可以同时定义多个同类型的变量，用逗号隔开；

变量初始值为 NULL，如果需要，可以使用DEFAULT子句提供默认值，值可以被指定为一个表达式。

对变量赋值采用 SET 语句，语法为：

```sql
SET var_name = expr [,var_name = expr] ...
```

## 4、NEW 与 OLD 详解

上述示例中使用了NEW关键字，和 MS SQL Server 中的 INSERTED 和 DELETED 类似，MySQL 中定义了 NEW 和 OLD，用来表示

触发器的所在表中，触发了触发器的那一行数据。
具体地：
在 INSERT 型触发器中，NEW用来表示将要（BEFORE）或已经（AFTER）插入的新数据；
在 UPDATE 型触发器中，OLD用来表示将要或已经被修改的原数据，NEW用来表示将要或已经修改为的新数据；
在 DELETE 型触发器中，OLD 用来表示将要或已经被删除的原数据；

使用方法： NEW.columnName （columnName 为相应数据表某一列名）
另外，OLD 是只读的，而 NEW 则可以在触发器中使用 SET 赋值，这样不会再次触发触发器，造成循环调用（如每插入一个学生前，都在其学号前加“2013”）。

## 5、查看与删除触发器

和查看数据库（show databases;）查看表格（showtables;）一样，查看触发器的语法如下：

```sql
SHOW TRIGGERS [FROM schema_name];
```

其中，schema_name 即 Schema 的名称，在 MySQL 中 Schema 和 Database 是一样的，也就是说，可以指定数据库名，这样就不必先“USE database_name;”了。
 
和删除数据库、删除表格一样，删除触发器的语法如下：
 
```sql
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```
## 6、执行顺序

我们建立的数据库一般都是 InnoDB 数据库，其上建立的表是事务性表，也就是事务安全的。这时，若SQL语句或触发器执行失败，MySQL 会回滚事务，有：

①如果 BEFORE 触发器执行失败，SQL 无法正确执行。
②SQL 执行失败时，AFTER 型触发器不会触发。
③AFTER 类型的触发器执行失败，SQL 会回滚。
  
