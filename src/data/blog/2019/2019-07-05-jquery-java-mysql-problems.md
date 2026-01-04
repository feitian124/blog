---
title: "java web开放中碰到的三个问题"
description: "java web开放中碰到的三个问题"
pubDatetime: 2019-07-05T12:00:00.000Z
tags: ["java", "web", "mysql"]
categories: ["work"]
---

# java web开放中碰到的三个问题
现在维护一个常规java web项目，jquery前端，java 后台， mysql 数据库，这几天开发过程中分别碰到一个问题，不算很冷门，但没碰到过或疏忽了也花费不少时间解决，特记录下来备用及分享。

## jquery 的 attr（）和 prop（）
男女两个 radio， 使用 jquery 分别赋值男女多次，最后使用 attr 方法异常，使用 prop 方法正常 
```html
<input type="radio" name="sex" value="1"/> 男
<input type="radio" name="sex" value="0"/> 女
```
```js
$("input[name='sex'][value=1]").attr("checked", true)  // ok
$("input[name='sex'][value=1]").attr("checked", false) // ok
$("input[name='sex'][value=1]").attr("checked", true)  // fail，最后男未选中，异常
```
```js
$("input[name='sex'][value=1]").prop("checked", true)  // ok
$("input[name='sex'][value=1]").prop("checked", false) // ok
$("input[name='sex'][value=1]").prop("checked", true)  // ok，最后男选中，正确
```

原因是jquery较高版本对property和attribute做了区分，（有的说1.6+,有的说1.9+,暂未核实）,较高版本应该使用 prop 方法操作 property:  
- property 它是与生俱来的，并不是后天赋予的。比如说，某些对象在定义时就具有某一些属性。
- attribute 本身没有的，后天赋予的。比如说，某些对象在创建后，自定义赋予的一些属性。

下面是官方 https://api.jquery.com/prop/ 的介绍：
```
The difference between attributes and properties can be important in specific situations. Before jQuery 1.6, the .attr() method sometimes took property values into account when retrieving some attributes, which could cause inconsistent behavior. As of jQuery 1.6, the .prop() method provides a way to explicitly retrieve property values, while .attr() retrieves attributes.
```

[关于jQuery radio 选中失效的问题](https://blog.csdn.net/websites/article/details/50769798)
[JS中attribute和property的区别](https://www.cnblogs.com/lmjZone/p/8760232.html)

## java 多线程的异常捕获

在 spring 容器或者使用第三方库的情况下，指不定有些功能是使用多线程实现的，这时需要关注多线程情况下的异常处理。

```java
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ThreadException implements Runnable{
    @Override
    public void run() {
        long id = Thread.currentThread().getId();
        throw new RuntimeException("thread id:"+id);
    }

    public static void main(String[] args){
        //就算把线程的执行语句放到try-catch块中也无济于事
        System.out.println("thread id:"+Thread.currentThread().getId());
        try{
            ExecutorService exec = Executors.newCachedThreadPool();
            exec.execute(new ThreadException());
        }catch(RuntimeException e){
            System.out.println("catched, thread id:"+Thread.currentThread().getId());
        }
    }
}

```

```sh
21:24:02: Executing task 'ThreadException.main()'...

> Task :compileJava
> Task :processResources NO-SOURCE
> Task :classes

> Task :ThreadException.main()
thread id:1
Exception in thread "pool-1-thread-1" java.lang.RuntimeException: thread id:9
	at ThreadException.run(ThreadException.java:8)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
	at java.lang.Thread.run(Thread.java:748)

```

可以看到 “catched” 没有打印。多线程运行不能按照顺序执行过程中捕获异常的方式来处理异常，异常会被直接抛出到控制台。具体如何处理，这里不做说明，知道了原因，解决起来不难。

## mysql 的联表更新

mysql 有 insert into 的语法，如下：

```sql
Insert into Table2(field1,field2,...) select value1,value2,... from Table1
```

但update语法稍有不同， 联表更新源表不是放在 from 子句后面，而是以连接查询的方式.

我碰到的问题其实与上面语法无关，但我的思路在这上面打转，直到同事提醒才发现。其实问题是个低级错误，即分组前不需要 distinct 子查询作为分组关联条件. 如下面的例子，查询班级中每个学生所有课程的总分。

优化前:

```sql
update class c inner join 
(
  select name,
         sum(score) as sum_score
  from student s1,
  (
  	select distinct name from student
  ) s2
  -- 上面这个 s2 子查询是多余的， group by 会自动分组， 不需要 distinct 先查出唯一学生名作为连接条件
  where s1.name = s2.name
  group by name
) as s on c.sid = s.sid
set c.sum_score = s.sum_score
```

优化后：

```sql
update class c inner join 
(
  select name,
         sum(score) as sum_score
  from student s1
  group by name
) as s on c.sid = s.sid
set c.sum_score = s.sum_score
```

在有索引，100多万数据量的情况下，执行时间从30多`秒`优化到30多`毫秒`.

