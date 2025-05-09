import{_ as s,c as a,a as e,o as p}from"./app-Bah7_sEf.js";const l={};function t(i,n){return p(),a("div",null,n[0]||(n[0]=[e(`<p>Kubernetes是用于自动部署、扩缩和管理容器化应用程序的开源系统</p><p>Kubernetes具有以下功能，是管理容器的将有力工具，缺点是有点复杂</p><ul><li>容器的自行修复，例如，重启失败的容器或替换容器。</li><li>根据需要动态地纵向扩展或纵向缩减已部署的容器计数。</li><li>容器的自动滚动更新和回滚。</li><li>管理存储。</li><li>管理网络流量。</li><li>存储并管理敏感信息，如用户名和密码。</li></ul><h3 id="部署应用" tabindex="-1"><a class="header-anchor" href="#部署应用"><span>部署应用</span></a></h3><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token comment"># 定义要部署到Kubernetes中的容器的部署规范</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 创建该对象所使用的 Kubernetes API 的版本</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token comment"># 想要创建的对象的类别</span></span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment </span>
<span class="line"><span class="token comment"># 帮助唯一标识对象的一些数据，包括一个 name 字符串、UID 和可选的 namespace</span></span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">name</span><span class="token punctuation">:</span> productsbackend</span>
<span class="line"><span class="token comment"># 所期望的该对象的状态</span></span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span> <span class="token comment"># 告知 Deployment 运行 1 个与该模板匹配的 Pod</span></span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> productsbackend</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> productsbackend</span>
<span class="line">        <span class="token key atrule">image</span><span class="token punctuation">:</span> wujunchengman/productservice<span class="token punctuation">:</span>latest</span>
<span class="line">        <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">        <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ASPNETCORE_URLS</span>
<span class="line">          <span class="token key atrule">value</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//<span class="token important">*:</span><span class="token number">80</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> productsbackend</span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token comment"># 定义容器作为 Kubernetes NodePort 服务运行</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Service</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> productsbackend</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort</span>
<span class="line">  <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">    <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">32001</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> productsbackend</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml" data-title="yml"><pre><code><span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> apps/v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Deployment</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> storefrontend</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">replicas</span><span class="token punctuation">:</span> <span class="token number">1</span></span>
<span class="line">  <span class="token key atrule">template</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">labels</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token key atrule">app</span><span class="token punctuation">:</span> storefrontend</span>
<span class="line">    <span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">containers</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> storefrontend</span>
<span class="line">        <span class="token key atrule">image</span><span class="token punctuation">:</span> wujunchengman/storeimage<span class="token punctuation">:</span>latest</span>
<span class="line">        <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">containerPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">        <span class="token key atrule">env</span><span class="token punctuation">:</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ASPNETCORE_URLS</span>
<span class="line">          <span class="token key atrule">value</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//<span class="token important">*:</span><span class="token number">80</span></span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ProductEndpoint</span>
<span class="line">        <span class="token comment"># 使用上一个配置文件在 Deployment 的 metadata.name 节点下指定的名称，Kubernetes会处理映射</span></span>
<span class="line">          <span class="token key atrule">value</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//productsbackend</span>
<span class="line">        <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> ImagePrefix</span>
<span class="line">          <span class="token key atrule">value</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//localhost<span class="token punctuation">:</span>32001/images</span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">matchLabels</span><span class="token punctuation">:</span></span>
<span class="line">      <span class="token key atrule">app</span><span class="token punctuation">:</span> storefrontend</span>
<span class="line"><span class="token punctuation">---</span></span>
<span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> v1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Service</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> storefrontend</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">type</span><span class="token punctuation">:</span> NodePort</span>
<span class="line">  <span class="token key atrule">ports</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token punctuation">-</span> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">    <span class="token key atrule">targetPort</span><span class="token punctuation">:</span> <span class="token number">80</span></span>
<span class="line">    <span class="token key atrule">nodePort</span><span class="token punctuation">:</span> <span class="token number">32000</span></span>
<span class="line">  <span class="token key atrule">selector</span><span class="token punctuation">:</span></span>
<span class="line">    <span class="token key atrule">app</span><span class="token punctuation">:</span> storefrontend</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用kubectl部署应用</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">kubectl apply <span class="token parameter variable">-f</span> frontend-deploy.yml</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>apply既用于部署，也用于更新</p><h3 id="缩放实例" tabindex="-1"><a class="header-anchor" href="#缩放实例"><span>缩放实例</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">kubectl scale <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">5</span> deployment/productsbackend</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>通过上面的命令将productsbackend服务配置为5个实例</p><p>通过下面的命令可以验证</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">kubectl get pods</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>如果要将productsbackend服务恢复到一个实例，则将replicas的值设为1即可</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">kubectl scale <span class="token parameter variable">--replicas</span><span class="token operator">=</span><span class="token number">1</span> deployment/productsbackend</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>除了这种方式，还可以直接在配置文件中修改replicas的值，然后使用apply更新配置</p><p>Kubernetes总会保证有replicas中指定的Pod实例个数</p>`,18)]))}const u=s(l,[["render",t]]),o=JSON.parse('{"path":"/Backend/Kubernetes/QuickStart.html","title":"Kubernetes快速上手","lang":"zh-CN","frontmatter":{"title":"Kubernetes快速上手"},"headers":[{"level":3,"title":"部署应用","slug":"部署应用","link":"#部署应用","children":[]},{"level":3,"title":"缩放实例","slug":"缩放实例","link":"#缩放实例","children":[]}],"git":{"updatedTime":1708437721000,"contributors":[{"name":"吴俊城","email":"wujunchngman@163.com","commits":1}]},"filePathRelative":"Backend/Kubernetes/QuickStart.md"}');export{u as comp,o as data};
