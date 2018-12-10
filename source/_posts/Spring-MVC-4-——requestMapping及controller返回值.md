---
title: Spring MVC(4)——requestMapping及controller返回值
categories:
  - Java
  - Spring
tags:
  - SpringMVC
date: 2018-03-06 16:14:21
---

集中参数绑定方式及返回值类型。
<!--more-->

## 1、RequestMapping

requestMapping注解的作用：对controller方法进行映射。

### 1.1 URL路径映射

requestMapping指定url，对controller方法进行映射。

```java
@RequestMapping("/queryBook")
public ModelAndView getBookById() {
```

### 1.2 窄化请求路径

为了更好的管理url，为了避免url冲突，可以在class上使用requestMapping指定根url。

```java
@Controller
@RequestMapping("/books")//指定请求根路径
public class Controller1 {
```

在开发时候，需要提前进行url规划，以避免后期修改url后，需要大量修改页面上的url地址。

### 1.3 请求方法限定

通过requestMapping限制http的请求方法，可以提高系统安全性。

```java
@RequestMapping(value="/queryBook",method={RequestMethod.GET,RequestMethod.POST})
public ModelAndView getBookById() {
```

## 2、Controller方法的返回值

### 2.1 返回ModelAndView

controller方法中定义ModelAndView对象并返回，对象中可添加model数据、指定逻辑视图名。

### 2.2 返回void

类似于原始servlet开发。

```java
@RequestMapping("/queryItemsReturnVoid")
public void queryItemsReturnVoid(HttpServletRequest request,HttpServletResponse response,Integer[] ids){
    List<Item> itemsList = itemService.findItemsList(ids);
    request.setAttribute("itemsList", itemsList);
    request.getRequestDispatcher("/WEB-INF/jsp/itemsList.jsp").forward(request, response);
}
```

响应结果的三种方法：

 1. 使用request转发页面，如下
 
    ```java
    request.getRequestDispatcher("页面路径").forward(request, response);
    ```

 2. 使用response页面重定向
 
    ```java
    response.sendRedirect("url")
    ```
    
 3. 通过response指定响应结果，如响应json数据

    ```java
    response.setCharacterEncoding("utf-8");
    response.setContentType("application/json;charset=utf-8");
    response.getWriter().write("json串");
    ```
    
### 2.3 返回String(推荐)

#### 2.3.1 页面转发方式

格式：forward:转发地址（不能写http://，只能写action的地址）
特点：转发的上一个请求request和要转发的地址共用request，转发后浏览器的地址是不变化。

```java
@RequestMapping(value="/queryBook",method={RequestMethod.GET,RequestMethod.POST})
public String getBookById() {

    Book book = bookService.findById(1000l);
    ModelAndView modelAndView = new ModelAndView();
    modelAndView.addObject("book", book);
    modelAndView.setViewName("bookDetail");
    return "forward:/books/queryItemsReturnVoid.do";
}

@RequestMapping("/queryItemsReturnVoid")
public void queryItemsReturnVoid(HttpServletRequest request,HttpServletResponse response,Integer[] ids) throws ServletException, IOException{
    //List<Item> itemsList = itemService.findItemsList(ids);
    request.setAttribute("itemsList", 111);
    request.getRequestDispatcher("/WEB-INF/jsp/itemsList.jsp").forward(request, response);
}
```

#### 2.3.2 页面重定向方式

格式是：redirect:重定向地址（比如：http://.....）
特点：重定的上一个请求request和要重定的地址不公用request，重定后浏览器的地址是变化的。

```java
@RequestMapping(value="/queryBook",method={RequestMethod.GET,RequestMethod.POST})
public String getBookById() {

    Book book = bookService.findById(1000l);
    ModelAndView modelAndView = new ModelAndView();
    modelAndView.addObject("book", book);
    modelAndView.setViewName("bookDetail");
    return "redirect:/books/queryItemsReturnVoid.do";
}

@RequestMapping("/queryItemsReturnVoid")
public void queryItemsReturnVoid(HttpServletRequest request,HttpServletResponse response,Integer[] ids) throws ServletException, IOException{
    //List<Item> itemsList = itemService.findItemsList(ids);
    request.setAttribute("itemsList", 111);
    request.getRequestDispatcher("/WEB-INF/jsp/itemsList.jsp").forward(request, response);
}
```

#### 2.3.3 表示逻辑视图名

返回一个string如果即不是转发格式，也不是重定向的格式，就表示一个逻辑视图名。

```java
@RequestMapping(value="/queryBook",method={RequestMethod.GET,RequestMethod.POST})
public String getBookById() {

    return "bookDetail";
}
```
