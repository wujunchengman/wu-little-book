---
title: SpringBoot的配置文件

---

# SpringBoot的配置文件

SpringBoot项目的配置文件遵循Maven项目结构规范，默认配置文件在resources目录下的application.properties文件

默认情况下配置文件中为空，全都采用默认配置，需要修改时写入对应的键值对即可
```
# 修改服务器端口为90
server.port=80

# 配置全局日志级别为debug
logging.level.root=debug
```

SpringBoot提供了涉及的所有配置项的文档，下面的链接是当前活动版本的所有配置项文档
[SpringBoot当前版本配置项](https://docs.spring.io/spring-boot/docs/current/reference/html/application-properties.html#appendix.application-properties)