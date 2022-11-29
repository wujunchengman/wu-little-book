---
title: 创建Model和ViewModel
---

# 创建Model和ViewModel

通过上面编写的TodoListView控件，已经有了一个基本的视图，但是当面对实际情况时，从数据库或者类似数据库的外部获取数据，传统的方式是在视图的构造函数中加载数据，然后生成对应的组件，但是这样有一些缺点

- 不能使用XAML（视图中的组件直接由代码构建，而不是通过XAML进行解析）
- 我们必须编写代码来响应数据的变化并更新显示
- 不可单元测试

这些注意事项对于小型应用程序似乎并不重要，但随着应用程序的增长，它们会成为越来越大的问题：尤其是可测试性部分（无法保证通过代码构建的样式、组件嵌套是正确的）。更好的方式是使用MVVM模式

## 创建Model

首先创建一个Model来表示数据（创建在Models文件中），就像在数据库中一样，这个Model包含两个属性：文本描述和是否被选中
```csharp
namespace Todo.Models
{
    public class TodoItem
    {
        public string Description { get; set; } = string.Empty;
        public bool IsChecked { get; set; }
    }
}
```

接下来创建一个Database服务，模拟从数据库中获取数据

在Todo项目创建Services文件夹，然后创建Database.cs类文件
```csharp
using System.Collections.Generic;
using Todo.Models;

namespace Todo.Services
{
    public class Database
    {
        public IEnumerable<TodoItem> GetItems() => new[]
        {
            new TodoItem { Description = "Walk the dog" },
            new TodoItem { Description = "Buy some milk" },
            new TodoItem { Description = "Learn Avalonia", IsChecked = true },
        };
    }
}
```

## 创建ViewModel

现在需要一个表示列表的视图模型，这是为视图提供数据的类

前面创建了TodoListView视图，因此关联的视图模型将被命名为TodoListViewModel，并将TodoListViewModel放在项目的ViewModels目录中

```csharp
using System.Collections.Generic;
using System.Collections.ObjectModel;
using Todo.Models;

namespace Todo.ViewModels
{
    public class TodoListViewModel : ViewModelBase
    {
        public TodoListViewModel(IEnumerable<TodoItem> items)
        {
            Items = new ObservableCollection<TodoItem>(items);
        }

        public ObservableCollection<TodoItem> Items { get; }
    }
}
```

视图模型在这个阶段非常简单，它只是在其构造函数中获取TodoItem模型的集合，并将它们放入ObservableCollection集合的Items属性中。

需要注意的是，父类ViewModelBase非常重要，后面会讲到它的作用

接下来修改MainWindowViewModel