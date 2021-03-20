---
title: "Springboot项目的nginx_https配置研究"
date: 2020-09-24 01:22:06
tags: ["nginx", "springboot", "https"]
categories: ["work"]
series: ["研究"]
---

近期研究了一下 springboot jsp web 项目的 https 部属，分享一下成果，代码见
https://gitee.com/feitian124/https_demo

## 准备工作
1. clone 并打包该项目， 以 war 包方式在 tomcat 中运行，访问 "http://localhost:8080/", 可以看到网页内容 "welcome, now:14:05:23.489"。

2. 新装 nginx, 访问 "http://localhost/"， 可以看到 nginx 的欢迎页面。

## 80 端口访问项目首页
修改 nginx 如下配置， 可以 http 正常 80 端口访问项目首页了， 但 https 仍然不行。
```
        location / {
	         proxy_pass http://127.0.0.1:8080;
			 proxy_set_header Host $host;
			 proxy_set_header X-Real-IP $remote_addr;
			 proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        }
```

## Nginx 配置 HTTPS
Nginx 配置 HTTPS 并不复杂，主要有两个步骤：签署第三方可信任的 SSL 证书 和 配置 HTTPS

### 获得 ssl 证书
理论上，我们自己也可以签发 SSL 安全证书，但是我们自己签发的安全证书不会被主流的浏览器信任，所以我们需要被信任的证书授权中心（ CA ）签发的安全证书,
通常需要购买，也有免费的，通过第三方 SSL 证书机构颁发.

为了加快推广 https 的普及， EEF 电子前哨基金会、 Mozilla 基金会和美国密歇根大学成立了一个公益组织叫 ISRG (Internet Security Research Group ),
这个组织从 2015 年开始推出了 Let's Encrypt 免费证书.后来 ISRG 的发起者 EFF （电子前哨基金会）为 Let's Encrypt 项目发布了一个官方的客户端 Certbot ,
利用它可以完全自动化的获取、部署和更新安全证书。

所以这里有3个方式了：
- 自己签发
- 申请免费证书，可以利用 certbot 完全自动化的获取、部署和更新
- 购买

这里演示目的，我们使用自己签发的方式。创建自签名证书需要安装openssl，使用以下步骤：
- 创建Key；
- 创建签名请求；
- 将Key的口令移除；
- 用Key签名证书。
  为HTTPS准备的证书需要注意，创建的签名请求的CN必须与域名完全一致，否则无法通过浏览器验证。

以上步骤命令繁琐，所以有人做了一个shell脚本，能一次性把证书搞定。从这里下载脚本：
https://github.com/michaelliao/itranswarp.js/blob/master/conf/ssl/gencert.sh

运行脚本，假设你的域名是www.test.com，那么按照提示输入：

```
 2020-09-04 15:47:20 ⌚  ming-acer in ~/learn/https_demo
± |master S:2 ✗| → ./gencert.sh 
Enter your domain [www.example.com]: www.test.com
Create server key...
Generating RSA private key, 1024 bit long modulus (2 primes)
...........+++++
................+++++
e is 65537 (0x010001)
Enter pass phrase for www.test.com.key:
Verifying - Enter pass phrase for www.test.com.key:
Create server certificate signing request...
Enter pass phrase for www.test.com.key:
Remove password...
Enter pass phrase for www.test.com.origin.key:
writing RSA key
Sign SSL certificate...
Signature ok
subject=C = US, ST = Mars, L = iTranswarp, O = iTranswarp, OU = iTranswarp, CN = www.test.com
Getting Private key
TODO:
Copy www.test.com.crt to /etc/nginx/ssl/www.test.com.crt
Copy www.test.com.key to /etc/nginx/ssl/www.test.com.key
Add configuration in nginx:
server {
    ...
    listen 443 ssl;
    ssl_certificate     /etc/nginx/ssl/www.test.com.crt;
    ssl_certificate_key /etc/nginx/ssl/www.test.com.key;
}
```
注意4次输入的口令都是一样的, 我输入的都是 test.

在当前目录下会创建出4个文件：

- www.test.com.crt：自签名的证书
- www.test.com.csr：证书的请求
- www.test.com.key：不带口令的Key
- www.test.com.origin.key：带口令的Key

Web服务器需要把www.test.com.crt发给浏览器验证，然后用www.test.com.key解密浏览器发送的数据，剩下两个文件不需要上传到Web服务器上。

### 配置 HTTPS
以Nginx为例，需要在server {...}中配置：

```
server {
    ...
    ssl on;
    ssl_certificate     /etc/nginx/ssl/www.test.com.crt;
    ssl_certificate_key /etc/nginx/ssl/www.test.com.key;
}
```

如果一切顺利，打开浏览器，就可以通过HTTPS访问 "https://localhost", 可以看到网页内容 "welcome, now:16:33:16.160"。

第一次访问时会出现警告（因为我们的自签名证书不被浏览器信任），
把证书通过浏览器导入到系统（Windows使用IE导入，Mac使用Safari导入）并设置为“受信任”，以后该电脑访问网站就可以安全地连接Web服务器了。

## 优化 https 配置
- 减少 CPU 运算量
    * 使用 keepalive 长连接
    * 复用 SSL 会话参数

- 使用 HSTS 策略强制浏览器使用 HTTPS 连接
    * 添加 Strict-Transport-Security 头部信息
    * 使用 HSTS 预加载列表（HSTS Preload List）

- 加强 HTTPS 安全性
    * 使用迪菲-赫尔曼密钥交换（D-H，Diffie–Hellman key exchange）方案
    * 添加 X-Frame-Options 头部信息，减少点击劫持
    * 添加 X-Content-Type-Options 头部信息，禁止服务器自动解析资源类型
    * 添加 X-Xss-Protection 头部信息，防XSS攻击

- HTTP/HTTPS混合服务器配置

- 基于服务器名称（name-based）的 HTTPS 服务器
    * 为每个 HTTPS 服务器分配独立的 IP 地址
    * 泛域证书
    * 域名标识（SNI）

## 其它选择
现在有些新的工具支持开箱即用的 https 配置:
1. 如 caddy2, a powerful, enterprise-ready, open source web server with automatic HTTPS written in Go
2. 边缘路由器 Træfɪk 是一个云原生的新型的 HTTP 反向代理、负载均衡软件。

它们都是 go 编写的，不得不承认 go 语言在这方面的强大，有机会下次再分享。

## 参考
- Configuring HTTPS servers， http://nginx.org/en/docs/http/configuring_https_servers.html
- Nginx 配置 HTTPS 服务器， https://aotu.io/notes/2016/08/16/nginx-https/index.html
- SSL/TLS协议运行机制的概述， http://www.ruanyifeng.com/blog/2014/02/ssl_tls.html
- Nginx 通过 certbot 为网站自动配置 SSL 证书并续期， https://blog.51cto.com/wzlinux/2385116
- 给Nginx配置一个自签名的SSL证书 https://www.liaoxuefeng.com/article/990311924891552