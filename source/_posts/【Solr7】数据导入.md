---
title: 【Solr7】数据导入
categories:
  - Java
  - 全文搜索
tags:
  - Solr
keyword:
  - Solr
date: 2018-08-30 19:18:54
updated: 2018-08-30 19:18:54
---

solr本身可以实现数据的导入功能，同时其提供jar还能整合如java、python等语言来导入。本文针对solr本身的数据导入功能。
<!--more-->

## 1、导入jar到lib下

solr-7.2.1\dist\solr-dataimporthandler-7.2.1.jar和mysql-connector-java-5.1.35.jar两个jar包放入
solr-7.2.1\server\solr-webapp\webapp\WEB-INF\lib下。

## 2、新建数据查询文档

在solr_home/core/conf目录下，新建data_config.xml并编写代码：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<dataConfig>
    <dataSource type="JdbcDataSource" driver="com.mysql.jdbc.Driver" url="jdbc:mysql://localhost:3306/taotao?characterEncoding=utf-8&amp;useSSL=false" user="root" password="123456" />
    <document>
        <entity name="tb_item" 
        	query="SELECT A.*, B.item_desc,c.NAME FROM tb_item A INNER JOIN tb_item_desc B ON A.id = B.item_id INNER JOIN tb_item_cat C ON A.cid = C.id" 
        	<!--增量更新，dataimporter是此文件同目录下导入数据后生成的文件-->
            deltaImportQuery="SELECT A.*, B.item_desc,c.NAME FROM tb_item A INNER JOIN tb_item_desc B ON A.id = B.item_id INNER JOIN tb_item_cat C ON A.cid = C.id where A.updated > '${dataimporter.tb_item.last_index_time}'">
            <!--column是数据库字段，name是solr中的field-->
            <field column="id" name="id" />
	        <field column="title" name="item_title" />
	        <field column="sell_point" name="item_sell_point" />
            <field column="price" name="item_price" />
            <field column="image" name="item_image" />
            <field column="name" name="item_category_name" />
            <field column="item_desc" name="item_desc" />
        </entity>
    </document>
</dataConfig>
```

## 3、添加field

solr_home/core/conf目录下的managed-schema文件中，添加上述字段

```xml
  <field name="id" type="string" multiValued="false" indexed="true" required="true" stored="true"/>

  <field name="item_title" type="text_ik" indexed="true" stored="true"/>
  <field name="item_sell_point" type="text_ik" indexed="true" stored="true"/>
  <field name="item_price"  type="plong" indexed="true" stored="true"/>
  <field name="item_image" type="string" indexed="false" stored="true" />
  <field name="item_category_name" type="string" indexed="true" stored="true" />
  <field name="item_desc" type="text_ik" indexed="true" stored="false" />
```

## 4、添加requestHandler

在solr_home/core/conf/solrconfig.xml文件中的requestHandler标签前面加上如下代码

```xml
<requestHandler name="/dataimport" class="org.apache.solr.handler.dataimport.DataImportHandler"> 
   <lst name="defaults"> 
      <str name="config">data_config.xml</str> 
   </lst> 
</requestHandler>
```

## 5、浏览器中完成导入

在浏览器打开solr,在DataImport中执行导入，左侧绿色字体为导入状态（可点击Refesh Status按钮刷新），如图：

![数据导入][1]


## 6、查询

在Query中查看导入结果，如图：

![此处输入图片的描述][2]

## 7、疑问

在第二歩中的增量查询，使用了时间比较，一个时间是数据库的timestamp(服务器时间),另一个是solr更新时间。
但是solr使用的是UTC时间，比我们少8个小时。

解决方案参考：[彻底解决Solr日期类型的时区问题][3]


  [1]: https://img-blog.csdn.net/20180306105138315?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxNDM3ODE4MQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70
  [2]: https://img-blog.csdn.net/20180306105403462?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvdTAxNDM3ODE4MQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70
  [3]: https://www.jianshu.com/p/8f65ffbd5c74