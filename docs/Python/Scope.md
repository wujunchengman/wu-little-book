---
title: Python中的变量作用域
---
# Python中的变量作用域

执行期间的任何时刻，都会有 3 或 4 个“命名空间可直接访问”的嵌套作用域：

- 最内层作用域，包含局部名称，并首先在其中进行搜索

- 那些外层闭包函数的作用域，包含“非局部、非全局”的名称，从最靠内层的那个作用域开始，逐层向外搜索。

- 倒数第二层作用域，包含当前模块的全局名称

- 最外层（最后搜索）的作用域，是内置名称的命名空间

如果一个名称被声明为全局，则所有引用和赋值都将直接指向“倒数第二层作用域”，即包含模块的全局名称的作用域。

 要重新绑定在最内层作用域以外找到的变量，可以使用 nonlocal 语句；如果未使用 nonlocal 声明，这些变量将为只读（**尝试写入这样的变量将在最内层作用域中创建一个 新的 局部变量，而使得同名的外部变量保持不变**）。

 Python 有一个特殊规定。如果不存在生效的 global 或 nonlocal 语句，则对名称的赋值总是会进入最内层作用域。赋值不会复制数据，只是将名称绑定到对象。删除也是如此：语句 del x 从局部作用域引用的命名空间中移除对 x 的绑定。所有引入新名称的操作都是使用局部作用域：尤其是 import 语句和函数定义会在局部作用域中绑定模块或函数名称。

 ```python
def scope_test():
    def do_local():
        # 最内层作用域，局部作用域
        spam = "local spam"

    def do_nonlocal():
        # 外层闭包函数的作用域，非局部、非全局
        nonlocal spam
        spam = "nonlocal spam"

    def do_global():
        # global变量在倒数第二层作用域，包含模块的全局名称的作用域
        global spam
        spam = "global spam"

    # 外层闭包函数的作用域，非局部、非全局
    spam = "test spam"
    
    # do_local赋值spam变量时，因为没有global或者nonlocal，Python会在这个函数的作用域内创建一个spam变量
    do_local()
    
    # 当执行print时，do_local只是在其作用域内创建了一个同名的spam变量，并在函数执行完成后释放，
    # 并没有修改scope_test作用域内定义的spam
    print("After local assignment:", spam)

    # do_nonlocal中使用nonlocal标记了spam变量，因此Python在外层作用域中（scope_test函数作用域中）重新绑定
    # 此时赋值spam变量时操作的就是scope_test作用域中的spam变量，所以输出发生了变化
    do_nonlocal()
    print("After nonlocal assignment:", spam)

    # do_global使用global标记了spam变量，Python会在模块的全局名称作用域中重新绑定
    # 此时赋值spam变量时操作的就是模块全局作用域中的spam变量
    do_global()
    print("After global assignment:", spam)

    # print函数是最外层作用域，内置名称的命名空间

scope_test()
print("In global scope:", spam)
 ```
 输出：
 ```shell
After local assignment: test spam
After nonlocal assignment: nonlocal spam
After global assignment: nonlocal spam
In global scope: global spam
 ```