---
title: Mysql视图的简单使用
categories:
  - Mysql
tags:
  - Mysql
  - 数据库
keyword:
  - Mysql
  - 视图
date: 2018-04-10 21:07:20
---

视图是指计算机数据库中的视图，是一个虚拟表，其内容由查询定义。同真实的表一样，视图包含一系列带有名称的列和行数据。但是，视图并不在数据库中以存储的数据值集形式存在。行和列数据来自由定义视图的查询所引用的表，并且在引用视图时动态生成。——百度百科

<!--more-->

## 1、创建

要在MySQL中创建一个新视图，可以使用CREATE VIEW语句。 在MySQL中创建视图的语法如下：

```sql
CREATE 
   [ALGORITHM = {MERGE  | TEMPTABLE | UNDEFINED}]
VIEW [database_name].[view_name] 
AS
[SELECT  statement]
```

下面我们来详细的查看上面的语法。

### 1.1、查看处理算法:

算法属性允许您控制MySQL在创建视图时使用的机制，MySQL提供了三种算法：MERGE，TEMPTABLE和UNDEFINED。

 - 使用MERGE算法，MySQL首先将输入查询与定义视图的SELECT语句组合成单个查询。 然后MySQL执行组合查询返回结果集。 如果SELECT语句包含集合函数(如MIN，MAX，SUM，COUNT，AVG等)或DISTINCT，GROUP BY，HAVING，LIMIT，UNION，UNION ALL，子查询，则不允许使用MERGE算法。 如果SELECT语句无引用表，则也不允许使用MERGE算法。 如果不允许MERGE算法，MySQL将算法更改为UNDEFINED。请注意，将视图定义中的输入查询和查询组合成一个查询称为视图分辨率。
 - 使用TEMPTABLE算法，MySQL首先根据定义视图的SELECT语句创建一个临时表，然后针对该临时表执行输入查询。因为MySQL必须创建临时表来存储结果集并将数据从基表移动到临时表，所以TEMPTABLE算法的效率比MERGE算法效率低。 另外，使用TEMPTABLE算法的视图是不可更新的。
 - 当您创建视图而不指定显式算法时，UNDEFINED是默认算法。UNDEFINED算法使MySQL可以选择使用MERGE或TEMPTABLE算法。MySQL优先使用MERGE算法进行TEMPTABLE算法，因为MERGE算法效率更高。

### 1.2、查看名称

在数据库中，视图和表共享相同的命名空间，因此视图和表不能具有相同的名称。 另外，视图的名称必须遵循表的命名规则。

### 1.3、SELECT语句

在SELECT语句中，可以从数据库中存在的任何表或视图查询数据。SELECT语句必须遵循以下几个规则：

 - SELECT语句可以在WHERE子句中包含子查询，但FROM子句中的不能包含子查询。
 - SELECT语句不能引用任何变量，包括局部变量，用户变量和会话变量。
 - SELECT语句不能引用准备语句的参数。
 

 




