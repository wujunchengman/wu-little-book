---
title: SignalR快速入门
---

ASP.NET Core SignalR 是一个开放源代码库，可用于简化向应用添加实时 Web 功能。 实时 Web 功能使服务器端代码能够将内容推送到客户端

SignalR优先使用WebSockets，如果不可用则使用Server-Sent Events技术，如果依然不可用则使用长轮询机制进行处理

SignalR的交互逻辑是相互调用对应的方法：服务端调用客户端方法；客户端调用服务端方法
```javascript
// 构造一个连接（此时还没有建立，只是一个连接对象）
var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

// 定义客户端方法ReceiveMessage，接收两个参数
connection.on("ReceiveMessage", function (user, message) {
    console.log("接收两个参数"+ user + ":" + message);
});

// 建立连接
connection.start().then(function () {
    console.log("建立连接成功");
}).catch(function (err) {
    return console.log("建立连接失败");
});

```

```csharp
// 定义一个继承自Hub的类，Hub中包含了Clients等对象，用于区分连接
public class ChatHub: Hub
{
    // 定义可供客户端调用的方法
    public async Task SendMessage(string user, string message)
    {
        // 通过Clients调用所有客户端定义的ReceiveMessage方法
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }

}

```



SignalR 使用Hub在客户端和服务器之间进行通信。
