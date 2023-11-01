---
title: 控制流
---

# 控制流

任何一门编程语言都有控制流，包含条件控制和循环控制

## 条件控制

Rust中常用的条件控制是if和match

if与大多数编程语言一样，都是if……else if……else，如果条件为真，则执行对应的代码块

在Rust中有一个其他编程语言并不常见的语法支持，Rust中的赋值只要右边是表达式即可，因此，只要if中的代码块是表达式，就可以用来赋值

例如在C#中
```cshrp
// 允许的操作，使用三元表达式赋值
var z = true?1:2;

// 不允许的操作
// var z ={
//     if(true){
//         return 0;
//     }else{
//         return 10;
//     }
// }
```

在Rust中
```rust
// 正确操作
let number = if true { 5 } else { 6 };
```

当if……else过多时，代码的可读性将大大降低，此时可以使用更为强大的match

TODO:

## 循环结构

Rust中有三种循环，分别是loop、while、for，它和其他编程语言不大一样，其中loop是无限循环，与其他语言中的while(true)类似；while则基本相同，都是执行到不满足条件结束循环；for与其他语言不同，虽然叫for,但是更像C#中的foreach，它的结构是
```rust
for element in a {
        println!("the value is: {element}");
    }
```
从结构和功能上都更贴近foreach

Rust的循环还有一个比较特别的点，就是支持循环标签，一般的语言中，break和continue都是作用于最内层的循环，但Rust支持使用循环标签，指定break和continue作用与哪个循环上
```rust{3,10,13}
fn main() {
    let mut count = 0;
    'counting_up: loop {
        println!("count = {count}");
        let mut remaining = 10;

        loop {
            println!("remaining = {remaining}");
            if remaining == 9 {
                break;
            }
            if count == 2 {
                break 'counting_up;
            }
            remaining -= 1;
        }

        count += 1;
    }
    println!("End count = {count}");
}
```
最外层定义了循环标签`counting_up`，在13行中的break指定了循环标签，这时候break就会作用于循环标签对应的外层loop循环，而第9行的break并没有指定循环标签，则会作用于最内层的循环