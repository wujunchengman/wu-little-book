---
title: Kubernetes快速上手
---

Kubernetes是用于自动部署、扩缩和管理容器化应用程序的开源系统

Kubernetes具有以下功能，是管理容器的将有力工具，缺点是有点复杂
- 容器的自行修复，例如，重启失败的容器或替换容器。
- 根据需要动态地纵向扩展或纵向缩减已部署的容器计数。
- 容器的自动滚动更新和回滚。
- 管理存储。
- 管理网络流量。
- 存储并管理敏感信息，如用户名和密码。

### 部署应用

```yaml
---
# 定义要部署到Kubernetes中的容器的部署规范

# 创建该对象所使用的 Kubernetes API 的版本
apiVersion: apps/v1
# 想要创建的对象的类别
kind: Deployment 
# 帮助唯一标识对象的一些数据，包括一个 name 字符串、UID 和可选的 namespace
metadata:
    name: productsbackend
# 所期望的该对象的状态
spec:
  replicas: 1 # 告知 Deployment 运行 1 个与该模板匹配的 Pod
  template:
    metadata:
      labels:
        app: productsbackend
    spec:
      containers:
      - name: productsbackend
        image: wujunchengman/productservice:latest
        ports:
        - containerPort: 80
        env:
        - name: ASPNETCORE_URLS
          value: http://*:80
  selector:
    matchLabels:
      app: productsbackend
---
# 定义容器作为 Kubernetes NodePort 服务运行

apiVersion: v1
kind: Service
metadata:
  name: productsbackend
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 32001
  selector:
    app: productsbackend
```

```yaml
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: storefrontend
spec:
  replicas: 1
  template:
    metadata:
      labels:
        app: storefrontend
    spec:
      containers:
      - name: storefrontend
        image: wujunchengman/storeimage:latest
        ports:
        - containerPort: 80
        env:
        - name: ASPNETCORE_URLS
          value: http://*:80
        - name: ProductEndpoint
        # 使用上一个配置文件在 Deployment 的 metadata.name 节点下指定的名称，Kubernetes会处理映射
          value: http://productsbackend
        - name: ImagePrefix
          value: http://localhost:32001/images
  selector:
    matchLabels:
      app: storefrontend
---
apiVersion: v1
kind: Service
metadata:
  name: storefrontend
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 32000
  selector:
    app: storefrontend
```

使用kubectl部署应用
```shell
kubectl apply -f frontend-deploy.yml
```
apply既用于部署，也用于更新

### 缩放实例

```shell
kubectl scale --replicas=5 deployment/productsbackend
```
通过上面的命令将productsbackend服务配置为5个实例

通过下面的命令可以验证
```shell
kubectl get pods
```

如果要将productsbackend服务恢复到一个实例，则将replicas的值设为1即可

```shell
kubectl scale --replicas=1 deployment/productsbackend
```

除了这种方式，还可以直接在配置文件中修改replicas的值，然后使用apply更新配置

Kubernetes总会保证有replicas中指定的Pod实例个数