---
title: spring(3)——AOP浅析
categories:
  - Spring
tags:
  - Spring
  - AOP
date: 2017-06-14 17:05:36
---
这篇博客简要介绍了Spring AOP的执行过程及实现。
<!--more-->
## 1. AOP简介
AOP（Aspect Oriented Programming），即面向切面编程，可以说是OOP（Object Oriented Programming，面向对象编程）的补充和完善。OOP引入封装、继承、多态等概念来建立一种对象层次结构，用于模拟公共行为的一个集合。不过OOP允许开发者定义纵向的关系，但并不适合定义横向的关系，例如日志功能。日志代码往往横向地散布在所有对象层次中，而与它对应的对象的核心功能毫无关系对于其他类型的代码，如安全性、异常处理和透明的持续性也都是如此，这种散布在各处的无关的代码被称为横切（cross cutting），在OOP设计中，它导致了大量代码的重复，而不利于各个模块的重用。

AOP技术恰恰相反，它利用一种称为"横切"的技术，剖解开封装的对象内部，并将那些影响了多个类的公共行为封装到一个可重用模块，并将其命名为"Aspect"，即切面。所谓"切面"，简单说就是那些与业务无关，却为业务模块所共同调用的逻辑或责任封装起来，便于减少系统的重复代码，降低模块之间的耦合度，并有利于未来的可操作性和可维护性。

使用"横切"技术，AOP把软件系统分为两个部分：核心关注点和横切关注点。业务处理的主要流程是核心关注点，与之关系不大的部分是横切关注点。横切关注点的一个特点是，他们经常发生在核心关注点的多处，而各处基本相似，比如权限认证、日志、事物。AOP的作用在于分离系统中的各种关注点，将核心关注点和横切关注点分离开来。

## 2. AOP核心概念

 - **连接点(Joinpoint)**:被拦截到的点，因为Spring只支持方法类型的连接点，所以在Spring中连接点指的就是被拦截到的方法，实际上连接点还可以是字段或者构造器
 - **切入点(Pointcut**):要被增强的方法，定义了切入发生的地点
 - **通知(advice)**:要执行的增强方法，定义了切入的时机和执行的动作
 - **切面(Aspect)**:切入点和通知的对应关系，也就是两者结合的称呼
 - **目标对象(Target Object)**:包含切入点的运行时对象，也就是被代理的对象
 - **AOP代理(aop proxy)**:代理对象
 - **织入(Weaving)**:是一个将通知功能加入原始字节码的动态过程，共有三种方法，Spring使用的是运行时织入。

## 3. AOP运行环境

 - Spring核心包（4个）
 - 日志包（两个）
 - AOP包（4个）
    - Spring进行AOP开发(1个)spring-aop-4.2.5.RELEASE.jar
    - Spring整合AspectJ框架spring-aspects-4.2.5.RELEASE.jar
    - AOP联盟规范(1个)com.springsource.org.aopalliance-1.0.0.jar
    - aspectJ支持(1个)com.springsource.org.aspectj.weaver-1.7.2.RELEASE.jar

## 4. XML实现

### 4.1 在配置文件中开启AOP空间
### 4.2 编写连接点类，即需要增强的业务类
    业务类可以有上层接口(JDK代理)，也可以没有(cglib代理)
    
 - 业务类接口

    ```java
    public interface ImSleep {
	    public void sleep();
    }
    ```
    
 - 业务类实现
    
    ```java
	public class HumanSleep implements ImSleep{
	
    	@Override
    	public void sleep() {
    		System.out.println("我要睡觉了");
    	}
    }
    ```
### 4.3 编写通知类，即增强方法所在的类

```java
public class TimeHandler {
    //通知方法
	public void printTime() {
		System.out.println("CurrentTime=" + System.currentTimeMillis());
	}
}
```

### 4.4 在xml中配置切面，即关联切入点和通知
 
```xml
<bean id="humanSleep" class="com.topvision.ssm.domian.HumanSleep"/>
<bean id="timeHandler" class="com.topvision.ssm.domian.TimeHandler"/>
	
<aop:config>
    //配置切面，ref关联通知类
	<aop:aspect id="time" ref="timeHandler">
	    //切入点，匹配要切入的业务类
		<aop:pointcut expression="execution(*com.topvision.ssm.domian.HumanSleep.sleep())" id="addTime"/>
		//通知类型，执行通知类中的那个方法，关联的切入点
		<aop:before method="printTime" pointcut-ref="addTime"/>
		<aop:after method="printTime" pointcut-ref="addTime"/>
	</aop:aspect>
</aop:config>
```

### 4.5 测试类

```java
ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
ImSleep human = (ImSleep) ctx.getBean("humanSleep");
human.sleep();
```

## 5. 注解实现
### 5.1 开启aop注解
核心配置文件中添加以下配置，功能等同于注解配置Bean的自动扫描路径
```xml
//开启bean扫描
<context:component-scan base-package="com.topvision.ssm.*"/> 
//开启aop注解扫描
<aop:aspectj-autoproxy/>
```
### 5.2 配置业务类
```java
@Component
public class Bussiness {
	
	/**
	 * 切入点
	 */
	public String delete(String obj) {
		System.out.println("==========调用切入点：" + obj + "说：你敢删除我！===========\n");
		return obj + "：瞄～";
	}

	public String add(String obj) {
		System.out.println("================这个方法不能被切。。。============== \n");
		return obj + "：瞄～ 嘿嘿！";
	}

	public String modify(String obj) {
		System.out.println("=================这个也设置加入切吧====================\n");
		return obj + "：瞄改瞄啊！";
	}
}
```
### 5.3 配置通知类
```java
/**
 * 定义切面
 * 
 * @Aspect : 标记为切面类
 * @Pointcut : 指定匹配切点
 * @Before : 指定前置通知，value中指定切入点匹配
 * @AfterReturning ：后置通知，具有可以指定返回值
 * @AfterThrowing ：异常通知
 * 
 * @author yanbin
 * 
 */
@Component
@Aspect
public class AspectAdvice {

    /**
     * 指定切入点匹配表达式，注意它是以方法的形式进行声明的。
     */
    @Pointcut("execution(* com.topvision.*..*.*(..))")
    public void anyMethod() {
    }

    /**
     * 前置通知
     * 
     * @param jp
     */
    @Before(value = "execution(* com.topvision.ssm.domian.Bussiness.delete(..))")
    public void doBefore(JoinPoint jp) {
        System.out.println("===========进入before advice============ \n");

        System.out.print("准备在" + jp.getTarget().getClass() + "对象上用");
        System.out.print(jp.getSignature().getName() + "方法进行对 '");
        System.out.print(jp.getArgs()[0] + "'进行删除！\n\n");

        System.out.println("要进入切入点方法了 \n");
    }

    /**
     * 后置通知
     * 
     * @param jp
     *            连接点
     * @param result
     *            返回值
     */
    @AfterReturning(value = "anyMethod()", returning = "result")
    public void doAfter(JoinPoint jp, String result) {
        System.out.println("==========进入after advice=========== \n");
        System.out.println("切入点方法执行完了 \n");

        System.out.print(jp.getArgs()[0] + "在");
        System.out.print(jp.getTarget().getClass() + "对象上被");
        System.out.print(jp.getSignature().getName() + "方法删除了");
        System.out.print("只留下：" + result + "\n\n");
    }

    /**
     * 环绕通知
     * 
     * @param pjp
     *            连接点
     */
    @Around(value = "anyMethod()")
    public void doAround(ProceedingJoinPoint pjp) throws Throwable {
        System.out.println("===========进入around环绕方法！=========== \n");

        // 调用目标方法之前执行的动作
        System.out.println("调用方法之前: 执行！\n");

        // 调用方法的参数
        Object[] args = pjp.getArgs();
        // 调用的方法名
        String method = pjp.getSignature().getName();
        // 获取目标对象
        Object target = pjp.getTarget();
        // 执行完方法的返回值：调用proceed()方法，就会触发切入点方法执行
        Object result = pjp.proceed();

        System.out.println("输出：" + args[0] + ";" + method + ";" + target + ";" + result + "\n");
        System.out.println("调用方法结束：之后执行！\n");
    }

    /**
     * 异常通知
     * 
     * @param jp
     * @param e
     */
    @AfterThrowing(value = "anyMethod())", throwing = "e")
    public void doThrow(JoinPoint jp, Throwable e) {
        System.out.println("删除出错啦");
    }

}
```
### 5.4 测试类（集成junit）

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations="classpath:applicationContext.xml")
public class Test01{
	
	@Autowired
	private Bussiness bs;
	
	@Test
	public void BSTest() {
		bs.delete("qwe");
	}
}
```
## 6. 切入点表达式及通知
### 6.1 切入点表达式
格式：execution(切入点表达式)
execution([方法的访问控制修饰符] 方法的返回值 包名.类名/接口名.方法名(参数)) 
注意：方法的访问控制修饰符可以省略
```xml
com.topvision.*.dao.UserDAO.add() com包下的topvision包下的任意包下的dao包下的...
 *..*.*()      任意包下的任意类中的任意方法
```
						
**方法参数**

 - add()		无参数
 - add(*)		一个参数
 - add(int)		一个int型参数
 - add(*,*)		两个参数
 - add(*,int)		两个参数，第一个任意，第二个int
 - add(..)		任意参数
 - add(*,..)		至少一个参数

### 6.2 通知类型

 1. 类型
before:在原始操作前运行
	after: 在原始操作后运行，无论方法是否抛出异常
	afterReturning:在原始操作后运行，只有方法正常结束才运行，抛出异常则不运行
	afterThrowing:在原始操作中如果抛出异常，运行
	around: 在原始操作前后运行，通过ProceedingJoinPoint对象调用procee()方法完成对原始操作的调用

 2. 格式
    ```xml
    <aop:before pointcut-ref="pt2" method="before"/> 
    <aop:after pointcut-ref="pt2" method="after"/> 
    <aop:after-returning pointcut-ref="pt2" method="afterReturning"/> 
    <aop:after-throwing pointcut-ref="pt2" method="afterThrowing"/> 
    <aop:around pointcut-ref="pt2" method="around"/>
    ```

### 6.3 获取通知参数
为环绕通知之外的通知方法定义形参**JoinPoint**，该参数必须是通知方法的第一个参数。
获取参数：Obejct[] args = jp.getArgs();	
范例：

```java
public void before(JoinPoint jp){	
	Object[] objs = jp.getArgs();
	System.out.println("before......"+objs[0]+","+objs[1]);
}
```
为环绕通知方法定义形参**ProceedingJoinPoint**对象
获取参数：Obejct[] args = pjp.getArgs();

 

### 6.4 获取通知返回值
afterReturning 与 around可以获取方法的返回值
    
- around通知获取返回值
**ProceedingJoinPoint**对象执行调用原始操作的返回值就是原始方法的运行返回值。

```java
Object res = pt.proceed(args);
```
注意：如果原始方法返回值为void类型，则around方法返回值设置为Object。如果原始方法返回值为非void类型，则around方法内必须将原始方法调用的结果返回。
原始方法返回值为void类型的，通知内获取的返回值统一为null。

```java
public Object around(ProceedingJoinPoint pjp) throws Throwable{
	Object res = pjp.proceed(args);
	return res;
}
```

- afterReturning通知获取返回值
在通知方法的参数中，声明一个Object类型的参数，用于保存方法的返回值

```java
public void afterReturning(JoinPoint jp,Object abc){
    System.out.println("afterReturning......"+ abc);
}
```
在配置文件中，为afterReturning声明保存返回值的变量名

### 6.5 获取异常值
异常对象的获取方式与返回值很相似，声明变量，在配置中声明保存异常对象的变量名。
```xml
<aop:after-throwing pointcut-ref="pt" method="afterThrowing" throwing="e"/>
```
```java
public void afterThrowing (Throwable e){
	System.out.println("afterThrowing......."+ e);
}
```

 
## 7. JDK代理与cglib代理





