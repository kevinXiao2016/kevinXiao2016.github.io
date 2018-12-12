---
title: WebSocket简介
categories:
  - WebSocket
tags:
  - WebSocket
keyword:
  - WebSocket
date: 2018-12-12 10:24:13
updated: 2018-12-12 10:24:13
---

## 1、前言

Websocket是随HTML5一起来的新的应用层协议，它是基于TCP的一种新的网络协议。它实现了浏览器与服务器全双工(full-duplex)通信——允许服务器主动发送信息给客户端。

![此处输入图片的描述][1]

<!--more-->

## 2、Websocket原理

有兴趣的可以看下下面这个回答，来自知乎，比较生动有趣
[WebSocket 是什么原理？为什么可以实现持久连接？][2]

websocket与socket有什么区别呢？引用下面的一段话：

    软件通信有七层结构，下三层结构偏向与数据通信，上三层更偏向于数据处理，中间的传输层则是连接上三层与下三层之间的桥梁，每一层都做不同的工作，上层协议依赖与下层协议。基于这个通信结构的概念。
    
    Socket 其实并不是一个协议，是应用层与 TCP/IP 协议族通信的中间软件抽象层，它是一组接口。当两台主机通信时，让 Socket 去组织数据，以符合指定的协议。TCP 连接则更依靠于底层的 IP 协议，IP 协议的连接则依赖于链路层等更低层次。

    WebSocket 则是一个典型的应用层协议。

    总的来说：Socket 是传输控制层协议，WebSocket 是应用层协议。


## 3、客户端API

websocket的API，可以参看[HTML5 WebSocket][3]。

API比较简单，重点是接下来的如何应用到我们的程序中。


## 4、服务端的实现

WebSocket 服务器的实现，可以查看[维基百科的列表][4]。

因为我是一名Java后端程序猿，在这里记录下基于Java语言的具体实现方法。

[Tomcat8整合websocket][5]
[Spring4整合websocket][6]
[Springboot整合websocket][7]


  [1]: http://pj973z6ct.bkt.clouddn.com/websocket.png
  [2]: https://www.zhihu.com/question/20215561/answer/40316953
  [3]: http://www.runoob.com/html/html5-websocket.html
  [4]: https://en.wikipedia.org/wiki/Comparison_of_WebSocket_implementations
  [5]: https://www.greateman.top/Tomcat8%E6%95%B4%E5%90%88websocket.html
  [6]: https://www.greateman.top/Spring4%E6%95%B4%E5%90%88websocket.html
  [7]: https://www.cnblogs.com/eleven24/p/8680714.html