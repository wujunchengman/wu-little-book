import{_ as s,c as e,a,o as i}from"./app-Bah7_sEf.js";const l={};function d(c,n){return i(),e("div",null,n[0]||(n[0]=[a(`<h1 id="nginx负载均衡" tabindex="-1"><a class="header-anchor" href="#nginx负载均衡"><span>Nginx负载均衡</span></a></h1><p>负载均衡在目前是非常重要的技术，当业务负载越来越高，就可以考虑使用负载均衡来水平扩展，这是负载均衡很重要的功能。不过绝大多数公司都用不着水平扩展，但是负载均衡仍然有用，比如说用来不间断更新服务，灰度发布什么的，总之学了还是很实用的</p><h2 id="http的负载均衡" tabindex="-1"><a class="header-anchor" href="#http的负载均衡"><span>HTTP的负载均衡</span></a></h2><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">http {</span>
<span class="line"></span>
<span class="line">    # 其它配置内容</span>
<span class="line"></span>
<span class="line">    upstream backend {</span>
<span class="line">        server 10.10.12.45:80 weight=1;</span>
<span class="line">        server app.example.com:80 weight=2;</span>
<span class="line">        server spare.example.com:80 backup;</span>
<span class="line">    }</span>
<span class="line">    server {</span>
<span class="line">        location / {</span>
<span class="line">            proxy_pass http://backend;</span>
<span class="line">        }</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此配置指定了两台主服务器和一台后备服务器，当两台主服务器都不可用时使用backup后备服务器</p><p>两台主服务器通过指定<code>weight</code>设置了权重，默认权重均为1，通过上述设置，Nginx会向第二台主服务器传输第一台主服务器两倍的请求，也就是请求1/3走第一台服务器，2/3走第二台服务器</p><h3 id="负载均衡的方式" tabindex="-1"><a class="header-anchor" href="#负载均衡的方式"><span>负载均衡的方式</span></a></h3><p>Nginx支持多种负载均衡方式，其默认负载均衡方式是轮询，除此之外还有最少连接、最短时间、通用哈希、随机算法和IP哈希等多种负载均衡方式</p><p>如果设备都不指定，那么使用默认的轮询方式进行负载均衡，如果要使用其他方式，则添加对应的指令</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">    upstream backend {</span>
<span class="line">        # 使用最少连接进行负载均衡</span>
<span class="line">        least_conn;</span>
<span class="line">        server 10.10.12.45:80 weight=1;</span>
<span class="line">        server app.example.com:80 weight=2;</span>
<span class="line">        server spare.example.com:80 backup;</span>
<span class="line">    }</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>负载均衡方式</th><th>指令</th><th>备注</th></tr></thead><tbody><tr><td>轮询</td><td>无</td><td>默认方式，无需指令</td></tr><tr><td>最少连接</td><td>least_conn</td><td></td></tr><tr><td>最短时间</td><td>least_time</td><td>仅在企业版提供</td></tr><tr><td>通用哈希</td><td>hash</td><td></td></tr><tr><td>随机</td><td>random</td><td></td></tr><tr><td>IP哈希</td><td>ip_hash</td><td>仅适用于HTTP</td></tr></tbody></table><p>补充说明</p><h5 id="通用哈希" tabindex="-1"><a class="header-anchor" href="#通用哈希"><span>通用哈希</span></a></h5><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">upstream backend {</span>
<span class="line">    hash $request_uri consistent;</span>
<span class="line">    server backend1.example.com;</span>
<span class="line">    server backend2.example.com;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用通用hash时，指定一个变量定义哈希值，NGINX 能够为当前请求生成哈希值并将其放在上游服务器上，从而在这些服务器之间分发负载。<code>consistent</code>是一个可选参数，能够将重新分发带来的影响最小化</p><p><a href="https://nginx.org/en/docs/http/ngx_http_core_module.html#variables" target="_blank" rel="noopener noreferrer">Nginx内置变量表</a></p><h5 id="随机" tabindex="-1"><a class="header-anchor" href="#随机"><span>随机</span></a></h5><p>使用random时，会随机选择一个服务器，如果使用了two参数，则会随机选择两个服务器，再按照后面的负载均衡方式选择一个</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">upstream backend {</span>
<span class="line">    random two least_conn;</span>
<span class="line">    server backend1.example.com;</span>
<span class="line">    server backend2.example.com;</span>
<span class="line">    server backend3.example.com;</span>
<span class="line">    server backend4.example.com;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个配置文件会随机选择2个服务器，然后使用最少连接的方式选择其中一个，<code>least_conn</code>是默认的方法，也可以省略（<code>random two least_conn;</code>等效<code>random two;</code>）</p><h2 id="tcp-udp负载均衡" tabindex="-1"><a class="header-anchor" href="#tcp-udp负载均衡"><span>TCP/UDP负载均衡</span></a></h2><p>TCP</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">stream {</span>
<span class="line">    upstream mysql_read {</span>
<span class="line">        server read1.example.com:3306 weight=5;</span>
<span class="line">        server read2.example.com:3306;</span>
<span class="line">        server 10.10.12.34:3306 backup;</span>
<span class="line">    }</span>
<span class="line">    server {</span>
<span class="line">        listen 3306;</span>
<span class="line">        proxy_pass mysql_read;</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>UDP</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">stream {</span>
<span class="line"></span>
<span class="line">    upstream stream_backend {</span>
<span class="line">        server backend1.example.com:12345;</span>
<span class="line">        server backend2.example.com:12345;</span>
<span class="line">        server backend3.example.com:12346;</span>
<span class="line">        # ...</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    upstream dns_servers {</span>
<span class="line">        server 192.168.136.130:53;</span>
<span class="line">        server 192.168.136.131:53;</span>
<span class="line">        # ...</span>
<span class="line">    }</span>
<span class="line"></span>
<span class="line">    # ...</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>TCP和UDP的负载均衡，并不在HTTP模块，而是使用stream模块，不支持IP哈希，其他的语法是相同的</p>`,26)]))}const p=s(l,[["render",d]]),t=JSON.parse('{"path":"/Infrastructure/Nginx/LoadBalance.html","title":"Nginx负载均衡","lang":"zh-CN","frontmatter":{"title":"Nginx负载均衡","sidebar":"auto"},"headers":[{"level":2,"title":"HTTP的负载均衡","slug":"http的负载均衡","link":"#http的负载均衡","children":[{"level":3,"title":"负载均衡的方式","slug":"负载均衡的方式","link":"#负载均衡的方式","children":[]}]},{"level":2,"title":"TCP/UDP负载均衡","slug":"tcp-udp负载均衡","link":"#tcp-udp负载均衡","children":[]}],"git":{"updatedTime":1717145967000,"contributors":[{"name":"吴俊城","email":"wujunchengman@163.com","commits":1}]},"filePathRelative":"Infrastructure/Nginx/LoadBalance.md"}');export{p as comp,t as data};
