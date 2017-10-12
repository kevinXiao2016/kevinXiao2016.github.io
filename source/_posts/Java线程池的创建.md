---
title: Java线程池的创建
categories:
  - JavaSE
tags:
  - Java
  - 多线程
date: 2017-10-12 11:13:25
---
## 1. Executor框架

从JDK 1.5 开始，java.util.concurrent包中的Executor执行器将用来管理Thread对象，从而简化并发编程。

**Executor**是一套线程池管理框架，接口里只有一个方法execute，执行Runnable任务。
**ExecutorService**接口扩展了Executor，添加了线程生命周期的管理，提供任务终止、返回任务结果等方法。
**AbstractExecutorService**实现了ExecutorService，提供例如submit方法的默认实现逻辑。

然后到今天的主题**ThreadPoolExecutor**，继承了AbstractExecutorService，提供线程池的具体实现。

<!--more-->

## 2. ThreadPoolExecutor

### 2.1 构造

ThreadPoolExecutor的构造方法有四种，下面是参数最全的构造：

```java
public ThreadPoolExecutor(int corePoolSize, 
		int maximumPoolSize, 
		long keepAliveTime, 
		TimeUnit unit, 
		BlockingQueue<Runnable> workQueue, 
		ThreadFactory threadFactory,
        RejectedExecutionHandler handler) {
	
}
```

 - corePoolSize:线程池目标大小，即刚刚创建时的线程数
 - maximumPoolSize: 线程池的最大上限
 - keepAliveTime: 线程的存活时间，当线程池内的线程数量超过corePoolSize，超出存活时间的空闲线程就会被回收；
 - unit: 时间单位
 - workQueue: 缓存队列
 - threadFactory: 线程工厂
 - handler: 缓存队列饱和处理策略

### 2.2 定制线程池

ThreadPoolExecutor中有几个预先设置好的线程池，通过Executors的工厂方法创建。

#### 2.2.1 newFixedThreadPool

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }
```

newFixedThreadPool的corePoolSize和maximumPoolSize都设置为传入的固定数量，keepAliveTim设置为0。线程池创建后，线程数量将会固定不变，适合需要线程很稳定的场合。

#### 2.2.2 newSingleThreadExecutor

```java
public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }
```

newSingleThreadExecutor是线程数量固定为1的newFixedThreadPool版本，保证池内的任务串行。注意到返回的是FinalizableDelegatedExecutorService，来看看源码：

```java
static class FinalizableDelegatedExecutorService
    extends DelegatedExecutorService {
    FinalizableDelegatedExecutorService(ExecutorService executor) {
        super(executor);
    }
    protected void finalize() {
        super.shutdown();
    }
}
```
FinalizableDelegatedExecutorService继承了DelegatedExecutorService，仅仅在gc时增加关闭线程池的操作，再来看看DelegatedExecutorService的源码：

```java
static class DelegatedExecutorService extends AbstractExecutorService {
        private final ExecutorService e;
        DelegatedExecutorService(ExecutorService executor) { e = executor; }
        public void execute(Runnable command) { e.execute(command); }
        public void shutdown() { e.shutdown(); }
        public List<Runnable> shutdownNow() { return e.shutdownNow(); }
        public boolean isShutdown() { return e.isShutdown(); }
        public boolean isTerminated() { return e.isTerminated(); }
        ...
}
```
DelegatedExecutorService包装了ExecutorService，使其只暴露出ExecutorService的方法，因此不能再配置线程池的参数。本来，线程池创建的参数是可以调整的，ThreadPoolExecutor提供了set方法。使用newSingleThreadExecutor目的是生成单线程串行的线程池，如果还能配置线程池大小，那就没意思了。

Executors还提供了unconfigurableExecutorService方法，将普通线程池包装成不可配置的线程池。如果不想线程池被不明所以的后人修改，可以调用这个方法。

#### 2.2.3 newCachedThreadPool

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                  60L, TimeUnit.SECONDS,
                                  new SynchronousQueue<Runnable>());
}
```

newCachedThreadPool生成一个会缓存的线程池，线程数量可以从0到Integer.MAX_VALUE，超时时间为1分钟。线程池用起来的效果是：如果有空闲线程，会复用线程；如果没有空闲线程，会新建线程；如果线程空闲超过1分钟，将会被回收。

#### 2.2.4 newScheduledThreadPool

```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }
```
```java
public ScheduledThreadPoolExecutor(int corePoolSize) {
        super(corePoolSize, Integer.MAX_VALUE, 0, NANOSECONDS,
              new DelayedWorkQueue());
    }
```

newScheduledThreadPool将会创建一个可定时执行任务的线程池。这个不打算在本文展开，后续会另开文章细讲。

### 2.3 等待队列

看完上面四个预设置的线程池，回发现在构造中都有一个 **Queue** 参数。

线程池的大小或有限（newFixedThreadPool）、或几乎无限（newCachedThreadPool），但是系统资源是有限的，任务的处理速度总有可能比不上任务的提交速度。因此，可以为ThreadPoolExecutor提供一个阻塞队列来保存因线程不足而等待的Runnable任务，这就是BlockingQueue。

Executor提供了以下几种等待队列（部分）：

 - ArrayBlockingQueue：数组结构的阻塞队列
 - LinkedBlockingQueue：链表结构的阻塞队列
 - PriorityBlockingQueue：有优先级的阻塞队列
 - SynchronousQueue：不会存储元素的阻塞队列
 - DelayedWorkQueue

newFixedThreadPool和newSingleThreadExecutor在默认情况下使用一个**无界的LinkedBlockingQueue**。要注意的是，如果任务一直提交，但线程池又不能及时处理，等待队列将会无限制地加长，系统资源总会有消耗殆尽的一刻。所以，推荐使用有界的等待队列，避免资源耗尽。但解决一个问题，又会带来新问题：队列填满之后，再来新任务，这个时候怎么办？后文会介绍如何处理队列饱和。

newCachedThreadPool使用的SynchronousQueue十分有趣，看名称是个队列，但它却不能存储元素。要将一个任务放进队列，必须有另一个线程去接收这个任务，一个进就有一个出，队列不会存储任何东西。因此，SynchronousQueue是一种移交机制，不能算是队列。newCachedThreadPool生成的是一个没有上限的线程池，理论上提交多少任务都可以，使用SynchronousQueue作为等待队列正合适。

### 2.4 饱和策略

在上一小节中说道，等待队列不能无限制的增长，但若队列填满了该如何处理？此时就是饱和策略在发挥作用。ThreadPoolExecutor的饱和策略通过传入RejectedExecutionHandler来实现。如果没有为构造函数传入，将会使用默认的defaultHandler。

```java
private static final RejectedExecutionHandler defaultHandler = new AbortPolicy();
```

 - AbortPolicy

```java
public static class AbortPolicy implements RejectedExecutionHandler {
       public AbortPolicy() { }
       public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
           throw new RejectedExecutionException("Task " + r.toString() + " rejected from " + e.toString());
       }
   }
```

AbortPolicy是默认的实现，直接抛出一个RejectedExecutionException异常，让调用者自己处理。除此之外，还有几种饱和策略，来看一下

 - DiscardPolicy

```java
public static class DiscardPolicy implements RejectedExecutionHandler {
       public DiscardPolicy() { }
       public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
       }
   }
```
DiscardPolicy的rejectedExecution直接是空方法，什么也不干。如果队列满了，后续的任务都抛弃掉。

 - DiscardOldestPolicy

```java
public static class DiscardOldestPolicy implements RejectedExecutionHandler {
       public DiscardOldestPolicy() { }
       public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
           if (!e.isShutdown()) {
               e.getQueue().poll();
               e.execute(r);
           }
       }
   }
```

DiscardOldestPolicy会将等待队列里最旧的任务踢走，让新任务得以执行。

 - CallerRunsPolicy

```java
public static class CallerRunsPolicy implements RejectedExecutionHandler {
    public CallerRunsPolicy() { }
    public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
        if (!e.isShutdown()) {
            r.run();
        }
    }
}
```

CallerRunsPolicy它既不抛弃新任务，也不抛弃旧任务，而是直接在当前线程运行这个任务。当前线程一般就是主线程啊，让主线程运行任务，说不定就阻塞了。如果不是想清楚了整套方案，还是少用这种策略为妙。

### 2.5 ThreadFactory

每当线程池需要创建一个新线程，都是通过线程工厂获取。如果不为ThreadPoolExecutor设定一个线程工厂，就会使用默认的defaultThreadFactory：

```java
public static ThreadFactory defaultThreadFactory() {
    return new DefaultThreadFactory();
}
```
```java
static class DefaultThreadFactory implements ThreadFactory {
       private static final AtomicInteger poolNumber = new AtomicInteger(1);
       private final ThreadGroup group;
       private final AtomicInteger threadNumber = new AtomicInteger(1);
       private final String namePrefix;

       DefaultThreadFactory() {
           SecurityManager s = System.getSecurityManager();
           group = (s != null) ? s.getThreadGroup() :
                                 Thread.currentThread().getThreadGroup();
           namePrefix = "pool-" +
                         poolNumber.getAndIncrement() +
                        "-thread-";
       }

       public Thread newThread(Runnable r) {
           Thread t = new Thread(group, r,
                                 namePrefix + threadNumber.getAndIncrement(),
                                 0);
           if (t.isDaemon())
               t.setDaemon(false);
           if (t.getPriority() != Thread.NORM_PRIORITY)
               t.setPriority(Thread.NORM_PRIORITY);
           return t;
       }
   }
```

平时打印线程池里线程的name时，会输出形如pool-1-thread-1之类的名称，就是在这里设置的。这个默认的线程工厂，创建的线程是普通的非守护线程，如果需要定制，实现ThreadFactory后传给ThreadPoolExecutor即可。
 
 
[参考文章链接][1]
 
 


  [1]: http://www.jianshu.com/p/adbf37ef77bb