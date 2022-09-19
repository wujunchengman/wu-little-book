---
title: 一个简单的鉴权、授权
---
# 一个最简单的鉴权、授权

Asp.Net Core内置了授权鉴权的支持，这里简单写一个使用内置的默认的最基本的鉴权方案的例子

## 添加授权中间件

添加认证中间件，认证中间件与授权中间件单词有点像，注意不要搞错了，授权中间件在模板中是默认添加了的，认证中间件是需要手动添加的

```csharp
// 认证中间件要在授权中间件之前，Asp.Net Core的中间件管道是与顺序相关的

// 认证中间件（需要自己添加）
app.UseAuthentication();

// 授权中间件（模板已经添加好了）
app.UseAuthorization();
```
::: danger 特别注意
如果没有添加认证中间件，那么后续对资源进行鉴权时会鉴权不过
:::

## 配置认证服务

除了添加认证中间外，还需要在IOC容器中注入身份认证服务，并配置认证方案
```csharp
// CookieAuthenticationDefaults.AuthenticationScheme值为Cookies，
// AddAuthentication()中的字符串名字代表了默认要使用的认证方案
// 这里是指定默认的认证方式为Cookies
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    // 添加Cookie认证方式，这里AddCookie()提供了两个参数，第一个参数指定了身份验证方案名
    // 第二个参数是一个Action委托，用于指定认证行为
    .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme, options =>
    {
        // 如果没有认证跳转到的登陆地址
        options.LoginPath = "/Account/Login";
        // 拒绝访问时跳转到的地址
        options.AccessDeniedPath = "/forbid";
        
        // 还有很多其他配置选项
    });
```
::: tip Cookie对于未认证用户访问的处理
对于默认的Cookie行为，如果用户没认证，则会返回302重定向到登录地址，默认的登陆地址是/Account/Login，如果没有使用这个地址，则需要向上面一样进行手动指定（这里我指定的与默认的一致，可以省略，这里只是为了展示配置项）
:::

## 对资源添加认证保护

最简单的授权要求，就是用户已认证，如果一个需要将资源添加简单的保护，可以使用这个策略

要求必须是已认证用户才能访问对应的资源，只需要为对应的资源添加Authorize特性
```csharp
[ApiController]
[Route("[controller]")]
[Authorize]
public class AccountController:ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public string Login()
    {
        return "登陆成功";
    }

    [HttpGet]
    public string Logout()
    {
        return "退出登陆成功";
    }
}
```
这里将Authorize特性添加到Controller，代表该Controller下的所有Action均需要已认证才能访问，但是这是一个身份认证的Controller，如果连登录也必须身份认证通过才能通过，就变成了允许访问才能拿到认证和必须有认证才能访问的死循环了，于是提供了AllowAnonymous特性，被AllowAnonymous标注的资源将不需要任何授权，访问权限变成了公开，谁都可以访问

## 设置身份认证Cookie

前面设置了需要经过认证的用户才能访问资源，然后认证的默认方案设置的是Cookie，这里再简单讲讲怎么设置这个认证Cookie

Asp.Net Core提供了一个SignInAsync的扩展方法，通过这个方法可以快速设置用于身份认证的Cookie
```csharp
[AllowAnonymous]
[HttpPost]
public async Task<string> Login()
{
    
    // 身份信息，会被解析到HttpContext.User中

    //这里方案的ClaimsIdentity的构造函数的参数要和下面的SignInAsync的方案名一致
    var claimIdentity = new ClaimsIdentity(CookieAuthenticationDefaults.AuthenticationScheme);
    claimIdentity.AddClaim(new Claim(ClaimTypes.Name,"admin"));

    // 将身份信息编码后写入Cookie
    await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimIdentity),
        new AuthenticationProperties
        {
            // 凭据过期时间
            ExpiresUtc = DateTime.UtcNow.AddMinutes(30)
        });
    
    return "登陆成功";
}
```
这个SignInAsync是针对Cookie身份认证的，对于JWT或者自定义身份认证都没有意义

要退出登录也非常简单
```csharp
[HttpGet("logout")]
public async Task<string> Logout()
{
    await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    
    return "退出登陆成功";
}
```
只需调用对应的SignOutAsync方法，传入对应的方案名即可

SignOutAsync和SignInAsync是针对Asp.Net Core框架自带的Cookie认证方案提供的一组快捷方法

