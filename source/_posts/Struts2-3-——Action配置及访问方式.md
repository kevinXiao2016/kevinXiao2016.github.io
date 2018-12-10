---
title: Struts2(3)——Action配置及访问方式
categories:
  - Java
  - Struts2
tags:
  - Struts2
date: 2017-12-21 09:51:14
---
Action类构建及访问方式。
<!-- more -->
## 1、如何编写动作类

 1. 普通POJO类做action(不推荐)
 2. 实现Action接口，重写excute方法(不推荐)
 3. 继承ActionSupport，写自己需要的方法。

## 2、如何访问动作类
struts.xml中action的配置。
```xml
<package name="login" namespace="/" extends="struts-default">
	<action name="loginTest" class="com.topvision.s2sm.login.action.LoginAction" method="loginTest">
		<result>/WEB-INF/jsp/login/login.jsp</result>
	</action>
</package>
```
 - package.name:包名，不能和其他package重复，唯一标识
 - package.namespace:命名空间，默认“”，优化访问路径
 - package.extends：自己写的package要继承struts-default这个包
 - action.name：动作的名称。让用户访问用的。
 - action.class：动作类的全名。
    有默认值的，这个默认值是：com.opensymphony.xwork2.ActionSupport,在struts-default.xml中有配置：<default-class-ref class="com.opensymphony.xwork2.ActionSupport" />
 - action.method：要执行的动作类中的动作方法。
    有默认值的，这个默认值是：public String execute()方法


如上会有一个缺点，就是每个方法都要在xml中配置一个action，较为麻烦。如何优化呢？有两个办法：动态方法调用和通配符。

 1. 通配符

    通配符使用的比较多，是人为的设置编码规则，体现出约定大于编码的规范。即action.name可以使用通配符星号(*)，在action.class、aciton.method、result.name处可以使用{n}方式匹配星号，举个例子就明白了。
    ```xml
    <action name="*_*" class="{1}" method="{2}">
        <result></result>
    </action>
    ```
    请求路径：..../userAction_add，{1}匹配第一个*,为userAction, {2}匹配第二个*，为add。

 2. 动态方法调用

    在struts.xml中开启动态方法的使用。struts.enable.DynamicMethodInvocation = true。
    ```xml
    <!-- 让struts2支持动态方法调用,可以使用通配符 -->
    <constant name="struts.enable.DynamicMethodInvocation" value="true" />
    ```
    那么就可以直接使用http://localhost:8080/xxx/xxxAction!add,直接调用xxxAction中的add方法了，并且在struts.xml中的action配置中，就不需要配置method属性的值了。这样做就解决了写死method值的问题

## 3、动作类生命周期

诞生：每次用户访问时。
活着：动作没有响应结束。
死亡：响应结束。

多例的；没有线程安全问题。（与struts1所不同的）。
因为动作类是一个非常普通的Java类，创建它需要消耗的资源可以省略不计。

## 4、动作类访问Servlet的API

 1. 实现xxxAware接口

    ServletContextAware, ServletRequestAware,ServletResponseAware,SessionAware.
    
    struts2提供了这四个Aware接口用于Action类的实现，从而注入对应的application、request、response，session。这和ActionContext一样是解耦的，即没有引入servlet相关的包，是在struts2内部的。
    
    通过XxxAware接口的实现，可以方便的获取web资源。
    
    ```java
    public class BaseAction extends ActionSupport implements SessionAware,ServletRequestAware, ServletResponseAware, ServletContextAware {
        private static final long serialVersionUID = -6318930077865937364L;
        protected Logger logger = LoggerFactory.getLogger(getClass());
        protected Map<String, Object> session;
        protected HttpServletRequest request;
        protected HttpServletResponse response;
        protected ServletContext context;
    
        @Override
        public void setSession(Map<String, Object> session) {
            this.session = session;
        }
    
        @Override
        public void setServletRequest(HttpServletRequest request) {
            this.request = request;
        }
    
        @Override
        public void setServletResponse(HttpServletResponse response) {
            this.response = response;
        }
    
        @Override
        public void setServletContext(ServletContext context) {
            this.context = context;
        }
    }
    ```

 2. 直接耦合构造

    ```java
    ServletContext servletContext = ServletActionContext.getServletContext();
    HttpServletRequest request = ServletActionContext.getRequest();
    HttpSession session = request.getSession();
    ```
 


