---
layout: post
title: "理解 CSRF 和 XSS 攻击"
date: 2014-11-08 22:30:29
---

## CSRF(cross-site-request-forgeries)

当 web 站点允许认证用户执行某个敏感操作, 但不验证该操作是否来自用户本身时, 该站点就存在 CSRF 漏洞.

理解 CSRF 的关键是, 站点通常并不是验证一个请求来自认证过的用户, 而仅仅验证请求来自该用户使用的浏览器. 浏览器会同时运行多个网站的页面, 则存在这么一个
危险, 一个站点(在用户不知情的情况下)发送请求到站点二, 站点二错误的认为该请求来自用户. 

如果一个用户访问了攻击者的站点, 攻击者可以强迫用户的浏览器执行一些敏感操作, 而目标站点看到请求是来自一个认证过的用户的浏览器, 毫无防备的执行了攻击者的操作, 而没有意识到被攻击了. CSRF 攻击容易和 CSS(cross site scripting) 混淆, 但是他们是很不同的. 一个对 XSS 做过完全防备的网站, 还是会有 CSRF 漏洞.

## XSS(cross-site scripting)

跨站脚本攻击是一种注入攻击, 恶意脚本被嵌入到正常的站点; 当用户访问那些正常站点时, 恶意脚本被同时加载到浏览器, 访问 cookie, session token, 
其它敏感信息, 甚至重写整个页面.

[A nice CSRF blog](https://freedom-to-tinker.com/blog/wzeller/popular-websites-vulnerable-cross-site-request-forgery-attacks/)

[OWASP](https://www.owasp.org/index.php/Cross-site_Scripting)