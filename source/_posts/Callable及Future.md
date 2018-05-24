---
title: Callable及Future
categories:
  - 并发
tags:
  - Java
  - 并发
keyword:
  - Callable
  - Future
date: 2017-10-12 11:13:54
updated: 2018-05-04 16:27:21
---
## 1. 概述
在线程池中执行任务，使用execute()方法，执行的是Runnable任务，它不返回任何值。如果希望任务完成后返回结果，那么需要使用Callable接口，这也是本文要研究的主题。

<!--more-->

```java
public class CallableTest {
	public static void main(String[] args) {
		Callable<Integer> callable = new Callable<Integer>() {
			@Override
			public Integer call() throws Exception {
				System.out.println("callable线程执行");
				return new Random().nextInt(100);
			}
		};

		ExecutorService executorService = Executors.newSingleThreadExecutor();
		Future<Integer> future = executorService.submit(callable);

		try {
			// 限定时间获取结果
			System.out.println(future.get(5, TimeUnit.SECONDS));
		} catch (TimeoutException e) {
			// 超时触发线程中止
			e.printStackTrace();
		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			// 抛出执行异常
			e.printStackTrace();
		} finally {
			// 如果任务还在运行，执行中断
			boolean mayInterruptIfRunning = true;
			future.cancel(mayInterruptIfRunning);
		}
	}
}
```

上面是callable和future的简单应用，执行时要求在限定时间内获取结果，超时执行会抛出TimeoutException，执行异常会抛出ExecutionException。最后在finally里，如果任务还在执行，就进行取消；如果任务已经执行完，取消操作也没有影响。

## 2. Callable接口

我们先回顾一下java.lang.Runnable接口，就声明了run(),其返回值为void，当然就无法获取结果了。
```java
public interface Runnable {  
    public abstract void run();  
} 
```
而callable的接口定义如下：
```java
public interface Callable<V> {   
      V   call()   throws Exception;   
} 
```
callable接口声明call()方法，有返回值，也可抛出异常，对该接口我们先了解这么多就行，下面我们来说明如何使用。

无论是Runnable接口的实现类还是Callable接口的实现类，都可以被ThreadPoolExecutor或ScheduledThreadPoolExecutor执行，ThreadPoolExecutor或ScheduledThreadPoolExecutor都实现了ExcutorService接口，而因此Callable需要和Executor框架中的ExcutorService结合使用，我们先看看ExecutorService提供的方法：
```java
<T> Future<T> submit(Callable<T> task);  
Future<?> submit(Runnable task);  
<T> Future<T> submit(Runnable task, T result);  
```

 - 第一个方法：submit提交一个实现Callable接口的任务，并且返回封装了异步计算结果的Future。
 - 第二个方法：submit提交一个实现Runnable接口的任务，并且返回封装了异步计算结果的Future。
 - 第三个方法：submit提交一个实现Runnable接口的任务，并且指定了在调用Future的get方法时返回的result对象。这个用的很少，因为是自己给定的返回结果，意义不大。

因此我们只要创建好我们的线程对象（实现Callable接口或者Runnable接口），然后通过上面3个方法提交给线程池去执行即可。
还有点要注意的是，除了我们自己实现Callable对象外，我们还可以使用工厂类Executors来把一个Runnable对象包装成Callable对象。Executors工厂类提供的方法如下：
```java
public static Callable<Object> callable(Runnable task)  
public static <T> Callable<T> callable(Runnable task, T result)  
```
 
## 3. Future接口
Future<V>接口是用来获取异步计算结果的，说白了就是对具体的Runnable或者Callable对象任务执行的结果进行获取(get()),取消(cancel()),判断是否完成等操作。我们看看Future接口的源码：
```java
public interface Future<V> {  
    boolean cancel(boolean mayInterruptIfRunning);  
    boolean isCancelled();  
    boolean isDone();  
    V get() throws InterruptedException, ExecutionException;  
    V get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException, TimeoutException;  
}  
```

方法解析：

 - get(): 获取异步执行的结果，如果没有结果可用，此方法会阻塞直到异步计算完成。
 - get(long timeout, TimeUnit unit):获取异步执行结果，如果没有结果可用，此方法会阻塞，但是会有时间限制，如果阻塞时间超过设定的timeout时间，该方法将抛出异常。
 - isDone():如果任务执行结束，无论是正常结束或是中途取消还是发生异常，都返回true。
 - isCancelled():如果任务完成前被取消，则返回true。
 - cancel():
    - 如果任务还没开始，执行cancel(...)方法将返回false
    - 如果任务已经启动，执行cancel(true)方法将以中断执行此任务线程的方式来试图停止任务，如果停止成功，返回true；当任务已经启动，执行cancel(false)方法将不会对正在执行的任务线程产生影响(让线程正常执行到完成)，此时返回false
    - 当任务已经完成，执行cancel(...)方法将返回false

通过方法分析我们也知道实际上Future提供了3种功能：
 1. 能够中断执行中的任务
 2. 判断任务是否执行完成
 3. 获取任务执行完成后额结果。

但是我们必须明白Future只是一个接口，我们无法直接创建对象，因此就需要其实现类FutureTask登场啦
     
## 4. FutureTask
            
-------------------------![此处输入图片的描述][1]--------------------------
FutureTask除了实现了Future接口外还实现了Runnable接口，因此FutureTask也可以直接提交给Executor执行。 当然也可以调用线程直接执行（FutureTask.run()）.


### 4.1 FutureTask的状态
```java
private volatile int state;
private static final int NEW          = 0;
private static final int COMPLETING   = 1;
private static final int NORMAL       = 2;
private static final int EXCEPTIONAL  = 3;
private static final int CANCELLED    = 4;
private static final int INTERRUPTING = 5;
private static final int INTERRUPTED  = 6;
```

FutureTask有7种状态，初始状态从NEW开始，状态转换路径可以归纳为图2所示。在后文的代码，会使用int的大小比较判断状态处于哪个范围，需要留意上面状态的排列顺序
![FutureTask的状态][2]
FutureTask的状态路径，取决于run和cancel的调用顺序，在后文分析时，对号入座这几条路径。

 1. NEW -> COMPLETING -> NORMAL 正常的流程
 2. NEW -> COMPLETING -> EXCEPTIONAL 异常的流程
 3. NEW -> CANCELLED 被取消流程
 4. NEW -> INTERRUPTING -> INTERRUPTED 被中断流程

### 4.2 FutureTask的变量
```java
private volatile int state;
/** The underlying callable; nulled out after running */
private Callable<V> callable;
/** The result to return or exception to throw from get() */
private Object outcome; // non-volatile, protected by state reads/writes
/** The thread running the callable; CASed during run() */
private volatile Thread runner;
/** Treiber stack of waiting threads */
private volatile WaitNode waiters;
```
state、runner、waiters三个变量没有使用原子类，而是使用Unsafe对象进行原子操作。代码中会见到很多形如compareAndSwap的方法，入门原理可以看[认识非阻塞的同步机制CAS][3]。

callable是要执行的任务，runner是执行任务的线程，outcome是返回的结果（正常结果或Exception结果）

```java
static final class WaitNode {
    volatile Thread thread;
    volatile WaitNode next;
    WaitNode() { thread = Thread.currentThread(); }
}
```

waiters的数据结构是WaitNode，保存了Thread和下个WaitNode的引用。waiters保存了等待结果的线程，每次操作只会增减头，所以是一个栈结构，详细见后文对get方法的分析。

### 4.3 FutureTask的创建
下面是FutureTask的两种创建方式：
```java
public FutureTask(Callable<V> callable) {
    if (callable == null)
        throw new NullPointerException();
    this.callable = callable;
    this.state = NEW;       // ensure visibility of callable
}

public FutureTask(Runnable runnable, V result) {
    this.callable = Executors.callable(runnable, result);
    this.state = NEW;       // ensure visibility of callable
} 
```

提交FutureTask到线程池的submit定义在AbstractExecutorService，根据入参的不同，有三个submit方法。下面以提交Callable为例：

```java
public <T> Future<T> submit(Callable<T> task) {
   if (task == null) throw new NullPointerException();
   RunnableFuture<T> ftask = newTaskFor(task);
   execute(ftask);
   return ftask;
}

protected <T> RunnableFuture<T> newTaskFor(Callable<T> callable) {    
   return new FutureTask<T>(callable);
}
```

FutureTask在newTaskFor创建，然后调用线程池的execute执行，最后返回Future。获取Future后，就可以调用get获取结果，或者调用cancel取消任务。

### 4.4 FutureTask的运行

FutureTask实现了Runnable，在线程池里执行时调用的方法是run。

```java
public void run() {
    //1
    if (state != NEW ||
        !UNSAFE.compareAndSwapObject(this, runnerOffset,null, Thread.currentThread()))
        return;
    //2
    try {
        Callable<V> c = callable;
        if (c != null && state == NEW) {
            V result;
            boolean ran;
            try {
                result = c.call();
                ran = true;
            } catch (Throwable ex) {
                result = null;
                ran = false;
                setException(ex);
            }
            if (ran)
                set(result);
        }
    } finally {
       //3
        runner = null;
        int s = state;
        if (s >= INTERRUPTING)
            handlePossibleCancellationInterrupt(s);
    }
}
```
标记1处检查FutureTask的状态，如果不是处于NEW，说明状态已经进入四条路径之一，也就没有必要继续了。如果状态是NEW，则将执行任务的线程交给runner。

标记2处开始正式执行任务，调用call方法获取结果，没有异常就算成功，最后执行set方法；出现异常就调用setException方法。

标记3处，无论任务执行是否成功，都需要将runner重新置为空。

```java
protected void set(V v) {
    if (UNSAFE.compareAndSwapInt(this, stateOffset, NEW, COMPLETING)) {
        outcome = v;
        UNSAFE.putOrderedInt(this, stateOffset, NORMAL); // final state
        finishCompletion();
    }
}

protected void setException(Throwable t) {
    if (UNSAFE.compareAndSwapInt(this, stateOffset, NEW, COMPLETING)) {
        outcome = t;
        UNSAFE.putOrderedInt(this, stateOffset, EXCEPTIONAL); // final state
        finishCompletion();
    }
}
```

任务执行成功与失败，分别对应NEW -> COMPLETING -> NORMAL和NEW -> COMPLETING -> EXCEPTIONAL两条路径。这里先将状态修改为中间状态，再对结果赋值，最后再修改为最终状态。

```java
private void finishCompletion() {
    // assert state > COMPLETING;
    for (WaitNode q; (q = waiters) != null;) {
        if (UNSAFE.compareAndSwapObject(this, waitersOffset, q, null)) {
            for (;;) {
                Thread t = q.thread;
                if (t != null) {
                    q.thread = null;
                    LockSupport.unpark(t);
                }
                WaitNode next = q.next;
                if (next == null)
                    break;
                q.next = null; // unlink to help gc
                q = next;
            }
            break;
        }
    }
    done();
    callable = null;        // to reduce footprint
}
```

最后调用finishCompletion执行任务完成，唤醒并删除所有在waiters中等待的线程。done方法是空的，供子类实现，最后callable也设置为空。

FutureTask还有个runAndReset，逻辑和run类似，但没有调用set方法来设置结果，执行完成后将任务重新初始化。

```java
protected boolean runAndReset() {
    if (state != NEW ||
        !UNSAFE.compareAndSwapObject(this, runnerOffset,
                                     null, Thread.currentThread()))
        return false;
    boolean ran = false;
    int s = state;
    try {
        Callable<V> c = callable;
        if (c != null && s == NEW) {
            try {
                c.call(); // don't set result
                ran = true;
            } catch (Throwable ex) {
                setException(ex);
            }
        }
    } finally {
        // runner must be non-null until state is settled to
        // prevent concurrent calls to run()
        runner = null;
        // state must be re-read after nulling runner to prevent
        // leaked interrupts
        s = state;
        if (s >= INTERRUPTING)
            handlePossibleCancellationInterrupt(s);
    }
    return ran && s == NEW;
}
```


### 4.5 FutureTask的取消

对于已经提交执行的任务，可以调用cancel执行取消。

```java
public boolean cancel(boolean mayInterruptIfRunning) {
   //1
    if (!(state == NEW &&
          UNSAFE.compareAndSwapInt(this, stateOffset, NEW,
              mayInterruptIfRunning ? INTERRUPTING : CANCELLED)))
        return false;
    try {    // in case call to interrupt throws exception
       //2
        if (mayInterruptIfRunning) {
            try {
                Thread t = runner;
                if (t != null)
                    t.interrupt();
            } finally { // final state
                UNSAFE.putOrderedInt(this, stateOffset, INTERRUPTED);
            }
        }
    } finally {
        finishCompletion();
    }
    return true;
}
```

标记1处判断任务状态，为NEW才能被取消。如果mayInterruptIfRunning是true，代表任务需要被中断，走NEW -> INTERRUPTING -> INTERRUPTED流程。否则代表任务被取消，走NEW -> CANCELLED流程。

标记2处理任务被中断的情况，这里仅仅是对线程发出中断请求，不确保任务能检测并处理中断，详细原理去看Java的中断机制。

最后调用finishCompletion完成收尾工作。

```java
public boolean isCancelled() {
    return state >= CANCELLED;
}
```
判断任务是否被取消，具体逻辑是判断state >= CANCELLED，包括了被中断一共两条路径的结果。

### 4.5 FutureTask获取结果
调用FutureTask的get方法获取任务的执行结果，可以阻塞直到获取结果，也可以限制范围时间内获取结果，否则抛出TimeoutException。
```java
public V get() throws InterruptedException, ExecutionException {
    int s = state;
    if (s <= COMPLETING)
        s = awaitDone(false, 0L);
    return report(s);
}

public V get(long timeout, TimeUnit unit)
    throws InterruptedException, ExecutionException, TimeoutException {
    if (unit == null)
        throw new NullPointerException();
    int s = state;
    if (s <= COMPLETING &&
        (s = awaitDone(true, unit.toNanos(timeout))) <= COMPLETING)
        throw new TimeoutException();
    return report(s);
}
```
get的核心实现调用了awaitDone，入参为是否开启时间限制和最大的等待时间。

```java
private int awaitDone(boolean timed, long nanos)
    throws InterruptedException {
    final long deadline = timed ? System.nanoTime() + nanos : 0L;
    WaitNode q = null;
    boolean queued = false;
    for (;;) {
        if (Thread.interrupted()) {
            removeWaiter(q);
            throw new InterruptedException();
        }

        int s = state;
        if (s > COMPLETING) {    //1
            if (q != null)
                q.thread = null;
            return s;
        }
        else if (s == COMPLETING) // cannot time out yet    //2
            Thread.yield();
        else if (q == null)     //3
            q = new WaitNode();
        else if (!queued)    //4
            queued = UNSAFE.compareAndSwapObject(this, waitersOffset,
                                                 q.next = waiters, q);
        else if (timed) {    //5
            nanos = deadline - System.nanoTime();
            if (nanos <= 0L) {
                removeWaiter(q);
                return state;
            }
            LockSupport.parkNanos(this, nanos);
        }
        else     //6
            LockSupport.park(this);
    }
}
```
awaitDone主要逻辑是一个无限循环，首先判断线程是否被中断，是的话移除waiter并抛出中断异常。接下来是一串if-else，一共六种情况。

 1. 判断任务状态是否已经完成，是就直接返回；
 2. 任务状态是COMPLETING，代表在set结果时被阻塞了，这里先让出资源；
 3. 如果WaitNode为空，就为当前线程初始化一个WaitNode；
 4. 如果当前的WaitNode还没有加入waiters，就加入；
 5. 如果是限定时间执行，判断有无超时，超时就将waiter移出，并返回结果，否则阻塞一定时间；
 6. 如果没有限定时间，就一直阻塞到下次被唤醒。
 
LockSupport是用来创建锁和其他同步类的基本线程阻塞原语。park和unpark的作用分别是阻塞线程和解除阻塞线程。

```java
private V report(int s) throws ExecutionException {
   Object x = outcome;
   if (s == NORMAL)
       return (V)x;
   if (s >= CANCELLED)
       throw new CancellationException();
   throw new ExecutionException((Throwable)x);
}
```

最后get调用report，使用outcome返回结果。

![此处输入图片的描述][4]

如果多个线程向同一个FutureTask实例get结果，但FutureTask又没有执行完毕，线程将会阻塞并保存在waiters中。待FutureTask获取结果后，唤醒waiters等待的线程，并返回同一个结果。


  [1]: http://upload-images.jianshu.io/upload_images/3294095-237f514c17eb5e4a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
  [2]: http://upload-images.jianshu.io/upload_images/3294095-66574ae94d956415.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240
  [3]: http://www.jianshu.com/p/e2179c74a2e4
  [4]: http://upload-images.jianshu.io/upload_images/3294095-123399195bd337cc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240