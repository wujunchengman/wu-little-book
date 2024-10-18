---
title: 慎用递归
---

# 慎用递归

## 起因： 

在学习Rust的时候，有一道语法练习题是计算斐波那契数列的第N项的值，这是一道非常简单的题，但是引发了一个使用递归性能问题，考虑到用Rust的人不多，后面的代码都是C#的，因为C#的语法更大众一些，更好看懂

## 第一次解

```csharp
public static ulong FibonacciNumberRecursion(int n)
{
    if (n == 1)
        return 0;
    else if (n == 2)
        return 1;
    else
    {
        return FibonacciNumberRecursion(n - 1) + FibonacciNumberRecursion(n - 2);
    }
}
```
这个写法非常的符合大脑思考，第一项返回0，第二项返回1，后面的返回前两项之和，简单测试没有任何问题。但是，这个算法有非常严重的性能问题，当n到40的时候，计算速度已经到了肉眼不可接受的地步，再往上就到了分钟级的了，造成运行缓慢的原因，就是递归会不停的压栈，存储当前的状态，这是非常没有必要的，于是我写了第二种解法

## 第二次解
```csharp
public static ulong FibonacciNumber(int n)
{
    if (n == 1)
        return 0;
    else if (n == 2)
        return 1;
    else
    {
        var x = 3;
        ulong xSub1 = 1;
        ulong xSub2 = 0;
        ulong value = 0;
        while (x <= n)
        {
            value = xSub1 + xSub2;
            xSub2 = xSub1;
            xSub1 = value;
            x += 1;
        }
        return value;
    }
}
```
这一次使用循环代替递归，它没有频繁的压栈，性能非常好，计算第200项的值也在纳秒级别，于是便有了思考，是否所有的递归都是这么不堪？经过查阅资料，发现第一次的递归有很多是无效递归，于是进行了改写

### 第三次解
```csharp
public static ulong FibonacciNumberRecursion2(int n, ulong a = 0, ulong b = 1)
{
    // 斐波那契数列是第N项等于前两项的和
    if (n == 1)
    {
        return a;
    }
    else
    {
        return FibonacciNumberRecursion2(n - 1, b, a + b);
    }
}
```
这一次的递归使用了a和b两个变量去缓存前两项的值，这里看起来和实际情况是有差异的，它的计算过程更接近循环，因为a，b是从0，1开始往上加出来的，虽然递归是n-1。这里的n-1更像是为了达到终止递归的条件

经过修改的递归方法，性能和循环已经很接近了，只差一点点，那这个是不是递归已经非常强了？也不是，经过查阅资料，发现是编译器针对尾递归进行了优化，会用类似循环的机制来运行尾递归

尾递归：如果一个函数中所有递归形式的调用都出现在函数的末尾，我们称这个递归函数是尾递归的。当递归调用是整个函数体中最后执行的语句且它的返回值不属于表达式的一部分时，这个递归调用就是尾递归。尾递归函数的特点是在回归过程中不用做任何操作，这个特性很重要，因为大多数现代的编译器会利用这种特点自动生成优化的代码。

### 第四次解

经过上面的解法，经过编译器优化的尾递归已经很好了，但是还想看看如果没有优化的性能是什么样子呢？因为第一次解的速度慢不只是递归的原因，还有很多无意义计算，那么抛开无意义的计算，递归和循环有多少差距呢？

```csharp
public static ulong FibonacciNumberRecursion3(int n, ulong a = 0, ulong b = 1)
{
    // 斐波那契数列是第N项等于前两项的和
    if (n == 1)
    {
        return a;
    }
    else
    {
        var r = FibonacciNumberRecursion3(n - 1, b, a + b);
        var z = r + 1;
        
        return z-1;
    }
}
```
在这里使用了+1和-1，主要是为了破坏尾递归，那么最后的性能是怎样的呢
```
BenchmarkDotNet v0.13.10, Windows 10 (10.0.19045.3570/22H2/2022Update)
AMD Ryzen 7 4800HS with Radeon Graphics, 1 CPU, 16 logical and 8 physical cores
.NET SDK 8.0.100
  [Host]     : .NET 6.0.25 (6.0.2523.51912), X64 RyuJIT AVX2
  DefaultJob : .NET 6.0.25 (6.0.2523.51912), X64 RyuJIT AVX2
```
| Method     | Mean      | Error    | StdDev   |
|----------- |----------:|---------:|---------:|
| Loop       |  53.02 ns | 0.111 ns | 0.098 ns |
| Recursion2 |  52.98 ns | 0.261 ns | 0.232 ns |
| Recursion3 | 348.34 ns | 4.367 ns | 4.084 ns |

求第200项的值，Loop使用循环，Recursion2是尾递归，Recursion3是破环了尾递归的情况，从这上面来看，卫队贵对性能的影响还是很大的

## 结论

上面4中求斐波那契数列的第N项值的写法，有不同的性能表现，使用循环和尾递归相差无几，如果是线性递归，那么性能就会差很多，因此

为了性能，优先使用循环解决问题，经过编译器优化的尾递归性能也不差，尽量避免使用普通的递归