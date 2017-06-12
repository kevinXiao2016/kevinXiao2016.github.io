---
title: SNMP学习总结(3)——SNMP4J
date: 2017-05-25 8:42:50
categories:
  - SNMP
tags:
  - snmp
  - network
  - snmp4j
---
这篇博客简要介绍了snmp4j协议栈的基本使用
<!-- more -->
## 1 snmp4j简介
　　SNMP4J是一个用Java来实现SNMP(简单网络管理协议)协议的开源项目.它支持以命令行的形式进行管理与响应。SNMP4J是纯面向对象设计与SNMP++(用C++实现SNMPv1/v2c/v3)相类似。
　　SNMP4J API 提供以下下特性：

         - 支持MD5和SHA验证，DES，3DES,AES128、AES192和AES256加密的SNMPv3。
         - 支持MPv1,MPv2C和MPv3，带执行的可阻塞的信息处理模块。
         - 全部PDU格式。
         - 可阻塞的传输拓扑。支持UPD、TCP、TLS 。
         - 可阻塞的超时模块。
         - 同步和异步请求。
         - 命令发生器以及命令应答器的支持。
         - 基于Apache license的开源免费。
         - JAVA 1.4.1或更高版本(2.0或更高版本需要jdk1.6及以上的支持)。
         - 基于LOG4J记录日志。
         - 使用GETBULK实现Row-based的有效的异步表格获取。
         - 支持多线程。
         
## 2 snmp4j重要的类及接口介绍
Snmp4j包中最重要的三个概念，也是三个类：**Snmp**、**Target**、**PDU**
### 2.1 Target类
#### 2.1.1 共有方法
　　Target表示被管理的设备。对于被管理的设备，我们关注它的Address,它所使用的的协议版本Version，访问它的用户名和密码，以及人为设置的跟他打交道的策略，比如超时时间、
重传次数等。所以有如下方法：

 - 设置或获取IP地址
```java
void setAddress（Address address）   
Address getAddress（）
```
 - 设置或获取协议版本
```java
void setVersion(int ver)
int getVersion()
```
 - 超时时间（单位：milliseconds）
```java
void   setTimeout(long out）
long getTimeout()
```
 - 重传次数
```java
void setRetries(int retries)
int getRetries()
```
 - PUD最大值
```java
void setMaxSizeRequestPDU(int max)
int getMaxSizeRequestPDU()
```

上面的方法对于snmp三个版本都是相同的，不同的在于安全方面。具体来说，Snmpv1，v2c采用共同体（community）方式，安全性很差；SnmpV3采用基于用户的安全（USM）方式，安全性能得到很大提高。

#### 2.1.2 communityTarget
对于Snmpv1，v2c，使用Target派生出一个子类CommunityTarget，增加了对Community的方法：
```java
void setMaxSizeRequestPDU(int max)
int getMaxSizeRequestPDU()
```
#### 2.1.3 UserTarget
对于SnmpV3，使用其子类UserTarget，增加了一些有关USM安全方面的设置，比如采用的安全模型、安全级别、访问该设备的用户名以及权威引擎ID（authoritative engine ID）：

 - 安全级别（支持三种安全级别）
```java
void setSecurityLevel(int level)
int   getSecurityLevel()
```
 - 访问用户名（该访问用户名称必须在设置USM的时候添加其相应的UsmUser）
```java
void setSecurityName(OctetString name)
OctetString   getSecurityName()
```
 - 安全模型（支持三种安全模型）
```java
void setSecurityModel(int model)
int   getSecurityModel()
```
 - 权威引擎ID（authoritative engine ID）
```java
void   setAuthoritativeEngineID(byte[] id)
byte[] getAuthoritativeEngineID（）
```

### 2.2 PDU类
　　PDU（协议数据单元），用来表示管理站跟代理站点进行通信的数据。包括PDU的类型、传输的数据集合、错误说明等。
　　该类是SNMP报文单元的抽象，其中PDU类适用于SNMPv1和SNMPv2c。ScopedPDU类继承于PDU类，适用于SNMPv3。
　　Snmp4j针对Snmp的各个版本，开发了三个有关PDU的类。PDU（针对Snmpv2c）、PDUv1（针对Snmpv1）、ScopedPDU（针对Snmpv3），但三个类除各自特别的一些参数外，都基本相同。所以Snmp4j在设计的时候，将PDU设计成另外两个的超类，使他们能够共享大部分功能。
　　
### 2.3 Snmp类
　　snmp类是SNMP4J的核心，它提供了发送和接收SNMP PDUs的方法，所有的SNMP PDU 类型都可以采用同步或者异步的方式被发送。
　　Snmp采用独立的传输协议，通过`TransportMapping`接口调用`addTransportMapping(TransportMapping transportMapping)`方法或者采用默认的构造函数来实现传输映射，以此来实现信息的传输。
　　




