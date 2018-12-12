---
title: Tomcat8整合websocket
categories:
  - Websocket
tags:
  - Websocket
keyword:
  - websocket
  - tomcat整合websocket
date: 2018-12-12 16:31:39
updated: 2018-12-12 16:31:39
---

使用 tomcat8 开发 WebSocket 服务端非常简单，大致有如下两种方式。

 1. 使用注解方式开发，被 @ServerEndpoint 修饰的 Java 类即可作为 WebSocket 服务端
 2. 继承 Endpoint 基类实现 WebSocket 服务端

开发被 @ServerEndpoint 修饰的类之后，该类中还可以定义如下方法。

 - @OnOpen 修饰的方法：当客户端与该 WebSocket 服务端建立连接时激发该方法
 - @OnClose 修饰的方法：当客户端与该 WebSocket 服务端断开连接时激发该方法
 - @OnMessage 修饰的方法：当 WebSocket 服务端收到客户端消息时激发该方法
 - @OnError 修饰的方法：当客户端与该 WebSocket 服务端连接出现错误时激发该方法。

<!--more-->

下面将基于 WebSocket 开发一个多人实时聊天的程序，在这个程序中，每个客户所用的浏览器都与服务器建立一个 WebSocket，从而保持实时连接，这样客户端的浏览器可以随时把数据发送到服务器端；当服务器收到任何一个浏览器发送来的消息之后，将该消息依次向每个客户端浏览器发送一遍。

按如下步骤开发 WebSocket 服务端程序即可

 1. 定义 @OnOpen 修饰的方法，每当客户端连接进来时激发该方法，程序使用集合保存所有连接进来的客户端。
 2. 定义 @OnMessage 修饰的方法，每当该服务端收到客户端消息时激发该方法，服务端收到消息之后遍历保存客户端的集合，并将消息逐个发给所有客户端。
 3. 定义 @OnClose 修饰的方法，每当客户端断开与该服务端连接时激发该方法，程序将该客户端从集合中删除。


## 1、搭建web系统

首先搭建一个简单可访问的web系统，这里提供一个我自己搭建的[SSM框架][1]供使用。

使用Tomcat整合websocket，注入导入`javaee-api-7.0.jar`

```xml
<dependency>
    <groupId>javax</groupId>
    <artifactId>javaee-api</artifactId>
    <version>7.0</version>
</dependency>
```

## 2、创建Websocket服务端

**ChatEndpoint.java**
{% fold 点击显/隐内容 %}
```java
package com.websocket;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

/**
 * 〈Tomcat8整合WS〉
 *
 * @author xiaoyue
 * @create 2018/12/12 15:36
 * @since 1.0.0
 */
@ServerEndpoint(value = "/ws/chat")
public class ChatEndpoint {
	
    private static final String GUEST_PREFIX = "访客";
    private static final AtomicInteger connectionIds = new AtomicInteger(0);
    // 定义一个集合，用于保存所有接入的 WebSocket 客户端
    private static final Set<ChatEndpoint> clientSet = new CopyOnWriteArraySet<>();
    // 定义一个成员变量，记录 WebSocket 客户端的聊天昵称
    private final String nickname;
    // 定义一个成员变量，记录与 WebSocket 之间的会话
    private Session session;

    public ChatEndpoint() {
        nickname = GUEST_PREFIX + connectionIds.getAndIncrement();
    }

    // 当客户端连接进来时自动激发该方法
    @OnOpen
    public void start(Session session) {
        this.session = session;
        // 将 WebSocket 客户端会话添加到集合中
        clientSet.add(this);
        String message = String.format("[%s %s]", nickname, "加入了聊天室");
        // 发送消息
        broadcast(message);
    }

    // 当客户端断开连接时自动激发该方法
    @OnClose
    public void end() {
        clientSet.remove(this);
        String message = String.format("[%s %s]", nickname, "离开了聊天室!");
        // 发送消息
        broadcast(message);
    }

    // 每当收到客户端消息时自动激发该方法
    @OnMessage
    public void incoming(String message) {
        String filteredMessage = String.format("%s: %s", nickname, filter(message));
        // 发送消息
        broadcast(filteredMessage);
    }

    // 当客户端通信出现错误时激发该方法
    @OnError
    public void onError(Throwable t) throws Throwable {
        System.out.println("WebSocket 服务端错误" + t);
    }

    // 实现广播消息的工具方法
    private static void broadcast(String msg) {
        // 遍历服务器关联的所有客户端
        for (ChatEndpoint client : clientSet) {
            try {
                synchronized (client) {
                    // 发送消息
                    client.session.getBasicRemote().sendText(msg);
                }
            } catch (IOException e) {
                System.out.println("聊天错误，向客户端" + client + "发送消息出现错误。");
                clientSet.remove(client);
                try {
                    client.session.close();
                } catch (IOException el) {
                }

                String message = String.format("[%s %s]", client.nickname, "已经被断开了连接");
                broadcast(message);
            }
        }
    }

    // 定义一个工具方法，用于对字符串中的 HTML 字符标签进行转义
    private static String filter(String message) {
        if (message == null)
            return null;
        char content[] = new char[message.length()];
        message.getChars(0, message.length(), content, 0);
        StringBuilder result = new StringBuilder(content.length + 50);

        for (int i = 0; i < content.length; i++) {
            // 控制对尖括号等特殊字符转义
            switch (content[i]) {
            case '<':
                result.append("<");
                break;
            case '>':
                result.append(">");
                break;
            case '&':
                result.append("&");
                break;
            case '"':
                result.append("\"");
                break;
            default:
                result.append(content[i]);
            }
        }

        return (result.toString());
    }

}
```
{% endfold %}

需要说明的是，该 CharEndpoint 类并不是真正的 WebSocket 服务端，它只实现了 WebSocket 服务端的核心功能，Tomcat 会调用它的方法作为 WebSocket 服务端。因此，Tomcat 会为每个 WebSocket 客户端创建一个 ChatEndpoint 对象，也就是说，有一个 WebSocket 服务端，程序就有一个 ChatEndpoint 对象。所以上面程序中的 clientSet 集合保存了多个 ChatEndpoint 对象，其中每个 ChatEndpoint 对象对应一个 WebSocket 客户端。

## 3、创建JS客户端

chat.jsp
{% fold 点击显/隐内容 %}
```html
<%--
  Created by IntelliJ IDEA.
  User: Administrator
  Date: 2018/12/12
  Time: 15:47
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>Title</title>
</head>
<body>
<div style="width: 600px; height:240px;overflow-y: auto;border: 1px solid #333;" id="show">

</div>
<input type="text" size="80" id="msg" name="msg" placeholder="请输入聊天内容"/ >
<input type="button" value="发送" id="sendBtn" name="sendBtn" />
<br>

<script>
    window.onload = function() {
        // 创建 WebSocket 对象
        var webSocket = new WebSocket("ws://127.0.0.1:8080/ws/chat");
        var sendMsg = function() {
            var inputElement = document.getElementById('msg');
            // 发送消息
            webSocket.send(inputElement.value);
            // 清空单行文本框
            inputElement.value = "";
        };
        var send = function(event) {
            if (event.keyCode == 13) {
                sendMsg();
            }
        };

        webSocket.onopen = function() {
            console.log('WebSocket已经打开');
            // 为 onmessage 事件绑定监听器，接收消息
            webSocket.onmessage = function(event) {
                var show = document.getElementById('show');
                // 接收并显示消息
                show.innerHTML += event.data + "<br/>";
                show.scrollTop = show.scrollHeight;
            };
            document.getElementById('msg').onkeydown = send;
            document.getElementById('sendBtn').onclick = sendMsg;
        };
        webSocket.onclose = function() {
            // document.getElementById('msg').onkeydown = null;
            // document.getElementById('sendBtn').onclick = null;
            console.log('WebSocket已经被关闭');
        };
    }
</script>
</body>
</html>
```
{% endfold %}







  [1]: https://github.com/kevinXiao2016/ssm
