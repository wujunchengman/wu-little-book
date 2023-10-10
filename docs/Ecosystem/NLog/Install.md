---
title: Asp.netCore中安装启用Nlog
---

## 安装Nlog

```shell
dotnet add package NLog
dotnet add package NLog.Web.AspNetCore
```

## 启用Nlog

```csharp
using NLog;
using NLog.Web;

// Early init of NLog to allow startup and exception logging, before host is built
var logger = NLog.LogManager.Setup().LoadConfigurationFromAppSettings().GetCurrentClassLogger();
logger.Debug("init main");

try
{
    var builder = WebApplication.CreateBuilder(args);
    /* 
    * 原本的builder的内容 
    * 主要是注入各种依赖服务的代码
    */

    // 清理自带的日志记录器提供程序
    builder.Logging.ClearProviders();
    // 使用Nlog作为日志记录器
    builder.Host.UseNLog();

    var app = builder.Build();

    /* 原本的app管道配置部分不变 */
}
catch (Exception exception)
{
    // NLog: catch setup errors
    logger.Error(exception, "Stopped program because of exception");
    throw;
}
finally
{
    // Ensure to flush and stop internal timers/threads before application-exit (Avoid segmentation fault on Linux)
    NLog.LogManager.Shutdown();
}
```

## 编写Nlog配置文件

