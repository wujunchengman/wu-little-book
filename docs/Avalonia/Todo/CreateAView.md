---
title: 创建一个视图
---

# 创建一个视图

创建一个视图展示TODO列表和一个添加Todo项的Button按钮

通过VS创建，在Views目录下右键添加->新建项，Avalonia中的User Control，命名为TodoListView（非强制，只是为了更好的复制示例代码）

也可以通过CLI进行创建
```powershell
dotnet new avalonia.usercontrol -o Views -n TodoListView  --namespace Todo.Views
```

创建的TodoListView在Views目录下，和MainWindow.axaml在一个目录下，同时还有一个TodoListView.axaml.cs文件(`*.axaml`和`*.axaml.cs`构成一个视图文件)，在VS中这两个文件会折叠到一起，展开就能看到

目前先不涉及cs代码，可以直接先把数据写死在界面（axaml文件）中，看看效果

```xml
<UserControl xmlns="https://github.com/avaloniaui"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             mc:Ignorable="d" d:DesignWidth="200" d:DesignHeight="400"
             x:Class="Todo.Views.TodoListView">
  <DockPanel>
    <Button DockPanel.Dock="Bottom"
            HorizontalAlignment="Center">
        Add an item
    </Button>
    <StackPanel>
      <CheckBox Margin="4">Walk the dog</CheckBox>
      <CheckBox Margin="4">Buy some milk</CheckBox>
    </StackPanel>
  </DockPanel>
</UserControl>
```
需要注意命名空间和类名（x:Class），如果没有采用上面提到的项目名和视图名，需要改成自己的对应的类名（命名空间也要对应上）

简单看一下这个axaml文件，首先根节点是UserControl，其中包含了许多xml的名称空间，也就是xmlns(XML namespace)，最重要的是第一行的avalonia，它声明这个XAML文件中包含Avalonia XAML；没有这个命名空间则不会解析为界面

命名空间`xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`用来导入非Avalonia特定的XAML功能，后面会使用到它

`mc:Ignorable="d" d:DesignWidth="200" d:DesignHeight="400"`用于指定特定于设计器的信息，前面的`mc:Ignorable="d"`告诉XAML引擎忽略以`d:`开头的项目，因此后面的`d:DesignWidth="200" d:DesignHeight="400"`都不会被XAML引擎解析，但是设计器会使用这两个参数，它们决定了设计器显示的宽度和高度

`x:Class="Todo.Views.TodoListView"`决定了从哪里查找对应的class文件，它是类的完全限定名称，前面的`x:`则是第二行的`xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"`指定的，x就代表了这个命名空间

以上便是`UserControl`的信息，`UserControl`的子项，就是具体的页面代码了

一个`UserControl`只能有一个子节点，因此需要使用面板节点（也可以叫容器节点），面板节点可以包含多个子节点

`DockPanel`是一种面板，它在顶部、底部、左侧和右侧布置其控件，单个控件填充中间的剩余空间。

`<Button DockPanel.Dock="Bottom" HorizontalAlignment="Center">Add an item</Button>`声明出现在视图底部的按钮。`DockPanel.Dock="Bottom"`告诉DockPanel我们希望按钮出现在底部，`HorizontalAlignment="Center"`告诉DockPanel这个按钮是居中对齐的。Button元素中间包裹的值会自动绑定到Content属性上，也就是说，也可以改写成`<Button DockPanel.Dock="Bottom" HorizontalAlignment="Center" Content="Add an item"></Button>`这是等效的，并且，如果节点中间没有内容的话，还可以把节点改成自闭合节点，也就是`<Button DockPanel.Dock="Bottom" HorizontalAlignment="Center" Content="Add an item"></Button>`，他们都是等效的，看个人喜好

Button节点下面是一个StackPanel节点，这也是一个面板节点，它会垂直平铺所有的子节点（可以通过设置`<StackPanel Orientation="Horizontal">`改为水平平铺，默认是垂直的）

StackPanel节点中有两个CheckBox节点`<CheckBox Margin="4">Walk the dog</CheckBox>`，它们是选择框组件，会被渲染为选择框，Margin属性为组件设置边距，这里的设置值为4px，以避免选择框和程序的边框贴在一起，这样更好看一点

定义好TodoListView用户控件后，就要使用了

想要显示刚刚创建的TodoListView控件，它位于Todo.Views命名空间中，这里需要将Todo.Views命名空间映射到视图XML命名空间，编辑`MainWindow.axaml`，在Window节点添加命名空间`xmlns:views="clr-namespace:Todo.Views"`。任何不是Avalonia核心控件的控件通常都需要这种类型的映射，以便XAML引擎找到控件。

然后编辑Window节点的子节点，添加`<views:TodoListView/>`，前面的views就是在Window引入的命名空间，TodoListView就是前面定义的控件，需要注意的是Window也只能有一个子节点，因此可能原来的模板中还有其他节点，需要删除，只保留一个子节点

还有最后一点，设计TodoListView组件的时候是宽高200 * 400，而MainWindow中模板默认的是800 * 450，可以考虑改成一致，这样更好看
`Width="200" Height="400"`(Width和DesignWidth是不同的，Width是实际宽度，DesignWidth是设计器宽度)

接下来运行即可看到效果了



