# java 整型比较的坑

今天碰到一个奇怪的空指针错误，场景大概是这样，从数据库中找出选修了某门课程的学生列表，然后筛选出不及格的考生，要求他们重新考试，部分代码如下

```java
List<Student> list = StudentMapper.findByClass(classId); //找出选修课程的所有学生
list.stream()
    .filter(x -> x.getScore() < 60)
    ...
```

然而上面的代码，运行时会报空指针异常，由于错误信息包在 stream 里面并不是很清晰，我第一个想法就是 x 为空，故 `x.getScore(0)` 报空指针异常， 然而经过debug， 发现 `list` 均不是 null。然后我的方向往 stream api 的方向去找了，莫非全过滤调了，或者哪个 api 用错了，一番折腾，依旧没有解决。

最后，我注意到了 `x.getScore()` 返回的是整型`Integer`, `int` 的自动拆封装箱类型，原来不是 `x` 的值为空，而是`x.getScore()`的值为空，然后和 60 比较大小时，抛出空指针异常。

由于在其他场景自动拆封装箱使用的挺顺畅，以及编译期不报语法错误，`Integer` 和`int`互相比较时，很容易写成较简单的 `==` 形式，然后就出现了奇怪的空指针异常。

整型比较还有更不容易发现的坑，如下面的代码:

```java
        Integer i1 = 120;
        Integer i2 = 120;
        Integer i3 = 130;
        Integer i4 = 130;

        System.out.println(i1==i2);  //true
        System.out.println(i3==i4);  //false
    }
```

是不是很惊奇？原因是 java 为优化性能，默认创建了值在(-128,128]这个范围内的整型装箱实例。

`Integer`类型的比较，实际还是遵循对象的比较方法，用`equals`方法，此时又不得不注意 null 空指针。

注意 Integer、Short、Byte、Character、Long、Double、Float、Boolean 这几个自动拆封装箱类型都有类似的问题，所以还是尽量用原生类型吧。

