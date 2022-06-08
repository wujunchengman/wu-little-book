---
title: WPF动态生成ListView
description: 在WPF中，根据实际代码需要，动态渲染ListView列
---

# WPF动态生成ListView，根据内容自动渲染列

最近写代码的时候遇到了这样一个需求，在一个页面中需要用ListView显示数据，但是这个地方会因为接入的设备不同，而接收不同的的数据，在ListView中也要根据对应的数据种类，显示出正确的表头和内容

经过一番测试，可以用下面的方法来动态的决定ListView的列和对应的绑定

首先，不能将ListView的列定义在XAML之中，如果写在XAML中，那么这个列和绑定关系则基本就定下来了，因此只能在后台中去绑定对应的列

```csharp

// 这是一行注释
Console.WriteLine("输出");

```