---
title: ".Net使用微信支付"
---

# .Net使用微信支付

微信支付官方没有提供.NET的SDK，使用社区提供的SDK
```shell
dotnet install SKIT.FlurlHttpClient.Wechat.Api
```
MerchantId: 商户号

CertificatePrivateKey: key.pem文件内容

SucessedNotifyUrl: 成功回调地址

FailNotifyUrl: 退款通知回调地址 