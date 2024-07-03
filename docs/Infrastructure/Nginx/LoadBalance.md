---
title: Nginx负载均衡
sidebar: 'auto'
---

# Nginx负载均衡

负载均衡在目前是非常重要的技术，当业务负载越来越高，就可以考虑使用负载均衡来水平扩展，这是负载均衡很重要的功能。不过绝大多数公司都用不着水平扩展，但是负载均衡仍然有用，比如说用来不间断更新服务，灰度发布什么的，总之学了还是很实用的


## HTTP的负载均衡
```conf
http {

    # 其它配置内容

    upstream backend {
        server 10.10.12.45:80 weight=1;
        server app.example.com:80 weight=2;
        server spare.example.com:80 backup;
    }
    server {
        location / {
            proxy_pass http://backend;
        }
    }
}
```
此配置指定了两台主服务器和一台后备服务器，当两台主服务器都不可用时使用backup后备服务器

两台主服务器通过指定`weight`设置了权重，默认权重均为1，通过上述设置，Nginx会向第二台主服务器传输第一台主服务器两倍的请求，也就是请求1/3走第一台服务器，2/3走第二台服务器


### 负载均衡的方式

Nginx支持多种负载均衡方式，其默认负载均衡方式是轮询，除此之外还有最少连接、最短时间、通用哈希、随机算法和IP哈希等多种负载均衡方式

如果设备都不指定，那么使用默认的轮询方式进行负载均衡，如果要使用其他方式，则添加对应的指令

```conf
    upstream backend {
        # 使用最少连接进行负载均衡
        least_conn;
        server 10.10.12.45:80 weight=1;
        server app.example.com:80 weight=2;
        server spare.example.com:80 backup;
    }
```
| 负载均衡方式 | 指令 | 备注 |
| -- | -- | -- |
| 轮询 | 无 | 默认方式，无需指令 |
| 最少连接 | least_conn | |
| 最短时间 | least_time | 仅在企业版提供 |
| 通用哈希 | hash | |
| 随机 | random | |
| IP哈希 | ip_hash | 仅适用于HTTP |

补充说明
##### 通用哈希
```conf
upstream backend {
    hash $request_uri consistent;
    server backend1.example.com;
    server backend2.example.com;
}
```
使用通用hash时，指定一个变量定义哈希值，NGINX 能够为当前请求生成哈希值并将其放在上游服务器上，从而在这些服务器之间分发负载。`consistent`是一个可选参数，能够将重新分发带来的影响最小化

[Nginx内置变量表](https://nginx.org/en/docs/http/ngx_http_core_module.html#variables)

##### 随机

使用random时，会随机选择一个服务器，如果使用了two参数，则会随机选择两个服务器，再按照后面的负载均衡方式选择一个

```conf
upstream backend {
    random two least_conn;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
    server backend4.example.com;
}
```
这个配置文件会随机选择2个服务器，然后使用最少连接的方式选择其中一个，`least_conn`是默认的方法，也可以省略（`random two least_conn;`等效`random two;`）


## TCP/UDP负载均衡
TCP
```conf
stream {
    upstream mysql_read {
        server read1.example.com:3306 weight=5;
        server read2.example.com:3306;
        server 10.10.12.34:3306 backup;
    }
    server {
        listen 3306;
        proxy_pass mysql_read;
    }
}
```
UDP
```conf
stream {

    upstream stream_backend {
        server backend1.example.com:12345;
        server backend2.example.com:12345;
        server backend3.example.com:12346;
        # ...
    }

    upstream dns_servers {
        server 192.168.136.130:53;
        server 192.168.136.131:53;
        # ...
    }

    # ...
}
```
TCP和UDP的负载均衡，并不在HTTP模块，而是使用stream模块，不支持IP哈希，其他的语法是相同的