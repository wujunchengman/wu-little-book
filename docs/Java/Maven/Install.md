---
title: Maven的安装与基本配置
---
# Maven的安装与基本配置

## Maven的安装

Maven是一个“绿色软件”，也就是不用安装，解压就能运行的软件，但是maven是依赖jre的，因此要提前安装上jre。不过用Maven都是用来开发Java的，因此直接装JDK就好了，现在安装JDK已经非常方便了，在Linux环境下直接用包管理工具安装OpenJDK就好，简单方便；Windows上也可以使用Microsoft JDK，这是微软维护的JDK，可以自动配置环境变量，设置JAVA_HOME什么的，非常方便



## 配置本地仓库路径

Maven默认配置中将本地仓库的配置注释了的，默认保存在用户目录下的.m2目录下的repository目录
```xml
<!-- localRepository
| The path to the local repository maven will use to store artifacts.
|
| Default: ${user.home}/.m2/repository
<localRepository>/path/to/local/repo</localRepository>
-->
```
在Windows系统中，用户目录一般在C盘，而C盘空间一般比较金贵，数据放在其他分区，这时候可以通过配置localRepository节点来设置；Linux系统一般所有文件在同一个分区，或者/home单独一个分区，因此配置与不配置倒是影响不大
```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
    
    <!-- 本地仓库路径配置 -->
    <localRepository>D:\Storage\maven\repository</localRepository>

    <!-- 其他的一些配置省略了…… -->

</settings>
```
我这里将本地仓库路径放在了D盘的Storage的maven的repository目录下

## 配置镜像代理

maven的中央仓库在国外，访问速度很慢，因此需要配置一个镜像代理，在访问中央仓库的时候，直接访问代理镜像仓库，用的最多的镜像仓库是阿里云的maven镜像仓库

配置镜像代理仓库不是修改中央仓库的位置，而是访问中央仓库的时候去访问镜像代理仓库

mirror应该配置在settings节点下的mirrors节点(默认配置文件中已经存在mirrors节点)下，其结构为
```xml
<settings xmlns="http://maven.apache.org/SETTINGS/1.2.0"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://maven.apache.org/SETTINGS/1.2.0 https://maven.apache.org/xsd/settings-1.2.0.xsd">
    
    <!-- 其他的一些配置省略了…… -->

    <mirrors>
        <!-- 配置central仓库的镜像代理 -->
        <mirror>
            <!-- 镜像仓库Id -->
            <id>aliyun</id>
            <!-- 被镜像仓库Id（被替代的仓库） -->
            <mirrorOf>central</mirrorOf>
            <!-- 镜像名称（可有可无） -->
            <name>aliyun</name>
            <!-- 镜像地址 -->
            <url>https://maven.aliyun.com/repository/public</url>
        </mirror>
    </mirrors>

    <!-- 其他的一些配置省略了…… -->

</settings>
```
这里我使用了阿里云的镜像仓库去代理central仓库，也就是maven的中央仓库，这里配置的aliyun这个镜像去代理哪个仓库就是通过mirrorOf节点指定的，除了指定具体的仓库，还支持通配符
```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```
这一段是阿里云镜像给的帮助文档，mirrorOf指定为*，代表所有的仓库都走阿里云的镜像

## 默认JDK的配置

目前的maven默认的JDK版本是7，但是实际上使用的JDK版本并不是7，此时使用maven构建项目就会出错，因此需要更改一下maven所使用的默认JDK版本

