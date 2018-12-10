---
title: volatile的实现原理
categories:
  - Java
  - 并发
tags:
  - Java
  - 并发
keyword:
  - 并发
  - 多线程
  - volatile
date: 2018-05-04 16:27:21
updated: 2018-05-04 16:27:21
---

## 1、特性

 1. 保证变量在线程之间的可见性
 2. 通过内存屏障来阻止指令重排，是happens-before规范的具体的一种实现
 3. 解决了long类型和double类型数据的8字节赋值问题

<!-- more -->

## 2、可见性

JMM(Java Memeory Model)是JVM定义的一种抽象规范，用来屏蔽不同硬件和操作系统的内存访问差异。

![此处输入图片的描述][1]

 - 主内存：简单理解为计算机当中的内存，但并不完全等同。被所有线程共享，存储着共享变量的“本尊”。
 - 工作内存：简单理解为计算机当中的CPU高速缓存，但又不完全等同。每一个线程拥有自己的工作内存，对于一个共享变量来说，工作内存当中存储了它的“副本”。
 
线程对共享变量的所有操作都必须在工作内存进行，不能直接读写主内存中的变量。不同线程之间也无法访问彼此的工作内存，变量值的传递只能通过主内存来进行。

当一个变量被volatile修饰后，表示着线程本地内存无效，当一个线程修改共享变量后他会立即被更新到主内存中，当其他线程读取共享变量时，它会直接从主内存中读取。 
当然，synchronize和锁都可以保证可见性。

## 3、有序性

在Java内存模型中，为了效率是允许编译器和处理器对指令进行重排序，当然重排序它不会影响单线程的运行结果，但是对多线程会有影响。

Java提供volatile来保证一定的有序性。最著名的例子就是单例模式里面的DCL（双重检查锁）。


**happen-before**

 1. 同一个线程中的，前面的操作happen-before后续的操作。（即单线程内按代码顺序执行。但是，在不影响在单线程环境执行结果的前提下，编译器和处理器可以进行重排序，这是合法的。换句话说，这一是规则无法保证编译重排和指令重排）。
 2. 监视器上的解锁操作 happen-before 其后续的加锁操作。（Synchronized 规则）
 3. 对volatile变量的写操作 happen-before 后续的读操作。（volatile 规则）
 4. 线程的start() 方法 happen-before 该线程所有的后续操作。（线程启动规则）
 5. 线程所有的操作 happen-before 其他线程在该线程上调用 join 返回成功后的操作。
 6. 如果 a happen-before b，b happen-before c，则a happen-before c（传递性）。

重点关注第3条，使用volatile修饰的变量，在指令重排时，会产生额外的lock前缀指令，也就是内存屏障。

![此处输入图片的描述][2]


## 4、局限性及使用场景

 - 局限性
    不能保证原子性
 - 场景
    运行结果并不依赖变量的当前值，或者能够确保只有单一的线程修改变量的值
    不参与多个volatile变量的不变约束。


## 参考

 1. [【死磕Java并发】-----深入分析volatile的实现原理][3]
 2. [漫画：什么是volatile关键字？（整合版）][4]

 
  
 


  [1]: http://mmbiz.qpic.cn/mmbiz_png/NtO5sialJZGricHmm50IzXNiaAMroheficIiaoP0yvpTjvtYXECkp5GNib77GCbu7s5ticlhJ7wP6icxHRbgVLmhKj1vAg/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1
  [2]: http://images2015.cnblogs.com/blog/381060/201702/381060-20170208174537963-1251333114.jpg
  [3]: https://www.cnblogs.com/chenssy/p/6379280.html
  [4]: https://mp.weixin.qq.com/s/DZkGRTan2qSzJoDAx7QJag