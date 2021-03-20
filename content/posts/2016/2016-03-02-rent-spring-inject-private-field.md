---
layout: post
title: "spring 注入私有属性"
date: 2016-03-02 20:19:01
categories: work
---

# spring 可以注入私有属性

因工作原因, 最近又重归 java 阵营, java 已经到了版本8, spring 已经到了 4.X.

在学过 ruby on rails 和 nodejs 等东西后, 对 java 和 spring 又有了新的认识.

今天, 在看代码的时候, 发现 spring 可以注入私有 bean, 有点小惊讶, 我印象中 java 强类型, 访问修饰符这样的东西反射机制应该是改不了的.

```java

@Component
public class Bean1 {
    //...
}

@Component
public class Bean2 {

    @Autowired
    private Bean1 bean1;

}

```

spring 有4种注入方式:

1. 构造函数
2. setter 方法
3. 静态工厂方法
4. 实例工厂方法

上述代码好像一条也不满足, 而且 bean1 是私有的, 我以为注入不了, 谁知道居然可以.

一句话:

java的反射可以绕过访问权限，访问到类的私有方法和成员。
