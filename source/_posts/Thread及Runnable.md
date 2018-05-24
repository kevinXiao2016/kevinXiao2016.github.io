---
title: Thread及Runnable
categories:
  - 并发
tags:
  - Java
  - 并发
date: 2017-09-30 09:22:54
updated: 2018-05-04 16:27:21
---

本文简单介绍了多线程的基本概念、基于Thread和Runnable实现多线程编程及简单的线程安全问题示例。
<!--more-->

# 1 概述

## 1.1 进程与线程

 - 进程是正在执行的程序    JVM是一个进程.
 - 线程进程中用于控制程序执行的控制单元(执行路径)
 - 进程中至少有一个线程,对于JVM,启动时至少有两个线程:JVM的主线程和JVM的垃圾回收线程

## 1.2 并行与并发

 - 并行就是两个任务同时运行，就是甲任务进行的同时，乙任务也在进行。(需要多核CPU)
 - 并发是指两个任务都请求运行，而处理器只能按受一个任务，就把这两个任务安排轮流进行，由于时间间隔较短，使人感觉两个任务都在运行。

## 1.3 基本实现方式

### 1.3.1 继承Thread类覆盖run方法

```java
package com.topvision.thread;

public class ThreadDemo1 {
	public static void main(String[] args) {
		Demo1 d1 = new Demo1();
		d1.start();
		for (int i = 0; i < 60; i++) {
			System.out.println(Thread.currentThread().getName() + i);
		}
	}
}

class Demo1 extends Thread {
	@Override
	public void run() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + i);
		}
	}
}
```

### 1.3.2 实现Runnable接口实现run方法

```java
public class ThreadDemo1 {
	public static void main(String[] args) {
		Thread d2 = new Thread(new Demo2());
		d2.start();
		for (int i = 0; i < 60; i++) {
			System.out.println(Thread.currentThread().getName() + i);
		}
	}
}
class Demo2 implements Runnable {

	@Override
	public void run() {
		for (int i = 0; i < 10; i++) {
			System.out.println(Thread.currentThread().getName() + i);
		}
	}
}
```

## 1.4 继承Thread与实现Runnable的区别

 - 查看源码的区别:
	* a.继承Thread : 由于子类重写了Thread类的run(), 当调用start()时, 直接找子类的run()方法
	* b.实现Runnable : 构造函数中传入了Runnable的引用, 成员变量记住了它, start()调用run()方法时内部判断成员变量Runnable的引用是否为空, 不为空编译时看的是Runnable的run(),运行时执行的是子类的run()方法
 - 继承Thread
	* 好处是:可以直接使用Thread类中的方法,代码简单
	* 弊端是:如果已经有了父类,就不能用这种方法
 - 实现Runnable接口
	* 好处是:即使自己定义的线程类有了父类也没关系,因为有了父类也可以实现接口,而且接口是可以多实现的
	* 弊端是:不能直接使用Thread中的方法需要先获取到线程对象后,才能得到Thread的方法,代码复杂

# 2 基本API

与人有生老病死一样，线程也同样要经历开始（等待）、运行、挂起和停止四种不同的状态。这四种状态都可以通过Thread类中的方法进行控制。下面给出了Thread类中和这四种状态相关的方法。

 1. 开始线程
 
    publicvoid start( );
    publicvoid run( );

 2. 挂起和唤醒线程
 
    publicvoid resume( );     // 不建议使用
    publicvoid suspend( );    // 不建议使用
    publicstaticvoid sleep(long millis);
    publicstaticvoid sleep(long millis, int nanos);

 3. 终止线程
 
    publicvoid stop( );       // 不建议使用
    publicvoid interrupt( );

 4. 得到线程状态
 
    publicboolean isAlive( );
    publicboolean isInterrupted( );
    publicstaticboolean interrupted( );

 5. join方法
 
    publicvoid join( ) throws InterruptedException;

线程在建立后并不马上执行run方法中的代码，而是处于等待状态。线程处于等待状态时，可以通过Thread类的方法来设置线程不各种属性，如线程的优先级（setPriority）、线程名(setName)和线程的类型（setDaemon）等。

当调用start方法后，线程开始执行run方法中的代码。线程进入运行状态。可以通过Thread类的isAlive方法来判断线程是否处于运行状态。当线程处于运行状态时，isAlive返回true，当isAlive返回false时，可能线程处于等待状态，也可能处于停止状态。

一但线程开始执行run方法，就会一直到这个run方法执行完成这个线程才退出。但在线程执行的过程中，可以通过两个方法使线程暂时停止执行。这两个方法是suspend和sleep。在使用suspend挂起线程后，可以通过resume方法唤醒线程。而使用sleep使线程休眠后，只能在设定的时间后使线程处于就绪状态（在线程休眠结束后，线程不一定会马上执行，只是进入了就绪状态，等待着系统进行调度）。

## 2.1 设置及获取线程名字

 1. 构造方法中传入名字 new Thread("张三"){}
 2. 线程对象设置名字  thread.setName()
 3. 线程对象获取名字  thread.getName()  Thread.currentThread().hetName()

## 2.2 休眠线程Sleep

1. sleep方法有两个重载形式，其中一个重载形式不仅可以设毫秒，而且还可以设纳秒(1,000,000纳秒等于1毫秒)。但大多数操作系统平台上的Java虚拟机都无法精确到纳秒，因此，如果对sleep设置了纳秒，Java虚拟机将取最接近这个值的毫秒。

2. 在使用sleep方法时必须使用throws或try{…}catch{…}。因为run方法无法使用throws，所以只能使用try{…}catch{…}。当在线程休眠的过程中，使用interrupt方法中断线程时sleep会抛出一个InterruptedException异常。sleep方法的定义如下：

        publicstaticvoid sleep(long millis) throws InterruptedException
        publicstaticvoid sleep(long millis, int nanos) throws InterruptedException
        
## 2.3 守护线程Daemon

**setDaemon(), 设置一个线程为守护线程, 该线程不会单独执行, 当其他非守护线程都执行结束后, 自动退出	**

```java
public class ThreadDemo4 {
	/**
	 * @param args
	 * 守护线程
	 */
	public static void main(String[] args) {
		Thread t1 = new Thread() {
			public void run() {
				for (int i = 0; i < 10; i++) {
					System.out.println(getName() + "...aaaaaaaaaaaaaaaaaaaa");
				}
			}
		};

		Thread t2 = new Thread() {
			public void run() {
				for (int i = 0; i < 5000; i++) {
					System.out.println(getName() + "...bb" + i);
				}
			}
		};

		t2.setDaemon(true); // 设置为守护线程

		t1.start();
		t2.start();
	}
}
```

## 2.4 加入线程Join

join方法的功能就是使异步执行的线程变成同步执行。也就是说，当调用线程实例的start方法后，这个方法会立即返回，如果在调用start方法后后需要使用一个由这个线程计算得到的值，就必须使用join方法。如果不使用join方法，就不能保证当执行到start方法后面的某条语句时，这个线程一定会执行完。而使用join方法后，直到这个线程退出，程序才会往下执行。下面的代码演示了join的用法。

## 2.5 礼让线程Yield

Thread.yield()方法作用是：暂停当前正在执行的线程对象，并执行其他线程。
yield()应该做的是让当前运行线程回到可运行状态，以允许具有相同优先级的其他线程获得运行机会。因此，使用yield()的目的是让相同优先级的线程之间能适当的轮转执行。但是，实际中无法保证yield()达到让步目的，因为让步的线程还有可能被线程调度程序再次选中。
 
结论：yield()从未导致线程转到等待/睡眠/阻塞状态。在大多数情况下，yield()将导致线程从运行状态转到可运行状态，但有可能没有效果。

## 2.6 设置线程优先级Priority

setPriority不一定起作用的，在不同的操作系统不同的jvm上，效果也可能不同。现在很多jvm的线程的实现都使用的操作系统线程，设置优先级也是使用的操作系统优先级，java层面有10个优先级别，假设操作系统只有3个优先级别，那么jvm可能将1-4级映射到操作系统的1级，5-7级映射到操作系统的2级，剩下的映射到3级，这样的话，在java层面，将优先级设置为5,6,7，其实本质就是一样的了。

另外，操作系统也不能保证设置了优先级的线程就一定会先运行或得到更多的CPU时间。
在实际使用中，不建议使用该方法

# 3 同步

* 当多线程并发, 有多段代码同时执行时, 我们希望某一段代码执行的过程中CPU不要切换到其他线程工作. 这时就需要同步.
* 如果两段代码是同步的, 那么同一时间只能执行一段, 在一段代码没执行结束之前, 不会执行另外一段代码.

## 3.1 同步代码块

* 使用synchronized关键字加上一个锁对象来定义一段代码, 这就叫同步代码块
* 多个同步代码块如果使用相同的锁对象, 那么他们就是同步的

```java
public class ThreadDemo6 {
	public static void main(String[] args) {
		Print p = new Print();
		new Thread(){
			public void run() {
				while (true) {
					p.print1();
				}
			}
		}.start();
		
		new Thread(){
			public void run() {
				while (true) {
					p.print2();
				}
			}
		}.start();
	}
}

class Print {

	public void print1() {
		synchronized (ThreadDemo6.class) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.out.println("鼎");
			System.out.println("点");
			System.out.println("视");
			System.out.println("讯");
		}
	}

	public void print2() {
		synchronized (ThreadDemo6.class) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
			System.out.println("T");
			System.out.println("O");
			System.out.println("P");
			System.out.println("V");
			System.out.println("I");
			System.out.println("S");
			System.out.println("I");
			System.out.println("O");
			System.out.println("N");
		}
	}
}
```

## 3.2 同步方法

* 使用synchronized关键字修饰一个方法, 该方法中所有的代码都是同步的
* 注意锁对象

```java
//同步方法，锁对象是this
public synchronized void print1() {
	System.out.println("鼎");
	System.out.println("点");
	System.out.println("视");
	System.out.println("讯");
}
```

```java
//静态同步方法，锁对象是字节码文件
public static synchronized void print1() {
	System.out.println("鼎");
	System.out.println("点");
	System.out.println("视");
	System.out.println("讯");
}
```

## 3.3 线程安全

* 多线程并发操作同一数据时, 就有可能出现线程安全问题
* 使用同步技术可以解决这种问题, 把操作数据的代码进行同步, 不要多个线程一起操作。

```java
package com.topvision.thread;

public class ThreadTicket1 {
	public static void main(String[] args) {
		/*new Ticket1().start();
		new Ticket1().start();
		new Ticket1().start();
		new Ticket1().start();*/
		Ticket2 t2 = new Ticket2();
		new Thread(t2).start();
		new Thread(t2).start();
		new Thread(t2).start();
		new Thread(t2).start();
	}
}

class Ticket1 extends Thread {
	private static int ticktets = 100;

	public void run() {
		while (true) {
			synchronized (Ticket1.class) {
				if (ticktets <= 0) {
					break;
				}
				System.out.println("这是第" + ticktets-- + "张票");
			}
		}

	}
}

class Ticket2 implements Runnable {
	private int ticktets = 100;

	@Override
	public void run() {
		// TODO Auto-generated method stub
		while (true) {
			synchronized (this) {
				if (ticktets <= 0) {
					break;
				}
				System.out.println("这是第" + ticktets-- + "张票");
			}
		}
	}

}
```

## 3.4 死锁

两个线程各自拥有对方需要的锁对象，等待对方释放，因此互相等待，程序卡死。
* 多线程同步的时候, 如果同步代码嵌套, 使用相同锁, 就有可能出现死锁
* 尽量不要嵌套使用

```java
package com.topvision.thread;


public class ThreadDemo8 {
	/**
	 * @param args
	 */
	private static String s1 = "筷子左";
	private static String s2 = "筷子右";

	public static void main(String[] args) {
		new Thread() {
			public void run() {
				while (true) {
					synchronized (s1) {
						System.out.println(getName() + "...获取" + s1 + "等待" + s2);
						synchronized (s2) {
							System.out.println(getName() + "...拿到" + s2 + "开吃");
						}
					}
				}
			}
		}.start();

		new Thread() {
			public void run() {
				while (true) {
					synchronized (s2) {
						System.out.println(getName() + "...获取" + s2 + "等待" + s1);
						synchronized (s1) {
							System.out.println(getName() + "...拿到" + s1 + "开吃");
						}
					}
				}
			}
		}.start();
	}
}
```








 
	
 
 
