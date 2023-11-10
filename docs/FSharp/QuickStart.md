---
title: F#快速入门
sidebar: 'auto'
---

# F#快速入门

> 这里是F#快速入门，假定了您了解了什么是F#，F#有什么作用及其适用场景，这里只是讲一下怎么跑起来之类的简单问题

## 开发环境

- SDK：.Net
- 编辑器：VS Code + Ionide扩展

## 交互式窗口

有时只是简单的想运行一段代码执行某项计算或者其他的什么功能，不想要浏览创建、打包和分发应用程序的过程。就像Python的交互模式一样，F#也提供了相同体验的交互窗口

F# 交互窗口是一种交互式编程和脚本环境。 通过控制台或独立脚本文件实时编写和运行代码，从而简化了从想法到代码的过程。

启动交互式窗口
```shell
dotnet fsi
```
执行一行代码，需要以两个分号`;;`结尾，交互式窗口认为`;;`是一行代码的结束，而不是通过换行

```fsharp
> printfn "Hello World!";;
```

退出交互式窗口使用`#q`或 `#quit` 命令。

交互式窗口也可以运行脚本文件，F#脚本文件扩展名为`.fsx`，脚本文件使用标准F#语法，不再以`;;`作为语句的结尾

## 创建F#程序项目

这里只介绍使用.NET CLI，因为使用VS这种IDE工具直接点就是了，使用.NET CLI还是要看一下命令的

```shell
dotnet new console --language F# -o MyFSharpApp
```
这里创建了一个控制台项目，指定了编程语言是F#，项目名是MyFSharpApp，可以看到这和创建C#项目相同，只是通过`--language F#`指定编程语言是F#，默认情况下.NET项目使用C#语言

运行F#项目，这就与运行C#项目一样了，因为这些操作都是基于.NET平台的，只是编程语言不同，一样使用`dotnet run`运行

## F#的基本语法

### 变量

F#中使用let关键字定义变量，需要注意的是，F#中的变量与通常的编程语言不大一样，它的变量默认是不可变的，也就是F#中定义的变量，默认是只读的

```fsharp
// 声明变量name，初始值为Chris
let name = "Chris"
// 默认情况下变量在初始化后不能再变更它的值
```
可变变量
```fsharp
// 声明为mutable的变量才可以重新赋值
let mutable name = "Chris"
// 为name变量重新赋值，重新赋值不是用的等号，而是使用 <-
name <- "Luis" 
```

F#是强类型编程语言，上面没有指定变量类型，是因为编译器进行了类型推断，自动赋予了初始类型，这能够简化很多，也可以手动明确类型
```fsharp
let name:string = "Chris"
```
有时候需要进行类型转换，有两种方法，一种是使用.NET中的转换方法，一种是内置类型提供的方法
```fsharp
// 初始类型为string
let myString = "3"
// 使用.NET类型提供的方法
let myInt = System.Int32.Parse(myString)
// 使用内置类型提供的方法
let myInt = int myString
```


### 输入与输出

不管什么语言，输出到屏幕都是非常常用的功能，比如说JavaScript的console.log，C语言中的print，C++中的cout，F#中也有对应的输出到屏幕的功能

#### printf
打印到 stdout 内联（没有换行符）
```fsharp
let name = "Luis"
let company = "Microsoft"
printf $"Name: {name}, Company: {company}"
```
#### printfn
printfn：它将打印到 stdout（添加一个换行符）
```fsharp
let name = "Luis"
let company = "Microsoft"
printfn $"Name: {name}, Company: {company}"
```
#### Console.WriteLine
来自.NET平台的通用方法，在C#中用得很多，但是在F#中能用但不推荐用

#### printf和printfn输出内容的格式设置

在上面的例子中，使用了插值语法，这在C#中很熟悉，也就是使用`$`在字符串的开头，字符串内可以使用大括号加变量名的方式内嵌变量

除了这一种格式化还可以使用位置参数，语法与string.Format相同`string.Format("My name is {0} and I live in {1}", "Chris", "UK")`，字符串内部使用大括号加数字，补充变量参数

最为常用的格式设置是使用说明符 [格式说明符明细](https://learn.microsoft.com/zh-cn/dotnet/fsharp/language-reference/plaintext-formatting#format-specifiers-for-printf)

F#格式说明符与C语言的格式说明符很像，可以参照

常见的格式说明符，比如说`%d`表示整数之类的
```fsharp
// F#并没有使用括号的，而是空格分隔，很多人一开始都不适应，看起来怪怪的
printf "Age: %i" 65
```

至于输入，F#并没有特别定义，而是使用.NET的通用方法`Console.ReadLine()`和`Console.ReadKey()`

```fsharp
System.Console.Write "Type a value:"
let str = System.Console.ReadLine()
printfn "You typed %s" str
```

### 运算符

| 运算符 | 描述 |
| -- | -- |
| + | 两个值相加 |
| - | 两个值相减 |
| * | 两个值相乘 |
| / | 左侧值与右侧值相除 |
| % | 称为“取模”，左侧值与右侧值相除得到余数 |
| <> | 检查两个值是否不相等 |
| = | 检查两个值是否相等 |

```fsharp
let no = 10
// 先计算no % 2 = 0，判断no是否是偶数，然后再将结果赋初值给isDivisibleByTwo
let isDivisibleByTwo = no % 2 = 0
printfn "Divisible by two %b" isDivisibleByTwo
```
从上面的例子可以看出来，F#的等号看起来有问题，有时候是赋初值，有时候是判断相等，尤其是在同一行的时候，让人有点看不懂，像其他编程语言的`==`判断相等，`=`赋初值更容易理解

### 条件运算符

if是常见的条件运算符，F#的if语句与C#有一点不同，包含一个then，then表示符合条件操作，而在C#中使用的是紧跟在if后面的语句表示正确
```fsharp
// 接收一个输入
let input = Console.ReadLine()
// 强制转换输入的字符串为int，F#允许隐藏变量
let input = int input

if input > 5
// 当then后面有语句时执行后面的语句，下一行的代码不再是then的内容，这其实是缩进决定的，
// 推荐的写法还是then跟在条件的后面，执行的代码块由缩进匹配，像下面的elif一样
then printfn "输入大于5"
// 当then后面直接换行后，根据缩进决定then所执行的语句范围
elif input > 3 then
    printfn "输入大于"
    printfn "then块"
else 
    printfn "什么都不满足"
```
从上面的例子可以看到，缩进对F#的执行流程影响很大，有时候

### 循环

F#有三种循环：for...in、for...to、while...do

#### for...in

```fsharp
let list = [1; 2; 3; 4; 5]
for i in list do
   printf "%d " i
```
for...in会遍历整个可枚举集合，与C#中的foreach类似

#### for...to

for...to提供初值，达到边界后停止循环

for...to有两个版本

```fsharp
// 使用to每次自增标志变量
for i = 1 to 10 do
  printfn "%i " i  // prints 1 2 3 4 5 6 7 8 9 10
// 使用downto每次自减标志变量
for i = 10 downto 1 do
  printfn "%i" i  // prints 10 9 8 7 6 5 4 3 2 1
```
从上面的例子来看，for...to对应C#中的`for(var i = 1; i <= 10; i++)`和`for(var i = 10;i >= 1; i++)`

#### while...do

```fsharp
let mutable num = 1;
while num<=10 do
    printfn $"当前num:{num}"
    num <- num+1;
```

F#的while...do和绝大多数语言的while一样，满足条件则执行，直到不满足条件
