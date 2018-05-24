---
title: Quartz学习
categories:
  - 框架
tags:
  - quartz
keyword:
  - quartz
date: 2018-05-24 19:39:48
updated: 2018-05-24 19:39:48
---

Quartz是一个开源的作业调度框架，可以让计划的任务在一个预先设计好的日期和时间运行。Quartz可以用来创建简单或复杂的日程安排执行几十，几百，甚至是十万的作业数，支持集群。

<!--more-->

## 1、核心类简介

**调度器**：Scheduler 

quartz的核心大脑，调度中心，包含两个重要的组件：JobStore、ThreadPool

JobStore:存储器，用来存储运行时的信息，包括Trigger、JobDetail、Schduler、业务锁等，有以下几种实现：

 1. RAMJob（内存实现）
 2. JobStoreTX(JDBC实现，事务由quartz管理)
 3. JobStoreCMT(JDBC实现，事务由容器管理)
 4. ClusteredJobStore(集群实现)
 5. TerracottaJobStore(什么是Terractta)
    

**任务**：JobDetail & Job

JobDetail是任务的定义，而Job是任务的执行逻辑。在JobDetail里会引用一个Job Class定义，还有一个JobDetailMap存储结构。

Job是具体的任务执行逻辑，JobDetailMap是同一个JobDetail实例化的Job共享的存储器。

**触发器**：Trigger

定义Job何时执行，理解为定时触发，有以下几种实现：

 1. SimpleTrigger:指定从某一个时间开始，以一定的时间间隔（单位是毫秒）执行的任务。
 2. CalendarIntervalTrigger:类似于SimpleTrigger，指定从某一个时间开始，以一定的时间间隔执行的任务。 但是不同的是SimpleTrigger指定的时间间隔为毫秒，没办法指定每隔一个月执行一次（每月的时间间隔不是固定值），而CalendarIntervalTrigger支持的间隔单位有秒，分钟，小时，天，月，年，星期。
 3. DailyTimeIntervalTrigger:指定每天的某个时间段内，以一定的时间间隔执行任务。并且它可以支持指定星期。
 4. CronTrigger:适合于更复杂的任务，它支持类型于Linux Cron的语法（并且更强大）。基本上它覆盖了以上三个Trigger的绝大部分能力（但不是全部）—— 当然，也更难理解。

## 2、RAMJob方式的简单应用

```java
package com.topvision.quartz;

import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.SimpleTrigger;
import org.quartz.impl.StdSchedulerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.SimpleScheduleBuilder.simpleSchedule;
import static org.quartz.TriggerBuilder.newTrigger;

public class JdbcStoreTest {

    private static Logger logger = LoggerFactory.getLogger(JdbcStoreTest.class);

    public static void main(String[] args) throws SchedulerException {

        /*创建调度器*/
        Scheduler scheduler = new StdSchedulerFactory("quartz.properties").getScheduler();
        
        /*创建JobDetail*/
        JobDetail jobDetail = newJob(MyJob.class).withIdentity("jobkey1", "jobgroup").build();


        /*创建触发器*/
        SimpleTrigger trigger = newTrigger().withIdentity("trikey2", "trigroup")
                .startNow()
                .withSchedule(simpleSchedule().withIntervalInSeconds(3).withRepeatCount(3))
                .build();

        /*绑定*/
        scheduler.scheduleJob(jobDetail, trigger);

        /*开启*/
        scheduler.start();
        logger.info("启动时间：" + new Date());


        try {
            Thread.sleep(6*1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        scheduler.shutdown();

    }


}

```

```java
package com.topvision.quartz;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.SimpleDateFormat;
import java.util.Date;



public class MyJob implements Job {

    private Logger logger = LoggerFactory.getLogger(MyJob.class);

    public void execute(JobExecutionContext jobExecutionContext) throws JobExecutionException {
        System.out.println("MyJob  is start ..................");

        System.out.println("Hello quzrtz  " +
                new SimpleDateFormat("yyyy-MM-dd HH:mm:ss ").format(new Date()));

        System.out.println("MyJob  is end .....................");
    }
}

```


## 详细用法参考

 1. [Quartz学习——Quartz大致介绍——阿飞(dufyun)的博客][1]
 


  [1]: https://blog.csdn.net/u010648555/article/details/54863144
