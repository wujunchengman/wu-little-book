---
title: Rsync同步文件
---

rsync是一个用于同步文件的常用工具，随着开发换成了Linux，服务也部署在Linux上，rsync用得越来越多了，这里简单记录一下rsync的使用

```bash
rsync [OPTION]... SRC [SRC]... DEST
```

rsync有多个选项，支持将多个文件文件夹同步到指定目录中

rsync也支持远程传输，默认使用ssh，既可以将远程主机的内容同步到本地，也可以将本地内容同步到远程主机，也就是说SRC和DEST都支持远程地址

### rsync常见选项

##### -r

`-r` : recurse into directories，也就是递归子目录，Linux中的很多指令都用`-r`参数指定递归子目录

##### -a

`-a` : -a参数可以替代-r，除了可以递归同步以外，还可以同步元信息（比如修改时间、权限等）。由于 rsync 默认使用文件大小和修改时间决定文件是否需要更新，所以-a比-r更有用

##### --delete

`--delete` : delete extraneous files from dest dirs，指定该选项时，当SRC目录中没有某个文件时，也会删除DEST目录中文件，也就是通常说的“镜像” 模式

### 案例

```bash
rsync -av --delete docs/.vuepress/dist/ wujuncheng@192.168.1.107:/home/wujuncheng/Applications/WuLittleBook
```
上面的rsync指令将`docs/.vuepress/dist`目录下的所有内容使用ssh，以`wujuncheng`为用户名登陆，镜像同步到远程主机`192.168.1.107`的`/home/wujuncheng/Applications/WuLittleBook`目录下


### 参考文档

[阮一峰-rsync用法教程](https://www.ruanyifeng.com/blog/2020/08/rsync.html)