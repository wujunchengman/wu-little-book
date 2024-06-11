---
title: 消息处理
---

# 消息处理

消息处理有两种方式，一种通过订阅，一种通过直接在服务端处理。如果通过订阅，那么大概率不需要自己写服务端了，因为有很多做得很好的开源MQTT Server，比如EMQX。通过订阅的方式有一个巨大的缺点：订阅的客户端出了异常挂掉了真实设备是不知道的。当订阅接收程序出现异常（涉及到业务总是有可能出异常），设备是不知道的，MQTT Server也是正常的，这时候设备发送上来的数据就因为接收端没有丢失了。因此这里主要介绍的是通过服务器直接处理

```csharp
app.UseMqttServer(server =>
{
    server.InterceptingPublishAsync += messageHandle.MessageProcess;
});
```
上面写到了使用MQTTnet创建一个服务端，这里还是接[上文](./a-little-mqtt-server.md)，通过`UseMqttServer`扩展方法，给`InterceptingPublishAsync`委托注册一个处理方法，当客户端发送消息时就会调用这个方法。

`InterceptingPublishEventArgs`接收一个`InterceptingPublishEventArgs`参数，通过这个参数可以获取到消息的内容，ClientId等一些列参数

```csharp
    public class MessageHandle
    {
        public async Task MessageProcess(InterceptingPublishEventArgs args)
        {
            var clientId = args.ClientId;
            var message = args.ApplicationMessage;
            var topic = args.ApplicationMessage.Topic;
            var payload = args.ApplicationMessage.PayloadSegment;
        }
    }
```

解析获取到的消息，可以进行各种业务操作。这种方式的好处就是，如果消息处理挂了，会连带整个Server都挂掉，这样设备就能清楚的知道Server已经没了，数据已经无法接收了，需要把数据先保存起来等到Server恢复了再发送。

EMQX直接在服务端保存数据需要购买企业版，如果业务不大不复杂，不需要那么多的高可用，自己起一个MQTT Server也是不错的选择。上文提到的通过订阅的方式处理也可以通过明确的回复来解决这个问题，设备的每一条消息都有对应的一条消息进行确认，只是这样的话开销就很高了，得不偿失。对一些不是很重要的数据，允许轻微丢失数据的场景，用这种方式是可以接受的，毕竟要更简单一些