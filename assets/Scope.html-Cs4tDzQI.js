import{_ as s,c as a,a as l,o as p}from"./app-Bah7_sEf.js";const e={};function i(t,n){return p(),a("div",null,n[0]||(n[0]=[l(`<h1 id="python中的变量作用域" tabindex="-1"><a class="header-anchor" href="#python中的变量作用域"><span>Python中的变量作用域</span></a></h1><p>执行期间的任何时刻，都会有 3 或 4 个“命名空间可直接访问”的嵌套作用域：</p><ul><li><p>最内层作用域，包含局部名称，并首先在其中进行搜索</p></li><li><p>那些外层闭包函数的作用域，包含“非局部、非全局”的名称，从最靠内层的那个作用域开始，逐层向外搜索。</p></li><li><p>倒数第二层作用域，包含当前模块的全局名称</p></li><li><p>最外层（最后搜索）的作用域，是内置名称的命名空间</p></li></ul><p>如果一个名称被声明为全局，则所有引用和赋值都将直接指向“倒数第二层作用域”，即包含模块的全局名称的作用域。</p><p>要重新绑定在最内层作用域以外找到的变量，可以使用 nonlocal 语句；如果未使用 nonlocal 声明，这些变量将为只读（<strong>尝试写入这样的变量将在最内层作用域中创建一个 新的 局部变量，而使得同名的外部变量保持不变</strong>）。</p><p>Python 有一个特殊规定。如果不存在生效的 global 或 nonlocal 语句，则对名称的赋值总是会进入最内层作用域。赋值不会复制数据，只是将名称绑定到对象。删除也是如此：语句 del x 从局部作用域引用的命名空间中移除对 x 的绑定。所有引入新名称的操作都是使用局部作用域：尤其是 import 语句和函数定义会在局部作用域中绑定模块或函数名称。</p><div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py" data-title="py"><pre><code><span class="line"><span class="token keyword">def</span> <span class="token function">scope_test</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">   <span class="token keyword">def</span> <span class="token function">do_local</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">       <span class="token comment"># 最内层作用域，局部作用域</span></span>
<span class="line">       spam <span class="token operator">=</span> <span class="token string">&quot;local spam&quot;</span></span>
<span class="line"></span>
<span class="line">   <span class="token keyword">def</span> <span class="token function">do_nonlocal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">       <span class="token comment"># 外层闭包函数的作用域，非局部、非全局</span></span>
<span class="line">       <span class="token keyword">nonlocal</span> spam</span>
<span class="line">       spam <span class="token operator">=</span> <span class="token string">&quot;nonlocal spam&quot;</span></span>
<span class="line"></span>
<span class="line">   <span class="token keyword">def</span> <span class="token function">do_global</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span></span>
<span class="line">       <span class="token comment"># global变量在倒数第二层作用域，包含模块的全局名称的作用域</span></span>
<span class="line">       <span class="token keyword">global</span> spam</span>
<span class="line">       spam <span class="token operator">=</span> <span class="token string">&quot;global spam&quot;</span></span>
<span class="line"></span>
<span class="line">   <span class="token comment"># 外层闭包函数的作用域，非局部、非全局</span></span>
<span class="line">   spam <span class="token operator">=</span> <span class="token string">&quot;test spam&quot;</span></span>
<span class="line">   </span>
<span class="line">   <span class="token comment"># do_local赋值spam变量时，因为没有global或者nonlocal，Python会在这个函数的作用域内创建一个spam变量</span></span>
<span class="line">   do_local<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">   </span>
<span class="line">   <span class="token comment"># 当执行print时，do_local只是在其作用域内创建了一个同名的spam变量，并在函数执行完成后释放，</span></span>
<span class="line">   <span class="token comment"># 并没有修改scope_test作用域内定义的spam</span></span>
<span class="line">   <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&quot;After local assignment:&quot;</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">   <span class="token comment"># do_nonlocal中使用nonlocal标记了spam变量，因此Python在外层作用域中（scope_test函数作用域中）重新绑定</span></span>
<span class="line">   <span class="token comment"># 此时赋值spam变量时操作的就是scope_test作用域中的spam变量，所以输出发生了变化</span></span>
<span class="line">   do_nonlocal<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">   <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&quot;After nonlocal assignment:&quot;</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">   <span class="token comment"># do_global使用global标记了spam变量，Python会在模块的全局名称作用域中重新绑定</span></span>
<span class="line">   <span class="token comment"># 此时赋值spam变量时操作的就是模块全局作用域中的spam变量</span></span>
<span class="line">   do_global<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">   <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&quot;After global assignment:&quot;</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">   <span class="token comment"># print函数是最外层作用域，内置名称的命名空间</span></span>
<span class="line"></span>
<span class="line">scope_test<span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string">&quot;In global scope:&quot;</span><span class="token punctuation">,</span> spam<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出：</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">After <span class="token builtin class-name">local</span> assignment: <span class="token builtin class-name">test</span> spam</span>
<span class="line">After nonlocal assignment: nonlocal spam</span>
<span class="line">After global assignment: nonlocal spam</span>
<span class="line">In global scope: global spam</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,9)]))}const o=s(e,[["render",i]]),u=JSON.parse('{"path":"/Python/Scope.html","title":"Python中的变量作用域","lang":"zh-CN","frontmatter":{"title":"Python中的变量作用域"},"headers":[],"git":{"updatedTime":1715694075000,"contributors":[{"name":"吴俊城","email":"wujunchengman@163.com","commits":1}]},"filePathRelative":"Python/Scope.md"}');export{o as comp,u as data};
