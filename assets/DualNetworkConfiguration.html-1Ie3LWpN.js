import{_ as s,c as a,a as e,o as i}from"./app-Bah7_sEf.js";const l={};function p(c,n){return i(),a("div",null,n[0]||(n[0]=[e(`<h1 id="nmcli双网卡配置主副网卡" tabindex="-1"><a class="header-anchor" href="#nmcli双网卡配置主副网卡"><span>nmcli双网卡配置主副网卡</span></a></h1><p>先说说情况，公司有一台物理服务器，其中虚拟化了多个Linux系统，这些Linux系统各有用途。对外提供着不同的服务，同时内部之间也需要相互连通，因此这些虚拟机都同时处在两个局域网中：一个连接到公司的局域网中，用于连接外网；一个连接到由主机创建的虚拟路由器，提供内部Linux虚拟机之间互相访问的高速通道。非常典型的内、外网双网卡结构。</p><h2 id="简单谈谈nmcli" tabindex="-1"><a class="header-anchor" href="#简单谈谈nmcli"><span>简单谈谈nmcli</span></a></h2><p>在CentOS 8（准确的说是RHEL8及其衍生版），默认已经推荐使用nmcli这个工具来管理网络了，以前的修改script的方式已经快要淘汰了，系统中也找不到对应的script文件了，因此本文的配置网络，都是通过nmcli来进行管理的</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">nmcli connection show</span>
<span class="line"></span>
<span class="line">nmcli connnection</span>
<span class="line"></span>
<span class="line">nmcli c</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面的三条命令是等效的，第一条为完整的命令，第二条命令是因为connection的默认操作就是show,因此可以省略后面的show，第三条命令是因为nmcli查找命令的时候并不需要输入完整的命令，而是只要输入的命令可以确定到唯一对象就行了，因此可以用c直接代替connection</p><p>nmcli能够管理连接，也就是本文中的connection，除了connection对象，还有device对象，管理设备，用的最多的就是这两个对象，当然还有其他对象，但是这里就只是简单的讲一下connection对象中的关于默认路由的配置和自动连接网络，因为我主要做开发，Linux只能算半罐水，目前遇到的网络问题也就这两个，如果后面遇到新的了，到时候再更新</p><h2 id="查看网络配置" tabindex="-1"><a class="header-anchor" href="#查看网络配置"><span>查看网络配置</span></a></h2><p>前面提到了<code>nmcli connection show</code>可以查看系统中的网络连接基本信息，如果要看对应的详细信息，则在show的后面跟对应的连接名即可，也就是这条命令</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">nmcli connection show eth1</span>
<span class="line"></span>
<span class="line">nmcli c show eth1</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这条命令就是查看对应的连接eth1的详情，下面的是将connection简写为c的版本，需要注意的是，因为带了参数，此时的show讲不能再省略</p><p>通过这条命令，就可以看到连接的详细信息</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">connection.id:                          eth1</span>
<span class="line">connection.uuid:                        a073ba38-4fe1-4edc-b0c8-0e7bae0375d1</span>
<span class="line">connection.stable-id:                   --</span>
<span class="line">connection.type:                        <span class="token number">802</span>-3-ethernet</span>
<span class="line">connection.interface-name:              eth1</span>
<span class="line">connection.autoconnect:                 是</span>
<span class="line">connection.autoconnect-priority:        <span class="token number">0</span></span>
<span class="line">connection.autoconnect-retries:         <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">connection.multi-connect:               <span class="token number">0</span>（default）</span>
<span class="line">connection.auth-retries:                <span class="token parameter variable">-1</span></span>
<span class="line">connection.timestamp:                   <span class="token number">1662868627</span></span>
<span class="line">connection.read-only:                   否</span>
<span class="line">connection.permissions:                 --</span>
<span class="line">connection.zone:                        --</span>
<span class="line">connection.master:                      --</span>
<span class="line">connection.slave-type:                  --</span>
<span class="line">connection.autoconnect-slaves:          -1（default）</span>
<span class="line">connection.secondaries:                 --</span>
<span class="line">connection.gateway-ping-timeout:        <span class="token number">0</span></span>
<span class="line">connection.metered:                     未知</span>
<span class="line">connection.lldp:                        default</span>
<span class="line">connection.mdns:                        -1（default）</span>
<span class="line">connection.llmnr:                       -1（default）</span>
<span class="line">connection.dns-over-tls:                -1（default）</span>
<span class="line">connection.wait-device-timeout:         <span class="token parameter variable">-1</span></span>
<span class="line"><span class="token number">802</span>-3-ethernet.port:                    --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.speed:                   <span class="token number">0</span></span>
<span class="line"><span class="token number">802</span>-3-ethernet.duplex:                  --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.auto-negotiate:          否</span>
<span class="line"><span class="token number">802</span>-3-ethernet.mac-address:             --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.cloned-mac-address:      --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.generate-mac-address-mask:--</span>
<span class="line"><span class="token number">802</span>-3-ethernet.mac-address-blacklist:   --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.mtu:                     自动</span>
<span class="line"><span class="token number">802</span>-3-ethernet.s390-subchannels:        --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.s390-nettype:            --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.s390-options:            --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.wake-on-lan:             default</span>
<span class="line"><span class="token number">802</span>-3-ethernet.wake-on-lan-password:    --</span>
<span class="line"><span class="token number">802</span>-3-ethernet.accept-all-mac-addresses:-1（default）</span>
<span class="line">ipv4.method:                            manual</span>
<span class="line">ipv4.dns:                               --</span>
<span class="line">ipv4.dns-search:                        --</span>
<span class="line">ipv4.dns-options:                       --</span>
<span class="line">ipv4.dns-priority:                      <span class="token number">0</span></span>
<span class="line">ipv4.addresses:                         <span class="token number">192.168</span>.12.202/24</span>
<span class="line">ipv4.gateway:                           --</span>
<span class="line">ipv4.routes:                            --</span>
<span class="line">ipv4.route-metric:                      <span class="token parameter variable">-1</span></span>
<span class="line">ipv4.route-table:                       <span class="token number">0</span> <span class="token punctuation">(</span>unspec<span class="token punctuation">)</span></span>
<span class="line">ipv4.routing-rules:                     --</span>
<span class="line">ipv4.ignore-auto-routes:                否</span>
<span class="line">ipv4.ignore-auto-dns:                   否</span>
<span class="line">ipv4.dhcp-client-id:                    --</span>
<span class="line">ipv4.dhcp-iaid:                         --</span>
<span class="line">ipv4.dhcp-timeout:                      <span class="token number">0</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">ipv4.dhcp-send-hostname:                是</span>
<span class="line">ipv4.dhcp-hostname:                     --</span>
<span class="line">ipv4.dhcp-fqdn:                         --</span>
<span class="line">ipv4.dhcp-hostname-flags:               0x0（none）</span>
<span class="line">ipv4.never-default:                     是</span>
<span class="line">ipv4.may-fail:                          是</span>
<span class="line">ipv4.required-timeout:                  <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">ipv4.dad-timeout:                       <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">ipv4.dhcp-vendor-class-identifier:      --</span>
<span class="line">ipv4.dhcp-reject-servers:               --</span>
<span class="line">ipv6.method:                            auto</span>
<span class="line">ipv6.dns:                               --</span>
<span class="line">ipv6.dns-search:                        --</span>
<span class="line">ipv6.dns-options:                       --</span>
<span class="line">ipv6.dns-priority:                      <span class="token number">0</span></span>
<span class="line">ipv6.addresses:                         --</span>
<span class="line">ipv6.gateway:                           --</span>
<span class="line">ipv6.routes:                            --</span>
<span class="line">ipv6.route-metric:                      <span class="token parameter variable">-1</span></span>
<span class="line">ipv6.route-table:                       <span class="token number">0</span> <span class="token punctuation">(</span>unspec<span class="token punctuation">)</span></span>
<span class="line">ipv6.routing-rules:                     --</span>
<span class="line">ipv6.ignore-auto-routes:                否</span>
<span class="line">ipv6.ignore-auto-dns:                   否</span>
<span class="line">ipv6.never-default:                     否</span>
<span class="line">ipv6.may-fail:                          是</span>
<span class="line">ipv6.required-timeout:                  <span class="token parameter variable">-1</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">ipv6.ip6-privacy:                       -1（unknown）</span>
<span class="line">ipv6.addr-gen-mode:                     stable-privacy</span>
<span class="line">ipv6.ra-timeout:                        <span class="token number">0</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">ipv6.dhcp-duid:                         --</span>
<span class="line">ipv6.dhcp-iaid:                         --</span>
<span class="line">ipv6.dhcp-timeout:                      <span class="token number">0</span> <span class="token punctuation">(</span>default<span class="token punctuation">)</span></span>
<span class="line">ipv6.dhcp-send-hostname:                是</span>
<span class="line">ipv6.dhcp-hostname:                     --</span>
<span class="line">ipv6.dhcp-hostname-flags:               0x0（none）</span>
<span class="line">ipv6.token:                             --</span>
<span class="line">proxy.method:                           none</span>
<span class="line">proxy.browser-only:                     否</span>
<span class="line">proxy.pac-url:                          --</span>
<span class="line">proxy.pac-script:                       --</span>
<span class="line">GENERAL.NAME:                           eth1</span>
<span class="line">GENERAL.UUID:                           a073ba38-4fe1-4edc-b0c8-0e7bae0375d1</span>
<span class="line">GENERAL.DEVICES:                        eth1</span>
<span class="line">GENERAL.IP-IFACE:                       eth1</span>
<span class="line">GENERAL.STATE:                          已激活</span>
<span class="line">GENERAL.DEFAULT:                        是</span>
<span class="line">GENERAL.DEFAULT6:                       否</span>
<span class="line">GENERAL.SPEC-OBJECT:                    --</span>
<span class="line">GENERAL.VPN:                            否</span>
<span class="line">GENERAL.DBUS-<span class="token environment constant">PATH</span><span class="token builtin class-name">:</span>                      /org/freedesktop/NetworkManager/ActiveC<span class="token operator">&gt;</span></span>
<span class="line">GENERAL.CON-<span class="token environment constant">PATH</span><span class="token builtin class-name">:</span>                       /org/freedesktop/NetworkManager/Setting<span class="token operator">&gt;</span></span>
<span class="line">GENERAL.ZONE:                           --</span>
<span class="line">GENERAL.MASTER-<span class="token environment constant">PATH</span><span class="token builtin class-name">:</span>                    --</span>
<span class="line">IP4.ADDRESS<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>:                         <span class="token number">192.168</span>.12.202/24</span>
<span class="line">IP4.GATEWAY:                            --</span>
<span class="line">IP4.ROUTE<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>:                           dst <span class="token operator">=</span> <span class="token number">192.168</span>.12.0/24, nh <span class="token operator">=</span> <span class="token number">0.0</span>.0.0, mt<span class="token operator">&gt;</span></span>
<span class="line">IP6.ADDRESS<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>:                         fe80::d9f:c18d:165f:167f/64</span>
<span class="line">IP6.GATEWAY:                            --</span>
<span class="line">IP6.ROUTE<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span>:                           dst <span class="token operator">=</span> fe80::/64, nh <span class="token operator">=</span> ::, mt <span class="token operator">=</span> <span class="token number">1024</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="启用网卡自动连接" tabindex="-1"><a class="header-anchor" href="#启用网卡自动连接"><span>启用网卡自动连接</span></a></h2><p>前面说到了show加连接名可以看到网络的详细配置，如果要启用自动连接，只需要将<code>connection.autoconnect</code>设置为是(或者是true，显示跟系统语言有关系)，我这里因为已经配过了，因此已经显示为是了。下面是配置语句</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text" data-title="text"><pre><code><span class="line">nmcli c modify eth1 connection.autoconnect true</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>查看使用的是show操作，而修改则是modify操作，后面跟修改的连接名，再跟需要修改的属性，再跟要修改的值。通过这条命令，就是讲eth1这个连接的自动连接设置为true,也就是会自动进行连接</p><h2 id="配置默认路由-默认使用连接外网的网卡" tabindex="-1"><a class="header-anchor" href="#配置默认路由-默认使用连接外网的网卡"><span>配置默认路由，默认使用连接外网的网卡</span></a></h2><p>当使用双网卡打开了两个连接，两个连接默认都会设置默认路由，这时候通过<code>route</code>命令，会有两条default的路由，在通过域名进行访问的时候，有时候就会走内网的default路由，这时候就表现为不能上网，这时候与两种选择，一是搞一个软路由，让内网的流量继续向外走到外网；一是删除内网的默认路由。我们选择的是删除内网的默认路由，因为确实没必要再搞个软路由转一圈。</p><p>删除内网的默认路由可以直接在路由表上删除，也就是route命令去删除，但是这种方式在连接下次建立之后，又会重新建立，因此根本上的解决办法，还是禁止自动创建default路由</p><p>控制这是否创建default路由的是<code>ipv4.never-default</code>属性，如果是ipv6则是ipv6前缀，这个属性默认是false，也就是每次都会创建default路由，因此需要将对应的属性值改为true，下面是对应的命令</p><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh" data-title="sh"><pre><code><span class="line">nmcli c modify eth1 ipv4.never-default <span class="token boolean">true</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>never-default设置为true，永不创建default路由，这样就只有外网的连接有default路由，这样内部的访问除了通过对应的内网ip网段直接访问的，其他的都会走外网路由，双网卡的网络也就正常了</p>`,23)]))}const d=s(l,[["render",p]]),r=JSON.parse('{"path":"/Linux/DualNetworkConfiguration.html","title":"双网卡配置主副网卡","lang":"zh-CN","frontmatter":{"title":"双网卡配置主副网卡","description":"通过nmcli进行双网卡配置"},"headers":[{"level":2,"title":"简单谈谈nmcli","slug":"简单谈谈nmcli","link":"#简单谈谈nmcli","children":[]},{"level":2,"title":"查看网络配置","slug":"查看网络配置","link":"#查看网络配置","children":[]},{"level":2,"title":"启用网卡自动连接","slug":"启用网卡自动连接","link":"#启用网卡自动连接","children":[]},{"level":2,"title":"配置默认路由，默认使用连接外网的网卡","slug":"配置默认路由-默认使用连接外网的网卡","link":"#配置默认路由-默认使用连接外网的网卡","children":[]}],"git":{"updatedTime":1662872214000,"contributors":[{"name":"吴俊城","email":"wujunchengman@163.com","commits":1}]},"filePathRelative":"Linux/DualNetworkConfiguration.md"}');export{d as comp,r as data};
