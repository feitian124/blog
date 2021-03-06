---
title: "不蒜子计数器研究和jsonp的妙用"
date: 2020-05-22 20:00:00
tags: ["js", "前端", "devops"]
categories: ["work"]
series: ["研究"]
---

最近研究使用  halo 部署个人博客，很常见的一个需求就是网站访问量统计，毕竟每个新站长都想知道自己的网站有多少人访问了。
halo 内置了不蒜子极简网站计数器，简单的添加一个 js 和页面标签，就能获得你网站的访问人数等数据，简单，够用。
那么它是怎么实现的呢，下面我们就来研究一下。

## 获得源码
不蒜子只需要一个 js 文件，把它拷贝下来，比较简单不到 100 行，直接贴在下面:
```js
// http://s.xinac.net/static/busuanzi/v2.3.0/bsz.pure.mini.js
var bszCaller, bszTag;
!function() {
    var c, d, e, a = !1, b = [];
    ready = function(c) {
        return a || "interactive" === document.readyState || "complete" === document.readyState ? c.call(document) : b.push(function() {
            return c.call(this)
        }),
        this
    },
    d = function() {
        for (var a = 0, c = b.length; c > a; a++)
            b[a].apply(document);
        b = []
    },
    e = function() {
        a || (a = !0,
        d.call(window),
        document.removeEventListener ? document.removeEventListener("DOMContentLoaded", e, !1) : document.attachEvent && (document.detachEvent("onreadystatechange", e),
        window == window.top && (clearInterval(c),
        c = null)))
    },
    document.addEventListener ? document.addEventListener("DOMContentLoaded", e, !1) : document.attachEvent && (document.attachEvent("onreadystatechange", function() {
        /loaded|complete/.test(document.readyState) && e()
    }),
    window == window.top && (c = setInterval(function() {
        try {
            a || document.documentElement.doScroll("left")
        } catch (b) {
            return
        }
        e()
    }, 5)))
}(),
bszCaller = {
    fetch: function(a, b) {
        var c = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
        window[c] = this.evalCall(b),
        a = a.replace("=BusuanziCallback", "=" + c),
        scriptTag = document.createElement("SCRIPT"),
        scriptTag.type = "text/javascript",
        scriptTag.defer = !0,
        scriptTag.src = a,
        document.getElementsByTagName("HEAD")[0].appendChild(scriptTag)
    },
    evalCall: function(a) {
        return function(b) {
            ready(function() {
                try {
                    a(b),
                    scriptTag.parentElement.removeChild(scriptTag)
                } catch (c) {
                    bszTag.hides()
                }
            })
        }
    }
},
bszCaller.fetch("//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback", function(a) {
    bszTag.texts(a),
    bszTag.shows()
}),
bszTag = {
    bszs: ["site_pv", "page_pv", "site_uv"],
    texts: function(a) {
        this.bszs.map(function(b) {
            var c = document.getElementById("busuanzi_value_" + b);
            c && (c.innerHTML = a[b])
        })
    },
    hides: function() {
        this.bszs.map(function(a) {
            var b = document.getElementById("busuanzi_container_" + a);
            b && (b.style.display = "none")
        })
    },
    shows: function() {
        this.bszs.map(function(a) {
            var b = document.getElementById("busuanzi_container_" + a);
            b && (b.style.display = "inline")
        })
    }
};
```

查看浏览器 network 记录，可以看到它往 busuanzi.ibruce.info 发了一个请求, 并返回了如下数据:
```js
// request 如下
// http://busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback_1094480025895
// 同时 response 还会 set-cookie: busuanziId
try { 
    BusuanziCallback_1094480025895({ 
        "site_uv": 1465179, 
        "page_pv": 7582792, 
        "version": 2.4, 
        "site_pv": 20797087 
    }); 
} catch (e) { }
```

## 原理分析
结合代码和 network 记录，可以猜测它的原理大致如下：

    1. 嵌入 js 后， 用户访问页面时， 该 js 使用 jsonp 发送一个跨域请求到不蒜子后台  
    2. 不蒜子后台根据 http 协议获得访问源 ip，即可以确定一次访问和一个客户  
    3. 生成访问量数据返回，前端接收后更新页面  

上面第 2 步还有一个问题，即不蒜子发送请求到后台时用户访问的是哪个网址呢？这样才能知道这一次访问应该算在谁的头上。

我们到 http request headers的属性里面去找，可以发现有一个属性可以满足我们的需求，即：
> Refer: 当浏览器向 web 服务器发送请求时，带上此参数告诉浏览器我是从哪个页面链接过来的, 服务器可以获得一些信息用于处理

这个 Refer 有一些有趣的应用，比如，某个服务器设置只能从它自己的网址访问，如果发送的 refer 不符合要求就不允许访问，这样就实现了防盗链。但并不是每个 http 请求都会带 refer， 比如浏览器直接输入网址访问。不蒜子如果使用 refer 的话会有统计不准确的问题，那还有其他方法吗？对，使用 cookie 标志某一个访问地址, 这应该就是不蒜子会设置一个 cookie busuanziId 的原因了。至此，整个不蒜子的原理都理通了。


## 实现解读
然后我们来看看它是如何实现的。通过分析，我们知道了主要计数点就是 jsonp，然后还需解决浏览器兼容性问题，以及如何使用浏览器事件将整个流程串起来。

### 还原后代码
代码经过了压缩，可读性较差，下面是我手动还原之后的代码:

```js
var bszCaller, bszTag;
!function() {
    var intervalId, applyCallbacks, callAndClean, ok = false, callbacks = [];
    ready = function(callback) {
        return ok || "interactive" === document.readyState || "complete" === document.readyState
            ? callback.call(document)
            : callbacks.push(function() {
                return callback.call(this)
            }),
            this
    },
    applyCallbacks = function() {
        for (var i = 0, len = callbacks.length; len > i; i++) {
            callbacks[i].apply(document);
        }
        callbacks = []
    },
    callAndClean = function() {
        ok || (
            ok = true,
            applyCallbacks.call(window),
            document.removeEventListener
                ? document.removeEventListener("DOMContentLoaded", callAndClean, false)
                : document.attachEvent && (
                    document.detachEvent("onreadystatechange", callAndClean),
                    window == window.top && (clearInterval(intervalId), intervalId = null)
                )
        )
    },
    document.addEventListener
        ? document.addEventListener("DOMContentLoaded", callAndClean, false)
        : document.attachEvent && (document.attachEvent("onreadystatechange", function() {
                /loaded|complete/.test(document.readyState) && callAndClean()
            }),
            // doScroll判断ie6-8的DOM是否加载完成, 模拟 addDOMLoadEvent 事件
            window == window.top && (
                intervalId = setInterval(function() {
                    try {
                        ok || document.documentElement.doScroll("left")
                    } catch (err) {
                        return
                    }
                    callAndClean()
                }, 5)
            )
        )
}(),

bszCaller = {
    fetch: function(src, callback) {
        var jsonpCallback = "BusuanziCallback_" + Math.floor(1099511627776 * Math.random());
        window[jsonpCallback] = this.evalCall(callback),
        src = src.replace("=BusuanziCallback", "=" + jsonpCallback),
        scriptTag = document.createElement("SCRIPT"),
        scriptTag.type = "text/javascript",
        scriptTag.defer = true,
        scriptTag.src = src,
        document.getElementsByTagName("HEAD")[0].appendChild(scriptTag)
    },
    evalCall: function(callback) {
        return function(data) {
            ready(function() {
                try {
                    callback(data),
                    scriptTag.parentElement.removeChild(scriptTag)
                } catch (err) {
                    bszTag.hides()
                }
            })
        }
    }
},

bszCaller.fetch("//busuanzi.ibruce.info/busuanzi?jsonpCallback=BusuanziCallback", function(data) {
    bszTag.texts(data),
    bszTag.shows()
}),

bszTag = {
    bszs: ["site_pv", "page_pv", "site_uv"],
    texts: function(data) {
        this.bszs.map(function(a) {
            var b = document.getElementById("busuanzi_value_" + a);
            b && (b.innerHTML = data[a])
        })
    },
    hides: function() {
        this.bszs.map(function(a) {
            var b = document.getElementById("busuanzi_container_" + a);
            b && (b.style.display = "none")
        })
    },
    shows: function() {
        this.bszs.map(function(a) {
            var b = document.getElementById("busuanzi_container_" + a);
            b && (b.style.display = "inline")
        })
    }
};
```

我不知道是原作者本来就是这么写的还是压缩工具导致，可以看出还原后可读性仍然不太好，大量使用了3元运算符和逻辑运算符的短路特性，下面做一些解读。

### jsonp
众所周知，ajax 请求普通文件有跨域问题，但 web 页面调用 js 文件不受影响(有 src 这个属性的标签都有跨域能力)，那跨域访问数据就只有一种可能: 远程服务器设法将数据装进 js 格式， 供客户端进一部处理。更妙的是， JSON 可以简洁的表示复杂数据， 还被 js 原生支持， 于是逐渐形成了一种非正式传输协议， jsonp.
以不蒜子 js 为例子， 见如下的注释：
```js
// 下面这个语句在注册一个名称类似 BusuanziCallback_1094480025895 的方法
 window[jsonpCallback] = this.evalCall(callback)

// 替换后大概是这个样子
 window['BusuanziCallback_1094480025895'] =  function(data) {
    ready(function() {
        try {
            bszTag.texts(data),
            bszTag.shows(),
            scriptTag.parentElement.removeChild(scriptTag)
        } catch (err) {
            bszTag.hides()
        }
    })
}

// 发起跨域请求， 服务器返回如下代码，数据和回调函数名也包括里面，加载完成时调用 BusuanziCallback_1094480025895 方法
 try { 
    BusuanziCallback_1094480025895({ 
        "site_uv": 1465179, 
        "page_pv": 7582792, 
        "version": 2.4, 
        "site_pv": 20797087 
    }); 
} catch (e) { }

```

### 逗号运算符
全篇出现了几处难懂的语法，如
```js
    ready = function(callback) {
        return ok || "interactive" === document.readyState || "complete" === document.readyState
            ? callback.call(document)
            : callbacks.push(function() {
                return callback.call(this)
            }),
            this
    },
```
这里用到了 || 的短路特性，嵌套在一个3元表达式里面，简化后如下:
```js
    ready = function(callback) {
        return true ? f1(): f2(), this
    }
```
还是不太容易理解对不对？这里其实用到 js 的逗号运算符的一个特性, 即使用逗号运算符连接的多个子表达式，会依次执行各个子表达式，然后以最后一个表达式的结果作为整个表达式的值。举个例子吧.
```js
var a = (1,2,3); // a == 3

var  f1 = function() {
    return false ?  a != 3 : a==3; 
}
var b = f1(); // b == true
```

### 立即执行函数
立即执行函数是一种语法，让你的函数在定义以后立即执行, 它有一些好处, 如: 不必为函数命名，内部形成了一个单独的作用域等。它有两种常见的形式：
```js
(function(){
    // ...
})();

(function(){
    // ...
}());
```

() ! + - = 等运算符都能起到立即执行的作用，因为它们都可以将`匿名函数或函数声明变成函数表达式`。
再看另一种形式:
```js
!function(test) {
    console.log(test);
}(123);
```
不蒜子js第2行即用了类似上面的立即执行函数。

### 上下文和 this
js 的一大特点就是函数存在 `定义时上下文`，`运行时上下文` 以及 `上下文可变`，js 提供了一种机制可以手动设置
this 的指向， 就是 call 和 apply。他们的作用相同但调用方式不同:
```js
fn.call(obj, p1,p1,p3);
fn.apply(obj, [p1, p2, p3]);
// 通过上述方法，fn内部的 this 绑定为 obj, 因此可以用 this.xx 的方式访问 obj 的 xx 属性
```

### 浏览器兼容性

为了兼容 ie8 以下浏览器， 不蒜子js 还做了一些 hack 工作，主要是下面2个点:

1. 浏览器标准 `document.addEventListener` 和 ie8 以下的 `document.attachEvent`

2. 浏览器标准 `document.DOMContentLoaded` 和 ie8 以下的 `doScroll判断DOM是否加载完成, 模拟 DOMContentLoaded 事件`

至此， 整个实现流程也很清晰了:

1.  页面加载`不蒜子js`后，立即执行函数，注册 `DOMContentLoaded` 事件调用 `callAndClean`.

2. 然后调用 bszCaller.fetch 发起请求, 触发 callAndClean。

## 总结
至此，整个不蒜子js的解读已经完成，涉及以下知识点:

- jsonp
- 逗号运算符
- 立即执行函数
- 上下文和 this
- 浏览器兼容性

比较短小精妙，如果能看到源码就更好了。
