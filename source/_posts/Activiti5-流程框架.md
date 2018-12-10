---
title: Activiti5 流程框架
categories:
  - Java
  - Activiti
tags:
  - activiti
date: 2017-11-23 17:00:30
---
工作流(Workflow)，就是“业务过程的部分或整体在计算机应用环境下的自动化”，它主要解决的是“使在多个参与者之间按照某种预定义的规则传递文档、信息或任务的过程自动进行，从而实现某个预期的业务目标，或者促使此目标的实现”。
<!--more-->

# 1 Activiti简介

Activiti5是由Alfresco软件在2010年5月17日发布的业务流程管理（BPM）框架，它是覆盖了业务流程管理、工作流、服务协作等领域的一个开源的、灵活的、易扩展的可执行流程语言框架。Activiti基于Apache许可的开源BPM平台，创始人Tom Baeyens是JBoss jBPM的项目架构师，它特色是提供了eclipse插件，开发人员可以通过插件直接绘画出业务流程图。

## 1.1 工作流引擎

这是Activiti的核心，负责生成流程运行时的各种实例及数据、监控和管理流程的运行。
  
## 1.2 BPMN2.0

业务流程建模与标注（Business Process Model and Notation，BPMN) ，描述流程的基本符号，包括这些图元如何组合成一个业务流程图（Business Process Diagram）

## 1.3 数据库

Activiti的后台是有数据库的支持，所有的表都以ACT_开头。第二部分是表示表的用途的两个字母标识。 用途也和服务的API对应。

 1. **ACT_RE_***: 'RE'表示repository。 这个前缀的表包含了流程定义和流程静态资源 （图片，规则，等等）。
 2. **ACT_RU_***: 'RU'表示runtime。 这些运行时的表，包含流程实例，任务，变量，异步任务，等运行中的数据。 Activiti只在流程实例执行过程中保存这些数据， 在流程结束时就会删除这些记录。 这样运行时表可以一直很小速度很快。
 3. **ACT_ID_***: 'ID'表示identity。 这些表包含身份信息，比如用户，组等等。
 4. **ACT_HI_***: 'HI'表示history。 这些表包含历史数据，比如历史流程实例， 变量，任务等等。
 5. **ACT_GE_***: 通用数据， 用于不同场景下。

### 1.3.1 资源库流程规则表

 1. act_re_deployment  部署信息表
 2. act_re_mode        流程设计模型部署表
 3. act_re_procdef     流程定义表

### 1.3.2 运行时数据库

 1. act_ru_execution    运行时流程执行实例表
 2. act_ru_identitylink 运行时流程人员表，主要存储任务节点与参与者的相关信息
 3. act_ru_task		    运行时任务节点表
 4. act_ru_variable	    运行时流程变量数据表

### 1.3.3 历史数据库表

 1. act_hi_actinst 		    历史节点表
 2. act_hi_attachment		历史附件表
 3. act_hi_comment		    历史意见表
 4. act_hi_identitylink		历史流程人员表
 5. act_hi_detail			历史详情表，提供历史变量的查询
 6. act_hi_procinst		    历史流程实例表
 7. act_hi_taskinst		    历史任务实例表
 8. act_hi_varinst		    历史变量表

### 1.3.4 组织机构表

 1. act_id_group		用户组信息表
 2. act_id_info		用户扩展信息表
 3. act_id_membership	用户与用户组对应信息表
 4. act_id_user		用户信息表

这四张表很常见，基本的组织机构管理，关于用户认证方面建议还是自己开发一套，组件自带的功能太简单，使用中有很多需求难以满足 。可以使shiro完成用户认证。

### 1.3.5 统用数据表

 1. act_ge_bytearray		二进制数据表
 2. act_ge_property		属性数据表存储整个流程引擎级别的数据,初始化表结构时，会默认插入三条记录

## 1.4 activiti.cfg.xml

Activiti核心配置文件，配置流程引擎创建工具的基本参数和数据库连接池参数。

定义数据库配置参数：

 - jdbcUrl: 数据库的JDBC URL。
 - jdbcDriver: 对应不同数据库类型的驱动。
 - jdbcUsername: 连接数据库的用户名。
 - jdbcPassword: 连接数据库的密码。

基于JDBC参数配置的数据库连接 会使用默认的MyBatis连接池。 下面的参数可以用来配置连接池（来自MyBatis参数）：

 - jdbcMaxActiveConnections: 连接池中处于被使用状态的连接的最大值。默认为10。
 - jdbcMaxIdleConnections: 连接池中处于空闲状态的连接的最大值。
 - jdbcMaxCheckoutTime: 连接被取出使用的最长时间，超过时间会被强制回收。 默认为20000（20秒）。
 - jdbcMaxWaitTime: 这是一个底层配置，让连接池可以在长时间无法获得连接时， 打印一条日志，并重新尝试获取一个连接。（避免因为错误配置导致沉默的操作失败）。 默认为20000（20秒）。


示例如下：

```xml
  	<bean name="processEngineConfiguration" class="org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration">
  		<property name="JdbcDriver" value="com.mysql.jdbc.Driver" />
  		<property name="JdbcUrl" value="jdbc:mysql://localhost:3306/activititest"/>
		<property name="JdbcUsername" value="root" />
		<property name="JdbcPassword" value="123" />
		<!-- 
			databaseSchemaUpdate：设置流程引擎启动和关闭时如何处理数据库表
			false（默认）:检查数据库表的版本和依赖库的版本，如果不一致就抛出异常
			true:构建流程引擎是执行检查，如果需要就更新，如果表不存在就创建
			create-drop：构建流程引擎是创建表，关闭时删除表  
		-->
		<property name="databaseSchemaUpdate" value="true" />
  	</bean>
```

关于c3p0、dbcp等数据库连接池配置请参看[spring(4)——持久层封装][1]

## 1.5 logging.properties

```xml
log4j.rootLogger=WARN, stdout
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%d %p [%c] - %m%n
```

更详细log4j说明请参看[log4j.properties配置详解与实例][2]
 
# 2 环境搭建

## 2.1 需求java环境

 1. JDK1.6或更高
 2. 支持的数据库有：h2, mysql, oracle, postgres, mssql, db2等。
 3. 支持activiti5运行的jar包
 4. 开发环境为Eclipse3.7或者以上版本,myeclipse为8.6版本

## 2.2 资源下载

activiti可以到[Activiti官方网站][3]下载得到。

百度网盘下载地址，5.22.0和6.0.0两个版本，还有eclipse插件。[百度网盘下载][4]

注意：安装插件后，在Windows->Preferences->Activiti->Save菜单下勾选保存时自动生成图片。

## 2.3 配置开发环境

### 2.3.1 添加jar包

在activiti-5.22.0→wars目录下是一些示例项目，解压activiti-rest项目，导入activiti-rest目录中WEB-INF\lib下所有jar包到classpath中。
注意还需要数据库连接驱动包，如Mysql还需要添加**mysql-connector-java.jar**。

### 2.3.2 初始化数据库

```java
@Test
public void createTable() {
    //1、创建流程引擎配置对象
	ProcessEngineConfiguration processEngineConfiguration = ProcessEngineConfiguration.createStandaloneProcessEngineConfiguration();
	//2、配置数据库
	processEngineConfiguration.setJdbcDriver("com.mysql.jdbc.Driver");
	processEngineConfiguration.setJdbcUrl("jdbc:mysql://localhost:3306/activititest");
	processEngineConfiguration.setJdbcUsername("root");
	processEngineConfiguration.setJdbcPassword("123");
	//3、设置建表策略
	processEngineConfiguration.setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_TRUE);
	//4、创建流程引擎对象
	ProcessEngine processEngine = processEngineConfiguration.buildProcessEngine();
	System.out.println("processEngine"+processEngine);
}
```
在Activiti中，在创建核心的流程引擎对象时会自动建表。如果程序正常执行，mysql会自动建库，然后创建23张表。

### 2.3.3 配置文件

在Actiiti5中定制流程必定会操作到数据库，如果都像上面那样写一大段代码会非常麻烦，所以我们可以把数据库连接配置写入配置文件。
  
在Activiti5的官方示例中并没有现成的配置文件，所以先得找到activiti-rest\WEB-INF\classes下有：**activiti-context.xml**：一个类似spring结构的配置文件，清空内容后改名为activiti.cfg.xml，用来做流程引擎的相关配置。

```xml
  	<bean name="processEngineConfiguration" class="org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration">
  		<property name="JdbcDriver" value="com.mysql.jdbc.Driver" />
  		<property name="JdbcUrl" value="jdbc:mysql://localhost:3306/activititest"/>
		<property name="JdbcUsername" value="root" />
		<property name="JdbcPassword" value="123" />
		<!-- 
			databaseSchemaUpdate：设置流程引擎启动和关闭时如何处理数据库表
			false（默认）:检查数据库表的版本和依赖库的版本，如果不一致就抛出异常
			true:构建流程引擎是执行检查，如果需要就更新，如果表不存在就创建
			create-drop：构建流程引擎是创建表，关闭时删除表  
		-->
		<property name="databaseSchemaUpdate" value="true" />
  	</bean>
```

Java代码如下：

```java
@Test
public void createTable2() {
	ProcessEngineConfiguration processEngineConfiguration = ProcessEngineConfiguration.createProcessEngineConfigurationFromResource("activiti.cfg.xml");
	ProcessEngine processEngine = processEngineConfiguration.buildProcessEngine();
}
```

# 3 核心API

## 3.1 ProcessEngine

 1. 在Activiti中最核心的类，其他的类都是由它而来。
 2. 产生方式
    2.1 方式一：最基础版本，见2.3.2小节
    2.2 方式二：配置文件+java代码，见2.3.3小节
    
    ```java
    @Test
    public void createTable3() {
    	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    }
    ```
    这种方式更加简单，会自动加载classpath下名为activiti.cfg.xml的文件。
 3. 产生各种service
 
    ```java
    //流程仓库业务类，管理流程定义、部署
    RepositoryService repositoryService = processEngine.getRepositoryService();
    //流程运行业务类，管理流程启动、推进、删除等操作
    RuntimeService runtimeService = processEngine.getRuntimeService();
    //流程任务类，管理具体的任务
    TaskService taskService = processEngine.getTaskService();
    //流程历史数据类
    HistoryService historyService = processEngine.getHistoryService();
    //流程用户业务类
    IdentityService identityService = processEngine.getIdentityService();
    ```
## 3.2 ReposityService

流程仓库业务类，仓库简单理解即流程定义文档的两个文件：bpmn文件和流程图片

 1. 产生流程部署配置对象，用来定义流程部署的相关参数

    ```
    @Test
    public void Demo1() {
    	DeploymentBuilder deploymentBuilder = processEngine.getRepositoryService().createDeployment().name("test");
    	deploymentBuilder.addClasspathResource("diagrams/HelloWord.bpmn");
    	deploymentBuilder.addClasspathResource("diagrams/HelloWord.png");
    	
    	Deployment deployment = deploymentBuilder.deploy();
    	System.out.println(deployment.getId() + "。。。。"+ deployment.getName());
    }
    ```
 2. 删除流程定义

    ```
    repositoryService.deleteDeployment(deploymentId);
    ```
 
## 3.3 RuntimeService

流程执行服务类。可以从这个类中获取很多关于流程执行相关的信息。

 1. 启动流程
 
    ```java
    //常用的启动流程实例的两种方法
    ProcessInstance processInstance = runtimeService.startProcessInstanceById(processInstanceId);
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(processInstanceKey);
    ```

## 3.4 TaskService

activiti的任务服务类。可以从这个类中获取任务的信息。

## 3.5 ProcessDefinition

流程定义类。可以从这里获得资源文件等。
每个流程文件唯一对应一个相同key的流程定义，只是流程定义的version不同

## 3.6 ProcessInstance

流程实例。根据流程定义实例化的具体流程，我们可以利用这个对象来了解当前流程实例的进度等信息。
如：
    公司有一个所有人通用的请假流程，这个叫做流程定义。
    小明今天请假，填写请假单，就是创建了一个流程实例。

```java
/** Represents one execution of a  {@link ProcessDefinition}.
 1. 
 2. @author Tom Baeyens
 3. @author Joram Barrez
 4. @author Daniel Meyer
 5. @author Tijs Rademakers
 */
public interface ProcessInstance extends Execution {
```

从上面可以看出ProcessInstance就是Execution，但实际有点区别

 1. 单线流程中，ProcessInstance与Execution是一致的，ID都一样
 2. 多线 流程中，总线路代表ProcessInstance，而分线路中每个活动代表Execution。

## 3.7 Execution

Activiti用这个对象去描述流程执行的每一个节点。在没有并发的情况下，同ProcessInstance。

# 4 流程定义

## 4.1 创建流程文件

在classpath下创建流程文件
![创建][5]
编辑流程文件
![编辑][6]

## 4.2 部署流程定义

部署流程定义可以看成是添加流程定义
```java
@Test
public void deploy() {
    //创建流程引擎
    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    //创建流程部署对象
    DeploymentBuilder deploymentBuilder = processEngine.getRepositoryService().createDeployment();
    //读取文件部署流程
    Deployment deploy = deploymentBuilder.name("测试")
                            .addClasspathResource("diagrams/HelloWord.bpmn")
                            .addClasspathResource("diagrams/HelloWord.png")
                            .deploy();
    
    System.out.println(deploy.getId() + "。。。" + deploy.getName());
}
```

**部署流程会改变3张表**

 - act_re_deployment
	存放流程定义的显示名和部署时间，每部署一次增加一条记录
 - act_re_procdef
	存放流程定义的属性信息，部署每个新的流程定义都会在这张表中增加一条记录。
 - act_ge_bytearray
	存储流程定义相关的部署信息。即流程定义文档的存放地。每部署一次就会增加两条记录，一条是关于bpmn规则文件的，一条是图片的（如果部署时只指定了bpmn一个文件，activiti会在部署时解析bpmn文件内容自动生成流程图）。两个文件不是很大，都是以二进制形式存储在数据库中。

## 4.3 查看流程定义

```java
@Test
public void view() {
    RepositoryService repositoryService = ProcessEngines.getDefaultProcessEngine().getRepositoryService();
    List<ProcessDefinition> list = repositoryService.createProcessDefinitionQuery()
                                        //过滤条件
                                        .processDefinitionKey("HelloWorld")
                                        //.processDefinitionId(processDefinitionId)
                                        //分页
                                        //.listPage(firstResult, maxResults)
                                        //排序
                                        //.orderByProcessDefinitionVersion()
                                        //执行查询
                                        .list();
    for (ProcessDefinition processDefinition : list) {
        System.out.print("id:" + processDefinition.getId() + ",");//流程Id
        System.out.print("key:" + processDefinition.getKey() + ",");//流程Key
        System.out.print("name:" + processDefinition.getName() + ",");//流程名字
        System.out.print("version:" + processDefinition.getVersion() + ",");//流程版本
        System.out.println("deploymentId():" + processDefinition.getDeploymentId());//流程部署对象Id
    }
}
```
查询结果

    id:HelloWorld:1:35004,key:HelloWorld,name:请假审批流程,version:1,deploymentId():35001
再部署一次，再查询

    id:HelloWorld:1:35004,key:HelloWorld,name:请假审批流程,version:1,deploymentId():35001
    id:HelloWorld:2:37504,key:HelloWorld,name:请假审批流程,version:2,deploymentId():37501
    
说明：
    

 1. 因为流程定义的信息在仓库中，实际在act_re_*表中，所以创建RepositoryService
 2. 创建查询对象**ProcessDefinitionQuery**，设置查询参数，调用list()执行查询
 3. 由查询结果可知：
    3.1 流程定义的key和name与流程文件的id和name一致

    ```xml
    <process id="HelloWorld" name="请假审批流程" isExecutable="true">
    ```
    3.2 key属性被用来区别不同的流程定义。
    3.3 带有特定key的流程定义第一次部署时，version为1。之后每次部署都会在当前最高版本号上加1
    3.4 Id的生成规则为：**{processDefinitionKey}:{processDefinitionVersion}:{generated-id}**，这里的generated-id是一个自动生成的唯一的数字
    3.5 重复部署一次，deploymentId的值以一定的形式变化
    
## 4.4 删除流程定义

删除部署到activiti中的流程定义。如:删除请假流程定义，则大家再也不能请假了。

```java
@Test
public void delete() {
    RepositoryService repositoryService = ProcessEngines.getDefaultProcessEngine().getRepositoryService();
    String deploymentId = "7501";
    //如果有关联信息，会报错
    //repositoryService.deleteDeployment(deploymentId);
    //如果有关联信息，会级联删除
    repositoryService.deleteDeployment(deploymentId, true);
}
```

## 4.5 获取流程定义文档资源

```java
@Test
public void getResource() throws IOException {
    RepositoryService repositoryService = ProcessEngines.getDefaultProcessEngine().getRepositoryService();
   
    String deploymentId = "35001";
    String resourceName = null;
    //资源文件名,即act_re_bytearray表中的name
    List<String> names = repositoryService.getDeploymentResourceNames(deploymentId);
    for (String str : names) {
        //过滤出特定的图片文件
        if (str.indexOf("HelloWorld.png") != -1) {
            resourceName = str;
        }
    }
    System.out.println(resourceName);
    if (resourceName != null) {
        //通过部署ID和文件名获得输入流
        InputStream inputStream = repositoryService.getResourceAsStream(deploymentId, resourceName);
        File file = new File("D:/"+ resourceName);
        FileUtils.copyInputStreamToFile(inputStream, file);
    }
}
```
    
# 5 流程实例

## 5.1 启动流程实例

```java
@Test
public void startProcess() {
    RuntimeService runtimeService = ProcessEngines.getDefaultProcessEngine().getRuntimeService();
    //根据流程Id启动流程
    //ProcessInstance processInstance = runtimeService.startProcessInstanceById(processDefinitionId);
    //根据流程key启动流程，会自动找到版本最高的流程定义来创建
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("HelloWorld");
    System.out.println(processInstance.getId());//流程实例Id
    System.out.println(processInstance.getActivityId());//流程当前节点Id
}
```
    启动流程实例有很多重载方法，根据实际需要选用。

## 5.2 查询任务

在Activiti中，任务主要分为两类：

 1. 确切指定了办理者的任务，之歌任务称为制定者的私人任务
 2. 2.无法指定具体的某一个人来办理的任务，可以把任务分配给几个人或者一到	多个小组，让这个范围内的用户可以选择性（如有空余时间时）来办理这类任务。

```java
@Test
public void taskQuery() {
    TaskService taskService = ProcessEngines.getDefaultProcessEngine().getTaskService();
    List<Task> list = taskService.createTaskQuery()
            //查询指定用户的私人任务
            //.taskAssignee("指定用户")
            //查询某人可接的共有任务
            //.taskCandidateUser("候选用户")
            //排序
            .orderByTaskCreateTime().desc()
            //执行查询
            .list();
    for (Task task : list) {
        System.out.println("id:" + task.getId());
        System.out.println("name:" + task.getName());
        System.out.println("assignee:" + task.getAssignee());
        System.out.println("createTime:" + task.getCreateTime());
        System.out.println("ProcessInstanceId:" + task.getProcessInstanceId());
        System.out.println("ProcessDefinitionId:" + task.getProcessDefinitionId());
    }
}
```

## 5.3 认领任务

```java
taskService.claim(taskId, userId);
```
将任务变为用户的私人任务

## 5.4 办理任务

```java
//根据任务Id办理任务
taskService.complete(taskId);
//根据任务Id办理任务,并设置任务变量
taskService.complete(taskId, variables);
```

variables是Map，当设置变量时，会在act_ru_variables表中添加相应条数的数据，变量可以用来执行gateway的判断，后面会讲到gateway。

## 5.5 判断流程是否结束

在流程执行过程中，创建的流程实例ID在整个过程都不会变，当流程结束后，流程实例将被删除。

 1. 从运行库中查询该流程是否还存在
 2. 从历史库中查询该流程是否存在

```java
@Test
public String checkStatus() {
    String processInstanceId = "1213";
    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    RuntimeService runtimeService = processEngine.getRuntimeService();
    //从运行库查询该流程实例是否存在
    ProcessInstance instance = runtimeService.createProcessInstanceQuery()
                                    .processInstanceId(processInstanceId)
                                    .singleResult();
    //实例不存在，可能未开始或者已结束
    if (instance == null) {
        //从历史库查
        HistoryService historyService = processEngine.getHistoryService();
        HistoricProcessInstance singleResult = historyService.createHistoricProcessInstanceQuery()
                                                .processInstanceId(processInstanceId)
                                                .singleResult();
        if (singleResult != null && singleResult.getEndTime() != null) {
            //流程已结束
            return "COMPLETE";
        } else {
            //流程未开始
            return "NOT_START";
        }
    }
    return instance.getActivityId();//当前任务节点
}
```
 
# 6 流程历史

在前一个的例子中，大家可能会流程执行完毕后，究竟去了哪里有些疑问。虽然已完成的任务在act_ru_task和act_ru_execution表中都已被删除，但是这些数据还存在activiti的数据库中，作为历史改由HistoryService来管理。

历史是一个组件，它可以捕获发生在进程执行中的信息并永久的保存，与运行时数据不同的是，当流程实例运行完成之后它还会存在于数据库中。

在流程引擎配置对象中可以设置历史记录规则：

```xml
<bean name="processEngineConfiguration" 
  	  class="org.activiti.engine.impl.cfg.StandaloneProcessEngineConfiguration">
	<property name="databaseSchemaUpdate" value="true" />
	<!--
		Activiti提供了四种历史级别：
		none:不保存任何历史，可以提高性能
		activiti:保存所有流程实例、任务、活动信息
		audit:默认级别,保存所有流程实例、任务、活动、表单
		full:保存所有信息,如流程变量
	  -->
	<property name="history" value="activiti"/>
```
由于数据库中保存着历史信息以及正在运行的流程实例信息，在实际项目中对已完成任务的查看频率远不及对代办和可接任务的查看，所以在activiti采用分开管理，把正在运行的交给runtimeService管理，而历史数据交给HistoryService来管理。

对已成为历史的数据主要进行查询操作，我们主要关心两种类型的历史数据：

 - **HistoricProcessInstance** 包含当前和已经结束的流程实例信息。
 - **HistoricActivityInstance** 包含一个活动(流程上的节点)的执行信息。

## 6.1 查看历史流程实例

```java
@Test
public void queryHisInstance() {
    //流程引擎
    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    //流程定义ID
    String processDefinitionId = "HelloWorld:2:37504";
    //查询历史流程实例
    List<HistoricProcessInstance> list = processEngine.getHistoryService().createHistoricProcessInstanceQuery()
                                        .processDefinitionId(processDefinitionId)
                                        .finished()
                                        .orderByProcessInstanceStartTime().desc()
                                        .list();
    for (HistoricProcessInstance hp : list) {
        System.out.println("ID："+hp.getId());
        System.out.println("startTime："+hp.getStartTime());
        System.out.println("endTime："+hp.getEndTime());
    }
}
```

1.通常查询历史流程实例都需要指定一个过滤条件，指定	processDefinitionId查看具体某一次部署所开启的流程或者指定	processDefinitionKey查看某个规则下不限版本的所有流程

2.可以选择性添加finished方法控制是否查询未完成的流程实例。在流	程开启时，activiti同时在act_ru_execution表和act_hi_procinst表中	创建了一条记录，在流程完成之前act_hi_procinst表中实例的结束时间为空


## 6.2 查看历史流程活动（节点）

```java
@Test
public void queryHisActiviti() {
    //流程引擎
    ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
    //流程实例ID
    String processInstanceId = "HelloWorld:2:37504";
    //查询历史流程活动
    List<HistoricActivityInstance> list = processEngine.getHistoryService()
                                        //创建历史流程活动实例查询对象
                                        .createHistoricActivityInstanceQuery()
                                        //过滤条件
                                        .processInstanceId(processInstanceId)
                                        //排序
                                        .orderByHistoricActivityInstanceStartTime().desc()
                                        //执行查询
                                        .list();
    for (HistoricActivityInstance ha : list) {
        System.out.println("ID："+ha.getActivityId());
        System.out.println("name:"+ha.getActivityName());
        System.out.println("startTime："+ha.getStartTime());
        System.out.println("endTime："+ha.getEndTime());
    }
}
```

通常查询历史流程活动都需要指定一个过滤条件，指定processInstanceId查看具体某一次流程执行过程中所经历的步奏

# 7 流程变量

流程变量在整个工作流中扮演很重要的作用。例如：请假流程中有请假天数、请假原因等一些参数都为流程变量的范围。
流程变量的作用域范围是流程实例。也就是说各个流程实例的流程变量是不相互影响的。
流程实例结束完成以后流程变量是否保存在数据库中取决于存储策略，见第六章。
![流程变量][7]

## 7.1 添加流程变量

 1. 启动流程实例时添加
    ```java
    @Test
    public void addVariables() {
        ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
        RuntimeService runtimeService = processEngine.getRuntimeService();
        
        String processDefinitionKey = "HelloWorld";
        Map<String,Object> variables = new HashMap<>();
        variables.put("请假天数", 3);
        variables.put("请假原因", "约会");
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(processDefinitionKey, variables);
    }
    ```
    说明：
        1)	在启动流程实例时，通过重载startProcessInstanceByKey的方法可以加载流程变量。
        2)	第二个参数要求是Map<String ,Object>类型，意味着可以添加多个流程变量。
        3)	当这段代码执行完以后，会在数据库表act_ru_variable中添加两行记录。
        

 2. 完成任务时添加
    ```java
    //办理过程中
    taskService.setVariables(taskId, variables);
    //提交时
    taskService.complete(taskId, variables);
    ```
    
 3. 执行流程实例时添加
    ```java
    //执行流程实例时
    runtimeService.setVariables(executionId, variables);
    //流程实例提交时
    runtimeService.signal(executionId, processVariables);//signal用于接受任务
    ```
    
## 7.2 获取流程变量

```java
//某个流程的变量
runtimeService.getVariables(executionId);
//某个任务的变量
taskService.getVariables(taskId);
```

说明：这些流程变量是从act_ru_variable这个表中读出来的。

## 7.3 流程变量范围

![此处输入图片的描述][8]

从图中可以看出包括了大部分封装类型和Date、String和实现了Serializable接口的类的类型。

## 7.4 Javabean类型变量

 1. 定义一个javabean，这个javabean实现了Serializable接口
 2. 实例化javaBean，放到map中，然后正常设置流程变量
 3. 正常取出变量

# 8 流程定义语言

## 8.1 流程（Process）

bpmn文件一个流程的根元素。一个流程就代表一个工作流。

## 8.2 顺序流（sequenceFlow）

顺序流是连接两个流程节点的连线，代表一个节点的出口。流程执行完一个节点后，会沿着节点的所有外出顺序流继续执行。 就是说，BPMN 2.0默认的行为就是并发的： 两个外出顺序流会创造两个单独的，并发流程分支。

顺序流主要由4个属性组成：

 - Id: 唯一标示，用来区分不同的顺序流
 - sourceRef：连线的源头节点ID
 - targetRef：连线的目标节点ID
 - name（可选）：连线的名称，不涉及业务，主要用于显示

## 8.3 节点

### 8.3.1 开始事件节点(startEvent)
开始事件用来指明流程在哪里开始。开始事件的类型（流程在接收事件时启动， 还是在指定时间启动，等等），定义了流程如何启动， 这通过事件中不同的小图表来展示。 在XML中，这些类型是通过声明不同的子元素来区分的。
![此处输入图片的描述][9]

 1. 空开始事件
    空开始事件技术上意味着没有指定启动流程实例的触发条件。最常用的一种开始，意味着流程的启动需要手动触发，通过调用api的startProcessInstanceByXXX方法。
    ```java
    ProcessInstance processInstance = runtimeService.startProcessInstanceByXXX()
    ```
    图形标记：空开始事件显示成一个圆圈，没有内部图表（没有触发类型）
    XML结构如下：
    ```xml
    <startEvent id="startevent" name="Start"></startEvent>
    ```

 2. 定时开始事件

    定时开始事件用来在指定的时间创建流程实例。 它可以同时用于只启动一次的流程 和应该在特定时间间隔启动多次的流程。

        注意：
        1.子流程不能使用定时开始事件。
        2.定时开始事件在流程发布后就会开始计算时间。不需要调用startProcessInstanceByXXX，虽然也而已调用启动流程的方法，但是那会导致调用startProcessInstanceByXXX时启动过多的流程。
        3.当包含定时开始事件的新版本流程部署时，对应的上一个定时器就会被删除。这是因为通常不希望自动启动旧版本流程的流程实例。
    
    图形标记：定时开始事件显示为一个圆圈，内部是一个表。
    XML内容：定时开始事件的XML内容是普通开始事件的声明，包含一个定时定义子元素。 
    示例：流程会启动4次，每次间隔5分钟，从2013年9月18日，12:10开始计时。
    ```xml
    <startEvent id="theStart">
        <timerEventDefinition>                
		    <timeCycle>R4/2017-11-22T11:04/PT5M</timeCycle>            		 
	    </timerEventDefinition>
    </startEvent> 
    ```
    示例：流程会根据选中的时间启动一次。
    ```xml
    <startEvent id="theStart">
        <timerEventDefinition>                
		    <timeDate>2017-12-31T23:59:59</timeDate>               		 
	    </timerEventDefinition>
    </startEvent> 
    ```
 
### 8.3.2 结束事件节点(endEvent)

结束事件表示（子）流程（分支）的结束。结束事件都是触发事件。这是说当流程达结束事件，会触发一个结果。 结果的类型是通过事件的内部黑色图标表示的。
![结束事件][10]

 1. 空结束事件
 
    空结束事件意味着到达事件时不会指定抛出的结果。这样，引擎会直接结束当前执行的分支，不会做其他事情。
    图形标记:空结束事件是一个粗边圆圈，内部没有小图表（无结果类型）
    XML内容:空结束事件的XML内容是普通结束事件定义，不包含子元素（其他结束事件类型都会包含声明类型的子元素）。
    ```xml
    <endEvent id="end" name="my end event"/>
    ```

### 8.3.3 任务节点(Task)

![任务节点][11]

 1. 用户任务节点
    用户任务用来设置必须由人员完成的工作。当流程执行到用户任务，会创建一个新任务，并把这个新任务加入到分配人或群组的任务列表中。
    图形标记：用户任务显示成一个普通任务（圆角矩形），左上角有一个小用户图标。
    XML内容：XML中的用户任务定义如下。id属性是必须的。 name属性是可选的。
    ```xml
    <userTask id="theTask" name="Important task"/>  
    ```
    用户任务也可以设置描述(实际上所有BPMN 2.0元素都可以设置描述)。 添加documentation元素可以定义描述。
    ```xml
    <userTask id="theTask" name="Schedule meeting">  
    <documentation>
        Schedule an engineering meeting for next week with the new hire.  
    </documentation>
    ```
    在实际应用中，用户接到任务后可以参照任务描述来办理任务，描述文本可以通过标准的java方法来获得：
    ```java
    task.getDescription() 
    ```
**私人任务**
    私有任务即有直接分配给指定用户的任务。只有一个用户可以成为任务的执行者。 在activiti中，用户叫做执行者。 拥有执行者的用户任务（即私有任务）对其他用户是不可见的。只能出现执行者的个人任务列表中.
    直接把用户任务分配给指定用户使用assignee属性，XML代码如下：
    ```xml
    <userTask id="theTask" name="my task" activiti:assignee="username"/>
    ```
    Assignee属性对应的值为一个用户的ID。
    直接分配给用户的任务可以通过TaskService像下面这样办理：
    ```java
    List<Task>tasks =taskService.createTaskQuery().taskAssignee("sirius").list();
Task task = tasks.get(0);// 假设任务集合的第一条是要办理的任务
taskService.complete(task.getId());

    ```
 **公有任务**
    有的用户任务在指派时无法确定具体的办理者，这时任务也可以加入到	人员的候选任务列表中，然后让这些人员选择性认领和办理任务。
    
    公有任务的分配可以分为指定候选用户和候选组两种。

    -  把任务添加到一批用户的候选任务列表中，使用candidateUsers	属	性，XML内容如下:
    ```xml
    <userTaskid="theTask"name="my task"activiti:candidateUsers="sirius,kermit"/>
    ```
    candidateUsers属性内为用户的ID，多个用户ID之间使用（半角）逗号间隔。
    
     - 把任务添加到一个或多个候选组下，这时任务对组下的所有用户可见，首先得保证每个组下面有用户，通过IdentityService对象创建用户和组，然后把用户添加到对应的组下。然后配置组任务，使用candidateGroups属性，XML内容如下：
    ```xml
    <userTask id="theTask" name="my task" activiti:candidateGroups="testGroup，developGroup"/>
    ```
    间接分配给用户的任务，可以通过TaskService像下面这样操作：
    ```java
    List<Task>tasks =taskService.createTaskQuery()
				.taskCandidateUser("sirius").list();
    Task task = tasks.get(0);// 假设任务集合的第一条是要办理的任务
    String taskId = task.getId();
    taskService.claim(taskId ,“sirius”); //认领任务，让用户成为任务的执行者
    taskService.complete(taskId );
    ```

    说明：
    
     1. 要维护用户和组得使用用户管理服务对象，使用		processEngine	得到IdentityService。
     2. 要分配组任务必须先创建组，而且组下得有用户，用户和组的	最关键属性是ID。
     3. 使用newUser（userId）和newGroup（groupId）创建用户和组。
     4. 使用createMembership（userId，groupId）把用户挂到组下。
     5. 办理候选任务，首先得认领任务，让用户成为任务的执行者
    
    如果上面的方式还不够灵活，那么我们也可以自定义一个任务分配处理器，通过代码的方式来动态设置任务的属性。XML代码如下：
    ```xml
    <userTask id="task1" name="My task"> 
        <extensionElements>    
            <activiti:taskListener event="create" class="org.activiti.MyAssignmentHandler"/>  
        </extensionElements>
    </userTask>
    ```
    DelegateTask会传递给TaskListener的实现，通过它可以设置执行人，候选人和候选组：
    ```java
    Public class MyAssignmentHandler implements TaskListener {
      
        Public void notify(DelegateTask delegateTask){ 
    	// 执行用户搜索相关代码    
    	...
    	// 然后把获取到的用户通过下面方法，设置给当前触发事件的任务
        	delegateTask.setAssignee("sirius");
        	//delegateTask.addCandidateUser("kermit");
       	//delegateTask.addCandidateGroup("testGroup"); 
       	...  
        }
    }
    ```

 2. 接收任务节点（receiveTask）

    接收任务是一个简单任务，它会等待对应消息的到达。当前，官方只实现了这个任务的java语义。 当流程达到接收任务，流程状态会保存到数据库中。在任务创建后，意味着流程会进入等待状态，直到引擎接收了一个特定的消息，这会触发流程穿过接收任务继续执行。
    
    图形标记：接收任务显示为一个任务（圆角矩形），右上角有一个消息小标记。 消息是白色的（黑色图标表示发送语义）。
    
    XML内容：
    ```xml
    <receiveTask id="waitState" name="wait"/> 
    ```
    
    当前任务（一般指机器自动完成，但需要耗费一定时间的工作）完成后，向后推移流程，可以调用runtimeService.signal(executionId)，传递接收任务上流程的id。
    ```java
    ProcessInstance pi = runtimeService.startProcessInstanceByKey("receiveTask");
    Execution execution = runtimeService.createExecutionQuery()
                            .processInstanceId(pi.getId())
                            .activityId("waitState")
                            .singleResult();
    runtimeService.signal(execution.getId());  
    ```
    
----------

述两个虽然都可以统称为任务节点，但是还是有本质区别：

 1. receiveTask主要代表机器自动执行的，userTask代表人工干预的。
 2. eiveTask任务产生后会在act_ru_execution表中新增一条记录，	而userTask产生后会在act_ru_execution和act_ru_task（主要记录任	务的发布时间，办理人等信息）中各产生一条记录。
 3. receiveTask任务提交方式使用RuntimeService的signal方法提交，	userTask任务提交方式使用TaskService的complete方法提交。

 
### 8.3.4 网关（gateWay）
![网关][12]

 1. 排他网关
    排他网关（也叫异或（XOR）网关，或更技术性的叫法基于数据的排他网关），用来在流程中实现决策。
    
    **图形标记**:排他网关显示成一个普通网关（比如，菱形图形）,内部是一个“X”图标,表示异或（XOR）语义。注意，没有内部图标的网关，默认为排他网关。BPMN2.0规范不允许在同一个流程定义中同时使用没有X和有X的菱形图形。
    
    **XML内容**:排他网关的XML内容是很直接的：用一行定义了网关,条件表达式定义在外出顺序流中。参考条件顺序流 获得这些表达式的可用配置。
    ![排他网关][13]
    ```xml
    <exclusiveGatewayid="exclusiveGw"name="Exclusive Gateway"/>
    <sequenceFlow id="flow2" sourceRef="exclusiveGw" targetRef="theTask1">  
        <conditionExpressionxsi:type="tFormalExpression">${input == 1}</conditionExpression> 
    </sequenceFlow>	
    <sequenceFlow id="flow3" sourceRef="exclusiveGw" targetRef="theTask2">   
        <conditionExpressionxsi:type="tFormalExpression">${input == 2}</conditionExpression> 
    </sequenceFlow>
    <sequenceFlow id="flow4" sourceRef="exclusiveGw" targetRef="theTask3">  
        <conditionExpressionxsi:type="tFormalExpression">${input == 3}</conditionExpression> 
    </sequenceFlow>
    ```
    
    说明：
    1.一个排他网关对应一个以上的顺序流
    2.由排他网关流出的顺序流都有个conditionExpression元素，在内部维护返回boolean类型的决策结果。
    3.决策网关只会返回一条结果。当流程执行到排他网关时，流程引擎会自动检索网关出口，从上到下检索如果发现第一条决策结果为true或者没有设置条件的(默认为成立)，则流出。
    4.如果没有任何一个出口符合条件则抛出异常。

 2. 并行网关
 
    网关也可以表示流程中的并行情况。最简单的并行网关是parallelGateWay，它允许将流程分成多条分支，也可以把多条分支汇聚到一起。

    **图形标记**：并行网关显示成一个普通网关（菱形）内部是一个“加号”图标，表示“与（AND）”语义。
    ![并行网关][14]
    
    **XML内容**：定义并行网关只需要一行
    ```xml
    <parallelGateway id="myParallelGateway"/>
    ```
    实际发生的行为（分支，聚合，同时分支聚合），要根据并行网关的顺序流来决定。
    ```xml
    <startEvent id="theStart"/>

    <sequenceFlow id="flow1" sourceRef="theStart" targetRef="fork"/>
    <parallelGateway id="fork"/> 
     
    <sequenceFlow sourceRef="fork" targetRef="receivePayment"/>
    <sequenceFlow sourceRef="fork" targetRef="shipOrder"/>
        
    <userTaskid="receivePayment"name="Receive Payment"/>
    <sequenceFlow sourceRef="receivePayment" targetRef="join"/>
       
    <userTaskid="shipOrder"name="Ship Order"/>
    <sequenceFlow sourceRef="shipOrder" targetRef="join"/>
    
    <parallelGateway id="join"/>
    <sequenceFlow sourceRef="join" targetRef="archiveOrder"/>
     
    <userTask id="archiveOrder"name="Archive Order"/>
    <sequenceFlow sourceRef="archiveOrder" targetRef="theEnd"/>
             
    <endEventid="theEnd"/>
    ```
    上面例子中，流程启动之后，会创建两个任务：
    ```java
    ProcessInstancepi =runtimeService.startProcessInstanceByKey("forkJoin");
    
    List<Task> tasks = taskService.createTaskQuery().list();
    Task task1 =tasks.get(0);
    System.out.println("Receive Payment"+task1.getName());
    Task task2 =tasks.get(1);
    System.out.println("Ship Order"+task2.getName());
    ```
    当两个任务都完成时，第二个并行网关会汇聚两个分支，因为它只有一条外出连线，不会创建并行分支，只会创建归档订单任务。
    
    说明：
    1.并行网关的功能是基于进入和外出的顺序流的：
        分支(fork)：并行后的所有外出顺序流，为每个顺序流都创建一个并发分支。
        汇聚(join)：所有到达并行网关，在此等待的进入分支，直到所有进入顺序流的分支都到达以后， 流程就会通过汇聚网关。
    2.并行网关的进入和外出都是使用相同节点标示
    3.如果同一个并行网关有多个进入和多个外出顺序流，它就同时具有分支和汇聚功能。这时，网关会先汇聚所有进入的顺序流，然后再切分成多个并行分支。
    4.并行网关不会解析条件。 即使顺序流中定义了条件，也会被忽略。
    5.并行网关不需要是“平衡的”（比如，对应并行网关的进入和外出节点数目相等）。如图中标示是合法的：
    ![并行网关不需要是“平衡的”][15]
 
## 8.4 监听器（Listener）

在流程中我们有时会对整个流程或者一个节点的某种状态做出相应的处理。这时就会用到监听器。

在Activiti中流程的监听主要分为两大类，执行监听器和任务监听器。

### 8.4.1 执行监听器（ExecutionListener）

执行监听器可以执行外部java代码或执行表达式，当流程定义中发生了某个事件。 可以捕获的事件有:

 - 流程实例的启动和结束。
 - 选中一条连线。
 - 节点的开始和结束。
 - 网关的开始和结束。
 - 中间事件的开始和结束。
 - 开始事件结束或结束事件开始。

现在有这样一个简单流程，只包含开始、结束、接收任务和用户任务4个节点：
![监听器流程示例][16]
配置监听器,XML代码如下
```xml
<extensionElements>
      <activiti:executionListener event="start" class="test.ProcessStartListener"></activiti:executionListener>
</extensionElements>
```
说明：

 - 任务监听器支持以下属性：
    
    - event（必选）：任务监听器会被调用的任务类型
        - start：流程节点创建后触发
        - end：当任务完成，并尚未从运行数据中删除时触发
        - take：任务完成后，流程流出时触发
    - class(必选)：代理类，实现org.activiti.engine.delegate.ExecutionListener接口。
    示例：
    ```java
    public class ProcessStartListener implements ExecutionListener {

    private static final long serialVersionUID = 1L;

    @Override
    public void notify(DelegateExecution execution) throws Exception {
            System.out.println("ID:"+execution.getId()+", Name:"+execution.getCurrentActivityName());
        }
    
    }
    ```

 - 执行监听器配置可以放在以下三个地方，如图
![此处输入图片的描述][17]

    a)	监听整个流程的启动和结束状态，配置为process节点的子元素，如①
    b)	监听一个节点的启动和结束状态，配置为一个节点的子元素，如②和③
    c)	监听一条连线的执行，配置在sequenceFlow节点的内部，只有task一种事件，如④
    
启动流程测试代码如下：
```java
@Test
public void Demo1() {
    //部署流程
    Deployment deployment = repositoryService.createDeployment()
                .addClasspathResource("diagrams/Listener.bpmn")
                .addClasspathResource("diagrams/Listener.png")
                .deploy();
    //启动
    ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("ListenerTest");
    //推动
    String processInstanceId = processInstance.getId();
    runtimeService.signal(processInstanceId);
    
    String id = taskService.createTaskQuery().processInstanceId(processInstanceId).singleResult().getId();
    taskService.complete(id);
}
```

测试结果如下：

        ID:60005, Name:开始
        ID:60005, Name:接收任务
        ID:60005, Name:用户任务

### 8.4.2 任务监听器（TaskListener）

任务监听器可以在发生对应的任务相关事件时执行自定义java逻辑 或表达式。
任务监听器只能添加到流程定义中的用户任务中。在之前任务节点上添加任务监听:
![此处输入图片的描述][18]

任务监听器支持以下属性

- event（必选）：任务监听器会被调用的任务类型。 可能的类型为：
    - create：任务创建并设置所有属性后触发。
    - assignment：任务分配给一些人时触发。当流程到达userTask，assignment事件 会在create事件之前发生。这样的顺序似乎不自然，但是原因很简单：当获得create时间时， 我们想获得任务的所有属性，包括执行人。
    - complete：当任务完成，并尚未从运行数据中删除时触发。
- class：必须调用的代理类。 这个类必须实现org.activiti.engine.delegate.TaskListener	接口。


----------

新添加的任务监听包裹在executionListener监听的内部，顺序为：execution Start--> task Assignment-->task Create-->task Complete-->execution End-->execution take。


# 9 Spring集成

虽然前面的例子中我们可以自己手动来创建相应的API实例，但是在一个项目中这些API都应该以**单例形式**存在的。和Spring的集成主要就是把Activiti的主要对象交给Spring容器管理。

```xml
<!-- 流程引擎 -->
<bean id="processEngine" class="org.activiti.spring.ProcessEngineFactoryBean"> 
	<property name="processEngineConfiguration" ref="processEngineConfiguration"></property>
</bean>

<!-- 流程引擎配置对象 -->
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	<property name="dataSource" ref="dataSource" />
	<property name="transactionManager" ref="transactionManager" />
	<!-- activiti表数据更新策略 false true（默认） create-drop-->
	<property name="databaseSchemaUpdate" value="true" />
	<!-- activiti历史数据保存策略 none activity audit(默认) full-->
	<property name="history" value="audit" />
	<!-- 管理线程计时器和异步消息,默认开启，但有ManagementService替代，避免冲突所以关闭 -->
	<property name="jobExecutorActivate" value="false" />
	<!-- 加载资源文件 -->
	<property name="deploymentResources" value="classpath:/activiti-process/*.bpmn" />
</bean>

<!-- 核心业务类 -->
<bean id="repositoryService" factory-bean="processEngine" factory-method="getRepositoryService" />
<bean id="runtimeService" factory-bean="processEngine" factory-method="getRuntimeService" />
<bean id="taskService" factory-bean="processEngine" factory-method="getTaskService" />
<bean id="historyService" factory-bean="processEngine" factory-method="getHistoryService" />
<bean id="managementService" factory-bean="processEngine" factory-method="getManagementService" />
```

**注意：**
 1. ProcessEngineConfiguration
    单独使用和整合Spring时不是同一个class
    独立使用：org.activiti.engine.ProcessEngineConfiguration
    整合Spring：org.activiti.spring.SpringProcessEngineConfiguration
 2. 项目部署后会自动在数据库中创建相关流程定义

 

 
 
 
  


  


  [1]: https://www.zybuluo.com/mdeditor#785927
  [2]: http://blog.csdn.net/dr_guo/article/details/50718063
  [3]: http://activiti.org/download.htmlt/dr_guo/article/details/50718063
  [4]: http://pan.baidu.com/s/1qYmgdlE
  [5]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/create.png
  [6]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/example.png
  [7]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/variable.png
  [8]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/baseVar.png
  [9]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/startEvent.png
  [10]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/endEvent.png
  [11]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/task.png
  [12]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/gateWay.png
  [13]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/xor.png
  [14]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/parallelGateWay.png
  [15]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/binxing.png
  [16]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/listenerExample.png
  [17]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/taskListener.png
  [18]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/activiti/taskListener2.png