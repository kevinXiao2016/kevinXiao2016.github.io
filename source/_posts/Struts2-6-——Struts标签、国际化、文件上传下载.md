---
title: Struts2(6)——Struts标签、国际化、文件上传下载
categories:
  - Struts2
tags:
  - Struts2
date: 2017-12-21 20:35:45
---

struts2标签的使用，国际化及文件上传下载。
<!-- more -->
## 1、struts标签

[Struts2标签库常用标签][1]

## 2、国际化 

Struts2在ActionSupport中为我们提供了getText()来获取国际化value.

### 2.1 定义资源包

 1. 全局资源
 
    创建资源文件

        格式：基本名称_语言_国家.properties　
        例如：resources_zh_CN.properties
              resources_en_US.properties
    
    指定文在所在位置及文件名
    ```xml
     <!-- 国际化资源文件路径及名称 -->
    <constant name="struts.custom.i18n.resources"
        value="com/topvision/s2sm/resources" />
    ```
    
 2. 包范围

    在包下创建资源文件，不用在xml中指定文件路径
    
        文件名：package_zh_CN.properties
                package_zh_CN.properties
    
  3. Action范围
    
    在Action同级目录创建资源文件，不用在xml中指定文件路径。

        文件名：ActionName_zh_CN.properties
        ActionName是对应action的名字
        
### 2.2 获取资源包内容

获取国际化
    
   

 -  Action： this.getText(key)
 -  Jsp: 使用<s:text/>标签， <s:text name="key" />
 -  配置文件:key(直接使用国际化配置文件中的key值即可获得)

自由选择消息资源包

```xml
<!--自己随意指定消息资源包-->
<s:i18n name="com/topvision/package">
    <s:text name="key"></s:text>
</s:i18n>
```

## 3、文件上传下载

### 3.1 上传

Struts2上传对表单有要求：

 1. post提交
 2. 表单的enctype必须为multipart/form-data
 3. 表单提供如下类型的input
 
    ```jsp
    <input type="file" name="name"/>
    ```

Struts2中如何实现文件上传的：

 1. 借助一个fileUpload拦截器完成的；
 2. 最底层的还是借助的commons-fileupload这个组件；


单文件上传

 1. 准备表单

    ```jsp
    <form action="aaa/upload.tv" method="post" enctype="multipart/form-data">
    	<input type="file" name="upload">
    	<button type="submit">上传</button>
    </form>
    ```
    
 2. action

    ```java
    private File upload;//input标签的name属性
    private String uploadFileName; //name属性+FileName
    private String uploadContentType;//name属性+ContentType
    
    public String upload() throws IOException {
        ServletContext servletContext = ServletActionContext.getServletContext();
        String realPath = servletContext.getRealPath("/WEB-INF/file");
        File file = new File(realPath);
        if (!file.exists()) {
            file.mkdirs();
        }
        
        /*InputStream is = new FileInputStream(upload);
        OutputStream os = new FileOutputStream(new File(file, uploadFileName));
        
        int len = -1;
        byte b[] = new byte[1024];
        while ((len = is.read(b)) != -1) {
            os.write(b, 0, len);
        }*/
        
        FileUtils.moveFile(upload, new File(file, uploadFileName));
        
        is.close();
        os.close();
        
        return SUCCESS;
    }
    ```

  3. 配置xml

    ```xml
    <action name="upload" class="com.topvision.s2sm.login.action.LoginAction" method="upload2">
		<result>/WEB-INF/jsp/login/login.jsp</result>
	</action>
    ```
      
 
    


多文件上传

第一种，比较煞笔的，多写几个上传框
第二种:使用　uploadify 插件
 
### 3.2 下载

action配置

```java
private InputStream inputStream;
public String download() throws FileNotFoundException {
    ServletContext servletContext = ServletActionContext.getServletContext();
    String realPath = servletContext.getRealPath("/WEB-INF/web.xml");
    inputStream = new FileInputStream(realPath);
    return SUCCESS;
}

public InputStream getInputStream() {
    return inputStream;
}
public void setInputStream(InputStream inputStream) {
    this.inputStream = inputStream;
}
```

xml配置

```xml
<result name="success" type="stream">
	<!-- 设置输入流来源 -->
	<param name="inputstream">inputstream</param>
	<!-- 响应头 -->
	<param name="contentDisposition">attachment;filename=web.xml</param>
	<!-- 传的什么类型数据，在tomcat的web.xml中有定义 -->
	<param name="contentType">application/xml</param>	
	<!-- 下载缓存 ,默认1024-->			
	<param name="bufferSize">10240</param>
	<!-- 下载文件大小 -->
	<param name="contentLength">10240</param>
</result>
```

   
 
  [1]: http://blog.csdn.net/q547550831/article/details/53326042




