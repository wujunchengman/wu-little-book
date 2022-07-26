---
title: NLog配置文件
description: NLog配置文件
---

# NLog 配置文件

> 因为很多文章都只讲讲怎么在.Net 项目中记录日志，但是这只是简单的能记录，日志不光要记录，还要记好，于是我再讲讲 NLog 的配置文件，让大家可以更符合需求的记录日志

## NLog 配置文件的位置

- NLog 必须要有配置文件才会工作，否则它将什么都不做
- 如果同时存在多个 NLog 配置文件，则以找到的第一个为准，当 NLog 找到配置文件之后，会停止查找，而不是继续查找覆盖前面的配置文件

### NLog 默认查找配置文件的位置

#### 独立应用程序

- 应用程序的`app.config`配置文件
- 应用程序所在目录下的`.nlog`后缀文件(暂未验证文件名是否必须与应用程序名相同)
- 应用程序所在目录下的`NLog.config`文件
- NLog.dll 所在目录下的`Nlog.dll.nlog`（仅当 GAC 中没安装 NLog 时生效）注：GAC 还不清楚是什么的缩写，但是这条目前没有遇到过

#### ASP.NET 应用程序（以前的 ASP.NET 必须依赖 IIS 运行，所以单独提出来）

- Web 应用程序的`web.config`配置文件
- web.config 所在目录下的`web.nlog`文件
- Web 应用程序所在目录下的`NLog.config`文件
- NLog.dll 所在目录下的`Nlog.dll.nlog`（仅当 GAC 中没安装 NLog 时生效）注：GAC 还不清楚是什么的缩写，但是这条目前没有遇到过

#### appsettings.json

NLog5 可以将配置文件写在 appsettings.json 文件中，这是 .Net Core/.Net 项目默认的配置文件，同时支持根据环境变量加载不同的配置

要让 NLog 从 appsettings.json 文件中读取配置需要 NLog.Extensions.Logging 或者 NLog.Web.AspNetCore 插件

### NLog 显式指定配置文件

用的很少，几乎没必要，如果是 Xamarin、Android 项目可以看一看[Explicit NLog configuration loading](https://github.com/NLog/NLog/wiki/Explicit-NLog-configuration-loading)

## 详解 Nlog 配置文件

独立的 NLog 配置文件是一个 XML 格式的文件，无论是什么文件后缀。如果 Nlog 的配置信息共用了应用程序的配置文件，则以应用程序的配置文件为准，也就是说，如果将 NLog 的配置写在 appsettings.json 文件中，则配置将以 Json 格式表达。虽然可能配置文件的格式不同，但是配置文件的层级结构和规则是相同的

先看一个最简单的 Nlog 配置文件

```xml
<?xml version="1.0" encoding="utf-8" ?>
<nlog xmlns="http://www.nlog-project.org/schemas/NLog.xsd"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">

    <targets>
        <!-- 日志写入文件file.txt -->
        <target name="logfile" xsi:type="File" fileName="file.txt" />
        <!-- 日志输出到控制台 -->
        <target name="logconsole" xsi:type="Console" />
    </targets>

    <rules>
        <!-- 日志输出规则，写入到前面定义的logconsole Target -->
        <logger name="*" minlevel="Info" writeTo="logconsole" />
        <!-- 日志输出规则，写入到前面定义的logfile Target -->
        <logger name="*" minlevel="Debug" writeTo="logfile" />
    </rules>
</nlog>
```

这个配置文件中，nlog 空间下有两个元素，一个是 targets，一个是 rules。

其中 targets 定义一组 target，每一个 target 有 name 和 xsi:type 属性，它们分别定义了这个 target 的名字，和日志输出的位置。在这个最简单的 NLog 配置文件中定义的 Target，logfile 将日志写入文件，logconsole 将日志写入控制台。

rules 定义了一组日志输出规则，它决定了要输出哪些日志，以及日志输出到哪里。这里定义了两条规则，他们的 name 都是`*`，.Net 中的日志会记录类的完成名称（包括命名空间），当 name 指定为`*`的时候，就会去匹配所有的日志信息；minlevel 则指定了日志输出的最低级别，writeTo 指定调用对应的 target 进行日志输出。所以这两条 logger 规则会匹配所有的日志，然后将日志级别高等等于 Info 的按照 logconsole 的规则写入到控制台，将日志级别高于等于 Debug 的按照 logfile 的规则写入到文件。

读完这个最简单 NLog 配置文件，也算对 NLog 的配置有一点了解了，那么下面我们就详细讲讲 NLog 的配置

### NLog 的顶层元素

从前面的例子可以看到，nlog 命名空间下会有 targets 和 rules 元素，除了这两个元素，nlog 的顶层元素还有 extensions、include、variable 三个元素，nlog 的顶层空间一共有五个元素，其中 targets 和 rules 元素是必须的，而 extensions、include、variable 三个元素是可选的，下面就来详解这几个 nlog 的顶层元素

#### Targets

targets 包含多个 target，每一个 target 都是一条日志输出规则。每一个 target 都必须有 name 和 type（当使用了 xml 命名空间时为 xsi:type）属性，name 指名规则的名字，在 rules 的记录规则中根据对应的名字匹配对应的输出规则，而 type 则指定了日志记录到何处。

NLog 自带了多种 target，同时也可以自定义 target，这里只讲讲几种常见的，其他的也都是差不多的，相信大家都是可以举一反三的，为了方便，也是因为我一般都是简单的写入文件，其他的也用的少

每一个 target，除了 name 和 type，还根据不同的 type 会有不同属性，比如说 type 为 File 会有 fileName 属性，而 type 为 Console 则是没有 fileName 这个属性的

##### Console

Console 是最简单的 Target，因为只是简单的将日志信息输出到控制台，它的属性非常的少。
| 属性名|值类型|描述|是否必须|
| -- | -- | -- | -- |
| xsi:type | Console | 日志输出类型 | 是 |
| name | String | target规则名称 | 是 |
| layout | Layout | 日志模板，如果不指定则使用默认Layout（后面详细说Layout怎么写）| 是 |
| footer | Layout | 日志尾模板（后面详细说Layout怎么写）| 否 |
| header | Layout | 日志头模板（后面详细说Layout怎么写）| 否 |
| encoding | Encoding | 编码格式，比如"utf-8" | 否 |
| StdErr | Boolean | 是否应使用错误流(stderr)而不是输出流(stdout)，默认为False，NLog5以前该属性名为error | 否 |
| detectConsoleAvailable | Boolean | 在未检测到控制台是是否禁用，默认为False | 否 |
| writeBuffer | Boolean | 使用Console.Write代替Console。WriteLine，与AysncWrapper结合使用时，将允许批处理并且会有双倍的性能。在云功能中重定向控制台时很有用，默认为False | 否 |
| autoFlush | Boolean | 在每次控制台写入后执行显示刷新。如果已重定向到未启用自动刷新的自定义控制台流，则很有用，默认值为False | 否 |

注：默认layout模板：`${longdate}|${level:uppercase=true}|${logger}|${message:withexception=true}`

