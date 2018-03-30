---
title: NexT主题深度优化
categories:
  - course
tags:
  - github
date: 2018-03-30 18:29:19
keyword:
  - next
  - 优化
  - 主题
  - next主题
---

本文主要对next主题导入后的基本及深度优化行为做了记录。其中基本配置直接贴出了配置文件，里面写上了中文注释。深度优化方面，既有总结，也有大量的链接推荐。

<!-- more -->


## 1.开始搭建博客

## 2.优化：基本功能配置

接下来是配置和增强功能，如阅读统计、评论、插件之类的，这些基本配置建议在写文章之前配置好。

基本功能配置大部分是修改两个文件，都叫_config.yml。一个是站点的，一个是主题的。

与其将各个功能分散开来讲，不如直接贴出配置文件，打上注释，从头到尾看一遍就知道如何配置了。

### 2.1 选择主题

我选择的是[NexT][1],是在Github上[被Star最多][2]【2018.3.30】的一个Hexo主题。从V6.0.0开始next主仓库已从 [iissnan][3] 名下 迁移至 [theme-next ][4]。组织

想要什么样的主题，去[Hexo Themes][5]上慢慢找。

至于更换主题，很简单，用NexT主题举个例子。

 1. 首先，去主题所在仓库拷贝仓库地址，如下图：
    
    ![拷贝仓库地址][6]    

 2. 然后，到博客站点根目录下,打开 **git bash**

    ```
    // next是自定义的主题名字，可以随意更改
    git clone https://github.com/theme-next/hexo-theme-next.git themes/next
    ```

 3. 最后，修改站点配置文件_config.yml
 
    ```
    ## Themes: https://hexo.io/themes/
    theme: next
    ```
    
### 2.2 站点配置文件

请先查看 [Hexo官方文档][7] ，再查看下面我贴出的，如果这样后你还是对有些地方比较懵，可以自行 Google。

**注意：文件中所有的 : 都是英文字符，且后面都有一个空格。**

【2018.3.30更新】文件位置： ~/blog/_config.yml

```
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: 温故而知新
subtitle: 
description: 天下事有难易乎？<br/>为之，则难者亦易矣；<br/>不为，则易者亦难矣。
author: 肖悦
language: zh-CN
timezone: 

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://kevinXiao2016.github.io
root: /
# 博客文章的 URL 结构，请务必写文章之前就想好！
# 详细参数请查看：https://hexo.io/docs/permalinks.html
permalink: :year/:month/:day/:title/
permalink_defaults:

# Directory
source_dir: source
public_dir: public
tag_dir: tags
archive_dir: archives
category_dir: categories
code_dir: downloads/code
i18n_dir: :lang
skip_render:

# Writing
new_post_name: :title.md # File name of new posts
default_layout: post
titlecase: false # Transform title into titlecase
external_link: true # Open external links in new tab
filename_case: 0
render_drafts: false
post_asset_folder: false
relative_link: false
future: true
# 代码高亮设置
highlight:
  enable: true
  line_number: true
  auto_detect: false
  tab_replace:

# Category & Tag
default_category: uncategorized
category_map:
tag_map:

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD
time_format: HH:mm:ss


# ---------------------------------------------------------------
# 扩展设置
# ---------------------------------------------------------------
# 集成Local Search 支持站内搜索
search:
  path: search.xml
  field: post
  format: html
  limit: 10000
# Pagination
## Set per_page to 0 to disable pagination
per_page: 10
pagination_dir: page

index_generator:
  per_page: 10 ##首页默认10篇文章标题 如果值为0不分页
## 修改归档页面、某一分类页面、某一标签页面的显示篇数
## 参考：http://theme-next.iissnan.com/faqs.html#setting-page-size
archive_generator:
	per_page: 10 ##归档页面默认10篇文章标题
	yearly: true  ##生成年视图
	monthly: true ##生成月视图
tag_generator:
	per_page: 10 ##标签分类页面默认10篇文章
category_generator: 
	per_page: 10 ###分类页面默认10篇文章

# Extensions
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: next

# Deployment
## Docs: https://hexo.io/docs/deployment.html
deploy:
  type: git
  # 没有做cdn映射前，请使用下面注释掉的配置
  repo: 
        github: git@github.com:kevinXiao2016/kevinXiao2016.github.io.git,master
        coding: git@git.coding.net:kevinXiao2016/kevinXiao2016.git,master

  #repository: https://github.com/kevinXiao2016/kevinXiao2016.github.io.git
  #branch: master
```

### 2.3 主题配置文件

如果使用的主题不是Next，那么请另 Google。建议先查看 [NexT 官方文档][8]。

【2018.3.30更新】文件位置： ~/blog/themes/next/_config.yml

```
# ---------------------------------------------------------------
# Theme Core Configuration Settings
# ---------------------------------------------------------------

# 更新相关，参考：https://github.com/iissnan/hexo-theme-next/issues/328
# 简单说：从V6.0.0开始支持以下功能，不更改主题设置，在站点中设置主题
# 1.在~/blog/source 目录下新建source目录，在里面新建 next.yml文件
# 2.将主题配置文件全部拷贝过去
# 3.设置此处override为true,表明此文件配置可被next.yml中的配置覆盖
override: true

# Allow to cache content generation. Introduced in NexT v6.0.0.
cache:
  enable: true
  
```

【2018.3.30更新】文件位置： ~/blog/source/_data/next.yml
```
# ---------------------------------------------------------------
# Site Information Settings
# ---------------------------------------------------------------

# 站点图标啦，直接去 https://realfavicongenerator.net
# 选项弄好后，下载压缩包，解压复制粘贴
# 建议放在 hexo-site/source/images/ 里（没有自己建）
# 这样可以避免更新 NexT 主题的时候遇到麻烦
# 最后记得要稍微改下文件名，与下面的保持一致
favicon:
  small: /images/favicon-16x16
  medium: /images/favicon-32x32
  #apple_touch_icon: /images/apple-touch-icon-next.png
  #safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml

# Set rss to false to disable feed link.
# Leave rss as empty to use site's feed link.
# Set rss to specific value if you have burned your feed already.
rss:

# 页脚配置
footer:
  # Specify the date when the site was setup.
  # If not defined, current year will be used.
  # 建站年份
  since: 2017

  # Icon between year and copyright info.
  # 年份后面的图标，为 Font Awesome 图标
  icon: 
    # Icon name in fontawesome, see: https://fontawesome.com/v4.7.0/icons
    # `heart` is recommended with animation in red (#ff0000).
    name: heart
    # If you want to animate the icon, set it to true.
    # 设置true时开启动画效果
    animated: true
    # Change the color of icon, using Hex Code.
    color: "#ff0000"

  # If not defined, will be used `author` from Hexo main config.
  # 如果不定义，默认用站点配置文件的 author 名
  copyright:
  # -------------------------------------------------------------
  # Hexo link (Powered by Hexo).
  # Hexo 的链接
  powered: true

  theme:
    # Theme & scheme info link (Theme - NexT.scheme).
    # 是否支持主题
    enable: true
    # Version info of NexT after scheme info (vX.X.X).
    # 是否显示next的版本
    version: true
  # -------------------------------------------------------------
  # Any custom text can be defined here.
  # 自定义内容
  #custom_text: Hosted by <a target="_blank" rel="external nofollow" href="https://pages.coding.me"><b>Coding Pages</b></a>

# ---------------------------------------------------------------
# SEO Settings
# ---------------------------------------------------------------

# Canonical, set a canonical link tag in your hexo, you could use it for your SEO of blog.
# See: https://support.google.com/webmasters/answer/139066
# Tips: Before you open this tag, remember set up your URL in hexo _config.yml ( ex. url: http://yourdomain.com )
canonical: true

# Change headers hierarchy on site-subtitle (will be main site description) and on all post/pages titles for better SEO-optimization.
seo: false

# If true, will add site-subtitle to index page, added in main hexo config.
# subtitle: Subtitle
index_with_subtitle: false


# ---------------------------------------------------------------
# Menu Settings
# ---------------------------------------------------------------

# When running the site in a subdirectory (e.g. domain.tld/blog), remove the leading slash from link value (/archives -> archives).
# Usage: `Key: /link/ || icon`
# Key is the name of menu item. If translate for this menu will find in languages - this translate will be loaded; if not - Key name will be used. Key is case-senstive.
# Value before `||` delimeter is the target link.
# Value after `||` delimeter is the name of FontAwesome icon. If icon (with or without delimeter) is not specified, question icon will be loaded.
# 菜单设置 || 菜单图标设置
# 编辑 ~/blog/themes/next/languages 下的相应文件
# 比如添加一个“留言”菜单，站点配置文件的 language 是 zh-Hans
# 则编辑 zh-Hans.yml，在 menu: 项内添加一行 留言: 留言
# 注意空格，且符号 : 为英文字符！
menu:
  home: / || home
  about: /about/ || user
  tags: /tags/ || tags
  categories: /categories/ || th
  archives: /archives/ || archive
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat

# Enable/Disable menu icons / item badges.
# 是否开启菜单图标
menu_settings:
  icons: true
  badges: false

# ---------------------------------------------------------------
# Scheme Settings
# ---------------------------------------------------------------

# Schemes
# 设计板式，都长啥样，去 README 里面的链接里看看
#scheme: Muse
scheme: Mist
#scheme: Pisces
#scheme: Gemini


# ---------------------------------------------------------------
# Sidebar Settings
# ---------------------------------------------------------------

# Posts / Categories / Tags in sidebar.
site_state: true

# 侧栏社交链接设置，与上面菜单差不多，要生效记得把前面的 # 去掉
# Social Links.
# Usage: `Key: permalink || icon`
# Key is the link label showing to end users.
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the name of FontAwesome icon. If icon (with or without delimeter) is not specified, globe icon will be loaded.
social:
  #GitHub: https://github.com/kevinXiao2016 || github
  #E-Mail: mailto:yourname@gmail.com || envelope
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype

# 侧栏社交链接图标设置
social_icons:
  enable: true
  icons_only: false
  transition: false
  # Dependencies: exturl: true in Tags Settings section below.
  # To encrypt links above use https://www.base64encode.org
  # Example encoded link: `GitHub: aHR0cHM6Ly9naXRodWIuY29tL3RoZW1lLW5leHQ= || github`
  exturl: false

# Follow me on GitHub banner in right-top corner.
# Usage: `permalink || title`
# Value before `||` delimeter is the target permalink.
# Value after `||` delimeter is the title and aria-label name.
github_banner: https://github.com/kevinXiao2016 || Follow me on GitHub

# Blog rolls
# 侧栏友链设置
links_icon: globe
links_title: 神奇的链接
links_layout: block
#links_layout: inline
links:
  EMS规范: http://ems.top-vision.cn:8110/dm/dm.html
  #网易云音乐 : https://music.163.com/#/user/home?id=86590096
  #Coldplay Official Website: http://coldplay.com/
  #获取 Elon Musk 的新闻: https://elonmusknews.org/
  #尼古拉·特斯拉：发明了现代世界的人: http://www.bilibili.com/video/av6211226/
  #关于此博客: https://reuixiy.github.io/about/

# Sidebar Avatar
# in theme directory(source/images): /images/avatar.gif
# in site  directory(source/uploads): /uploads/avatar.gif
# 侧栏头像设置
# 建议放在 hexo-site/source/uploads/ 里（没有自己建）
# 这样可以避免更新 NexT 主题的时候遇到麻烦
avatar: /images/avatar.png

# Table Of Contents in the Sidebar
# 侧栏文章目录设置（前提是 Markdown 书写正确）
toc:
  enable: true

  # Automatically add list number to toc.
  # 自动加数字序号
  number: false

  # If true, all words will placed on next lines if header width longer then sidebar width.
  # 如果标题太长，则放到下一行继续显示
  wrap: false

# Creative Commons 4.0 International License.
# http://creativecommons.org/
# Available: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | zero
#creative_commons: by-nc-sa
#creative_commons:

sidebar:
  # Sidebar Position, available value: left | right (only for Pisces | Gemini).
  # 侧栏位置设置，可用值：左 | 右（只对 Pisces 和 Gemini 设计版式有效！）
  position: left
  #position: right
  
  # 侧栏显示方式
  # Sidebar Display, available value (only for Muse | Mist):
  #  - post    expand on posts automatically. Default.
  #  - always  expand for all pages automatically
  #  - hide    expand only when click on the sidebar toggle icon.
  #  - remove  Totally remove sidebar including sidebar toggle.
  display: post
  #display: always
  #display: hide
  #display: remove

  # Sidebar offset from top menubar in pixels (only for Pisces | Gemini).
  # 只对 Pisces 和 Gemini 设计版式有效！
  offset: 12

  # Back to top in sidebar (only for Pisces | Gemini).
  # 只对 Pisces 和 Gemini 设计版式有效！
  b2t: false

  # Scroll percent label in b2t button.
  scrollpercent: true

  # Enable sidebar on narrow view (only for Muse | Mist).
  # 移动端显示侧栏，只对 Muse 和 Mist 设计版式有效！
  onmobile: true


# ---------------------------------------------------------------
# Post Settings
# ---------------------------------------------------------------

# Automatically scroll page to section which is under <!-- more --> mark.
# 点击 [Read More]，页面自动滚动到 <!-- more --> 标记处
scroll_to_more: false

# Automatically saving scroll position on each post/page in cookies.
# 用 cookies 保存浏览的位置信息，意味着重新打开这个页面后
# 页面就会自动滚动到上次的位置，除非读者清理浏览器 cookies
save_scroll: false

# Automatically excerpt description in homepage as preamble text.
# 将每篇文章 Front-matter 里 description 的文字作为页面显示的文章摘要
excerpt_description: true

# Automatically Excerpt. Not recommend.
# Please use <!-- more --> in the post to control excerpt accurately.
# 按字数自动加入 [Read More]，不建议！
# 建议在文章中加入 <!-- more -->
# 自定义 [Read More] 按钮之前要显示的内容！
auto_excerpt:
  enable: false
  length: 150

# Post meta display settings
# 文章顶部显示的文章元数据设置
post_meta:
  item_text: true
  created_at: true
  updated_at: false
  # Only show 'updated' if different from 'created'.
  updated_diff: false
  categories: true

# Post wordcount display settings
# Dependencies: https://github.com/theme-next/hexo-symbols-count-time
# 显示统计字数和估计阅读时长
# 注意：这个要安装插件，先进入站点文件夹根目录
# 然后：npm install hexo-symbols-count-time --save
symbols_count_time:
  separated_meta: true
  item_text_post: true
  item_text_total: false
  awl: 5
  wpm: 200

# Manual define the border radius in codeblock
# Leave it empty for the default 1
codeblock:
  border_radius: 

# Wechat Subscriber
#wechat_subscriber:
  #enabled: true
  #qcode: /path/to/your/wechatqcode ex. /uploads/wechat-qcode.jpg
  #description: ex. subscribe to my blog by scanning my public wechat account

# Reward
reward_comment: 坚持原创技术分享，您的支持将鼓励我继续创作！
wechatpay: /images/wechat-reward-image.jpg
alipay: /images/alipay-reward-image.jpg
#bitcoin: /images/bitcoin.png

# Related popular posts
# Dependencies: https://github.com/tea3/hexo-related-popular-posts
related_posts:
  enable: false
  title: # custom header, leave empty to use the default one
  display_in_home: false
  params:
    maxCount: 5
    #PPMixingRate: 0.0
    #isDate: false
    #isImage: false
    #isExcerpt: false

# Declare license on posts
post_copyright:
  enable: false
  license: <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" rel="external nofollow" target="_blank">CC BY-NC-SA 4.0</a>


# ---------------------------------------------------------------
# Misc Theme Settings
# ---------------------------------------------------------------

# Reduce padding / margin indents on devices with narrow width.
# 移动端把页面两边留白去除，个人不建议
mobile_layout_economy: false

# Android Chrome header panel color ($brand-bg / $headband-bg => $black-deep).
# Android 上 Chrome 浏览器顶部颜色设置
android_chrome_color: "#222"

# Custom Logo.
# !!Only available for Default Scheme currently.
# Options:
#   enabled: [true/false] - Replace with specific image
#   image: url-of-image   - Images's url
custom_logo:
  enabled: false
  image:

# Code Highlight theme
# Available values: normal | night | night eighties | night blue | night bright
# https://github.com/chriskempson/tomorrow-theme
# 代码高亮主题设置
# 都长啥样自己点开上面的链接查看
highlight_theme: normal

# Enable "cheers" for archive page.
cheers_enabled: true

# Manual define the max content width
# !!Only available for Gemini Scheme currently
# Leave it empty for the default 75% (suggest not less than 1000px)
#max_content_width: 1000px

# Manual define the sidebar width
# !!Only available for Gemini Scheme currently
# Leave it empty for the default 240
sidebar_width:

# ---------------------------------------------------------------
# Font Settings
# - Find fonts on Google Fonts (https://www.google.com/fonts)
# - All fonts set here will have the following styles:
#     light, light italic, normal, normal italic, bold, bold italic
# - Be aware that setting too much fonts will cause site running slowly
# - Introduce in 5.0.1
# ---------------------------------------------------------------
# CAUTION! Safari Version 10.1.2 bug: https://github.com/iissnan/hexo-theme-next/issues/1844
# To avoid space between header and sidebar in Pisces / Gemini themes recommended to use Web Safe fonts for `global` (and `logo`):
# Arial | Tahoma | Helvetica | Times New Roman | Courier New | Verdana | Georgia | Palatino | Garamond | Comic Sans MS | Trebuchet MS
# ---------------------------------------------------------------
# 字体设置
font:
  enable: false

  # Uri of fonts host. E.g. //fonts.googleapis.com (Default).
  host:

  # Font options:
  # `external: true` will load this font family from `host` above.
  # `family: Times New Roman`. Without any quotes.
  # `size: xx`. Use `px` as unit.

  # Global font settings used for all elements in <body>.
  global:
    external: true
    family: Lato
    size:

  # Font settings for Headlines (H1, H2, H3, H4, H5, H6).
  # Fallback to `global` font settings.
  headings:
    external: true
    family:
    size:

  # Font settings for posts.
  # Fallback to `global` font settings.
  posts:
    external: true
    family:

  # Font settings for Logo.
  # Fallback to `global` font settings.
  logo:
    external: true
    family:
    size:

  # Font settings for <code> and code blocks.
  codes:
    external: true
    family:
    size:


# ---------------------------------------------------------------
# Third Party Services Settings
# ---------------------------------------------------------------

# Math Equations Render Support
math:
  enable: false

  # Default(true) will load mathjax/katex script on demand
  # That is it only render those page who has 'mathjax: true' in Front Matter.
  # If you set it to false, it will load mathjax/katex srcipt EVERY PAGE.
  per_page: true

  engine: mathjax
  #engine: katex

  # hexo-rendering-pandoc (or hexo-renderer-kramed) needed to full MathJax support.
  mathjax:
    # Use 2.7.1 as default, jsdelivr as default CDN, works everywhere even in China
    cdn: //cdn.jsdelivr.net/npm/mathjax@2.7.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML
    # For newMathJax CDN (cdnjs.cloudflare.com) with fallback to oldMathJax (cdn.mathjax.org).
    #cdn: //cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML
    # For direct link to MathJax.js with CloudFlare CDN (cdnjs.cloudflare.com).
    #cdn: //cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML
    # For automatic detect latest version link to MathJax.js and get from Bootcss.
    #cdn: //cdn.bootcss.com/mathjax/2.7.1/latest.js?config=TeX-AMS-MML_HTMLorMML

  # hexo-renderer-markdown-it-plus (or hexo-renderer-markdown-it with markdown-it-katex plugin)
  # needed to full Katex support.
  katex:
    # Use 0.7.1 as default, jsdelivr as default CDN, works everywhere even in China
    cdn: //cdn.jsdelivr.net/npm/katex@0.7.1/dist/katex.min.css
    # CDNJS, provided by cloudflare, maybe the best CDN, but not works in China
    #cdn: //cdnjs.cloudflare.com/ajax/libs/KaTeX/0.7.1/katex.min.css
    # Bootcss, works great in China, but not so well in other region
    #cdn: //cdn.bootcss.com/KaTeX/0.7.1/katex.min.css

# Han Support
# Dependencies: https://github.com/theme-next/theme-next-han
# 汉字标准格式，没用过暂时不了解
han: false

# Pangu Support
# Dependencies: https://github.com/theme-next/theme-next-pangu
# For more information: https://github.com/vinta/pangu.js
pangu: false

# Swiftype Search API Key
#swiftype_key:

# Baidu Analytics ID
#baidu_analytics:

# Disqus
disqus:
  enable: false
  shortname:
  count: true
  lazyload: false

# Hypercomments
#hypercomments_id:

# changyan
changyan:
  enable: false
  appid:
  appkey:

# leanCloud支持的评论插件
# Valine. 
# You can get your appid and appkey from https://leancloud.cn
# more info please open https://valine.js.org
valine:
  enable: false
  appid:  P08Jh3wwb2zPhfm9puCevcUa-*******
  appkey:  CnhNSWBKT3kwj52v********
  notify: false # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: Just go go # comment box placeholder
  avatar: mm # gravatar style
  guest_info: nick,mail,link # custom comment header
  pageSize: 10 # pagination size


# Support for youyan comments system.
# You can get your uid from http://www.uyan.cc
#youyan_uid: your uid

# Support for LiveRe comments system.
# You can get your uid from https://livere.com/insight/myCode (General web site)
livere_uid: MTAyMC8yODQwNi******

# Gitment
# Introduction: https://imsun.net/posts/gitment-introduction/
gitment:
  enable: false
  mint: true # RECOMMEND, A mint on Gitment, to support count, language and proxy_gateway
  count: true # Show comments count in post meta area
  lazy: false # Comments lazy loading with a button
  cleanly: false # Hide 'Powered by ...' on footer, and more
  language: # Force language, or auto switch by theme
  github_user: # MUST HAVE, Your Github Username
  github_repo: # MUST HAVE, The name of the repo you use to store Gitment comments
  client_id: # MUST HAVE, Github client id for the Gitment
  client_secret: # EITHER this or proxy_gateway, Github access secret token for the Gitment
  proxy_gateway: # Address of api proxy, See: https://github.com/aimingoo/intersect
  redirect_protocol: # Protocol of redirect_uri with force_redirect_protocol when mint enabled

# Baidu Share
# Available value:
#    button | slide
# Warning: Baidu Share does not support https.
#baidushare:
##  type: button

# Share
# This plugin is more useful in China, make sure you known how to use it.
# And you can find the use guide at official webiste: http://www.jiathis.com/.
# Warning: JiaThis does not support https.
#jiathis:
  ##uid: Get this uid from http://www.jiathis.com/

#add_this_id:

# NeedMoreShare2
# Dependencies: https://github.com/theme-next/theme-next-needmoreshare2
# See: https://github.com/revir/need-more-share2
# Also see: https://github.com/DzmVasileusky/needShareButton
# iconStyle: default | box
# boxForm: horizontal | vertical
# position: top / middle / bottom + Left / Center / Right
# networks: Weibo,Wechat,Douban,QQZone,Twitter,Linkedin,Mailto,Reddit,
#           Delicious,StumbleUpon,Pinterest,Facebook,GooglePlus,Slashdot,
#           Technorati,Posterous,Tumblr,GoogleBookmarks,Newsvine,
#           Evernote,Friendfeed,Vkontakte,Odnoklassniki,Mailru
needmoreshare2:
  enable: false
  postbottom:
    enable: false
    options:
      iconStyle: box
      boxForm: horizontal
      position: bottomCenter
      networks: Weibo,Wechat,Douban,QQZone,Twitter,Facebook
  float:
    enable: false
    options:
      iconStyle: box
      boxForm: horizontal
      position: middleRight
      networks: Weibo,Wechat,Douban,QQZone,Twitter,Facebook

# Google Webmaster tools verification setting
# See: https://www.google.com/webmasters/
#google_site_verification:

# Google Analytics
#google_analytics:

# Bing Webmaster tools verification setting
# See: https://www.bing.com/webmaster/
#bing_site_verification:

# Yandex Webmaster tools verification setting
# See: https://webmaster.yandex.ru/
#yandex_site_verification:

# CNZZ count
#cnzz_siteid:

# Application Insights
# See https://azure.microsoft.com/en-us/services/application-insights/
# application_insights:

# Post widgets & FB/VK comments settings.
# ---------------------------------------------------------------
# Facebook SDK Support.
# https://github.com/iissnan/hexo-theme-next/pull/410
facebook_sdk:
  enable:       false
  app_id:       #<app_id>
  fb_admin:     #<user_id>
  like_button:  #true
  webmaster:    #true

# Facebook comments plugin
# This plugin depends on Facebook SDK.
# If facebook_sdk.enable is false, Facebook comments plugin is unavailable.
facebook_comments_plugin:
  enable:       false
  num_of_posts: 10    # min posts num is 1
  width:        100%  # default width is 550px
  scheme:       light # default scheme is light (light or dark)

# VKontakte API Support.
# To get your AppID visit https://vk.com/editapp?act=create
vkontakte_api:
  enable:       false
  app_id:       #<app_id>
  like:         true
  comments:     true
  num_of_posts: 10

# Star rating support to each article.
# To get your ID visit https://widgetpack.com
rating:
  enable: false
  id:     #<app_id>
  color:  fc6423
# ---------------------------------------------------------------

# Show number of visitors to each article.
# You can visit https://leancloud.cn get AppID and AppKey.
leancloud_visitors:
  enable: false
  app_id: P08Jh3wwb2zPhfm9puCevcUa-gzGzoHsz
  app_key: CnhNSWBKT3kwj52vyJ36armb
  # Dependencies: https://github.com/theme-next/hexo-leancloud-counter-security
  # If you don't care about security in lc counter and just want to use it directly
  # (without hexo-leancloud-counter-security plugin), set the `security` to `false`.
  security: true
  betterPerformance: false

# Another tool to show number of visitors to each article.
# visit https://console.firebase.google.com/u/0/ to get apiKey and projectId
# visit https://firebase.google.com/docs/firestore/ to get more information about firestore
firestore:
  enable: false
  collection: articles #required, a string collection name to access firestore database
  apiKey: #required
  projectId: #required
  bluebird: false #enable this if you want to include bluebird 3.5.1(core version) Promise polyfill

# Show Views/Visitors of the website/page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi/
busuanzi_count:
  enable: true
  total_visitors: true
  total_visitors_icon: user
  total_views: true
  total_views_icon: eye
  post_views: true
  post_views_icon: eye


# Tencent analytics ID
# tencent_analytics:

# Tencent MTA ID
# tencent_mta:


# Enable baidu push so that the blog will push the url to baidu automatically which is very helpful for SEO
baidu_push: false

# Google Calendar
# Share your recent schedule to others via calendar page
#
# API Documentation:
# https://developers.google.com/google-apps/calendar/v3/reference/events/list
calendar:
  enable: false
  calendar_id: <required>
  api_key: <required>
  orderBy: startTime
  offsetMax: 24
  offsetMin: 4
  timeZone:
  showDeleted: false
  singleEvents: true
  maxResults: 250

# Algolia Search
# See: https://github.com/theme-next/hexo-theme-next/blob/master/docs/ALGOLIA-SEARCH.md
# Dependencies: https://github.com/theme-next/theme-next-algolia-instant-search
algolia_search:
  enable: false
  hits:
    per_page: 10
  labels:
    input_placeholder: Search for Posts
    hits_empty: "We didn't find any results for the search: ${query}"
    hits_stats: "${hits} results found in ${time} ms"

# Local search
# Dependencies: https://github.com/theme-next/hexo-generator-searchdb
# 要安装插件才能使用，先进入站点文件夹根目录
#  然后：npm install hexo-generator-searchdb --save
local_search:
  enable: true
  # if auto, trigger search by changing input
  # if manual, trigger search by pressing enter key or search button
  trigger: auto
  # show top n results per article, show all results by setting to -1
  top_n_per_article: 1
  # unescape html strings to the readable one
  unescape: false

# Bookmark Support
# Dependencies: https://github.com/theme-next/theme-next-bookmark
bookmark:
  enable: false
  # if auto
  #   - save the reading position when closing the page
  #   - or clicking the bookmark-icon
  # if manual, only save it by clicking the bookmark-icon
  save: auto


# ---------------------------------------------------------------
# Tags Settings
# ---------------------------------------------------------------

# External URL with BASE64 encrypt & decrypt.
# Usage: {% exturl text url "title" %}
# Alias: {% extlink text url "title" %}
# 用法见：
# https://github.com/iissnan/hexo-theme-next/pull/1438
exturl: false

# 主题的标签样式，有 note、label、tabs 三种
# Note tag (bs-callout).
note:
  # Note tag style values:
  #  - simple    bs-callout old alert style. Default.
  #  - modern    bs-callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: simple
  icons: false
  border_radius: 3
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0

# Label tag.
label: true

# Tabs tag.
tabs:
  enable: true
  transition:
    tabs: false
    labels: true
  border_radius: 0

# Reading progress bar
# Dependencies: https://github.com/theme-next/theme-next-reading-progress
reading_progress:
  enable: false
  color: "#37c6c0"
  height: 2px


#! ---------------------------------------------------------------
#! DO NOT EDIT THE FOLLOWING SETTINGS
#! UNLESS YOU KNOW WHAT YOU ARE DOING
#! ---------------------------------------------------------------

# 动画
# Use velocity to animate everything.
motion:
  enable: true
  async: false
  transition:
    # Transition variants:
    # fadeIn | fadeOut | flipXIn | flipXOut | flipYIn | flipYOut | flipBounceXIn | flipBounceXOut | flipBounceYIn | flipBounceYOut
    # swoopIn | swoopOut | whirlIn | whirlOut | shrinkIn | shrinkOut | expandIn | expandOut
    # bounceIn | bounceOut | bounceUpIn | bounceUpOut | bounceDownIn | bounceDownOut | bounceLeftIn | bounceLeftOut | bounceRightIn | bounceRightOut
    # slideUpIn | slideUpOut | slideDownIn | slideDownOut | slideLeftIn | slideLeftOut | slideRightIn | slideRightOut
    # slideUpBigIn | slideUpBigOut | slideDownBigIn | slideDownBigOut | slideLeftBigIn | slideLeftBigOut | slideRightBigIn | slideRightBigOut
    # perspectiveUpIn | perspectiveUpOut | perspectiveDownIn | perspectiveDownOut | perspectiveLeftIn | perspectiveLeftOut | perspectiveRightIn | perspectiveRightOut
    post_block: fadeIn
    post_header: slideDownIn
    post_body: slideDownIn
    coll_header: slideLeftIn
    # Only for Pisces | Gemini.
    sidebar: slideUpIn

# Fancybox. There is support for old version 2 and new version 3.
# Please, choose only any one variant, do not need to install both.
# For install 2.x: https://github.com/theme-next/theme-next-fancybox
# For install 3.x: https://github.com/theme-next/theme-next-fancybox3
# 查看图片的
fancybox: false

# Added switch option for separated repo in 6.0.0.
# Dependencies: https://github.com/theme-next/theme-next-fastclick
fastclick: false

# Added switch option for separated repo in 6.0.0.
# Dependencies: https://github.com/theme-next/theme-next-jquery-lazyload
lazyload: false

# Progress bar in the top during page loading.
# Dependencies: https://github.com/theme-next/theme-next-pace
pace: false
# Themes list:
#pace-theme-big-counter
#pace-theme-bounce
#pace-theme-barber-shop
#pace-theme-center-atom
#pace-theme-center-circle
#pace-theme-center-radar
#pace-theme-center-simple
#pace-theme-corner-indicator
#pace-theme-fill-left
#pace-theme-flash
#pace-theme-loading-bar
#pace-theme-mac-osx
#pace-theme-minimal
# For example
# pace_theme: pace-theme-center-simple
pace_theme: pace-theme-minimal

# Canvas-nest
# Dependencies: https://github.com/theme-next/theme-next-canvas-nest
canvas_nest: true

# JavaScript 3D library.
# Dependencies: https://github.com/theme-next/theme-next-three
# three_waves
three_waves: false
# canvas_lines
canvas_lines: false
# canvas_sphere
canvas_sphere: false

# Only fit scheme Pisces
# Dependencies: https://github.com/theme-next/theme-next-canvas-ribbon
# Canvas-ribbon
# size: The width of the ribbon.
# alpha: The transparency of the ribbon.
# zIndex: The display level of the ribbon.
canvas_ribbon:
  enable: false
  size: 300
  alpha: 0.6
  zIndex: -1

# Script Vendors.
# Set a CDN address for the vendor you want to customize.
# For example
#    jquery: https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
# Be aware that you should use the same version as internal ones to avoid potential problems.
# Please use the https protocol of CDN files when you enable https on your site.
# 相关内容用 CDN 地址取代，加速网站访问，注意版本尽可能要一致
vendors:
  # Internal path prefix. Please do not edit it.
  _internal: lib

  # Internal version: 2.1.3
  jquery:

  # Internal version: 2.1.5
  # See: http://fancyapps.com/fancybox/
  fancybox:
  fancybox_css:

  # Internal version: 1.0.6
  # See: https://github.com/ftlabs/fastclick
  fastclick:

  # Internal version: 1.9.7
  # See: https://github.com/tuupola/jquery_lazyload
  lazyload:

  # Internal version: 1.2.1
  # See: http://VelocityJS.org
  velocity:

  # Internal version: 1.2.1
  # See: http://VelocityJS.org
  velocity_ui:

  # Internal version: 0.7.9
  # See: https://faisalman.github.io/ua-parser-js/
  ua_parser:

  # Internal version: 4.6.2
  # See: http://fontawesome.io/
  fontawesome:

  # Internal version: 1
  # https://www.algolia.com
  algolia_instant_js:
  algolia_instant_css:

  # Internal version: 1.0.2
  # See: https://github.com/HubSpot/pace
  # Or use direct links below:
  # pace: //cdn.bootcss.com/pace/1.0.2/pace.min.js
  # pace_css: //cdn.bootcss.com/pace/1.0.2/themes/blue/pace-theme-flash.min.css
  pace:
  pace_css:

  # Internal version: 1.0.0
  # https://github.com/hustcc/canvas-nest.js
  canvas_nest: 

  # three
  three:

  # three_waves
  # https://github.com/jjandxa/three_waves
  three_waves:

  # three_waves
  # https://github.com/jjandxa/canvas_lines
  canvas_lines:

  # three_waves
  # https://github.com/jjandxa/canvas_sphere
  canvas_sphere:

  # Internal version: 1.0.0
  # https://github.com/zproo/canvas-ribbon
  canvas_ribbon:

  # Internal version: 3.3.0
  # https://github.com/ethantw/Han
  han:

  # Internal version: 3.3.0
  # https://github.com/vinta/pangu.js
  pangu:

  # needMoreShare2
  # https://github.com/revir/need-more-share2
  needmoreshare2_js:
  needmoreshare2_css:

  # bookmark
  # Internal version: 1.0.0
  # https://github.com/theme-next/theme-next-bookmark
  bookmark:

  # reading_progress
  # Internal version: 1.0
  # https://github.com/theme-next/theme-next-reading-progress
  # Example: https://cdn.jsdelivr.net/gh/theme-next/theme-next-reading-progress@1.1/reading_progress.min.js
  reading_progress:

  # valine comment
  # Example: https://cdn.jsdelivr.net/npm/valine@1.1.8/dist/Valine.min.js
  valine:


# Assets
css: css
js: js
images: images

# Theme version
version: 6.0.6
```

### 2.4 动态背景

在主题配置文件中，靠后面，改canvas_nest: true，想要更改颜色和数量？修改文件：

文件位置：~/blog/themes/next/source/lib/canvas-nest/canvas-nest.min.js

怎么修改？参考[canvas-nest.js][9]。

### 2.5 注脚

参考[hexo-footnotes][10]。

## 3.优化:高级功能配置

### 3.1 大佬们的文章

更多如外挂一样的功能配置，就直接贴大佬的文章了，哪些功能自己喜欢，按照大佬的教程来配置就行。不过也有坑，比如有些功能（超链接样式、侧栏头像圆形并旋转）可以直接通过在custom.styl添加 CSS 代码实现，无需更改其它文件！

 1. [打造个性超赞博客Hexo+NexT+GithubPages的超深度优化][11]
 2. [hexo高阶教程next主题优化][12]
 3. [hexo的next主题个性化教程:打造炫酷网站][13]
 4. [Hexo搭建博客的个性化设置][14]

### 3.2 鼠标点击效果

 1. 新建mouse.js，复制[love][15]或者[富强民主...][16]中的内容到js文件中。
 2. 将mouse.js放到**/themes/next/source/js/src**路径下
 3. 打开/themes/next/layout/layout.swig文件，添加如下代码：
    
    ```js
    <script type="text/javascript" src="/js/src/mouse.js"></script>
    ```

 
### 3.3 文章加密
        
参考：[hexo-blog-encrypt][17]

 1. 在博客根目录下的package.json文件中添加一行代码

    ```json
    "hexo-blog-encrypt": "2.0.*"
    ```

 2. 在博客根目录下：  **npm install**
 3. 在站点配置文件中配置文章加密

    ```json
    # Security
    encrypt:
        enable: true
    ```

 4. 然后在你的文章的头部添加上对应的字段，如 password, abstract, message

    ```md
    title: hello world
    date: 2016-03-30 21:18:02
    tags:
        - fdsafsdaf
    password: Mike
    abstract: 没点开文章前显示的类容，类似于<!--more-->之前写的描述.
    message: 点开文章后，提示输入密码的信息.
    ```
 

    

### 3.4 博客推广及SEO优化


建站完成后百度和Google是没有收录我们的网站的，想要搜索到我们的博客非常困难。因此优化搜索非常有必要。

**博客推广**

博客推广第一步，手动推广。

你可以多浏览别人的博客并留下你的爪印（博客地址），比如 评论 本文；你可以去 [README.md][18]中提到的 [这个issue][19] 留下你的爪印；你可以去 [Issues页面][20] 试着回答下大家的问题并留下你的爪印。

博客推广第二步，[SEO][21]（Search Engine Optimization）。

**搜索引擎**

直接推荐大佬文章：[【搜索优化】Hexo-next百度和谷歌搜索优化][22]

### 3.5 随机生成背景图

在主题下的/source/css/_custom/custom.style文件中，添加如下代码：

```css
body{   
	background:url(https://source.unsplash.com/random/1920x1080);
	background-size:cover;
	background-repeat:no-repeat;
	background-attachment:fixed;
	background-position:50% 50%;
}

.main-inner { 
    margin-top: 60px;
    padding: 60px 60px 60px 60px;
    background: #fff;
    opacity: 0.8;
    min-height: 500px;
}
```

### 3.6 背景动画

依赖于[theme-next-canvas-nest][23],或者[3D library][24]。

 1. 进入到主题目录，如：cd themes/next
 2. 下载插件

    ```
    git clone https://github.com/theme-next/theme-next-canvas-nest source/lib/canvas-nest
    git clone https://github.com/theme-next/theme-next-three source/lib/three
    ```
 3. 在主题配置文件中开启，一次只开启一个

    ```
    canvas_nest: false
    
    three_waves: false
    canvas_lines: true
    canvas_sphere: false
    ```
    
 4. 插件更新

    ```
    $ cd themes/next/source/lib/canvas-nest
    $ git pull
    ```
 
 

 


  [1]: https://github.com/iissnan/hexo-theme-next
  [2]: https://github.com/search?o=desc&q=topic:hexo-theme&s=stars&type=Repositories
  [3]: https://github.com/iissnan/hexo-theme-next
  [4]: https://github.com/theme-next
  [5]: https://hexo.io/themes/
  [6]: https://raw.githubusercontent.com/kevinXiao2016/kevinXiao2016.github.io/hexo/imageStorage/blog/copyLink.png
  [7]: https://hexo.io/zh-cn/docs/configuration.html
  [8]: http://theme-next.iissnan.com/getting-started.html
  [9]: https://github.com/hustcc/canvas-nest.js/blob/master/README-zh.md
  [10]: https://github.com/LouisBarranqueiro/hexo-footnotes
  [11]: https://reuixiy.github.io/technology/computer/computer-aided-art/2017/06/09/hexo-next-optimization.html
  [12]: http://cherryblog.site/Hexo-high-level-tutorialcloudmusic,bg-customthemes-statistical.html
  [13]: http://shenzekun.cn/hexo%E7%9A%84next%E4%B8%BB%E9%A2%98%E4%B8%AA%E6%80%A7%E5%8C%96%E9%85%8D%E7%BD%AE%E6%95%99%E7%A8%8B.html
  [14]: http://www.dingxuewen.com/categories/Site/
  [15]: https://github.com/kevinXiao2016/kevinXiao2016.github.io/blob/hexo/source/love.js
  [16]: https://github.com/kevinXiao2016/kevinXiao2016.github.io/blob/hexo/source/mouse.js
  [17]: https://github.com/MikeCoder/hexo-blog-encrypt/blob/master/ReadMe.zh.md
  [18]: https://github.com/iissnan/hexo-theme-next#live-preview
  [19]: https://github.com/iissnan/hexo-theme-next/issues/119
  [20]: https://github.com/iissnan/hexo-theme-next/issuess://github.com/iissnan/hexo-theme-next/issues/119
  [21]: https://baike.baidu.com/item/SEO
  [22]: http://www.ehcoo.com/seo.html
  [23]: https://github.com/theme-next/theme-next-canvas-nest
  [24]: https://github.com/theme-next/theme-next-three