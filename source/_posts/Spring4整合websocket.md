---
title: Spring4整合websocket
categories:
  - Websocket
tags:
  - Websocket
keyword:
  - websocket
  - Spring整合websocket
date: 2018-12-12 17:12:56
updated: 2018-12-12 17:12:56
---

 1. spring 4.0及以上增加了WebSocket的支持(这里使用4.2.5.RELEASE)。
 2. spring 支持STOMP协议的WebSocket通信。
 3. 应对不支持 WebSocket 的场景，许多浏览器不支持 WebSocket 协议；SockJS 是 WebSocket 技术的一种模拟。SockJS 会 尽可能对应 WebSocket API，但如果 WebSocket 技术 不可用的话，会从如下 方案中挑选最优可行方案：
    ```
    XHR streaming
    XDR streaming
    iFrame event source
    iFrame HTML file
    XHR polling
    XDR polling
    iFrame XHR polling
    JSONP polling
    ```
 4. WebSocket 是发送和接收消息的 底层API，而SockJS 是在 WebSocket 之上的 API；最后 STOMP（面向消息的简单文本协议）是基于 SockJS 的高级API。
 5. SockJS 所处理的URL 是 “http:” 或 “https:” 模式 
 6. WebSocket 所处理的URL 是“ws:” or “wss:” 模式

<!--more-->

下面我们来建立一个websocket实例

## 1、创建web工程

首先搭建一个简单可访问的web系统，这里提供一个我自己搭建的[SSM框架][2]供使用。


## 2、导入spring-websocket需要的jar
{% fold 点击显/隐内容 %}
```xml
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-websocket</artifactId>
    <version>${spring.version}</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-messaging</artifactId>
    <version>${spring.version}</version>
</dependency>

<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
</dependency>

<dependency>
    <groupId>org.codehaus.jackson</groupId>
    <artifactId>jackson-mapper-asl</artifactId>
    <version>1.9.13</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.8.0</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.8.0</version>
</dependency>
```
{% endfold %}

## 3、创建Websocket处理器

可以扩展 AbstractWebSocketHandler ,也可以扩展TextWebSocketHandler(文本处理器)，TextWebSocketHandler 继承 AbstractWebSocketHandler

**TestWebsocketHandler**
{% fold 点击显/隐内容 %}
```java
package com.websocket;

import java.io.IOException;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.PongMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

/**
 * 〈websocket处理类〉
 *
 * @author xiaoyue
 * @create 2018/12/11 15:17
 * @since 1.0.0
 */
public class TestWebsocketHandler extends TextWebSocketHandler {

    private Logger logger = LoggerFactory.getLogger(TextWebSocketHandler.class);

    private static final ArrayList<WebSocketSession> sessions;// 这个会出现性能问题，最好用Map来存储，key用userid
    static {
        sessions = new ArrayList<WebSocketSession>();
    }

    // 接收文本消息，并发送出去
    // js调用websocket.send时候，会调用该方法
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        super.handleTextMessage(session, message);
        TextMessage returnMessage = new TextMessage(message.getPayload() + " received at server");
        // session.sendMessage(returnMessage);
        sendMessageToUsers(returnMessage);
    }

    // 连接建立后处理
    @SuppressWarnings("unchecked")
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("connect to the websocket success......当前数量:" + sessions.size());
        // 处理离线消息
    }

    // 抛出异常时处理
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        if (session.isOpen()) {
            session.close();
        }
        logger.debug("websocket chat connection closed......");
        sessions.remove(session);
    }

    // 连接关闭后处理
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
        logger.debug("websocket chat connection closed......");
        String username = (String) session.getAttributes().get("WEBSOCKET_USERNAME");
        System.out.println("用户" + username + "已退出！");
        sessions.remove(session);
        System.out.println("剩余在线用户" + sessions.size());
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

    @Override
    protected void handlePongMessage(WebSocketSession session, PongMessage message) throws Exception {
        super.handlePongMessage(session, message);
    }

    /**
     * 给某个用户发送消息
     *
     * @param userName
     * @param message
     */
    public void sendMessageToUser(String userName, TextMessage message) {
        for (WebSocketSession user : sessions) {
            if (user.getAttributes().get("WEBSOCKET_USERNAME").equals(userName)) {
                try {
                    if (user.isOpen()) {
                        user.sendMessage(message);
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
                break;
            }
        }
    }

    /**
     * 给所有在线用户发送消息
     *
     * @param message
     */
    public void sendMessageToUsers(TextMessage message) {
        for (WebSocketSession user : sessions) {
            try {
                if (user.isOpen()) {
                    user.sendMessage(message);
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```
{% endfold %}

## 4、创建WebSocket握手拦截器

**TestHandshakeInterceptor**
{% fold 点击显/隐内容 %}
```java
package com.websocket;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

/**
 * 〈握手（handshake）接口〉
 *
 * @author xiaoyue
 * @create 2018/12/11 15:18
 * @since 1.0.0
 */
public class TestHandshakeInterceptor extends HttpSessionHandshakeInterceptor {

    // 常用在注册用户信息，绑定WebSocketSession，在handler里根据用户信息获取WebSocketSession发送消息
    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception {
        System.out.println("Before Handshake");
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            HttpSession session = servletRequest.getServletRequest().getSession(false);
            if (session != null) {
                // 使用userName区分WebSocketHandler，以便定向发送消息
                String userName = (String) session.getAttribute("SESSION_USERNAME");
                if (userName == null) {
                    userName = "default-system";
                }
                attributes.put("WEBSOCKET_USERNAME", userName);
            }
        }
        return super.beforeHandshake(request, response, wsHandler, attributes);
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
            Exception ex) {
        System.out.println("After Handshake");
        super.afterHandshake(request, response, wsHandler, ex);
    }

}
```
{% endfold %}

## 5、创建Websocket配置文件

采用注解的方式。

**WebSocketConfig**
{% fold 点击显/隐内容 %}
```java
package com.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

/**
 * 〈WebSocket入口〉
 *
 * @author xiaoyue
 * @create 2018/12/11 15:37
 * @since 1.0.0
 */
@Configuration
// @EnableWebMvc//这个标注可以不加，如果有加，要extends WebMvcConfigurerAdapter
@EnableWebSocket
public class WebSocketConfig extends WebMvcConfigurerAdapter implements WebSocketConfigurer {

    // 注册处理器，绑定对应的url
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.out.println("==========================注册socket");
        String websocket_url = "/websocket/socketServer.do";
        registry.addHandler(testWebSocketHandler(), websocket_url).addInterceptors(testHandshakeInterceptor());
        String sockjs_url = "/sockjs/socketServer.do";
        registry.addHandler(testWebSocketHandler(), sockjs_url).addInterceptors(testHandshakeInterceptor())
                .withSockJS();
    }

    @Bean
    public WebSocketHandler testWebSocketHandler() {
        return new TestWebsocketHandler();
    }

    @Bean
    public TestHandshakeInterceptor testHandshakeInterceptor() {
        return new TestHandshakeInterceptor();
    }

}
```
{% endfold %}

## 5、创建Controller,控制页面跳转

**WebsocketController**
{% fold 点击显/隐内容 %}
```java
package com.websocket;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.socket.TextMessage;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

/**
 * 〈〉
 *
 * @author xiaoyue
 * @create 2018/12/11 16:38
 * @since 1.0.0
 */
@Controller
public class WebsocketController {
    @Bean // 这个注解会从Spring容器拿出Bean
    public TestWebsocketHandler infoHandler() {
        return new TestWebsocketHandler();
    }

    @RequestMapping("/websocket/login")
    public ModelAndView login(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String username = request.getParameter("username");
        System.out.println(username + "登录");
        HttpSession session = request.getSession(false);
        session.setAttribute("SESSION_USERNAME", username);
        // response.sendRedirect("/quicksand/jsp/websocket.jsp");
        return new ModelAndView("websocket");
    }

    @RequestMapping("/websocket/send")
    @ResponseBody
    public String send(HttpServletRequest request) {
        String username = request.getParameter("username");
        infoHandler().sendMessageToUser(username, new TextMessage("你好，测试！！！！"));
        return null;
    }
}
```
{% endfold %}

## 6、测试页面

登录页面，**index.jsp**

```jsp
<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<body>
<h2>Hello World!</h2>
<body>
<form action="/websocket/login.do">
    登录名：<input type="text" name="username"/>
    <input type="submit" value="登录"/>
</form>
</body>
</body>
</html>
```

消息发送接收页面 **websocket.jsp**

{% fold 点击显/隐内容 %}
```jsp
<%@ page language="java" contentType="text/html; charset=utf-8"
         pageEncoding="utf-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Java API for WebSocket (JSR-356)</title>
</head>
<body>
<script type="text/javascript" src="http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js"></script>
<script type="text/javascript" src="http://cdn.bootcss.com/sockjs-client/1.1.1/sockjs.js"></script>
<script type="text/javascript">
    var websocket = null;
    if ('WebSocket' in window) {
        //Websocket的连接
        websocket = new WebSocket("ws://localhost:8080/websocket/socketServer.do");//WebSocket对应的地址
    }
    else if ('MozWebSocket' in window) {
        //Websocket的连接
        websocket = new MozWebSocket("ws://localhost:8080/ws/websocket/socketServer.do");//SockJS对应的地址
    }
    else {
        //SockJS的连接
        websocket = new SockJS("http://localhost:8080/ws/sockjs/socketServer.do");    //SockJS对应的地址
    }
    websocket.onopen = onOpen;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
    websocket.onclose = onClose;

    function onOpen(openEvt) {
        //alert(openEvt.Data);
    }

    function onMessage(evt) {
        alert(evt.data);
    }
    function onError() {
    }
    function onClose() {
    }

    function doSend() {
        if (websocket.readyState == websocket.OPEN) {
            var msg = document.getElementById("inputMsg").value;
            websocket.send(msg);//调用后台handleTextMessage方法
            alert("发送成功!");
        } else {
            alert("连接失败!");
        }
    }

    window.close = function () {
        websocket.onclose();
    }
</script>
请输入：<textarea rows="3" cols="100" id="inputMsg" name="inputMsg"></textarea>
<button onclick="doSend();">发送</button>
</body>
```
{% endfold %}

## 注意事项

 1. 因为是基于Spring注解，所以要将以上websocket的三个文件添加到Spring的扫描路径中。
 2. 建议所有的servlet和filter都要加`<async-supported>true</async-supported>`，支持异步处理。



 


  [1]: asd
  [2]: https://github.com/kevinXiao2016/ssm
