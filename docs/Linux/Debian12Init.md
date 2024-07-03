---
title: Debian12初始化
---

# Debian12安装后的初始化工作

## Server

> 最近服务器用了Debian12，简单记一下需要进行的初始化操作。在安装时，我只选择了标准系统工具和SSH Server

### 配置DNS
DNS可以在安装时配置，但是Debian默认会先尝试着自动 DHCP 网络配置，如果成功了这一步并不会提示，所以我也没在这里配置到，这里将后面怎么配的

当请求一个域名需要DNS进行解析时，会请求`/etc/resolv.conf`设置的DNS，如果 resolvconf 软件包没有安装，"/etc/resolv.conf" 是一个静态文件。如果安装了，它是一个符号链接。

Debian默认不安装resolvconf，可以手动安装一下，安装完之后的`resolv.conf`带有注释，如果没安装则是空白的

```shell
# 指定DNS服务器为114.114.114.114
nameserver 114.114.114.114
```

### 禁用IPv6

公司的路由器使用IPv6有问题，所以停用了IPv6，但是不知道怎么的Debian会自己获取到IPv6地址，因此需要禁用IPv6（或者优先用IPv4，这里选择直接禁用）

编辑`/etc/sysctl.conf`文件，添加以下内容
```conf
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
```
保存文件后运行 `sudo sysctl -p` 来应用新的系统参数。这样就禁用了 IPv6

这个配置会将所有网卡的IPv6都禁用了，使用的时候需要注意这种行为是不是自己需要的

### 配置Sudo用户

Debian默认没有设置Sudo用户，甚至没有安装Sudo软件包，因此需要先通过su命令切换到root用户，然后安装sudo软件包
```shell
# 切换为root用户，如果本身是root用户，可以忽略
su
# 将penguin用户添加到sudoers中
echo "penguin  ALL=(ALL) ALL" >> /etc/sudoers

# 将penguin用户添加到sudoers中，并且penguin在使用sudo获得管理员权限时无需输入密码
# echo "penguin  ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
```
