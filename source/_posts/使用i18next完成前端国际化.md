---
title: 使用i18next完成前端国际化
categories:
  - Web
tags:
  - 国际化
date: 2017-09-30 09:53:44
---
i18next是一个用来支持应用国际化的javascript库,不依赖于其他第三方js库如jQuuery。[i18next官方网站][3]
<!--more-->

# 1 初始化init

```javascript
i18next
    .use(i18nextXHRBackend)
    .init({
        fallbackLng: 'en',
        lng: 'en',
        debug: false,
        ns: 'strings',
        defaultNS: 'strings',
        backend: {
            loadPath: src + '/{{lng}}/{{ns}}.json', //在每个html中定义localesPath，即localesPath文件夹路径
            crossDomain: true
        }
    }, function(err, t) {
        // init set content
        var array = document.querySelectorAll('[data-i18n]');
        if(array){
            for(var i = 0, len = array.length; i < len; i++) {
                var value = array[i].getAttribute('data-i18n');
                array[i].innerHTML = i18next.t(value);
            }
        };

        var inputs = document.querySelectorAll('input');
        if(inputs) {
            for(var i = 0, len = inputs.length; i < len; i++) {
            	var placeholder = inputs[i].getAttribute("placeholder");
            	var value = inputs[i].getAttribute('data-i18n');
            	if(placeholder != null){
                	inputs[i].setAttribute("placeholder", i18next.t(value));
                }
            }
        }
    });
```

# 2 API

## 2.1 init

    i18next.init(options, callback)
    
```javascript
i18next.init({
    fallbackLng: 'en',
    ns: ['file1', 'file2'],
    defaultNS: 'file1',
    debug: true
}, (err, t) => {
    if(err) return console.log('something went wrong loading', err);
    t('key'); // -> same as i18next.t
});

// with only callback
i18next.init((err, t) => {
    if(err) return console.log('something went wrong loading', err);
    t('key'); // -> same as i18next.t
});
```

 - debug:default false，是否输出日志
 - fallbackLng:default 'dev',当当前语言中找不到key，则去fallbackLng中查找
 - lng:default undefined,设置当前翻译的语言
 - ns：default 'translation'，命名空间，可以是数组，可以理解为国际化文件的名字
 - defaultNS：default 'translation'，如果没有找到设置的ns文件，则去找defaultNS文件
 - backend：设置国际化文件路径，需要配合***i18nextXHRBackend***插件使用，可以跨域读取网络文件，可以读取本地文件。具体配置参看[i18next-xhr-backend][1]
    -  loadPath： 文件路径
    -  crossDomain： 是否强制跨域

## 2.2 use
    
    i18next.use(module)
    
用来添加插件,如下代码所示，注意：一定要在工程中引入对应的js文件
```javascript
i18next
  .use(Backend)
  .use(Cache)
  .use(LanguageDetector)
  .use(postProcessor)
  .init(options, callback);
```

## 2.3 t

    i18next.t(keys, options)

在js中手动查找key得到对应翻译，options可省略，基本用法如下，详细用法请参看[interpolation][2]

```javascript
i18next.t('common.hello') 或 t('common.hello')
```

# 3 小结

以上是i18next的基本使用，可以满足基本的国际化需求。对于更加复杂的国际化需求，请参看官方文档。

说明：

 1. 国际化文件为json格式
 2. 国际化文件路径建议设置为 locales/语言（国家代码）/命名空间.json
 3. 对应第2条，loadPath设置为 locales文件夹路径/{{lng}}/{{ns}}.json

    
 



  [1]: https://github.com/i18next/i18next-xhr-backend
  [2]: https://www.i18next.com/interpolation.html
  [3]: https://github.com/i18next/i18next