---
title: 结构体
---

结构体和我们在“元组类型”部分论过的元组类似，它们都包含多个相关的值。和元组一样，结构体的每一部分可以是不同类型。但不同于元组，结构体需要命名各部分数据以便能清楚的表明其值的意义。由于有了这些名字，结构体比元组更灵活：不需要依赖顺序来指定或访问实例中的值。

```rust
struct User {
    active: bool,
    username: String,
    email: String,
    sign_in_count: u64,
}
```

### 结构体赋值

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username: username,
        email: email,
        sign_in_count: 1,
    }
}

```

### 简化赋值

Rust在给结构体赋值时可以简化，行为与JavaScript类似

```rust
fn build_user(email: String, username: String) -> User {
    User {
        active: true,
        username,
        email,
        sign_in_count: 1,
    }
}
```
当参数与结构体的字段同名时，可以简化写法

### 从其他实例创建实例

```rust
fn main() {
    // --snip--

    let user2 = User {
        email: String::from("another@example.com"),
        ..user1
    };
}
```
当需要从一个实例创建另一个实例时，除了常规的每个字段都进行赋值，还可以选择这种结构体更新语法，近指定需要变化的字段，然后解构原来的结构体（与JavaScript中的解构赋值类似）


### 特殊的结构体

##### 元组结构体

元组结构体有着结构体名称提供的含义，但没有具体的字段名，只有字段的类型。

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);
```
如果是元组，那么同样的三个整数是没有区分的，但是元组结构体能够表明这里是RGB颜色，还是XYZ坐标

##### 类单元结构体

一个没有任何字段的结构体，它们被称为 类单元结构体（unit-like structs）因为它们类似于 ()

类单元结构体常常在你想要在某个类型上实现 trait 但不需要在类型中存储数据的时候发挥作用。

