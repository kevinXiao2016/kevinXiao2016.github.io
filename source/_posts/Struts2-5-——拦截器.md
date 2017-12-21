---
title: Struts2(5)——拦截器
categories:
  - Struts2
tags:
  - Struts2
date: 2017-12-21 15:41:25
---

## 1、简介

struts2中很多的核心功能都是拦截器完成的。比如：params(封装动态参数)、staticParams（静态参数封装）、i18n(国际化)、modelDrivern（模型驱动）、servletConfig（注入servletAPI）等。
<font color="red">作用：在执行动作前或后进行拦截</font>
<!-- more -->

```xml
<default-interceptor-ref name="defaultStack"/>
```
```xml
<interceptor-stack name="defaultStack">
    <interceptor-ref name="exception"/>
    <interceptor-ref name="alias"/>
    <interceptor-ref name="servletConfig"/>
    <interceptor-ref name="i18n"/>
    <interceptor-ref name="prepare"/>
    <interceptor-ref name="chain"/>
    <interceptor-ref name="scopedModelDriven"/>
    <interceptor-ref name="modelDriven"/>
    <interceptor-ref name="fileUpload"/>
    <interceptor-ref name="checkbox"/>
    <interceptor-ref name="datetime"/>
    <interceptor-ref name="multiselect"/>
    <interceptor-ref name="staticParams"/>
    <interceptor-ref name="actionMappingParams"/>
    <interceptor-ref name="params"/>
    <interceptor-ref name="conversionError"/>
    <interceptor-ref name="validation">
        <param name="excludeMethods">input,back,cancel,browse</param>
    </interceptor-ref>
    <interceptor-ref name="workflow">
        <param name="excludeMethods">input,back,cancel,browse</param>
    </interceptor-ref>
    <interceptor-ref name="debugging"/>
    <interceptor-ref name="deprecation"/>
</interceptor-stack>
```

## 2、运作图
![此处输入图片的描述][1]

结论：
    动作方法执行前：拦截器会按照顺序依次进行拦截
    执行动作方法
    返回结果视图
拦截器会按照原来的顺序的相反顺序再次进行拦截

执行过程中：ActionInvocation保存了需要用到的数据


## 3、自定义拦截器
熟悉拦截器的体系：所有的拦截器都直接或间接的实现了Interceptor接口

![此处输入图片的描述][2]

### 3.1 创建拦截器类，继承AbstractInterceptor或实现Interceotor

```java
public class MyInterceptor extends AbstractInterceptor {

    private static final long serialVersionUID = -828084112876621948L;

    @Override
    public String intercept(ActionInvocation invocation) throws Exception {
        System.out.println("MyInterceptor拦截前");
        String invoke = invocation.invoke();//放行
        System.out.println("MyInterceptor拦截后");
        return invoke;
    }
}
```
    
### 3.2 注册拦截器

在struts.xml中注册拦截器，可以针对单个action配置，也可全局配置
    

 1. 针对单个action配置

    首先在package中声明拦截器
    ```xml
    <interceptors>
    		<interceptor name="myInterceptor" class="com.topvision.s2sm.plantform.interceptor.MyInterceptor"></interceptor>
    </interceptors>
    ```
    然后在action中声明引用该拦截器
    ```xml
    <action name="loginTest" class="com.topvision.s2sm.login.action.LoginAction" method="loginTest">
		<!-- 
			如果没有声明拦截器，默认使用struts-default.xml中的defaultStack
			如果声明了，则defaultStack失效
		 -->
		<interceptor-ref name="myInterceptor"></interceptor-ref>
		<result>/WEB-INF/jsp/login/login.jsp</result>
		<result name="input">/error.jsp</result>
	</action>
    ```
    但是一般不用这种，因为Struts2有这么一种机制，一旦为Action指定了拦截器，那么就不会再为这个Action执行默认拦截器了，即defaultStack这个拦截器栈中的拦截器都不会执行，也就是说，这个Action没有输入校验、没有参数注入、没有国际化、没有…，这是不行的，所以我们需要在这个<action>元素中再引用defaultStack拦截器栈。
    
 2. 全局配置（常用）

    创建一个拦截器栈，包含默认拦截器栈和自定义拦截器。

    ```xml
    <package name="default" extends="struts-default">
    	<interceptors>
	    	<!-- 自定义拦截器 -->
    		<interceptor name="myInterceptor" class="com.topvision.s2sm.plantform.interceptor.MyInterceptor"></interceptor>
    		<!-- 自定义拦截器栈 -->
    		<interceptor-stack name="myStack">
    			<interceptor-ref name="defaultStack"/>
    			<interceptor-ref name="myInterceptor"/>
    		</interceptor-stack>
    	</interceptors>
    	<!-- 指定默认拦截器 -->
    	<default-interceptor-ref name="myStack"></default-interceptor-ref>
    ```

## 4、MethodFilterInterceptor

是AbstractInterceptor的子类：
setIncludeMethods(String includeMethods):设置需要拦截的方法，多个方法用逗号分隔
setExcludeMethods(String excludeMethods):设置不需要拦截的方法，多个方法用逗号分隔

 
```java
public class MethodInterDemo extends MethodFilterInterceptor{

    private static final long serialVersionUID = -9060068603523571867L;
    
    @Override
    protected String doIntercept(ActionInvocation invocation) throws Exception {
        //拦截前操作
        String invoke = invocation.invoke();
        //拦截后操作
        return invoke;
    }

}
```

配置xml
```xml
<package name="default" extends="struts-default">
	<interceptors>
    	<!-- 自定义拦截器 -->
		<interceptor name="myInterceptor" class="com.topvision.s2sm.plantform.interceptor.MyInterceptor"></interceptor>
		<interceptor name="methodInterceptor" class="com.topvision.s2sm.plantform.interceptor.MethodInterDemo"></interceptor>
		
		<!-- 自定义拦截器栈 -->
		<interceptor-stack name="myStack">
			<interceptor-ref name="defaultStack"/>
			<interceptor-ref name="myInterceptor"/>
			<interceptor-ref name="methodInterceptor"/>
		</interceptor-stack>
	</interceptors>
	<!-- 指定默认拦截器 -->
	<default-interceptor-ref name="myStack"></default-interceptor-ref>

</package>
```

设置指定action

```xml
<package name="login" namespace="/" extends="default">
	<action name="loginTest" class="com.topvision.s2sm.login.action.LoginAction" method="loginTest">
		<interceptor-ref name="myStack">
			<!-- 设置不需要methodInterDemo拦截的方法 -->
			<param name="methodInterDemo.excludeMethods">loginTest</param>
			<!-- 设置需要methodInterDemo拦截的方法 -->
			<param name="methodInterDemo.includeMethods">aaa</param>
		</interceptor-ref>
		
		<result>/WEB-INF/jsp/login/login.jsp</result>
		<result name="input">/error.jsp</result>
	</action>
</package>
```

 

 
  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/struts2.png
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/Interceptor.png