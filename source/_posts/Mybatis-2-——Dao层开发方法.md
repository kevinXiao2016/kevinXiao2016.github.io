---
title: Mybatis(2)——Dao层开发方法
categories:
  - Java
  - Mybatis
tags:
  - Mybatis
date: 2018-02-27 16:21:42
---
mybatis的dao层通常有两种开发方式，原始dao开发及mapper接口发开方法。
<!--more-->

## 1、SqlSession的使用范围

SqlSession中封装了对数据库的操作，如：查询、插入、更新、删除等。通过SqlSessionFactory创建SqlSession，而SqlSessionFactory是通过SqlSessionFactoryBuilder进行创建。

### 1.1 SqlSessionFactoryBuilder
SqlSessionFactoryBuilder用于创建SqlSessionFacoty，SqlSessionFacoty一旦创建完成就不需要SqlSessionFactoryBuilder了，因为SqlSession是通过SqlSessionFactory生产，所以可以将SqlSessionFactoryBuilder当成一个工具类使用，最佳使用范围是方法范围即方法体内局部变量。

### 1.2 SqlSessionFactory
SqlSessionFactory是一个接口，接口中定义了openSession的不同重载方法，SqlSessionFactory的最佳使用范围是整个应用运行期间，一旦创建后可以重复使用，通常以单例模式管理SqlSessionFactory。

### 1.3 SqlSession
SqlSession是一个面向用户的接口，sqlSession中定义了数据库操作，默认使用DefaultSqlSession实现类。

**执行过程如下：**
1、	加载数据源等配置信息
    Environment environment = configuration.getEnvironment();
2、	创建数据库链接
3、	创建事务对象
4、	创建Executor，SqlSession所有操作都是通过Executor完成
5、	SqlSession的实现类即DefaultSqlSession，此对象中对操作数据库实质上用的是Executor

**结论：**
	每个线程都应该有它自己的SqlSession实例。SqlSession的实例不能共享使用，它也是线程不安全的。因此最佳的范围是请求或方法范围。绝对不能将SqlSession实例的引用放在一个类的静态字段或实例字段中。
	打开一个 SqlSession；使用完毕就要关闭它。通常把这个关闭操作放到 finally 块中以确保每次都能执行关闭。

## 2、原始Dao开发

原始开发方式需要编写dao接口及接口实现类。

### 2.1 编写映射文件（sql）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="test">
	<select id="queryById" parameterType="long" resultType="com.topvision.maven.mybatis.domain.Book">
		select book_id bookId,name,number from book where book_id = #{id}
	</select>
</mapper>
```

### 2.2 编写Dao接口

```java
public interface BookDao {
    public Book queryById(long id);
}
```

### 2.3 编写Dao实现类

```java
public class BookDaoImpl implements BookDao {

    private SqlSessionFactory sqlSessionFactory;

    // 注入SqlSessionFactory
    public BookDaoImpl(SqlSessionFactory sqlSessionFactory) {
        this.setSqlSessionFactory(sqlSessionFactory);
    }

    @Override
    public Book queryById(long id) {
        SqlSession sqlSession = null;
        Book book = null;
        try {
            sqlSession = sqlSessionFactory.openSession();
            book = sqlSession.selectOne("test.queryById", id);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            sqlSession.close();
        }
        return book;
    }

    public SqlSessionFactory getSqlSessionFactory() {
        return sqlSessionFactory;
    }

    public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
        this.sqlSessionFactory = sqlSessionFactory;
    }
    
}
```

### 2.4 测试用例

```java
public class BookDaoImplTest {
    
    private SqlSessionFactory sqlSessionFactory;
    
    @Before
    public void createSqlSessionFactory() throws IOException{
        String resource = "sqlMapConfig.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        
        sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
    }
    

    @Test
    public void testQueryById() {
        
        BookDao bookDao = new BookDaoImpl(sqlSessionFactory);
        Book book = bookDao.queryById(1000l);
        System.out.println(book);
    }

}
```

## 3、Mapper接口开发

Mapper接口开发方法只需要程序员编写Mapper接口（相当于Dao接口），由Mybatis框架根据接口定义创建接口的动态代理对象，代理对象的方法体同上边Dao接口实现类方法。
Mapper接口开发需要遵循以下规范：
1、	Mapper.xml文件中的namespace与mapper接口的类路径相同。
2、	Mapper接口方法名和Mapper.xml中定义的每个statement的id相同 
3、	Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql的parameterType的类型相同
4、	Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql的resultType的类型相同

### 3.1 Mapper.xml(映射文件)
在classpath下新建mapper文件夹，新建BookMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.topvision.maven.mybatis.dao.BookDao">
	<select id="queryById" parameterType="long" resultType="book">
		select book_id bookId,name,number from book where book_id = #{id}
	</select>
</mapper>
```

### 3.2 BookDao接口

```java
public interface BookDao {
    public Book queryById(long id);
}
```

接口定义有如下特点：
1、	Mapper接口方法名和Mapper.xml中定义的statement的id相同
2、	Mapper接口方法的输入参数类型和mapper.xml中定义的statement的parameterType的类型相同
3、	Mapper接口方法的输出参数类型和mapper.xml中定义的statement的resultType的类型相同

### 3.3 加载BookMapper.xml

```xml
<mappers>
	<mapper resource="mapper/BookMapper.xml"/>
</mappers>
```

### 3.4 测试

```java
@Test
public void testQueryByIdInProxy() {
    SqlSession sqlSession = null;
    try {
        sqlSession = sqlSessionFactory.openSession();
        BookDao bookDao = sqlSession.getMapper(BookDao.class);
        Book book = bookDao.queryById(1000l);
        System.out.println(book);
    } catch (Exception e) {
        e.printStackTrace();
    } finally {
        if (sqlSession != null) {
            sqlSession.close();
        }
    }
}
```

### 3.5 小结

 - electOne和selectList
动态代理对象调用sqlSession.selectOne()和sqlSession.selectList()是根据mapper接口方法的返回值决定，如果返回list则调用selectList方法，如果返回单个对象则调用selectOne方法。
 - namespace
mybatis官方推荐使用mapper代理方法开发mapper接口，程序员不用编写mapper接口实现类，使用mapper代理方法时，输入参数可以使用pojo包装对象或map对象，保证dao的通用性。
