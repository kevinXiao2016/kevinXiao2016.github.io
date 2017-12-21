---
title: Struts2(4)——数据封装和类型转换
categories:
  - Struts2
tags:
  - Struts2
date: 2017-12-21 10:10:28
---

![数据封装][1]
<!--more-->

## 数据封装

### 静态参数封装

 1. 静态参数即在action中固定不变的参数，在struts.xml中配置action时赋值。

    ```xml
    <package name="login" namespace="/" extends="struts-default">
    	<action name="loginTest" class="com.topvision.s2sm.login.action.LoginAction" method="loginTest">
    		<param name="username">xiaoyue</param>
    		<param name="password">123456</param>
    		<result>/WEB-INF/jsp/login/login.jsp</result>
    	</action>
    </package>
    ```

 2. 在action中创建对应属性，提供getter和setter方法。

    ```java
    @Controller
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public class LoginAction extends BaseAction{
        private static final long serialVersionUID = -4442251270114214406L;
        private String username;
        private String password;
        
        public String loginTest() {
            System.out.println(username);
            System.out.println(password);
            return SUCCESS;
        }
        
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public String getPassword() {
            return password;
        }
        public void setPassword(String password) {
            this.password = password;
        }
    }
    ```
输出结果
    ```java
    xiaoyue
    123456
    ```
    
静态参数封装依赖的是静态参数拦截器staticParams。
![staticParams][2]
该拦截器会将静态参数放入值栈中，而action就在值栈中的栈顶，自然就会找到该action中的对应属性，然后进行赋值了。想查看源码，参考该篇博文：[struts2 18拦截器详解(十四) --- StaticParametersInterceptor][3]

### 动态参数封装

属性驱动和模型驱动都非常重要，都需要掌握，如果还不会ognl表达式，那么可以在学完ognl表达后在回过头来看即可。

#### 属性驱动

 1. 基本属性驱动

    表单：
    ```jsp
    <form action="aaa/loginTest.tv" method="post">
    	<input type="text" name="username">
    	<button type="submit">提交</button>
    </form>  
    ```
    action：提供对应属性及getter和setter方法
    ```java
    private String username;
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    ```
    
    依赖params拦截器注入数据
    ![params][4]
    该拦截器做的事有两件，一是对提交的参数进行数据校验，判断是否合法，判断是否合法的标准就是拦截器中的excludeParams参数的正则表达式的值。二是将其封装到值栈中的栈顶元素中去，而当前action就在栈顶，所以能够将参数放入action中。通过查看[struts2 18拦截器详解(十五) --- ParametersInterceptor][5]来了解其源码 。
    
 2. ognl属性驱动

    表单，封装对象
    ```jsp
    <form action="aaa/loginTest.tv" method="post">
    	姓名：<input type="text" name="user.username"><br>
    	年龄：<input type="text" name="user.age"><br>
    	<button type="submit">提交</button>
    </form>
    ```
    创建JavaBean对象
    ```java
    public class User implements Serializable {
        private static final long serialVersionUID = 4340332295972232437L;
        private String username;
        private int age;
        public String getUsername() {
            return username;
        }
        public void setUsername(String username) {
            this.username = username;
        }
        public int getAge() {
            return age;
        }
        public void setAge(int age) {
            this.age = age;
        }
    }
    ```
    Action接收：创建对象，提供getter和setter
    ```java
    private User user = new User();
    
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
    ```
    
    在jsp页面中的user.username和user.age其实就是ognl表达式，代表着往根(root，值栈valueStack)中存放值，而值栈中的栈顶元素也就是为当前action，我们在action中设置user的get、set属性，即可以让存进来的值匹配到，进而将对应属性赋值成功。
 
#### 模型驱动

 实现ModelDriven接口，提供一个方法getModel()，编写对象实例。
 
 jsp表单：
```jsp
<form action="aaa/loginTest.tv" method="post">
    姓名：<input type="text" name="user.username"><br>
    年龄：<input type="text" name="user.age"><br>
    <button type="submit">提交</button>
</form> 
```

Action类实现ModelDriven接口，提供getModel()方法
```java
private User user = new User();
    
@Override
public User getModel() {
    return null;
}
```

分析：这有一个专门的拦截器，叫做modelDriven。
![modelDriven][6]
源码分析：[struts2 18拦截器详解(十) --- ModelDrivenInterceptor][7]
其实原理就是，该拦截器将getModel方法返回的结果压入值栈，而我们的表单参数会从值栈中从上往下进行查找，自然就直接将参数封装到User对象中了。


## 类型转换

从表单元素提交过来的都是String类型的，而我们在servlet中获取到表单元素后，得到的是Object类型，也就是需要我们自己手动转型，但是在struts2中，我们却不需要，是因为有这么一个机制，参数类型自动转型，获取过来的参数都是String类型的，但是如果我们需要int型，double型等，都会帮我们自己转换。

这里需要注意一点，在使用struts2中的日期自动转型时，表单中的日期字符串的格式是固定的，必须是2014-12-06，也就是yyyy-mm-dd这样的格式，其他格式的话，不能够转型成功，这对有些人来说，就有些不舒服，使用习惯不一样，但是没关系，struts2能够让我们自定义类型转换器，格式让我们自己来决定。

例如：表单输入**2013-12-23**，接收date为**Tue Dec 23 00:00:00 CST 2014**

### 自定义类型转换器

 1. 编写转换器类继承StrutsTypeConverter,实现两个抽象方法

    ```java
    public class DateConverter extends StrutsTypeConverter{
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        /* 
         * context:struts2的数据中心
         * values:输入的数据
         * toClass:要转换成的类型
         */
        @Override
        public Object convertFromString(Map context, String[] values, Class toClass) {
            if (values != null && values.length > 0) {
                String value = values[0];
                if (toClass == Date.class) {
                    try {
                        return sdf.parse(value);
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }
                }
            }
            return null;
        }
    
        @Override
        public String convertToString(Map context, Object o) {
            if (o != null && o.getClass() == Date.class) {
                return sdf.format(o);
            }
            return null;
        }
    
    }
    ```

 2. 注册类型转换器
 
    ![转换器位置说明][8]

    2.1 注册局部转换器
    
    在需要转换的Action同级目录，创建一个properties.
    位置：action类同包
    名称：actionClass-conversion.properties
    actionClass:action类的类名
    conversion.properties：固定名
    
    文件内容：
    ```properties
    date = com.topvision.s2sm.plantform.converter.DateConverter
    ```
    
    2.2 注册全局转换
    
    在src下创建一个properties。
    位置：src
    名称：xwork-conversion.properties 固定写法
    文件内容：
    ```properties
    java.util.date = com.topvision.s2sm.plantform.converter.DateConverter
    ```
    

 


  [1]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/dataTransform.png
  [2]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/staticParam.png
  [3]: http://blog.csdn.net/xtayfjpk/article/details/14133589
  [4]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/params.png
  [5]: http://blog.csdn.net/xtayfjpk/article/details/14180981
  [6]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/modelDriven.png
  [7]: http://blog.csdn.net/xtayfjpk/article/details/14004457
  [8]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/struts/conversion.png