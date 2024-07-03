---
title: 安装启动Redis
---

# 安装启动Redis

Redis并没有出Windows上的安装包，之前微软移植过，后来也没继续干了。现在Redis官方推荐的Windows下运行方案是使用WSL，但是想一想WSL都用了，不如直接用Docker跑算了，因此这里的安装就是用Docker跑，简单，学完了停了就是了，不占资源且好清理。

在Windows上跑Docker建议用WSL2和Docker Desktop，不过安装也是有坑的，后面再补充安装Docker Desktop的坑

```shell
docker run -v E:/WorkFiles/Configs/Redis:/usr/local/etc/redis -p 6379:6379 --name myredis -d redis redis-server /usr/local/etc/redis/redis.conf
```

简单解释一下这行命令，本来我也是看不懂的，问了下百度的文心一言，解释得很好，这里简单记一下。`-v /myredis/conf:/usr/local/etc/redis`是将本机的`/myredis/conf`文件夹的内容映射到`/usr/local/etc/redis`文件夹下，`-p 6379:6379`是将容器的6379端口映射到主机的6379端口，`-d`是后台运行容器，`--name myredis`是指定容器名称为`myredis`，`redis`是镜像的名称，根据`redis`这个镜像来创建容器，`redis-server /usr/local/etc/redis/redis.conf`是启动容器时执行的命令，这就是正常的redis的命令了，redis服务的程序名称是`redis-server`，然后传递了一个路径，该路径作为redis服务的配置文件

这样就简单的将Redis服务运行起来了，这里面使用了配置文件，默认的Redis配置并不是我们想要的，而Redis有哪些配置项、默认的配置文件是什么，在Redis的文档中都是有的，可以在这里查看 [配置](https://redis.io/docs/management/config/)

## 修改一下默认的配置文件

默认的配置文件，Redis仅允许本机访问，实际上Redis可能好几个服务器都要访问，因此这里要改一改
```conf
################################## NETWORK #####################################

# By default, if no "bind" configuration directive is specified, Redis listens
# for connections from all available network interfaces on the host machine.
# It is possible to listen to just one or multiple selected interfaces using
# the "bind" configuration directive, followed by one or more IP addresses.
# Each address can be prefixed by "-", which means that redis will not fail to
# start if the address is not available. Being not available only refers to
# addresses that does not correspond to any network interface. Addresses that
# are already in use will always fail, and unsupported protocols will always BE
# silently skipped.
#
# Examples:
#
# bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses
# bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6
# bind * -::*                     # like the default, all available interfaces
#
# ~~~ WARNING ~~~ If the computer running Redis is directly exposed to the
# internet, binding to all the interfaces is dangerous and will expose the
# instance to everybody on the internet. So by default we uncomment the
# following bind directive, that will force Redis to listen only on the
# IPv4 and IPv6 (if available) loopback interface addresses (this means Redis
# will only be able to accept client connections from the same host that it is
# running on).
#
# IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES
# COMMENT OUT THE FOLLOWING LINE.
#
# You will also need to set a password unless you explicitly disable protected
# mode.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bind 127.0.0.1 -::1
```
这一段是Redis默认配置文件中写的，里面讲了怎么配置哪些地址可以访问，默认是`127.0.0.1 -::1`，也就是本机IPv4地址和IPv6地址，如果要让所有地址都可以访问，上面的Examples也写了
```conf
# bind * -::*                     # like the default, all available interfaces
```
因为只是开发学习，就用这一条了，允许所有地址访问，将下面没有注释的`bind 127.0.0.1 -::1`改为`bind * -::*`

改完后是这个样子
```conf
# IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES
# COMMENT OUT THE FOLLOWING LINE.
#
# You will also need to set a password unless you explicitly disable protected
# mode.
# ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
bind bind * -::*
```

改完之后会发现外网还是不能访问，这是因为现在有个保护模式
```conf
# Protected mode is a layer of security protection, in order to avoid that
# Redis instances left open on the internet are accessed and exploited.
#
# When protected mode is on and the default user has no password, the server
# only accepts local connections from the IPv4 address (127.0.0.1), IPv6 address
# (::1) or Unix domain sockets.
#
# By default protected mode is enabled. You should disable it only if
# you are sure you want clients from other hosts to connect to Redis
# even if no authentication is configured.
protected-mode yes
```
保护模式开启时，在Redis没设密码的时候，不允许除本机之外的地址访问，调试的时候可以选择直接关掉保护模式，但是更好的选择是给Redis设置密码

```conf
# IMPORTANT NOTE: starting with Redis 6 "requirepass" is just a compatibility
# layer on top of the new ACL system. The option effect will be just setting
# the password for the default user. Clients will still authenticate using
# AUTH <password> as usually, or more explicitly with AUTH default <password>
# if they follow the new protocol: both will work.
#
# The requirepass is not compatible with aclfile option and the ACL LOAD
# command, these will cause requirepass to be ignored.
#
# requirepass foobared
```
密码通过requirepass指定
```conf
requirepass zxc123
```
从redis默认的配置文件中可以看到`requirepass`只是一个兼容层了，更好的方式是分配用户和密码，通过`requirepass`的方式将会视为给默认用户设置密码

## 使用RedisInsight掉坑里了

Redis的GUI管理工具现在推荐使用RedisInsight，我发现RedisInsight只是一个服务，界面靠浏览器渲染，然后我就选择通过docker启动服务，本来一切都很顺利，结果我连接Redis的时候却发现怎么都连不上，然后我发现我的Redis地址填的127.0.0.1，看起来没什么问题，因为我把Redis的端口映射到本机了，但实际上，因为RedisInsight也是Docker跑起来的，127.0.0.1这个地址对应的是运行RedisInsight的容器，而不是我的物理机，因此这里要用本机IP地址才行