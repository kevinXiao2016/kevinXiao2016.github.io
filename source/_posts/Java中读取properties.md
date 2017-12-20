---
title: Java中读取properties
categories:
  - Spring
tags:
  - properties
date: 2017-12-19 11:41:35
---

将一些业务常量配置成properties文件，是扩展程序兼容性的常用做法。在业务变更导致数据需要改变时，不需要修改代码，只用更改配置文件并重启即可生效。

<!-- more -->

## 方法一：IO实现
```java
public static String getValue(String fileNamePath, String key) throws IOException {
    Properties props = new Properties();
    InputStream in = null;
    
    try {
        in = new FileInputStream(fileNamePath);
        //如果将in改为下面的方法，必须要将.Properties文件和此class类文件放在同一个包中    
        //in = propertiesTools.class.getResourceAsStream(fileNamePath); 
        props.load(in);
        String value = props.getProperty(key);
        // 有乱码时要进行重新编码    
        // new String(props.getProperty("name").getBytes("ISO-8859-1"), "GBK");
        return value;
    } catch (FileNotFoundException e) {
        return null;
    } finally {
        if (null != in) {
            in.close();
        }
    }
}
```

## 方法二：spring实现

在spring扫描配置文件时，将properties中的key和value放入一个map中。

 1. Spring配置

  ```xml
 <bean id="propertyConfigurer" class="com.hapishop.util.ProjectDBinfoConfigurer">
        <property name="locations">
            <list>
                <value>classpath*:/META-INF/*.properties</value>
                <value>file:conf/*.properties</value>
            </list>
        </property>
    </bean>
  ```

 2. 自定义CustomizedPropertyConfigurer,继承**PropertyPlaceholderConfigurer**

    ```java
    public class CustomizedPropertyConfigurer extends PropertyPlaceholderConfigurer {
        private static Map<String, String> properties = new HashMap<String, String>();

        protected void processProperties(ConfigurableListableBeanFactory beanFactoryToProcess, Properties props) throws BeansException {
            // cache the properties
            PropertyPlaceholderHelper helper = new PropertyPlaceholderHelper(DEFAULT_PLACEHOLDER_PREFIX,DEFAULT_PLACEHOLDER_SUFFIX, DEFAULT_VALUE_SEPARATOR, false);
            for (Entry<Object, Object> entry : props.entrySet()) {
                String stringKey = String.valueOf(entry.getKey());
                String stringValue = String.valueOf(entry.getValue());
                stringValue = helper.replacePlaceholders(stringValue, props);
                properties.put(stringKey, stringValue);
            }
            super.processProperties(beanFactoryToProcess, props);
        }

        public static Map<String, String> getProperties() {
            return properties;
        }
    
        public static String getProperty(String key) {
            return properties.get(key);
        }
} 
    ```
    
 3. 配置properties

    ```xml
    site=iteye  
    blog=antlove  
    url=${site}/${blog} 
    ```
    

 4. Java获取

    ```java
    //调用此方法获取value
    CustomizedPropertyConfigurer.getContextProperty()
    ```

## 方法三：注解实现

 - Spring配置
  
  ```xml
 <bean id="propertyConfigurer" class="com.hapishop.util.ProjectDBinfoConfigurer">
        <property name="locations">
            <list>
                <value>classpath*:/META-INF/*.properties</value>
                <value>file:conf/*.properties</value>
            </list>
        </property>
    </bean>
  ```
  
 - 注解获取

    ```java
    @Value("${socket.time.out}")
    int socketTimeout;
    
    public void setSocketTimeout(int socketTimeout) {  
        this.socketTimeout = socketTimeout;  
    }  
    ```
    
    @Value写在要注入的属性上，要提供setter方法。
    
    
## spring加载properties的两个类的区别

 - PropertiesFactoryBean是PropertiesLoaderSupport直接的实现类，专门用来管理properties文件的工厂bean，默认是单例的。
 - PropertyPlaceholderConfigurer是解决properties文件占位符问题的，也实现了PropertiesLoaderSupport类。

在java 代码里，一般是使用@Value注解来引用 properties 文件的属性。

使用 PropertyPlaceholderConfigurer 时， @Value表达式的用法是 @Value(value="${properties key}") ，

使用 PropertiesFactoryBean 时，我们还可以用@Value 读取 properties对象的值， @Value 用法 是 @Value(value="#{configProperties['properties key']}")
     

 
 
 
 

