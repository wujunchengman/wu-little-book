---
title: 控制流
---

# 控制流

任何一门编程语言都有控制流，包含条件控制和循环控制

## 条件控制

Rust中常用的条件控制是if和match

#### if

if与大多数编程语言一样，都是if……else if……else，如果条件为真，则执行对应的代码块

```rust
    let number = 6;

    if number % 4 == 0 {
        println!("number is divisible by 4");
    } else if number % 3 == 0 {
        println!("number is divisible by 3");
    } else if number % 2 == 0 {
        println!("number is divisible by 2");
    } else {
        println!("number is not divisible by 4, 3, or 2");
    }
```

在Rust中有一个其他编程语言并不常见的语法支持，Rust中的赋值只要右边是表达式即可，因此，只要if中的代码块是表达式，就可以用来赋值

例如在C#中
```csharp
// 允许的操作，使用三元表达式赋值
var z = true ? 1 : 2;

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

#### match

```rust
    let o = Some(5);
    let s = match o {
        Some(v) => format!("Option的值是{}",v),
        None => String::from("Option的值是None"),
    };
    println!("{}",s)
```

match匹配必须是穷尽的，也就是说match分支必须覆盖每一种可能，比如处理Option时，就必须同时指定Some的处理和None的处理，只处理一种是不行的

match匹配必须穷尽，是不是意味着如果使用match时可能情况非常多，就必须把所有的情况都一一写出来呢？答案时不是的，math也支持通配模式和`_`占位符
```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        other => move_player(other),
    }
    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn move_player(num_spaces: u8) {}
```
这里match匹配了一个i32值，不代表必须把每个i32可能的值都写出来，这里使用了通配模式，other并不是一个i32值，Rust便认定other是一个通配模式，会将所有的值都匹配到这个分支（因此通配模式必须在最后用，否则将永远不会匹配到后面的分支了）

```rust
    let dice_roll = 9;
    match dice_roll {
        3 => add_fancy_hat(),
        7 => remove_fancy_hat(),
        _ => reroll(),
    }

    fn add_fancy_hat() {}
    fn remove_fancy_hat() {}
    fn reroll() {}
```
通配模式还支持`_`占位符，`_`占位符是通配模式的一种特殊情况，表示匹配这个分支，但是丢弃匹配的值（`_`在很多编程语言中都表示丢弃的值）

#### if let

if let是match的一种特殊形式，也就是只匹配一种模式，并丢弃其他模式的简便写法

```rust
    let config_max = Some(3u8);
    // if let 写法
    if let Some(max) = config_max {
        println!("The maximum is configured to be {max}");
    }

    // match写法
    match config_max {
        Some(max) => println!("The maximum is configured to be {max}"),
        _ => (),
    }
```

如果仅仅只处理一种模式，那么只需要`if let`直接跟对应的模式即可，这减少了很多样板代码，也让代码看起来更清晰了

if let也可以跟一个else，其对应的语句块则是match中丢弃模式中的语句块
```rust
    let mut count = 0;
    
    // match语法
    match coin {
        Coin::Quarter(state) => println!("State quarter from {state:?}!"),
        _ => count += 1,
    }

    // if let语法
    if let Coin::Quarter(state) = coin {
        println!("State quarter from {state:?}!");
    } else {
        count += 1;
    }
```
这里也展示了if let去匹配是对象位置的差异

上面的match后跟要匹配的变量，里面是对应的模式，而在if let 语法中，前面是要匹配的模式然后跟`=`，后面是要匹配的变量，这里感觉上有点颠倒了顺序，稍有不适，但是也还好


TODO:

## 循环结构

Rust中有三种循环，分别是loop、while、for，和其他编程语言有点一样

#### loop

loop是无限循环，与其他语言中的while(true)类似

```rust
    let mut counter = 0;

    let result = loop {
        counter += 1;

        if counter == 10 {
            break counter * 2;
        }
    };

    println!("The result is {result}");
```

Rust的循环允许返回值，也就是说Rust的循环是表达式，返回值跟在`break`关键字后面




#### while

while则基本相同，都是执行到不满足条件结束循环

```rust
    let a = [10, 20, 30, 40, 50];
    let mut index = 0;

    while index < 5 {
        println!("the value is: {}", a[index]);

        index += 1;
    }
```


#### for

for与C#中的for不同，虽然叫for,但是更像C#中的foreach，和Python中的for类似，它的结构是
```rust
    for number in (1..4).rev() {
        println!("{number}!");
    }
    println!("LIFTOFF!!!");
```
从结构和功能上都更贴近foreach

这里用到了两个标准库的功能，`(1..4)`是标准库的Range，用来生成从一个数字开始到另一个数字之前结束的所有数字的序列；rev()方法则用来反转Range。这里的遍历实际上是3，2，1（左开右闭）

#### 循环标签

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