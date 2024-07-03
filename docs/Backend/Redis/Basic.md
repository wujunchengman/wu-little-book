---
title: Redis常见命令
---

# Redis常见命令

Redis的文档介绍了所有命令，也支持分组 [Redis命令](https://redis.io/commands/)

## Redis的基本命令

Redis是一个键值对数据库，因此有针对Key的命令，常见的有：

- KEYS：查看符合模板的所有key
- DEL：删除一个指定的key
- EXISTS：判断key是否存在
- EXPIRE：给一个key设置有效期，有效期到期时该key会被自动删除
- TTL：查看一个KEY的剩余有效期

## Key结构

Redis没有Table结构，只是单纯的Key就很容易重复。举个例子，在Redis中存放了Id为1的用户信息，key通常用的就是Id，但是1并不唯一，因为有时候Redis还会存储Id为1的产品信息，这时候就重复了。Redis的解决办法是，用一个前缀来区分不同的类型，以`:`作为分隔，也就是用户的key就是`user:1`，而产品key就是`product:1`。

## Redis的基本类型

一些特殊的类型有特殊的命令，但是大体上都有设置Key-Value，查询Key对应的Value，批量设置Key-Value，批量查询Key对应的Value，不同数据类型在命令上有所不同

### String

String在Redis中是一个大类，同时包含了编程语言中的string、float、int，他们底层都是字节数组形式存储，只不过编码方式不同。字符串类型的最大空间不能超过512m.

常见命令有
- SET：添加或者修改已经存在的一个String类型的键值对
- GET：根据key获取String类型的value
- MSET：批量添加多个String类型的键值对
- MGET：根据多个key获取多个String类型的value
- INCR：让一个整型的key自增1
- INCRBY:让一个整型的key自增并指定步长，例如：incrby num 2 让num值自增2
- INCRBYFLOAT：让一个浮点类型的数字自增并指定步长
- SETNX：添加一个String类型的键值对，前提是这个key不存在，否则不执行
- SETEX：添加一个String类型的键值对，并且指定有效期

前四个是普通的命令，INCR和INCRBY是针对int特有的，与SET相比，它是原子的，不会出现并发冲突问题。INCRBYFLOAT这是针对float版本

### Hash

Redis通过不同的命令来决定保存Value的类型，如果类型是Hash，那么命令前面则带有H，Hash拥有多个键值对，而Redis是一个键值对数据库，因此Hash看起来很像嵌了一层的Redis

- HSET key field value：添加或者修改hash类型key的field的值
  
- HGET key field：获取一个hash类型key的field的值
  
- HMSET：批量添加多个hash类型key的field的值
  
- HMGET：批量获取多个hash类型key的field的值
  
- HGETALL：获取一个hash类型的key中的所有的field和value
  
- HKEYS：获取一个hash类型的key中的所有的field
  
- HINCRBY:让一个hash类型key的字段值自增并指定步长
  
- HSETNX：添加一个hash类型的key的field值，前提是这个field不存在，否则不执行

还是一样的基本的设置和查询，批量的设置和查询，然后加了Hash特有的查询Hash对象的所有的key，获取所有的key-value等

### List

### Set

### SortedSet

## Redis的特殊类型

### GEO

### BitMap

### HyperLog