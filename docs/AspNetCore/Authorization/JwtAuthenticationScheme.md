---
title: Jwt的身份认证
---

## 简述Jwt
Jwt全称是jwt的全称是json web token，它的作用是用户授权authorization，而不是用户的身份认证authentication，但是不是说Jwt与身份认证无关

身份认证是判断携带的Token信息是否合法，并解析为对应的身份信息。

在Asp.Net Core中，身份认证和授权的概念进行了解耦，以此更好的支持多种认证方式

无论是使用Cookie还是Jwt都要使用身份认证中间件去处理，然后解析为抽象好的的身份信息对象，再由授权中间件对访问的资源进行鉴权

前面提到的Jwt的主要作用是用户授权，是指Jwt中可以携带用户的权限信息，在这个映射过程中无需再从数据库中获取权限信息，然而实际上，用户的权限可能会很复杂，如果全部写入到Jwt中，会导致Jwt异常庞大，因此在服务器程序中，通常Jwt的payload只包含用户ID，使用方式与传统的session一样，还是从数据库中请求用户信息与权限信息。Jwt的优势更多时候是在客户端使用，例如：服务端下发一个Jwt Token，包含了所能使用的完整权限信息，客户端可以直接解析对应的权限，而无需频繁与服务器通信校验权限，可以节省大量的服务器资源


## 在Asp.Net Core中使用Jwt

微软提供了使用Jwt的身份认证方案，无需自己实现，只需要安装对应的包配置即可

安装nuget包
```shell
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer
```
在Program.cs中配置身份认证模式为使用Jwt身份认证
```csharp

builder.Services.AddAuthentication(options =>
{
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(o =>
{
    o.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateAudience = true,
        ValidateIssuer = true,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromSeconds(1),
        RequireExpirationTime = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Authentication:SecretKey"])),
        ValidIssuer = builder.Configuration["Authentication:Issuer"],
        ValidAudience = builder.Configuration["Authentication:Audience"],
    };
    }
);
```
Asp.Net Core会将Jwt中的信息解析到HttpContext.User中，Asp.Net Core将会根据HttpContext.User中包含的信息进行授权验证

需要注意的是，一定要注册身份认证中间件，否则不会去解析Jwt，进而导致HttpContext.User没有信息，授权验证不通过
```csharp
// 身份验证中间件
app.UseAuthentication();
// 授权中间件
app.UseAuthorization();
```

## 签发Jwt

```csharp
var claims = new List<Claim>
{
    new Claim(JwtRegisteredClaimNames.Aud,configuration["Authentication:Audience"]),
    new Claim(JwtRegisteredClaimNames.Iss,configuration["Authentication:Issuer"]),
    new Claim("UserName", account.UserName),
    new Claim("CorpId", account.CorpID.ToString())
};

// 过期时间
var expire = DateTime.Now.AddHours(2);
if (longActing==true)
{
    expire = DateTime.Now.AddMonths(1);
}

// 密钥
var key = configuration["Authentication:SecretKey"];
var secBytes = Encoding.UTF8.GetBytes(key);
var secKey = new SymmetricSecurityKey(secBytes);
var credentials = new SigningCredentials(secKey, SecurityAlgorithms.HmacSha256);

var tokenDescriptor = new JwtSecurityToken(claims: claims, expires: expire, signingCredentials: credentials);

// 最终的jwt
var jwt = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
```

## 携带Jwt

默认情况下，Asp.Net Core从Header中获取Jwt，添加授权后，需要在Header中携带`Authorization`，其值为`Bearer `加上对应Jwt，需要注意的是，这中间有个空格，不要忘了

## 401错误与403错误

刚开始用Jwt的时候，可能会出现401错误，这是身份验证除了问题，这时候可以看看响应头，Asp.Net Core会将错误信息输出的响应头的Authentication中，其中包含了大致的错误信息

403错误是授权错误，意味着Jwt解析之后的HttpContext.User中得到的权限信息不匹配，这代表这Jwt已经跑通了，只是分发Jwt时携带的权限出了问题