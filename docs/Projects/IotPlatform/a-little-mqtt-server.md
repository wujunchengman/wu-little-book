---
title: 建一个简单的MQTT服务器
---

# 建一个简单的MQTT服务器（基于MQTTnet）
> MQTTnet是一个高性能的.NET库，用于基于MQTT的通信。它提供了一个MQTT客户端和一个MQTT服务器（代理）。

自建MQTT服务器，考虑到一些操作可能需要由用户主动发起然后通过MQTT下发给设备，因此这里使用`MQTTnet.AspNetCore`，这里只是简单的想把MQTT Server放到Asp.Net Core上，因为Asp.Net Core提供了很多诸如依赖注入、托管主机、日志、配置文件之类的功能

## 创建项目

创建一个Asp.Net Core项目，可以是WebApi，也可以是其他的，只要有Kestrel就行（Worker不行，Woker没有Kestrel，只能用传统的方式建MQTT主机），因为这不是零基础文档，一次就不详细写了

## 添加依赖

```shell
dotnet add package MQTTnet.AspNetCore
```

## 注入Host

```csharp
builder.Services.AddHostedMqttServer(o =>
{
    o.WithDefaultEndpoint();
});
builder.Services.AddMqttConnectionHandler();

builder.WebHost.ConfigureKestrel(k =>
{
    k.ListenAnyIP(1883, l => l.UseMqtt());
    // 用于监听HTTP请求的端口，如果不需要就可以不写
    // k.ListenAnyIP(5000);
});
```
上文是引入一个默认的MQTT服务器，没有对事件进行任何操作，也没有身份认证之类的。只需要添加上述代码，就可以启动一个简单的没有任何逻辑的MQTT服务器了