---
title: 使用NLog将日志写入数据库
---

# 使用 NLog 将日志写入数据库

NLog 支持将日志写入多个目标（控制台、文件、数据库等），官方提供了写入数据库的插件

## 安装写入数据库的target支持

```shell
dotnet add package NLog.Database
```

NLog写数据库使用的是ADO.NET，写入不同的数据库还需要安装对应的数据库provider，如果是写入到SqlServer，就需要安装`Microsoft.Data.SqlClient`
```shell
dotnet add package Microsoft.Data.SqlClient
```
更多的提供程序，可以看看NLog官方给的[参考](https://github.com/NLog/NLog/wiki/Database-target#dbprovider-examples)

安装好数据库的target支持和操作数据库的provider，就可以在配置文件中创建一个将日志写入到数据库的target

## config 文件

```xml
    <target name="log_database" xsi:type="Database" dbProvider="Microsoft.Data.SqlClient.SqlConnection, Microsoft.Data.SqlClient" connectionString="Server=localhost;uid=sa;pwd=zxc123;Database=logs;MultipleActiveResultSets=true;pooling=true;min pool size=5;max pool size=32767;connect timeout=20;Encrypt=True;TrustServerCertificate=True;">
      <commandText>
        INSERT INTO SysNLogRecords
        (LogDate,LogLevel,LogType,LogTitle,Logger,Message,MachineName,MachineIp,NetRequestMethod
        ,NetRequestUrl,NetUserIsauthenticated,NetUserAuthtype,NetUserIdentity,Exception)
        VALUES
        (@LogDate,@LogLevel,@LogType,@LogTitle,@Logger,@Message,@MachineName,@MachineIp,@NetRequestMethod
        ,@NetRequestUrl,@NetUserIsauthenticated,@NetUserAuthtype,@NetUserIdentity,@Exception);
      </commandText>
      <parameter name="@LogDate" layout="${date}" />
      <parameter name="@LogLevel" layout="${level}" />
      <parameter name="@LogType" layout="${event-properties:item=LogType}" />
      <parameter name="@LogTitle" layout="${event-properties:item=LogTitle}" />
      <parameter name="@Logger" layout="${logger}" />
      <parameter name="@Message" layout="${message}" />
      <parameter name="@MachineName" layout="${machinename}" />
      <parameter name="@MachineIp" layout="${aspnet-request-ip}" />
      <parameter name="@NetRequestMethod" layout="${aspnet-request-method}" />
      <parameter name="@NetRequestUrl" layout="${aspnet-request-url}" />
      <parameter name="@NetUserIsauthenticated" layout="${aspnet-user-isauthenticated}" />
      <parameter name="@NetUserAuthtype" layout="${aspnet-user-authtype}" />
      <parameter name="@NetUserIdentity" layout="${aspnet-user-identity}" />
      <parameter name="@Exception" layout="${exception:tostring}" />
    </target>
```
NLog支持多种写法，这只是其中一种