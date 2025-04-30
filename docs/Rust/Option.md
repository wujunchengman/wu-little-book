---
title: Rust中的Option枚举：可能为Null的值
---

Rust没有空值，只有一个可以编码存在或不存在概念的枚举。这个枚举就是`Option<T>`

在C#中，引用类型对象的默认值就是`Null`，如果直接声明了一个变量但又忘了初始化直接进行使用，在编译阶段是不会报错的，或者在运行途中，将变量置为Null，而后又正常使用，在编译期得不到任何提示，大多数编程语言都是这样设计的。这会导致很多人忘记了这个变量可能为Null，或者使用第三方库时并不知道可能为Null，直接使用导致了Null异常。为了解决这个问题，C#在后续的版本（C#10.0）中引入了可空引用类型来解决这个问题，而Rust作为一门新语言，在设计阶段直接不允许Null值，而是用Option来表示这个值可能不存在

Option是一个枚举，包含Some和None，Some代表具体的值，而None则代表没有值，使用Option能够强制开发人员对可能为Null的值进行判断处理，并且明确了可能为Null和不可能为Null，这样避免了感觉不可能为Null，实际可能为Null的情况，以减少Null异常


### 消费Option

Option是一个枚举，并且用得非常多，因为日常中总有暂时还没有值的时候，因此Rust也提供了多种消费Option的手段


##### match

match是非常常规的消费Option的手段，它将Option作为一个普通枚举来消费

```rust
    let o = Some(5);
    let s = match o {
        Some(v) => format!("Option的值是{}",v),
        None => String::from("Option的值是None"),
    };
    println!("{}",s)
```