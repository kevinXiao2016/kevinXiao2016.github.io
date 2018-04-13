---
title: Mysql索引的简单使用
categories:
  - Mysql
tags:
  - Mysql
  - 数据库
keyword:
  - Mysql
  - 索引
date: 2018-04-10 21:11:36
---
这篇记录了mysql中索引的简单使用方法，基本上满足大部分的开发需求。

<!--more-->


## 1、索引是什么

索引（Index）是帮助Mysql高效查询数据的一种数据结构，其本质：数据结构。

## 2、优势

好比图书馆建立的书目索引，提高数据检索效率，降低数据库的IO成本。
通过索引对数据库进行排序，降低数据排序的成本，降低CPU的消耗。

## 3、劣势

索引也是一张表，该表保存了主键与索引片段，并指向实体表的记录，所以索引也是需要占用空间的。
同时会降低更新表的速度，如对表进行INSERT、UPDATE和DELETE。因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件。

## 4、分类

 1. 单列索引：即一个索引只包含一个列，一张表可以有多个单列索引。
 2. 唯一索引(UNIQUE)：索引列的值必须唯一，允许为空值。
 3. 全文索引(FULLTEXT)：仅用于MyISAM表。
 4. 组合索引(最左前缀): 多个列构成一个索引，适用于查询条件较复杂的情况。

> 最左前缀：

mysql查询时只能使用一个索引。建立组合索引时，本质上同时建立了好几个索引，下面以实例讲解：

```sql
ALTER TABLE people ADD INDEX lname_fname_age (lame,fname,age); 
```
创建一个组合索引，相当于同时创建了(lname)单列索引，(lname,fname)组合索引以及(lname,fname,age)组合索引。

**注：在创建多列索引时，要根据业务需求，where子句中使用最频繁的一列放在最左边。**

虽然索引对顺序敏感，但是mysql优化器会自动调整where后面的条件顺序，来匹配合适的索引。

 
## 5、基本语法

 1. 创建索引

    ```sql
    CREATE [UNIQUE] INDEX indexName ON tableName(columnName(length))
    ```
    如果是CHAR，VARCHAR类型，length可以小于字段实际长度；如果是BLOB和TEXT类型，必须指定 length。
    
    
    ```sql
    ALTER TABLE tableName ADD INDEX indexName(columnName(length))
    ```
    修改表结构添加索引
    
    ```sql
    CREATE TABLE mytable (
    	ID INT NOT NULL,
    	username VARCHAR (16) NOT NULL,
    	INDEX [ indexName ] (username(length))
    );  
    ```
    创建表的时候直接指定。
    
    

    > 使用ALTER 命令添加和删除索引：
    
     - ALTER TABLE tbl_name ADD PRIMARY KEY (column_list):
        该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL。
     - ALTER TABLE tbl_name ADD UNIQUE index_name (column_list):
        这条语句创建索引的值必须是唯一的（除了NULL外，NULL可能会出现多次）。
     - ALTER TABLE tbl_name ADD INDEX index_name (column_list): 
        添加普通索引，索引值可出现多次。
     - ALTER TABLE tbl_name ADD FULLTEXT index_name (column_list):
        该语句指定了索引为 FULLTEXT ，用于全文索引。

 2. 删除索引

    ```sql
    DROP INDEX [indexName] ON tableName   
    ```
    
 3. 查看索引

    ```sql
    SHOW INDEX FROM table_name;  
    ```
    
    
## 6、Mysql索引结构

    
 - BTree：
    - 可以用于使用 =, >, >=, <, <= 或者 BETWEEN 运算符的列比较
    - 如果 LIKE 的参数是一个没有以通配符起始的常量字符串的话也可以使用这种索引

 - Hash：
    - 只能够用于使用 = 或者 <=> 运算符的相等比较(但是速度更快)
    - 优化器不能够使用 hash 索引来加速 ORDER BY 操作
    - 无法使用 hash 索引估计两个值之间有多少行
    
 - full-text：MyISAM的一个特殊索引类型，主要用于全文检索。
 - R-Tree：MyISAM支持空间索引，主要用于地理空间数据类型，例如GEOMETRY。

## 7、哪些情况需要创建索引

 1. 主键自动建立唯一索引
 2. 频繁作为查询条件的字段应该创建索引
 3. 查询中与其他表关联的字段，外键关系建立索引
 4. 单键/组合索引的选择问题，who?(在高并发下倾向创建组合索引)
 5. 查询中排序的字段，排序的字段若通过索引去访问将大大提高排序速度
 6. 查询中统计或者分组字段

## 8、哪些情况不需要创建索引

 1. 表记录太少
 2. 经常增删改的表
　　　　提高了查询速度，同时却会降低更新表的速度，如对表进行INSERT、UPDATE、和DELETE。
　　　　因为更新表时，MySQL不仅要保存数据，还要保存一下索引文件。
　　　　数据重复且分布平均的表字段，因此应该只为最经常查询和最经常排序的数据建立索引。
 3. 注意，如果某个数据列包含许多重复的内容，为它建立索引就没有太大的实际效果。
 4. 频繁更新的字段不适合建立索引，因为每次更新不单单是更新了记录还会更新索引
 5. WHERE条件里用不到的字段不创建索引