---
title: "some tips for golang range"  
date: 2021-09-17 23:26:08  
tags: ["go"]  
categories: ["work"]  
series: ["研究"]  
---

There are 2 types of range, `with index` and `without index`. Let's see an example for range `with index`.

```go
func TestRangeWithIndex(t *testing.T) {
 rows := []struct{ index int }{{index: 0}, {index: 1}, {index: 2}}
 for _, row := range rows {
  row.index += 10
 }
 for i, row := range rows {
  require.Equal(t, i+10, row.index)
 }
}
```

the output is:

```shell
    Error Trace: version_test.go:39
    Error:       Not equal: 
                    expected: 10
                    actual  : 0
    Test:        TestShowRangeWithIndex
```

Above test fails since when range `with index`, the loop iterator variable is `the same instance of the variable` with `a clone of iteration target value`.

### The same instance of the variable

Since the the loop iterator variable is `the same instance of the variable`, it may result in hard to find error when use with goroutines.

```go
 done := make(chan bool)
 values := []string{"a", "b", "c"}
 for _, v := range values {
  go func() {
   fmt.Println(v)
   done <- true
  }()
 }
 for _ = range values {
  <-done
 }
```

You might mistakenly expect to see a, b, c as the output, but you'll probably see instead is c, c, c.
This is because each iteration of the loop uses the same instance of the variable v, so each closure shares that single variable.

This is the same reason which result wrong test when use `t.Parallel()` with range.

```go
func TestWithParallel(t *testing.T) {
 tests := []struct {
  name  string
  value int
 }{
  {name: "test 1", value: 4},
  {name: "test 2", value: 4},
  {name: "test 3", value: 4},
  {name: "test 4", value: 4},
 }
 for i, tc := range tests {
  t.Run(tc.name, func(t *testing.T) {
                         // uncomment below line will make 4 tests pass
   //t.Parallel()
   fmt.Printf("%+v == %+v \n", i+1, tc.value)
   require.Equal(t, i+1, tc.value)
  })
 }
}
```

for above table driven tests, `test1`, `test2`, `test3` should fail, `test 4` should pass, it works as expect.
but if we add `t.Parallel()` by uncomment the line, 4 test will pass, and the output is:

```shell
4 == 4 
4 == 4 
4 == 4 
4 == 4 
```

the reason is explained as above, here is another explain in [Go common mistakes guide](https://github.com/golang/go/wiki/CommonMistakes#using-goroutines-on-loop-iterator-variables), 2 reason:

1. In Go, the loop iterator variable is a single variable that takes different values in each loop iteration
2. there is a very good chance that when you run this code you will see the last element printed for every iteration instead of each value in sequence, because the goroutines will probably not begin executing until after the loop

### A clone of iteration target value

Since the loop iterator variable is `a clone of iteration target value`, it may result in logic error if you do not pay attention. It can also lead to performance issue compared with `without index` range or `for` loop.

```go
type Item struct {
 id  int
 value [1024]byte
}

func BenchmarkRangeIndexStruct(b *testing.B) {
 var items [1024]Item
 for i := 0; i < b.N; i++ {
  var tmp int
  for k := range items {
   tmp = items[k].id
  }
  _ = tmp
 }
}

func BenchmarkRangeStruct(b *testing.B) {
 var items [1024]Item
 for i := 0; i < b.N; i++ {
  var tmp int
  for _, item := range items {
   tmp = item.id
  }
  _ = tmp
 }
}
```

```shell
BenchmarkRangeIndexStruct-12             4875518               246.0 ns/op
BenchmarkRangeStruct-12                    16171             77523 ns/op
```

You can see range `with index` is much slower than range `without index`, since range `with index` use cloned value so have big performance decrease if `iteration target` is a large struct which  use a lot of memory.

this post is based on my research on a tidb [maybe common mistakes with table driven tests and t.Parallel()](https://github.com/pingcap/tidb/issues/27779), you can see more detail there.
