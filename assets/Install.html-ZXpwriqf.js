import{_ as s,c as n,a as i,o as a}from"./app-Bah7_sEf.js";const l={};function d(c,e){return a(),n("div",null,e[0]||(e[0]=[i(`<h1 id="安装启动redis" tabindex="-1"><a class="header-anchor" href="#安装启动redis"><span>安装启动Redis</span></a></h1><p>Redis并没有出Windows上的安装包，之前微软移植过，后来也没继续干了。现在Redis官方推荐的Windows下运行方案是使用WSL，但是想一想WSL都用了，不如直接用Docker跑算了，因此这里的安装就是用Docker跑，简单，学完了停了就是了，不占资源且好清理。</p><p>在Windows上跑Docker建议用WSL2和Docker Desktop，不过安装也是有坑的，后面再补充安装Docker Desktop的坑</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-v</span> E:/WorkFiles/Configs/Redis:/usr/local/etc/redis <span class="token parameter variable">-p</span> <span class="token number">6379</span>:6379 <span class="token parameter variable">--name</span> myredis <span class="token parameter variable">-d</span> redis redis-server /usr/local/etc/redis/redis.conf</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>简单解释一下这行命令，本来我也是看不懂的，问了下百度的文心一言，解释得很好，这里简单记一下。<code>-v /myredis/conf:/usr/local/etc/redis</code>是将本机的<code>/myredis/conf</code>文件夹的内容映射到<code>/usr/local/etc/redis</code>文件夹下，<code>-p 6379:6379</code>是将容器的6379端口映射到主机的6379端口，<code>-d</code>是后台运行容器，<code>--name myredis</code>是指定容器名称为<code>myredis</code>，<code>redis</code>是镜像的名称，根据<code>redis</code>这个镜像来创建容器，<code>redis-server /usr/local/etc/redis/redis.conf</code>是启动容器时执行的命令，这就是正常的redis的命令了，redis服务的程序名称是<code>redis-server</code>，然后传递了一个路径，该路径作为redis服务的配置文件</p><p>这样就简单的将Redis服务运行起来了，这里面使用了配置文件，默认的Redis配置并不是我们想要的，而Redis有哪些配置项、默认的配置文件是什么，在Redis的文档中都是有的，可以在这里查看 <a href="https://redis.io/docs/management/config/" target="_blank" rel="noopener noreferrer">配置</a></p><h2 id="修改一下默认的配置文件" tabindex="-1"><a class="header-anchor" href="#修改一下默认的配置文件"><span>修改一下默认的配置文件</span></a></h2><p>默认的配置文件，Redis仅允许本机访问，实际上Redis可能好几个服务器都要访问，因此这里要改一改</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">################################## NETWORK #####################################</span>
<span class="line"></span>
<span class="line"># By default, if no &quot;bind&quot; configuration directive is specified, Redis listens</span>
<span class="line"># for connections from all available network interfaces on the host machine.</span>
<span class="line"># It is possible to listen to just one or multiple selected interfaces using</span>
<span class="line"># the &quot;bind&quot; configuration directive, followed by one or more IP addresses.</span>
<span class="line"># Each address can be prefixed by &quot;-&quot;, which means that redis will not fail to</span>
<span class="line"># start if the address is not available. Being not available only refers to</span>
<span class="line"># addresses that does not correspond to any network interface. Addresses that</span>
<span class="line"># are already in use will always fail, and unsupported protocols will always BE</span>
<span class="line"># silently skipped.</span>
<span class="line">#</span>
<span class="line"># Examples:</span>
<span class="line">#</span>
<span class="line"># bind 192.168.1.100 10.0.0.1     # listens on two specific IPv4 addresses</span>
<span class="line"># bind 127.0.0.1 ::1              # listens on loopback IPv4 and IPv6</span>
<span class="line"># bind * -::*                     # like the default, all available interfaces</span>
<span class="line">#</span>
<span class="line"># ~~~ WARNING ~~~ If the computer running Redis is directly exposed to the</span>
<span class="line"># internet, binding to all the interfaces is dangerous and will expose the</span>
<span class="line"># instance to everybody on the internet. So by default we uncomment the</span>
<span class="line"># following bind directive, that will force Redis to listen only on the</span>
<span class="line"># IPv4 and IPv6 (if available) loopback interface addresses (this means Redis</span>
<span class="line"># will only be able to accept client connections from the same host that it is</span>
<span class="line"># running on).</span>
<span class="line">#</span>
<span class="line"># IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES</span>
<span class="line"># COMMENT OUT THE FOLLOWING LINE.</span>
<span class="line">#</span>
<span class="line"># You will also need to set a password unless you explicitly disable protected</span>
<span class="line"># mode.</span>
<span class="line"># ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>
<span class="line">bind 127.0.0.1 -::1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一段是Redis默认配置文件中写的，里面讲了怎么配置哪些地址可以访问，默认是<code>127.0.0.1 -::1</code>，也就是本机IPv4地址和IPv6地址，如果要让所有地址都可以访问，上面的Examples也写了</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line"># bind * -::*                     # like the default, all available interfaces</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>因为只是开发学习，就用这一条了，允许所有地址访问，将下面没有注释的<code>bind 127.0.0.1 -::1</code>改为<code>bind * -::*</code></p><p>改完后是这个样子</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line"># IF YOU ARE SURE YOU WANT YOUR INSTANCE TO LISTEN TO ALL THE INTERFACES</span>
<span class="line"># COMMENT OUT THE FOLLOWING LINE.</span>
<span class="line">#</span>
<span class="line"># You will also need to set a password unless you explicitly disable protected</span>
<span class="line"># mode.</span>
<span class="line"># ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~</span>
<span class="line">bind bind * -::*</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>改完之后会发现外网还是不能访问，这是因为现在有个保护模式</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line"># Protected mode is a layer of security protection, in order to avoid that</span>
<span class="line"># Redis instances left open on the internet are accessed and exploited.</span>
<span class="line">#</span>
<span class="line"># When protected mode is on and the default user has no password, the server</span>
<span class="line"># only accepts local connections from the IPv4 address (127.0.0.1), IPv6 address</span>
<span class="line"># (::1) or Unix domain sockets.</span>
<span class="line">#</span>
<span class="line"># By default protected mode is enabled. You should disable it only if</span>
<span class="line"># you are sure you want clients from other hosts to connect to Redis</span>
<span class="line"># even if no authentication is configured.</span>
<span class="line">protected-mode yes</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>保护模式开启时，在Redis没设密码的时候，不允许除本机之外的地址访问，调试的时候可以选择直接关掉保护模式，但是更好的选择是给Redis设置密码</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line"># IMPORTANT NOTE: starting with Redis 6 &quot;requirepass&quot; is just a compatibility</span>
<span class="line"># layer on top of the new ACL system. The option effect will be just setting</span>
<span class="line"># the password for the default user. Clients will still authenticate using</span>
<span class="line"># AUTH &lt;password&gt; as usually, or more explicitly with AUTH default &lt;password&gt;</span>
<span class="line"># if they follow the new protocol: both will work.</span>
<span class="line">#</span>
<span class="line"># The requirepass is not compatible with aclfile option and the ACL LOAD</span>
<span class="line"># command, these will cause requirepass to be ignored.</span>
<span class="line">#</span>
<span class="line"># requirepass foobared</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>密码通过requirepass指定</p><div class="language-conf line-numbers-mode" data-highlighter="prismjs" data-ext="conf" data-title="conf"><pre><code><span class="line">requirepass zxc123</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>从redis默认的配置文件中可以看到<code>requirepass</code>只是一个兼容层了，更好的方式是分配用户和密码，通过<code>requirepass</code>的方式将会视为给默认用户设置密码</p><h2 id="使用redisinsight掉坑里了" tabindex="-1"><a class="header-anchor" href="#使用redisinsight掉坑里了"><span>使用RedisInsight掉坑里了</span></a></h2><p>Redis的GUI管理工具现在推荐使用RedisInsight，我发现RedisInsight只是一个服务，界面靠浏览器渲染，然后我就选择通过docker启动服务，本来一切都很顺利，结果我连接Redis的时候却发现怎么都连不上，然后我发现我的Redis地址填的127.0.0.1，看起来没什么问题，因为我把Redis的端口映射到本机了，但实际上，因为RedisInsight也是Docker跑起来的，127.0.0.1这个地址对应的是运行RedisInsight的容器，而不是我的物理机，因此这里要用本机IP地址才行</p>`,23)]))}const t=s(l,[["render",d]]),o=JSON.parse('{"path":"/Backend/Redis/Install.html","title":"安装启动Redis","lang":"zh-CN","frontmatter":{"title":"安装启动Redis"},"headers":[{"level":2,"title":"修改一下默认的配置文件","slug":"修改一下默认的配置文件","link":"#修改一下默认的配置文件","children":[]},{"level":2,"title":"使用RedisInsight掉坑里了","slug":"使用redisinsight掉坑里了","link":"#使用redisinsight掉坑里了","children":[]}],"git":{"updatedTime":1708499328000,"contributors":[{"name":"吴俊城","email":"wujunchngman@163.com","commits":1}]},"filePathRelative":"Backend/Redis/Install.md"}');export{t as comp,o as data};
