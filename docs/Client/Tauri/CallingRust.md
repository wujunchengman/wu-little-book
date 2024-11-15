---
title: 前端调用Rust代码
---

# 前端调用Rust代码

Tauri提供了一个Command原语，用于访问具有类型安全性的Rust函数，还有一个更动态的事件系统。

### Commands

Tauri提供了一个简单而强大的command系统，用于从Web应用程序调用Rust函数。命令可以接受参数并返回值。它们也可以返回错误并成为async。

##### 基本示例

命令可以在src-tauri/src/lib.rs文件中定义。要创建一个command，只需添加一个函数并使用`#[tauri::command]`注释它：

```rust
#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}
```
注意：command名称必须唯一。

注意：定义的command不能使用pub标记，这是代码生成的限制，如果标记为pub则会报错

必须为构建器函数提供一个命令列表：
```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

现在就可以在JavaScript中调用Command了
```javascript
// When using the Tauri API npm package:
import { invoke } from '@tauri-apps/api/core';

// When using the Tauri global script (if not using the npm package)
// Be sure to set `app.withGlobalTauri` in `tauri.conf.json` to true
const invoke = window.__TAURI__.core.invoke;

// Invoke the command
invoke('my_custom_command');
```

##### 在单独的模块中定义Command

如果您的应用程序定义了许多组件，或者如果它们可以分组，则可以在单独的模块中定义command，而不是使lib.rs文件膨胀。

作为一个例子，让我们在src-tauri/src/commands.rs文件中定义一个command：
```rust
#[tauri::command]
pub fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}
```

注意：当在单独的模块中定义command时，它们应该标记为pub。

注意：command的作用域不限于模块，因此即使在模块之间，它们也必须是唯一的。

```rust
mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![commands::my_custom_command])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```
注意命令列表中的commands::前缀，它表示命令函数的完整路径。

这个例子中的命令名是`my_custom_command`，所以你仍然可以通过在前端执行`invoke("my_custom_command")`来调用它，`commands::`前缀被忽略。

##### WASM

当使用Rust前端不带参数地调用invoke()时，需要调整前端代码，如下所示。原因是Rust不支持可选参数。

```rust
#[wasm_bindgen]
extern "C" {
    // invoke without arguments
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "core"], js_name = invoke)]
    async fn invoke_without_args(cmd: &str) -> JsValue;

    // invoke with arguments (default)
    #[wasm_bindgen(js_namespace = ["window", "__TAURI__", "core"])]
    async fn invoke(cmd: &str, args: JsValue) -> JsValue;

    // They need to have different names!
}
```

##### 传递参数

command可以接收参数

```rust
#[tauri::command]
fn my_custom_command(invoke_message: String) {
  println!("I was invoked from JavaScript, with this message: {}", invoke_message);
}
```
参数应该作为带有camelCase键的JSON对象传递：

```javascript
invoke('my_custom_command', { invokeMessage: 'Hello!' });
```

可以使用snake_case作为具有rename_all属性的参数：
```rust
#[tauri::command(rename_all = "snake_case")]
fn my_custom_command(invoke_message: String) {}
```

```javascript
invoke('my_custom_command', { invoke_message: 'Hello!' });
```
参数可以是任何类型，只要它们实现了`serde::Deserialize`。

相应的JavaScript：

```javascript
invoke('my_custom_command', { invoke_message: 'Hello!' });
```

##### 返回数据

command也可以返回数据：
```rust
#[tauri::command]
fn my_custom_command() -> String {
  "Hello from Rust!".into()
}
```
invoke函数返回一个promise，并使用返回值进行解析：
```javascript
invoke('my_custom_command').then((message) => console.log(message));
```
返回的数据可以是任何类型，只要它实现了`serde::Serialize`。

###### 返回Array Buffers

当响应被发送到前端时，实现`serde::Serialize`的返回值被序列化为JSON。如果试图返回一个大数据（如文件或下载HTTP响应），这可能会降低应用程序的速度。要以优化的方式返回数组缓冲区，请使用`tauri::ipc::Response`：

```rust
use tauri::ipc::Response;
#[tauri::command]
fn read_file() -> Response {
  let data = std::fs::read("/path/to/file").unwrap();
  tauri::ipc::Response::new(data)
}
```

##### 错误处理

如果command可能会失败，并且需要能够返回一个错误，让函数返回一个Result：
```rust
#[tauri::command]
fn login(user: String, password: String) -> Result<String, String> {
  if user == "tauri" && password == "tauri" {
    // resolve
    Ok("logged_in".to_string())
  } else {
    // reject
    Err("invalid credentials".to_string())
  }
}
```
如果命令返回错误，promise将拒绝，否则，它将解析：
```javascript
invoke('login', { user: 'tauri', password: '0j4rijw8=' })
  .then((message) => console.log(message))
  .catch((error) => console.error(error));
```

如上所述，从command返回的所有内容都必须实现`serde::Serialize`，包括错误。如果你使用Rust的std库或外部crates中的错误类型，这可能会有问题，因为大多数错误类型都没有实现它。在简单的场景中，你可以使用`map_err`将这些错误转换为Strings：
```rust
#[tauri::command]
fn my_custom_command() -> Result<(), String> {
  std::fs::File::open("path/to/file").map_err(|err| err.to_string())?;
  // Return `null` on success
  Ok(())
}
```

由于这不是很习惯，您可能希望创建自己的错误类型，实现serde::Serialize。在下面的示例中，我们使用thiserrorcrate来帮助创建错误类型。它允许您通过派生thiserror::Error trait将枚举转换为错误类型。您可以查阅其文档以了解更多详细信息。

```rust
// create the error type that represents all errors possible in our program
#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error)
}

// we must manually implement serde::Serialize
impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

#[tauri::command]
fn my_custom_command() -> Result<(), Error> {
  // This will return an error
  std::fs::File::open("path/that/does/not/exist")?;
  // Return `null` on success
  Ok(())
}
```

自定义错误类型的优点是使所有可能的错误都显式化，因此读者可以快速识别可能发生的错误。这为其他人（和你自己）在以后检查和重构代码时节省了大量的时间。
它还使您能够完全控制错误类型的序列化方式。在上面的例子中，我们只是将错误消息作为字符串返回，但是你可以为每个错误分配一个代码，这样你就可以更容易地将它映射到一个类似的TypeScript错误枚举，例如：

```rust
#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error("failed to parse as string: {0}")]
  Utf8(#[from] std::str::Utf8Error),
}

#[derive(serde::Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
  Io(String),
  Utf8(String),
}

impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    let error_message = self.to_string();
    let error_kind = match self {
      Self::Io(_) => ErrorKind::Io(error_message),
      Self::Utf8(_) => ErrorKind::Utf8(error_message),
    };
    error_kind.serialize(serializer)
  }
}

#[tauri::command]
fn read() -> Result<Vec<u8>, Error> {
  let data = std::fs::read("/path/to/file")?;
  Ok(data)
}
```
在前端，现在得到一个{ kind: 'io' | 'utf8', message: string }错误对象：

```typescript
type ErrorKind = {
  kind: 'io' | 'utf8';
  message: string;
};

invoke('read').catch((e: ErrorKind) => {});
```

