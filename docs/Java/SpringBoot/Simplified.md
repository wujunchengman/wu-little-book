---
title: SpringBoot对开发的一些简化
---

# SpringBoot对开发的一些简化

SpringBoot的核心就是针对Spring开发非常复杂的问题而进行的一个简化，下面简单的看看SpringBoot是怎么做简化的

## 起步依赖

SpringBoot提供了众多常用Java包的版本定义，当使用一个已经定义好的项目时，仅需提供GAV（groupId、artifactId、version）中GA，而对应的项目的版本由SpringBoot同意提供，极大程度上避免了因依赖包版本冲突引发的问题

### parent

SpringBoot项目通过parent继承了`spring-boot-dependencies`，而在`spring-boot-denpencies`中通过`properties`定义了常用软件的版本，通过`dependencyManagement`定义了一系列坐标依赖管理，因此在项目中需要使用对应的依赖包时，仅需要提供对应的GA就可以了，无需再去匹配对应的版本信息、排除依赖冲突等操作

### starter

SpringBoot项目大量使用了starter依赖包，starter是满足某种功能需要的一组依赖包集合。仅需在使用时添加所需功能对应的starter依赖，通过依赖传递的方式将所需的依赖包全部导入，简化了对依赖包的配置

### parent和starter

starter定义了功能所需要的依赖包集合，使其在添加对应功能时仅需添加对应的starter一个依赖，而不是所需要的一堆依赖，达到**减少依赖项配置**的目的

parent定义来常用依赖包的版本，由SpringBoot管理各依赖之间的版本，达到**减少依赖冲突**的目的

## 自动配置

### 引导类

SpringBoot项目创建完成后，以Application结尾，带有`@SpringBootApplication`注解的类就是引导类

引导类中包含了main方法，它是程序的入口，在main方法中，执行了`SpringApplication.run()`方法，并将引导类和启动参数传递给了run方法

run方法会创建并移动一个容器，默认建立的项目没有用变量接收run方法的返回值，但是run方法是有返回值的，run方法运行后的返回值是一个ConfigurableApplicationContext对象，这是一个可配置应用上下文对象，它就是一个Spring容器。

可以通过getBean()方法获得到对应的Bean，获取Bean有四种方法，

引导类的`@SpringBootApplication`注解定义类配置累和Bean扫描，在未指定包路径的情况下，会扫描引导类当前包及其子包，因此可以无需手动注册Bean，前面HelloWorld创建的Controller就可以直接访问

通过引导类，使得原本要配置很多东西才能启动的Spring直接可以运行，这是一种通过约定完成配置的思想，简化了启动SpringBoot项目所需的工作，使开发从一堆没有意义的配置中脱离出来，更好的关注真正的业务价值

## 内嵌服务器

在学校学习Java Web开发的时候，老师讲配置Tomcat要讲四节课，整整一上午，到最后还是很多同学没有配置成功。Java的配置真的很多很烦很容易出错

SpringBoot在项目中集成了Tomcat，Tomcat的运行、终止全生命周期由SpringBoot来接管，这样就避免了各种麻烦的配置

因为默认用的Tomcat，有时候有些项目不想使用Tomcat，而是想用其他的Web服务器，可以通过排除依赖的方式移除Tomcat，然后添加想要的Web服务器依赖即可

tomcat的在`spring-boot-starter-web`中引入，如果不需要tomcat，可以使用下面的方式替换为其他Web服务器
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-jetty</artifactId>
</dependency>
```
通过排除tomcat然后重新引入jetty依赖的方式，替换了SpringBoot的Web服务器

SpringBoot默认支持三款Web服务器：tomcat、jetty、undertom，其中tomcat是项目默认继承的，如果没有啥特别需求，或者明确了解三款Web服务器各自功能特点的情况下，使用默认的即可
