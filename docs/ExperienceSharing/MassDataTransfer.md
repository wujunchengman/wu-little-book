---
title: 大量数据传输解决方案（替换默认的JSON）
---

# 大量数据传输方案（条目多，非文件大）

项目中有个需求是客户需要备份数据，这时候考虑了两种方案，一种是服务器直接生成备份文件，然后客户端直接下载这个备份文件，另一种方案是将数据直接发送到客户端，然后由客户端自己生成备份文件

在我们的项目中，有使用多种备份格式的需求，因此我们选择直接将数据发送到客户端。

数据直接发送到客户端有一个问题，就是备份的时候可能有几十万条数据，平常使用HTTP传输时使用JSON格式传输，但是当数据量大起来了之后，JSON产生的无效字符就显得非常多了，考虑到对带宽的影响，决定不使用JSON格式

### 选型

JSON是非常通用的格式，各种语言都提供了序列化和反序列化库，如果不使用JSON，就要寻找其它格式，这个格式应该满足两点：

- 主流语言的序列化和反序列化库相对完善
- 序列化后应该比JSON小很多

在这个项目中，后端使用的C#，客户端使用Tauri打包前端，因此需要寻找的就是C#和Javascript都支持序列化和反序列化的格式

最后的选择是：Protobuf

Protobuf很多人都是在gRPC中知道的，我也是。这个格式并不是只能在gRPC中使用，于是我的方案是在后端生成Protobuf字节数组，传输到前端后再交由Javascript反序列化还原数据

### 服务端打包

项目使用的是Asp.Net Core，因此这里的打包就是使用的.NET生态下的库了，如果是其他语言，则需要使用与之对应的库

##### 引入依赖

```shell
dotnet add package Google.Protobuf
dotnet add package Grpc.Core
dotnet add package Grpc.Tools
```

##### 添加Proto文件

```proto
syntax = "proto3";

import "google/protobuf/timestamp.proto";

package datalogpackage;
option csharp_namespace = "Example";

message DataLogReply {
	repeated DataLog dataLogs = 1;
}

message DataLog {
	// 设备号
	int64 device_id =1;

	// 时间戳
	google.protobuf.Timestamp data_timestamp = 2;

	// 可空整数型：温度
	int32 temperature = 3;

	// 可空整数型：湿度
	int32 humidity = 4;
}

```

```csproj
  <ItemGroup>
    <Protobuf Include="dataLog.proto" GrpcServices="Client" />
  </ItemGroup>
```

这里就不讲Proto文件的语法了，只是简单的说说这个地方，Grpc.Tools用来将proto生成对应的类，需要在项目文件中配置一下

Grpc.Tools可以选择生成服务端和客户端的代码，因为这里的需求仅仅只是打包，不是弄一个gRPC服务，只生成Client客户端代码就行了

##### 生成字节数组

Grpc.Tools根据proto文件生成对应的类之后，初始化对应的类，然后调用ToByteArray()进行打包

```csharp

// 初始化Message
var z = new DataLog()
{
    DataTimestamp = (new DateTime(2024, 10, 18).ToUniversalTime()).ToTimestamp(),
    DeviceId = 52107010001,
    Temperature = 250,
    Humidity = 400,
};
DataLogReply dataLogReply = new DataLogReply() { DataLogs = { new List<DataLog>() { z} } };

// 调用ToByteArray()得到序列化后的字节数组
var bytes = dataLogReply.ToByteArray();
```
得到字节数组后，可以选择自己喜欢的协议传给客户端，在这个项目中使用的是HTTP协议

### 客户端反序列化

##### 引入依赖

前端使用[protobuf.js](https://github.com/protobufjs/protobuf.js)来反序列化数据，这也是官方推荐的JS库

```shell
pnpm install protobufjs
```

##### 反序列化数据

```typescript
import { load } from "protobufjs"; // respectively "./node_modules/protobufjs"


  load("datalog.proto", async function (err, root) {
    if (err)
      throw err;
    if (root) {
      const DataLogReplyMessage = root.lookupType("datalogpackage.DataLogReply");

      axios({
        method: 'get',
        url: "http://localhost:5273/test",
        responseType: 'arraybuffer' // 设置响应类型为ArrayBuffer
      })
        .then(function (response) {
          // 现在response.data是ArrayBuffer类型
          var bytes = new Uint8Array(response.data);
          console.log(`buffer = ${Array.prototype.toString.call(bytes)}`);
          // 处理bytes...

          let decoded = DataLogReplyMessage.decode(bytes);
          console.log(`decoded = ${JSON.stringify(decoded)}`);
        })
        .catch(function (error) {
          console.log('请求失败', error);
        });
    }

  });

```

这里面需要注意的是decode方法需要字节数组作为参数，而使用axios获得的数据默认情况下并不是字节数组，需要特别执行responseType和使用Uint8Array转换