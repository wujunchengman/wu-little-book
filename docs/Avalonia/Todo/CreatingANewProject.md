---
title: 创建项目
---

安装好Avaloina模板后，创建MVVM项目，可以通过VS创建，也可以通过CLI创建

使用VS创建时，搜索Avalonia模板，选择Avalonia MVVM Application模板，项目名设为Todo（非强制，保持相同的名字只是为了更好的粘贴案例代码）

使用CLI创建
```powershell
dotnet new avalonia.mvvm -o Todo -n Todo
```

项目文件结构
```
Todo
 |- App.axaml
 |- App.axaml.cs
 |- Assets
 |   |- avalonia-logo.ico
 |- Models 
 |- nuget.config 
 |- Program.cs
 |- Todo.csproj
 |- ViewLocator.cs
 |- ViewModels
 |   |- MainWindowViewModel.cs
 |   |- ViewModelBase.cs
 |- Views
 |   |- MainWindow.axaml
 |   |- MainWindow.axaml.cs
 ```

 - Assets目录保存应用程序的二进制资产，如图标和位图。放在此目录中的文件将自动作为资源包含在应用程序中
 - Models目录目前是空的，但顾名思义，这是我们将放置模型的地方
 - ViewModels 目录预先填充了视图模型的基类和应用程序主窗口的视图模型
 - Views 目录目前只包含应用程序主窗口
 - App.axaml文件是应用于整个应用程序的XAML样式和模板的地方
 - Program.cs是应用程序的入口
 - ViewLocator.cs用来查找View的model后面会有更详细的解释