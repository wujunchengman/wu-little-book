---
title: 通过Assembly程序集获取所有Controller和Action
---

# 通过Assembly程序集获取所有Controller和Action

在设计系统权限的时候，很多时候需要精细化控制权限，需要控制每个角色能够访问的Action，在配置的时候，需要获取所有的Controller和Action，这时候使用反射是最简单的方式

首先使用Assembly.Load方法加载Assembly，然后使用GetTypes方法获取所有的类型

然后对所有类型进行筛选，首先需要明确Controller类型有什么特点：首先按照规范应该是Controller结尾，然后父类是ControllerBase。如果有其它的封装，则规则可能不同，但思路相同

经过筛选后的Type就是Controller了，然后使用GetMethods方法，可以得到所有的方法，Action是Controller中特殊的方法，因为也要对获取到的所有方法进行过滤

过滤Action的方式也有很多，可以考虑通过返回值类型来判断，也可以通过特性来判断
```csharp
// 通过方法的返回值类型判断
var newMethods = methods.Where(p =>
    p.ReturnType.FullName != null && (p.ReturnType.Name == "ActionResult" ||
                                      p.ReturnType.Name == "FileResult" ||
                                      p.ReturnType.Name == "JsonResult" ||
                                      (p.ReturnType.GenericTypeArguments.Length > 0 && p.ReturnType.GenericTypeArguments[0].Name == "JsonResult") ||
                                      p.ReturnType.Name == "IActionResult")
    ).ToList();

```

```csharp
// 通过特性的方式判断是不是Action
var httpMethods = new HashSet<string>() {
    "HttpGetAttribute","HttpPostAttribute","HttpPutAttribute","HttpDeleteAttribute",
};
var newMethods = methods.Where(p =>
    p.CustomAttributes.Select(a => a.AttributeType.Name).Intersect(httpMethods).Any()
    ).ToList();
```