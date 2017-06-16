---
title: spring(2)——IOC浅析
categories:
  - Spring
tags:
  - Spring
  - IOC
date: 2017-06-14 09:59:11
---

这篇博客简单分析了IOC和DI的原理及区别，并介绍了基于xml和注解的Bean配置方式。
<!--more-->
## 1. 什么是IOC?

### 1.1 IoC(Inversion of Control)控制反转
 - 控制:控制的双方是什么？谁控制谁？
    -  主控方：Spring
    -  被控方：应用程序所使用的资源
    -  (原始)应用程序控制自己执行操作需要使用的外部资源
    -  (Spring)Spring控制整个程序中所需要使用的外部资源
 - 反转:什么是反转？反转什么？
    -  正向：应用程序直接调用资源
    -  反向：应用程序依赖Spring为其提供资源
    -  反转的是资源的控制权
    -  应用程序由主动调用资源，变为被动的等待Spring提供资源
 - 有什么好处？
    -  正向缺点：应用程序控制的资源分布在程序的每一个地方
    -  反向的优点：所有的资源都在Spring中，便于管理
    -  总结：Spring反向控制应用程序所需要使用的外部资源。资源受Spring管理，利用率最大化。

### 1.2 spring演进模式
	A.基于分层设计
		UserAction			使用UserService,new UserService()
		UserService			使用UserDAO,new UserDAO()
		UserDAO
	B.工厂模式，使用面向接口编程设计，解决层与层之间的紧耦合
		制作接口，制作实现类，制作对象工厂
```java
A a = AFactory.createA();  
B b = BFactory.createB();  
a.setB(b);
```
	C.工厂模式+配置
		制作XML文件，将实现类配置到XML文件中
		读取XML文件中的配置信息，得到实现类的类名
		使用反射思想，获取实现类对象 class.newInstance();
```java
A a = Factory.create(“a”);  
B b = Factory.create(“b”);  
a.setB(b);  
```
```xml
<!--配置xml-->
a=AImpl  
b=BImpl
```
	D.自动的工厂+配置
```java
//返回装配好的a   
A a = Factory.create(“a”);  
```
```xml
<!--xml配置-->
<bean id=“a” class=“AImpl”>  
    <property name=“b” ref=“b”/>  
</bean>  
<bean id=“b” class=“BImpl”/>  
```
    E.工厂由Spring提供，实现类使用XML格式配置
        工厂由Spring提供，实现类使用XML格式配置
```java
//返回装配好的a   
A a = ApplicationContext.getBean(“a”);  
```
```xml
<!--xml配置-->
<bean id=“a” class=“AImpl”>  
    <property name=“b” ref=“b”/>  
</bean>  
<bean id=“b” class=“BImpl”/>  
```
## 2. 什么是DI？
### 2.1 DI的概念
DI(Dependency Injection)依赖注入，指应用程序依赖Spring为其提供运行时所需的资源.

- 谁依赖于谁？            -------   应用程序依赖于IoC容器
- 为什么需要依赖？        -------   应用程序依赖于IoC容器装配类之间的关系
- 依赖什么东西？          -------   依赖了IoC容器的装配功能
- 谁注入于谁？            -------   IoC容器注入应用程序
- 注入什么东西？          -------   注入应用程序需要的资源（类之间的关系）

更能描述容器其特点的名字——“依赖注入”（Dependency Injection）
IoC容器应该具有依赖注入功能，因此也可以叫DI容器 

### 2.2 DI实现方式

 1. 构造器注入
 2. setter注入
 3. 接口注入

## 3. IOC和DI的关系？
IOC和DI其实是同一概念的两种说法，两者站立的角度不一样。
IOC：从spring的角度看，资源的控制权限被反转了
DI：从应用程序的角度看，应用程序要依赖spring为其注入资源。

## 4. BeanFactory

 1. BeanFactory是ApplicationContext的顶层父接口，使用BeanFactory接口也可以完成获取Bean的操作.
 2. 操作步骤:
    ```java
    //初始化Resource对象
    Resource res = new ClassPathResource("applicationContext.xml");
    //初始化BeanFactory对象
    BeanFactory bf = new XmlBeanFactory(res);
    //根据id名称获取Bean
    UserService service = (UserService) bf.getBean("userService");
    ```
    
 3. AppplicationContext与BeanFactory的区别
   A. 加载方式不同

        AppplicationContext：立即加载，加载配置文件时即加载
		BeanFactory:延迟加载，获取Bean实例时才加载
   B. AppplicationContext具有更多的功能
   
        国际化处理
        事件传递
        Bean自动装配
        各种不同应用层的Context实现
        注意：实际开发中，优先选择ApplicationContext对象，避免使用BeanFactory

 4. Schema风格离线约束配置方式
        A.拷贝访问路径
		B.打开MyEclipse设置中的XML catalog选项
		C.创建新的映射
		D.选择对应的schema风格的约束文件
		E.将key type修改为schema location
		F.将要配置的路径复制到key中

## 5. Bean配置（XML）
### 5.1 Bean初始化

 1. 构造器初始化（重点）
    **Bean对应的类必须提供一个默认无参可访问的构造方法**
 2. 静态工厂初始化
 
    ```xml
    <bean id="userService2" 
        <!--配置中所配置的class配置成工厂类的类名-->
        class="com.topvision.bean.UserStataicFactory"
        <!--配置工厂类中的创建实例的静态方法-->
        factory-method="getInst">
    </bean>
    ```
 3. 实例工厂初始化
    提供一个实例工厂类，使用其中的实例方法获取对象。由于该工厂类本身需要创建对象，因此该对象必须受Spring控制，所以必须配置该工厂类为Bean.

    ```xml
    <!—实例化工厂Bean -->
    <bean id="uf" class="com.topvision.bean.UserFactory"></bean>
    <!--使用实例工厂创建Bean -->
    <!--factory-bean: 配置实例工厂在Spring范围内对应的Bean的id名称-->
    <!--factory-method：配置工厂类中的创建实例的实例方法-->
    <bean id="userService3"  factory-bean="uf" factory-method="getInst2"></bean>
    ```
    
### 5.2 Bean的作用域

Spring初始化的Bean默认为单例模式，如果想修改成非单例模式需要修改Bean的作用范围。
```xml   
<bean id=”beanId” class=”BeanClassName” scope=”prototype”></bean>
```
		scope属性：
			singleton：单例
			prototype：非单例
			request：请求对象范围request.setAttribute("beanId",obj);
			session：会话Session范围request.getSession().setAttribute("beanId",obj);
			globalSession：全局会话,分布式服务器
			
### 5.3 Bean的生命周期
定义Bean初始化与销毁时的动作，属于回调方法配置
定义bean时指定两个回调方法，控制bean的初始化与销毁操作时执行的动作

- init-method：初始化回调方法名，配置的方法必须由bean对象提供
- destroy-method：销毁回调方法名，配置的方法必须由bean对象提供

```xml
<bean id="user" class="com.topvision.lifecycle.User" init-method="init" destroy-method="destroy" scope="prototype"></bean>
```

- 销毁操作只针对scope="singletion"的对象，对于非单例对象无效
- 单例对象的销毁是在IoC容器关闭时发生，使用ClassPathXmlApplicationContext对象close方法完成
- 非单例Bean对象的内存回收交由JVM完成——GC

### 5.4 Bean属性注入

 1. 构造器注入（了解）
    A.在domain中提供对象的构造方法
    B.xml配置中设置构造方法的参数
    ```xml
    <!-- constructor-arg:使用构造器传递参数  -->
    <!-- value:赋值 -->
    <bean id="bean6" class="com.topvision.bean.xml.Bean6">
        <constructor-arg value="topvision"/>
        <constructor-arg value="2017"/>
    </bean>
    ```
    注意：如果类型匹配不成功，可以为配置中指定index索引属性，对应构造器中参数的位置.
    ```xml
	<bean id="bean6" class="com.topvision.bean.xml.Bean6">
		<constructor-arg index="0" value="2014" type="java.lang.Integer"></constructor-arg>
	    <constructor-arg index="1" value="topvision" type="java.lang.String"></constructor-arg>
	</bean>
	```
	说明：构造器传参受构造器参数位置和类型的限定，因此不常使用
	
 2. setter注入
 **前提：setter注入要求Bean必须提供无参可访问构造方法**

    A.注入简单类型
        
        1.提供对应要注入的属性
        2.为每个要注入的属性提供对应的标准封装setter方法
        3.在配置中为Bean指定要注入的属性，使用property元素 name=“属性名” value=”值”
    ```xml
    <property name="属性名" value="值"/>
    ```
    B.注入引用类型
         
        1.为某个Bean注入引用类型的值，首先在Bean对应的类中声明对应的属性
    ```java
    private TeacherDAO dao;
    ``` 

		2.为每个要注入的属性提供对应的标准封装setter方法 (访问器)
    ```xml
 	public void setDao(TeacherDAO dao) {
		this.dao = dao;
	}
    ```
        3.必须保障引入的对象是Spring控制的Bean
    ```xml
    <!-- 声明引用类型的资源为Bean -->
    <bean id="teacherDao" class="com.topvision.di.setter.TeacherDAO">	</bean>
    ```
        4.在Bean的属性注入中，使用ref引用对应的资源 ref=”beanId/beanName”
    ```xml
    <!-- setter注入 -->
	<!-- name:属性名 -->
	<!-- value:简单类型的值 -->
	<!-- ref:引用别的Bean，beanId/beanName -->
	<bean id="bean7" class="com.topvision.bean.xml.Bean7">
		<property name="name" value="topvision"/>
		<property name="age" value="8"/>
		<property name="dao" ref="teacherDao"></property>
	</bean>
    ```
    
## 6. Bean配置（注解）
从Spring2.5开始提供使用注解的形式配置Bean。

### 6.1 配置Bean使用@Component注解
如需为Bean定义名称，在参数中添加Bean名称@Component("beanName")

### 6.2 设定Spring的自动扫描路径
用于检测对应的Bean是否配置了注解，并加载配置了注解的类

 - 开启context空间的支持
```xml
<beans xmlns="http://www.springframework.org/schema/beans"
  	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   	xmlns:context="http://www.springframework.org/schema/context" 
   	xsi:schemaLocation="
	http://www.springframework.org/schema/beans 
	http://www.springframework.org/schema/beans/spring-beans.xsd
	http://www.springframework.org/schema/context 					
	http://www.springframework.org/schema/context/spring-context.xsd">
	
```
 - 开启自动扫描功能，并指定扫描的路径
```xml
<context:component-scan base-package="com.topvision.annotation"></context:component-scan>
```
说明：扫描路径可以设置多个，中间使用,隔开，扫描路径包含指定包和子包内所有的类,通常使用*号通配符匹配路径

### 6.3 Spring提供的三个注解

 1. @Repository 用于数据层实现类标注
 2. @Service 用于业务逻辑层实现类标注
 3. @Controller 用于控制层实现类进行标注

### 6.4 注入简单类型

 1. 在属性名上方声明该属性自动装配@Autowired
 2. 在属性名上方声明该属性注入的值@Value(value)
```java
@Autowired
@Value("topvision")
private String msg;
```
注意：注解自动装配属性值无需提供对应属性的setter方法

### 6.5 注入引用类型

 - 在属性名上方声明该属性自动装配@Autowired
 - 在属性名上方声明该属性注入的值@Qualifier(bean引用名称)
```java
@Autowired
@Qualifier("anno2")
private AnnotationOther other;
```

### 6.6 Autowired
Autowired的required属性用用于声明自动装配的数据是必须的。

 1. 如果required=true，必须为其装配数据，如果没有值，抛出异常
 2. 如果required=false，自动装配数据失败，则注入值为null

### 6.7 Resource

 1. 格式一：@Resource(name="myImpl")
 2. 格式二：@Autowired(required=false)
　　　　@Qualifier("myImpl")
以上两种格式效果相同

### 6.8 Bean声明周期注解

 1. @PostConstruct
    功能：为当前Bean指定init-method参数
	格式：定义在成员方法的上方，兼容静态方法
 2. @PreDestroy
    功能：为当前Bean指定destory-method参数
	格式：定义在成员方法的上方，兼容静态方法
	注意：要求当前类被注册为Bean，否则无效果

### 6.9 Bean作用域注解

在类的定义上方添加@Scope指定Bean的作用域
常用：@Scope("prototype")
默认：@Scope("singleton")

### 6.10 配置类注解
**@Configuration**配置当前类为配置类，用于加载其中配置的Bean，与静态工厂初始化Bean很相似
**@Bean(name="b1")**将配置类中的某个方法的返回值声明为Bean，该方法必须返回一个对象
```java
@Configuration			//设定该类参与自动扫描
public class MyBeanFactory {
	@Bean(name={"aa","bb","cc"})//设定该方法的返回值是一个Bean
	public static BookService getInst(){
		return new BookService();
	}
}
```
以上操作必须基于自动扫描功能，如不开启自动扫描，Spring将无法查找到对应的注解配置

### 6.11 AnnotationConfigApplicationContext不使用自动扫描

AnnotationConfigApplicationContext对象可以手工加载基于注解配置的Bean
```java
//用于手工添加注解开发Bean的上下文对象
AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
//加载配置管理类
ctx.register(MyConfiguration.class);
//刷新上下文对象
ctx.refresh();
```

注意：注册完成后一定要进行刷新，否则加载的Bean将无法被使用

## 博客链接

 1. [源码解读Spring IOC原理][1]
 2. [Spring源代码解析][2]


    


  [1]: http://www.cnblogs.com/ITtangtang/p/3978349.html
  [2]: http://www.cnblogs.com/dazhaxie/archive/2012/06/18/2553300.html