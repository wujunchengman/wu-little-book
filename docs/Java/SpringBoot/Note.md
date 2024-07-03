# 待整理的笔记

在SpringBoot的配置文件中可以指定当前的配置文件
```yml
spring:
  profiles:
    # 激活local配置文件
    active: local
```
如果在配置文件`bootstrap.yml`中配置激活local配置文件，那么将会启用`bootstrap-local.yml`配置文件（`bootstrap.yml`依然会加载，只是有相同配置会被覆盖）

读取FIlter时，类名后面的GatewayFilterFactory会被忽略，Filter为ManagerToken会查找ManagerTokenGatewayFilterFactory

## 需要补充的知识点：

- SpringBoot中的配置文件定义路由

- 配置类读取配置信息

