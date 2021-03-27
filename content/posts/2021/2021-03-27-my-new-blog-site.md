---
title: "博客迁移到 hugo"
date: 2021-02-01 23:26:08
tags: ["blog", "hugo"]
categories: ["work"]
series: ["研究"]
---

## 折腾博客的那些事

2012年开始折腾博客，转眼已经8个年头，一开始用的 jekyll, 期间在简书上面也写了少量文章，再基于 halo 搭建了动态站点 [topcoder](https://topcoder.club)， 
然后最近受 [苏洋的博客](https://soulteary.com/) 启发基于 hugo 搭建了本博客。

hola 是带后端的博客程序， 本意是搞一点动态内容和互动进去， 可是本身的懒惰导致写博客都没有好好坚持， 动态站点一年多也跟一个静态站点差不多，没什么动态内容。
而像 [苏洋的博客](https://soulteary.com/) 这样的静态站点， 内容却挺吸引我， 可见重要的是内容。

### 选型
go 是一门有活力有前途的语言，我最近也正在学习， 这是我选择 hugo 的一个原因， 另一个原因是 hugo 确实很快, 我现在80多篇文章 300 毫米左右, 估计 10000 篇博客以内， 都在一秒内就够了。

```shell
Start building sites … 

                   | ZH   
-------------------+------
  Pages            | 161  
  Paginator pages  |  17  
  Non-page files   |   0  
  Static files     |   1  
  Processed images |   0  
  Aliases          |  41  
  Sitemaps         |   1  
  Cleaned          |   0  

Built in 362 ms

```

但它的模板语法写起来还是挺繁琐， 做主题， 做静态站点这块前端有一定成本。

所以我对另一种方案也挺感兴趣， 即 markdown as headless cms 提供 api, 前端用 react 等技术栈的做 ssg 渲染， 其实有现成的解决方案就是 gatsbyjs,
nuxtjs/content 也提供了类似的方案。这种方案的好处是可以很好的使用现在 react 和 vue 等的生态。

目前我先使用 hugo 用用看。

### 主题
hugo 的主题还算丰富，挑几个说一下：
  
- https://github.com/adityatelange/hugo-PaperMod.git
  这个很简洁，干净清爽，对比度稍高，目前我使用这款
- https://github.com/olOwOlo/hugo-theme-even.git
  这个配色很舒服，适合长期阅读，可是对 markdown 格式要求似乎高一些，我的编译不过。
- https://github.com/dillonzq/LoveIt
  这个最漂亮，且作者是中国人对中文排版特意优化过。不过有半年没更新了。
  
### 域名
  如果在国内注册的话，有备案和监管的问题，然后价格也不便宜。最后多方比较选择了 NameSilo 中， 好像 Namecheap 也不错。
  国内的过度监管感觉已经影响到创新和信息流动了，可以明显感觉到国外的文化创作啊，技术创新啊更加活跃。
  举个例子，域名需要备案， 个人站点会少很多， 域名需求和部署需求会下降， 这可能也是国内没有 netlify 和 vercel 这一类服务商的原因。
  
### 部署
  github pages 不用说很慢了， 然后用了 netlify 也很慢。还有一种方案是 cdn 加速， 如 jsdeliver 和 Cloudflare， 我没有试。
  目前用的 vercel, 速度还可以接受，免费额度比 netlify 还大一点。 serverless 是有待发掘的功能。详细的情况可以参考下面几篇文章。
  目前上述几个平台都自带 ci/cd, 你首次配置好之后，之后只需 push 到仓库， 后面发布的事情就不用管了。

### 感谢
有想部署静态博客的朋友， 可以参考下面几篇文章， 也欢迎大家访问我这个站点。 [Ming 的博客](https://p2y.top)。
  * jsdeliver https://blog.halberd.cn/article/1603206409367#/
  * https://www.bmpi.dev/dev/guide-to-setup-blog-site-with-zero-cost-5/   
  * https://www.v2ex.com/t/739279
