---
title: Docker快速上手
---
# Docker快速上手

# Dockerfile

> Dockerfile 是一个用来构建镜像的文本文件，文本内容包含了一条条构建镜像所需的指令和说明。

一个简单的Dockerfile
```dockerfile
# 拉取 mcr.microsoft.com/dotnet/sdk:6.0 镜像并将其命名为 build
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
# 将镜像中的工作目录设置为 /src
WORKDIR /src
# 将在本地找到的名为 backend.csproj 的文件复制到你创建的 /src 目录中
COPY backend.csproj .
# 在项目中调用 dotnet restore
RUN dotnet restore
# 将本地工作目录中的所有内容复制到镜像中
COPY . .
# 在项目中调用 dotnet publish
RUN dotnet publish -c release -o /app
# 拉取 mcr.microsoft.com/dotnet/aspnet:6.0 镜像
FROM mcr.microsoft.com/dotnet/aspnet:6.0
# 将镜像中的工作目录设置为 /app
WORKDIR /app
# 公开端口 80 和 443
EXPOSE 80
EXPOSE 443
# 将创建的 build 镜像的 /app 目录中的所有内容复制到此镜像的应用目录中
COPY --from=build /app .
# 将此镜像的入口点设置为 dotnet，并将 backend.dll 作为参数传递
ENTRYPOINT ["dotnet", "backend.dll"]
```
保存Dockerfile，然后进入到Dockerfile所在目录，执行下面指令
```shell
docker build -t pizzabackend .
```

该Dockerfile覆盖了常见的指令，大多数情况下的Dockerfile都是这些指令，其中涉及了几个Docker的概念

### 上下文路径

无论是前面的Dockerfile还是创建docker镜像的命令，都包含了一个` . `，这个点代表的是当前上下文路径

它并不是固定的，而是根据命令所在的环境，如构建docker镜像时的` . `，所对应的环境是执行命令时的所在路径

而在上面的Dockerfile中，有这么一段
```dockerfile
# 将镜像中的工作目录设置为 /src
WORKDIR /src
# 将在本地找到的名为 backend.csproj 的文件复制到你创建的 /src 目录中
COPY backend.csproj .
```
这里的` . `不再是执行命令的路径，而是上面的设置的工作目录，因为这里的参数是镜像中的路径，前面已经设置了镜像中的路径的上下文，因此这里指代的是`/src`工作目录

由于 docker 的运行模式是 C/S。我们本机是 C，docker 引擎是 S。实际的构建过程是在 docker 引擎下完成的，所以这个时候无法用到我们本机的文件。这就需要把我们本机的指定目录下的文件一起打包提供给 docker 引擎使用。

如果未说明最后一个参数，那么默认上下文路径就是 Dockerfile 所在的位置。

注意：上下文路径下不要放无用的文件，因为会一起打包发送给 docker 引擎，如果文件过多会造成过程缓慢。

### 工作目录

当查找某个文件时，需要跳转到某个路径下执行，如果要删除一个文件，可以用rm命令
```shell
rm test.txt
```
如上面的命令，如果要删除`test.txt`，首先是进入到`test.txt`所在的目录，如果在本机上，可能是通过`cd`命令移动到对应的目录下，但是dockerfile中，使用`WORKDIR`切换到对应的目录，后续执行命令时，就以对应的工作目录作为当前路径

docker build 构建镜像过程中的，每一个 RUN 命令都是新建的一层。只有通过 WORKDIR 创建的目录才会一直存在。

### 公开端口

Docker是轻量的虚拟机，因此很多东西与系统类似，系统中存在防火墙，只有开放的端口才能被外界访问到，如果外界需要访问对应的端口，就需要通过指令进行开放

### 入口点

入口点指的是启动镜像后执行的命令，它的参数与`RUN`命令类似，有两种写法，如果后面跟的是一个字符串，则是执行对应命令；如果是一个数组，则数组的第一个值是可执行程序，后面的值都是对应的参数