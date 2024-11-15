---
title: 调用前端方法
---

# 调用前端方法

> Tauri使用Rust作为后端，但是官方说的后面可能增加其他编程语言的支持，但是目前仅是使用Rust，所以这篇的标题也可用叫『从Rust后端调用前端方法』

Rust端可以使用Event、Channels或者Eval来调用Tauri应用的前端方法

### Event系统

Tauri提供了一个简单的事件系统，可以使用它在Rust和前端之间进行双向通信

Event系统是针对需要流式传输少量数据或需要实现多消费者多生产者模式（例如推送通知系统）的情况而设计的。

Event系统不是为了低延迟或者高吞吐量情况设计的，针对这种情况请考虑使用针对流数据优化的Channels方式

command和event之间的主要区别是事件没有强类型支持，事件有效载荷总是JSON字符串，使其不适合更大的消息，并且不支持capabilities系统来精细控制event数据和channels。

AppHandle和WebviewWindow类型实现了event系统traits`Listener`和`Emitter` 。

事件可以是全局的（传递给所有侦听器），也可以是特定于web视图的（只传递给与给定标签匹配的web视图）。

##### 全局事件

要触发一个全局事件，可以使用Emitter#emit函数：
```rust
use tauri::{AppHandle, Emitter};

#[tauri::command]
fn download(app: AppHandle, url: String) {
  app.emit("download-started", &url).unwrap();
  for progress in [1, 15, 50, 80, 100] {
    app.emit("download-progress", 10).unwrap();
  }
  app.emit("download-finished", &url).unwrap();
}
```

注意：全局事件传递给所有侦听器

##### WebView事件

要向特定webview注册的侦听器触发事件，您可以使用Emitter#emit_to方法：
```rust
use tauri::{AppHandle, Emitter};

#[tauri::command]
fn login(app: AppHandle, user: String, password: String) {
  let authenticated = user == "tauri-apps" && password == "tauri";
  let result = if authenticated { "loggedIn" } else { "invalidCredentials" };
  app.emit_to("login", "login-result", result).unwrap();
}
```
也可以通过调用Emitter#emit_filter来触发一个事件到一个web视图列表。在下面的示例中，我们向main和file-viewer webviews发出一个open-file事件：
```rust
use tauri::{AppHandle, Emitter, EventTarget};

#[tauri::command]
fn open_file(app: AppHandle, path: std::path::PathBuf) {
  app.emit_filter("open-file", path, |target| match target {
    EventTarget::WebviewWindow { label } => label == "main" || label == "file-viewer",
    _ => false,
  }).unwrap();
}
```
注意：特定于Webview的事件不会触发到常规全局事件侦听器。要侦听任何事件，必须使用listen_any函数而不是listen，后者定义侦听器作为已发出事件的全部内容。

##### Event Payload

Event Payload可以是任何也实现了Clone的可序列化类型。让我们通过使用对象在每个Event中发出更多信息来增强download事件示例：

```rust
use tauri::{AppHandle, Emitter};
use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DownloadStarted<'a> {
  url: &'a str,
  download_id: usize,
  content_length: usize,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DownloadProgress {
  download_id: usize,
  chunk_length: usize,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct DownloadFinished {
  download_id: usize,
}

#[tauri::command]
fn download(app: AppHandle, url: String) {
  let content_length = 1000;
  let download_id = 1;

  app.emit("download-started", DownloadStarted {
    url: &url,
    download_id,
    content_length
  }).unwrap();

  for chunk_length in [15, 150, 35, 500, 300] {
    app.emit("download-progress", DownloadProgress {
      download_id,
      chunk_length,
    }).unwrap();
  }

  app.emit("download-finished", DownloadFinished { download_id }).unwrap();
}
```

##### 监听Event

Tauri提供API来监听webview和Rust接口上的事件。

###### 在前端监听

- 监听全局事件
```typescript
import { listen } from '@tauri-apps/api/event';

type DownloadStarted = {
  url: string;
  downloadId: number;
  contentLength: number;
};

listen<DownloadStarted>('download-started', (event) => {
  console.log(
    `downloading ${event.payload.contentLength} bytes from ${event.payload.url}`
  );
});
```
- 监听特定webview事件
```typescript
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

const appWebview = getCurrentWebviewWindow();
appWebview.listen<string>('logged-in', (event) => {
  localStorage.setItem('session-token', event.payload);
});
```

listen函数在应用程序的整个生命周期内保持事件侦听器的注册状态。要停止监听事件，可以使用由unlisten函数返回的listen函数：
```typescript
import { listen } from '@tauri-apps/api/event';

const unlisten = await listen('download-started', (event) => {});
unlisten();
```

注意：当执行上下文超出作用域时，例如卸载组件时，请始终使用unlisten函数。

注意：当页面被重新加载或导航到另一个URL时，侦听器将自动注销。但这不适用于单页应用程序（SPA）路由器。

此外，Tauri还提供了一个实用函数，用于只监听一次事件：
```typescript
import { once } from '@tauri-apps/api/event';
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';

once('ready', (event) => {});

const appWebview = getCurrentWebviewWindow();
appWebview.once('ready', () => {});
```
注意：在前端发出的事件也会触发这些API注册的侦听器。有关更多信息，请参阅从前端调用Rust文档。

###### 在Rust后端监听

全局和特定于webview的事件也会传递给在Rust中注册的侦听器。

- 监听全局事件
```rust
use tauri::Listener;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      app.listen("download-started", |event| {
        if let Ok(payload) = serde_json::from_str::<DownloadStarted>(&event.payload()) {
          println!("downloading {}", payload.url);
        }
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

- 监听特定Webview的事件

```rust
use tauri::{Listener, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      let webview = app.get_webview_window("main").unwrap();
      webview.listen("logged-in", |event| {
        let session_token = event.data;
        // save token..
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
```

listen函数在应用程序的整个生命周期内保持事件侦听器的注册状态。要停止监听事件，可以使用unlisten函数：

```rust
// unlisten outside of the event handler scope:
let event_id = app.listen("download-started", |event| {});
app.unlisten(event_id);

// unlisten when some event criteria is matched
let handle = app.handle().clone();
app.listen("status-changed", |event| {
  if event.data == "ready" {
    handle.unlisten(event.id);
  }
});
```

此外，Tauri还提供了一个实用函数，用于只监听一次事件：
```rust
app.once("ready", |event| {
  println!("app is ready");
});
```
在这种情况下，事件侦听器在第一次触发后立即取消注册。

### Channels

事件系统被设计成一个简单的双向通信，在您的应用程序中全局可用。在底层，它直接执行JavaScript代码，因此它可能不适合发送大量数据。

Channels旨在快速并提供有序数据。它们在内部用于流操作，如下载进度、子进程输出和WebSocket消息。

让我们重写我们的download命令示例，使用channels而不是Event系统：
```rust
use tauri::{AppHandle, ipc::Channel};
use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", tag = "event", content = "data")]
enum DownloadEvent<'a> {
  #[serde(rename_all = "camelCase")]
  Started {
    url: &'a str,
    download_id: usize,
    content_length: usize,
  },
  #[serde(rename_all = "camelCase")]
  Progress {
    download_id: usize,
    chunk_length: usize,
  },
  #[serde(rename_all = "camelCase")]
  Finished {
    download_id: usize,
  },
}

#[tauri::command]
fn download(app: AppHandle, url: String, on_event: Channel<DownloadEvent>) {
  let content_length = 1000;
  let download_id = 1;

  on_event.send(DownloadEvent::Started {
    url: &url,
    download_id,
    content_length,
  }).unwrap();

  for chunk_length in [15, 150, 35, 500, 300] {
    on_event.send(DownloadEvent::Progress {
      download_id,
      chunk_length,
    }).unwrap();
  }

  on_event.send(DownloadEvent::Finished { download_id }).unwrap();
}
```
调用download命令时，必须创建通道并将其作为参数提供：
```typescript
import { invoke, Channel } from '@tauri-apps/api/core';

type DownloadEvent =
  | {
      event: 'started';
      data: {
        url: string;
        downloadId: number;
        contentLength: number;
      };
    }
  | {
      event: 'progress';
      data: {
        downloadId: number;
        chunkLength: number;
      };
    }
  | {
      event: 'finished';
      data: {
        downloadId: number;
      };
    };

const onEvent = new Channel<DownloadEvent>();
onEvent.onmessage = (message) => {
  console.log(`got download event ${message.event}`);
};

await invoke('download', {
  url: 'https://raw.githubusercontent.com/tauri-apps/tauri/dev/crates/tauri-schema-generator/schemas/config.schema.json',
  onEvent,
});
```

### 执行Javascript代码

要在webview上下文中直接执行任何JavaScript代码，可以使用WebviewWindow#eval函数：
```rust
use tauri::Manager;

tauri::Builder::default()
  .setup(|app| {
    let webview = app.get_webview_window("main").unwrap();
    webview.eval("console.log('hello from Rust')")?;
    Ok(())
  })
```

如果要执行的脚本不是那么简单，并且必须使用来自Rust对象的输入，建议使用serialize-to-JavaScript crate。