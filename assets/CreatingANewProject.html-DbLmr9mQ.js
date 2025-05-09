import{_ as n,c as a,a as e,o as i}from"./app-Bah7_sEf.js";const l={};function o(d,s){return i(),a("div",null,s[0]||(s[0]=[e(`<p>安装好Avaloina模板后，创建MVVM项目，可以通过VS创建，也可以通过CLI创建</p><p>使用VS创建时，搜索Avalonia模板，选择Avalonia MVVM Application模板，项目名设为Todo（非强制，保持相同的名字只是为了更好的粘贴案例代码）</p><p>使用CLI创建</p><div class="language-powershell line-numbers-mode" data-highlighter="prismjs" data-ext="powershell" data-title="powershell"><pre><code><span class="line">dotnet new avalonia<span class="token punctuation">.</span>mvvm <span class="token operator">-</span>o Todo <span class="token operator">-</span>n Todo</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>项目文件结构</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">Todo</span>
<span class="line"> |- App.axaml</span>
<span class="line"> |- App.axaml.cs</span>
<span class="line"> |- Assets</span>
<span class="line"> |   |- avalonia-logo.ico</span>
<span class="line"> |- Models </span>
<span class="line"> |- nuget.config </span>
<span class="line"> |- Program.cs</span>
<span class="line"> |- Todo.csproj</span>
<span class="line"> |- ViewLocator.cs</span>
<span class="line"> |- ViewModels</span>
<span class="line"> |   |- MainWindowViewModel.cs</span>
<span class="line"> |   |- ViewModelBase.cs</span>
<span class="line"> |- Views</span>
<span class="line"> |   |- MainWindow.axaml</span>
<span class="line"> |   |- MainWindow.axaml.cs</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>Assets目录保存应用程序的二进制资产，如图标和位图。放在此目录中的文件将自动作为资源包含在应用程序中</li><li>Models目录目前是空的，但顾名思义，这是我们将放置模型的地方</li><li>ViewModels 目录预先填充了视图模型的基类和应用程序主窗口的视图模型</li><li>Views 目录目前只包含应用程序主窗口</li><li>App.axaml文件是应用于整个应用程序的XAML样式和模板的地方</li><li>Program.cs是应用程序的入口</li><li>ViewLocator.cs用来查找View的model后面会有更详细的解释</li></ul>`,7)]))}const p=n(l,[["render",o]]),t=JSON.parse('{"path":"/Avalonia/Todo/CreatingANewProject.html","title":"创建项目","lang":"zh-CN","frontmatter":{"title":"创建项目"},"headers":[],"git":{"updatedTime":1669714394000,"contributors":[{"name":"吴俊城","email":"wujunchengman@163.com","commits":1}]},"filePathRelative":"Avalonia/Todo/CreatingANewProject.md"}');export{p as comp,t as data};
