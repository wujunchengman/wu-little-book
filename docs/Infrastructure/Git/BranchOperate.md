---
title: Git分支操作
---

# Git分支操作

## 创建分支

创建新的Git分支可以使用以下命令
```shell
git branch <branch_name>
```
创建一个新分支，默认是从当前的位置创建，也就是新分支指向的当前分支的最后一个提交，如果需要从指定位置创建一个分支，可以指定一个提交记录hash值，这样新分支就是从指定位置创建的了
```shell
git branch <branch_name> <SHA>
```

## 切换分支

切换分支
```shell
git checkout <branch_name>
```

## 创建与切换合并操作

大多数时候创建分支之后紧接着就是切换到创建的分支，因此Git提供了一步到位的操作

```shell
git checkout -b <branch_name>
```

它相当于下面两条命令
```shell
git branch <branch_name>
git checkout <branch_name>
```

## 合并分支

合并分支首先需要切换到接收合并的分支上（一般是主分支），然后运行下面的命令
```shell
git merge <branch_name>
```
这里指定的分支名是被合并的分支名，通过这条命令，被合并分支的提交就会合并到当前分支上


有些时候，我们倾向于一个提交包含一个完整的功能，但是这个功能可能一次完成不了，考虑代码安全性之类的，可能会在下半时以某个比较随意的名字提交，在最后的时候合并为一个提交，这时候就会用到squash
```shell
git merge --squash <branch_name>
```
执行上述命令，会将<branch_name>中的更改全部应用到当前分支来，此时便可以以最终决定的提交信息进行提交，得到干净的一个完整的提交，不至于提交记录凌乱重复
