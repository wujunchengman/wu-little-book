parent定义的版本在dependencies中使用，dependencies中的dependency只需要指定包坐标，无需指定版本，版本从parent中查找

starter包含一系列需要的包坐标，通过依赖传递，仅需在项目中导入对应的starter即可导入所有相关需要的包

starter定义了当前项目使用得所有依赖坐标，以达到减少以来配置的目的

parent做依赖管理，而不是定义依赖，目的是减少依赖冲突



parent和starter解决配置问题


## 引导类

通过引导了Application.run创建并启动容器

[ ] 从容器中获取bean的4种方法
    - 同.class对象获取


引导类会扫描当前包及其子包下的bean并自动注册

## 内嵌Tomcat

可以通过移除依赖的方式移除内嵌的tomcat

可以排除tomcat更换为其他的web服务器

spring boot支持tomcat(默认)、jetty、undertom
