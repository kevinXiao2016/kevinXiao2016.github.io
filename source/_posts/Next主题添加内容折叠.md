---
title: Next主题添加内容折叠
categories:
  - Blog
tags:
  - Next
  - Blog
keyword:
  - next
  - next折叠
  - next主题折叠
  - 主题折叠
date: 2018-12-06 13:55:56
updated: 2018-12-06 13:55:56
---

当有大段的代码直接展示在页面时，看起来臃肿且不便于观看，此时将代码折叠是最好的选择。下面是在Hexo的Next主题上添加折叠功能。

<!-- more -->

## 1、在main.js中添加折叠js

Next主题的主要js位于 `themes/next/source/js/src/post-details.js`,在下面添加一下代码段：

```js
$(document).ready(function(){
    $(document).on('click', '.fold_hider', function(){
        $('>.fold', this.parentNode).slideToggle();
        $('>:first', this).toggleClass('open');
    });
    //默认情况下折叠
    $("div.fold").css("display","none");
});
```

## 2、自定义内建标签

在主题scripts下添加一个tags.js，位于`themes/next/scripts/tags.js`

```js
/*
  @haohuawu
  修复 Nunjucks 的 tag 里写 ```代码块```，最终都会渲染成 undefined 的问题
  https://github.com/hexojs/hexo/issues/2400
*/
const rEscapeContent = /<escape(?:[^>]*)>([\s\S]*?)<\/escape>/g;
const placeholder = '\uFFFD';
const rPlaceholder = /(?:<|&lt;)\!--\uFFFD(\d+)--(?:>|&gt;)/g;
const cache = [];
function escapeContent(str) {
  return '<!--' + placeholder + (cache.push(str) - 1) + '-->';
}
hexo.extend.filter.register('before_post_render', function(data) {
  data.content = data.content.replace(rEscapeContent, function(match, content) {
    return escapeContent(content);
  });
  return data;
});
hexo.extend.filter.register('after_post_render', function(data) {
  data.content = data.content.replace(rPlaceholder, function() {
    return cache[arguments[1]];
  });
  return data;
});
```

再继续添加一个fold.js,位于`themes/next/scripts/fold.js`

```js
/* global hexo */
// Usage: {% fold ???? %} Something {% endfold %}
function fold (args, content) {
    var text = args[0];
    if(!text) text = "点击显/隐";
    return '<div><div class="fold_hider"><div class="close hider_title">' + text + '</div></div><div class="fold">\n' + hexo.render.renderSync({text: content, engine: 'markdown'}) + '\n</div></div>';
}
hexo.extend.tag.register('fold', fold, {ends: true});
```

## 3、添加自定义样式

位于`themes/next/source/css/_custom/custom.styl`

```css
.hider_title{
    font-family: "Microsoft Yahei";
    cursor: pointer;
    color: red;
}
.close:after{
    content: "▼";
}
.open:after{
    content: "▲";
}
```

## 4、使用

在我们需要折叠的地方前后添加便签，示例用法：

```js
{% fold 点击显/隐内容 %}
something you want to fold, include code block.
{% endfold %}
```

## 5、参考

[Hexo next博客添加折叠块功能添加折叠代码块][1]
[Next主题实现内容折叠][2]
[jQuery 实现内容折叠功能][3]


  [1]: https://blog.rmiao.top/hexo-fold-block/
  [2]: http://zlingfly.com/2018/09/05/fold-test/
  [3]: https://www.oyohyee.com/post/Note/fold/