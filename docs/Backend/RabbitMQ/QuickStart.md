---
title: RabbitMQ 快速启动
---

# RabbitMQ快速启动

> RabbitMQ是基于Erlang编写的，需要Erlang环境，考虑到手动安装比较麻烦，因此选择最简单的使用Docker安装RabbitMQ（现在Docker仓库有墙，不能直接安装了，但是我相信对开发的同学来说问题不大）

### 安装RabbitMQ

```shell
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 -v rabbitmq-plugin:/plugins -e RABBITMQ_DEFAULT_USER=guest -e RABBITMQ_DEFAULT_PASS=123456 rabbitmq:4-management
```

很多教程是先让拉取RabbitMQ的镜像的，现在的Docker如果找不到对应的镜像会从Docker仓库上去找，如果本地没有会自动到Docker仓库拉取，这里就省略这一步了

简单讲讲这些参数，`-d`指定为后台运行，`--name`指定容器名称，`-p`映射端口，这里是将容器的5672和15672端口映射到本机的5672和15672端口（本机端口:容器端口），`-v`是映射目录到容器，这里将`rabbitmq-plugin`映射到了容器的`/plugins`，映射目录时，本机的相对路径是shell的当前路径作为起点的，`-e`则是设定环境变量，通过环境变量参数设定了用户名和密码，最后的`rabbitmq:4-management`这是指定镜像名称和版本，需要注意的是，RabbitMQ有两种版本，一种是不带后台管理页面的版本，只需要跟对应的版本号，另一种是带后台管理页面的版本，带后台管理页面版本的Docker镜像版本都以`-management`结尾，如果不需要后台管理页面，则选择不带对应尾缀的版本，同时也不需要暴露15672端口号