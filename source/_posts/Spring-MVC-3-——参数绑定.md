---
title: Spring MVC(3)——参数绑定
categories:
  - Java
  - Spring
tags:
  - SpringMVC
date: 2018-03-06 16:13:28
---
springmvc接收请求的key/value串（比如：id=2&type=101），经过类型转换，将转换后的值赋值给controller方法的形参，这个过程就叫参数绑定。

<!--more-->

## 1、默认支持的类型

在controller方法形参中如下类型是可以直接绑定成功，springmvc框架给以下类型的参数直接赋值：

 - **HttpServletRequest**：通过request对象获取请求信息
 - **HttpServletResponse**：通过response处理响应信息
 - **HttpSession**：通过session对象得到session中存放的对象
 - **Model/ModelMap**：ModelMap是Model接口的实现类，通过Model或ModelMap向页面传递数据，如下：
 
    ```java
    //调用service查询商品信息
    Items item = itemService.findItemById(id);
    model.addAttribute("item", item);
    ```
    页面通过${item.XXXX}获取item对象的属性值。
    使用Model和ModelMap的效果一样，如果直接使用Model，springmvc会实例化ModelMap。

## 2、基本类型

基本类型类型：Integer、string、boolean、float。。。

绑定规则：

 1. 对于基本类型参数绑定，当请求的参数的名称和controller方法的形参名一致时可以绑定成功。
 2. 如果请求的参数的名称和controller方法的形参名不一致时，如何绑定？
    就要使用@RequestParam进行绑定：

    使用方法如下：
    @RequestParam(value="ids") Integer id,将请求的参数名为ids的值绑定方法形参的id上。
    **required**：是否必须，默认是true，表示请求中一定要有相应的参数，否则将报；TTP Status 400 - Required Integer parameter 'XXXX' is not present;
    **defaultValue**：默认值，表示如果请求中没有同名参数时的默认值


## 3、简单pojo

简单pojo：pojo中都基本类型，没有包括自定义pojo属性。

页面参数名称的定义：

```html
<tr>
    <td>名称</td>
    <td><input type="text" name="name" value="${item.name}"/></td>
</tr>
<tr>
    <td>价格</td>
    <td><input type="text" name="price" value="${item.price}"/></td>
</tr>
```

controller方法的参数定义：

```java
@RequestMapping("editItem")
public ModelAndView editItem(Item item) throws Exception {
```
当页面参数名称和controller方法的pojo的参数的属性名一致，可以将请求的参数绑定到pojo形参的属性中。

## 4、包装类pojo

包装类型pojo：pojo中属性也是一个pojo。

页面请求参数名称定义：

```html
<tr>
    <td>名称</td>
    <td><input type="text" name="item.name"/></td>
</tr>
<tr>
    <td><input type="submit" value="查询"/></td>
</tr>
```

controller方法形参的定义：

```java
@RequestMapping(/queryItems)
public ModelAndView queryItems(ItemsQueryVo itemsQueryVo) throws Exception {
```

包装类型的pojo绑定规则：
item是包装pojo(ItemsQueryVo)的属性名。
item.name中name就是包装pojo(ItemsQueryVo)中属性item的一个属性。

## 5、数组

需求： 在商品查询列表页面批量选择商品进行删除。

页面要提交多个商品id，controller方法使用数组接收页面提交的参数。
页面参数名称定义：

```html
<c:forEach var="item" items="${itemsList}">
    <tr>
        <td><input type="checkbox" name="delete_id" value="${item.id}"></td>
        <td><input type="checkbox" name="delete_id" value="${item.id}"></td>
        <td><input type="checkbox" name="delete_id" value="${item.id}"></td>
        <td><input type="checkbox" name="delete_id" value="${item.id}"></td>
    </tr>
</c:forEach>
```

controller方法形参数定义：

```java
@RequestMapping(/deleteItems)
public ModelAndView queryItems(Integer[] delete_id) throws Exception {
```

绑定规则：
如果请求多个参数且名称一致，可以绑定到和请求参数名一致的数组中。

## 6、List<pojo>

需求：
实现商品信息批量修改功能，类似功能有成绩录入，一次录入好多门成绩，执行批量提交。

页面参数名称定义：

```html
<td><input type="text" name="itemsList[${status.index}].name"/></td>
<td><input type="text" name="itemsList[${status.index}].prive"/></td>
<td><input type="text" name="itemsList[${status.index}].createtime"/></td>
```

controller方法形参数定义:

```java
@RequestMapping(/queryItems)
public ModelAndView queryItems(ItemsQueryVo itemsQueryVo) throws Exception {
```

itemsQueryVo定义：

```java
public class ItemsQueryVo {

    private List<Item> itemsList;
```

## 7、自定义参数绑定

问题：
页面输入 2020-12-12 12:12:12(年月日时分秒)，springmvc默认提供年月日的绑定，没有对时分秒进行绑定。

解决问题：
需要自定义参数绑定器，实现将页面输入年月日 时分秒全部转成日期类型数据。

自定义参数绑定器方法：
自定义参数绑定器实现Conver<S,T>，S表示源类型，T表示目标类型，S是页面请求的参数类型，即string，目标类型是要绑定到pojo的属性的类型，上边的例子T目标类型就是：Items中createtime属性类型即java.util.Date

开发自定义参数绑定器：

```java
public class DateConver implements Converter<String, Date> {

    @Override
    public Date convert(String paramS) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        try {
            return sdf.parse(paramS);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }
    }

}
```

在springmvc.xml中在处理器适配器上配置参数绑定器：

```xml
<!-- 简写 -->
<mvc:annotation-driven conversion-service="conversionService"/>

<bean id="conversionService" class="org.springframework.format.support.FormattingConversionServiceFactoryBean">
	<property name="converters">
		<list>
			<bean class="com.topvision.ssm.DateConver"></bean>
		</list>
	</property>
</bean>
```