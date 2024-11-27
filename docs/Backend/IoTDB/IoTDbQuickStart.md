---
title: IoTDB快速启动
---

# IoTDB快速启动

> 本文结合工作实际应用，快速启动为从建数据库到上传/查询数据，不包含部署及使用细节，深入了解请详读官方文档

### 查看数据库

```shell
show databases
```

IoTDB支持通配符，可以通过`show databases root.x*`查看所有以root.x开头的数据库筛选结果


### 创建数据库

```shell
create database root.device_log
```

这里创建了一个`device_log`的数据库，需要注意的是,IoTDB要求数据库必须以root开头，多层级以`.`分割，并且被设置为数据库的路径总字符数不能超过64，包括路径开头的root.这5个字符。


### 设置TTL（数据存活时间）

```shell
set ttl to root.device_log 2592000000
```

IoTDB的TTL支持最多1000条规则，单位是毫秒，末尾使用`**`通配符

只设置路径的前一部分，会对最后补充`**`

上面的配置TTL等同于给`root.device_log.**`配置30天有效期

如果多条TTL规则出现了冲突，以路径最为精确的为准

### 创建设备模板

```shell
create device template d aligned(level INT32 compression=LZ4, event TEXT encoding=DICTIONARY compression=LZ4, message TEXT compression=LZ4, side BOOLEAN compression=LZ4)
```

设备模板表示所有的设备都是相同的结构，通常来说，同一个型号采集的数据都是相同的，上面的例子中创建了模板`d`，主要目的是记录日志，所以创建了这几个测点

encoding指定了编码方式，compression指定了压缩方式

### 挂载模板

```shell
 set device template d to root.device_log
 ```

官方推荐将模板挂载到数据库层面，所以这里的例子是将模板`d`挂载到`root.device_log`

### 开启自动注册序列

自动注册序列可以在序列不存在时自动创建，这种手动创建的事情还是交给IoTDB自己处理好多

```
enable_auto_create_schema=true
```

配置自动注册序列需要修改配置文件,在`conf`文件夹中的`iotdb-common.properties`文件修改
