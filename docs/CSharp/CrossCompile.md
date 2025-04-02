---
title: .NET平台下的AOT跨平台编译
---

.NET平台程序支持AOT编译，通过AOT技术可以更好的分发应用（不用再携带运行时），也大幅提高了程序的启动速度，降低了内存占用，对客户端程序有很大的体验上的提升。

因为公司的一个客户端程序需要运行在Linux-ARM64平台，同时Avalonia框架提供了较好的AOT支持，且开发与WPF相差不大，于是使用Avalonia开发并通过AOT部署到Linux-ARM64平台。

官方提供了一个[跨平台编译的文档](https://learn.microsoft.com/zh-cn/dotnet/core/deploying/native-aot/cross-compile)

通过这个文档能够轻松地完成AOT编译，并且可以生成一个可执行文件，通过这个可执行文件就可以在Linux-ARM64平台运行。

实际上这个文档埋了一个坑，当初次执行AOT交叉编译时，会报错`error : The PrivateSdkAssemblies ItemGroup is required for _ComputeAssembliesToCompileToNative`

查阅了许多资料，最后终于在Github上找到了一个[issue](https://github.com/dotnet/sdk/issues/45208)

又从中找到了一个关于[跨平台编译更详细的文档](https://github.com/dotnet/runtime/blob/main/src/coreclr/nativeaot/docs/compiling.md#cross-architecture-compilation)

它提到了一个`runtime.linux-x64.Microsoft.DotNet.ILCompiler`包，从X86平台交叉编译到ARM64需要的是`runtime.linux-arm64.Microsoft.DotNet.ILCompiler`包

重要是提供了一个线索，交叉编译需要对应平台的ILCompiler，实际上初次执行跨平台编译可能没有这个包，这就需要手动引用这个包，这样再执行跨平台编译就不会出现`The PrivateSdkAssemblies ItemGroup is required for _ComputeAssembliesToCompileToNative`错误了