---
title: 认证与授权
---

# 认证与授权

认证与授权是Web开发一定会遇到的问题，在Asp.Net Core中，提供了认证与授权对应的中间件与内置的实现，非常强大。如果内置的功能不能满足需求，还可以根据自己的需求去自定义自己的认证与授权实现

讲认证与授权，需要先明白什么是认证，什么是授权，以及它们之间的区别

现在的火车站基本都升级成了自动检票，去坐火车的检票，就有非常明显的认证与授权特征

## 认证：确定用户身份的过程

进火车站的时候，会刷身份证，还要扫脸，经过核验确定你用的你的身份证、身份证和持证人是一致的，这时候就可以进站候车了。这个确定本人的过程，就是认证

## 授权：确定用户是否有权访问资源的过程

进站以后，当车到了，要检票，还要再刷一次身份证，如果你买了对应车次的车，这个车次的车就在这个站台，你就可以上车了，这个确认你买的票是不是这个车次的车的过程，就是授权，购买了对应车次的车就代表拥有了访问这个车次列车（资源）的权限

## 认证与授权的区别

继续说火车站进站乘车，在进展以后，上车以前，也就是第二次刷身份证，第二次刷身份证并没有像第一次那样需要扫脸，这是因为经过第一次的认证，已经确认了身份证是真实的、身份证和本人的关系是能够对应上的、确实买了票（认证通过），只需要再检查有没有对应的权限（是不是买的这个车次的票）即可

认证的过程是判断用于证明身份的凭证是否有效，授权的过程是检查已经确认有效的凭据是否拥有相应的权限

在权限的处理中，必须要先认证，再鉴权，因此很多的框架把认证和鉴权放在了一起，将认证这个等级作为最基础的，所有用户共有的一种权限，但是我个人感觉，将认证和授权分开更好一些，因为已认证这个级别并不需要鉴权，而作为所有用户共有的一种权限，还是会去匹配一次是否拥有权限