---
title: 双网卡配置主副网卡
description: 通过nmcli进行双网卡配置
---
# nmcli双网卡配置主副网卡

先说说情况，公司有一台物理服务器，其中虚拟化了多个Linux系统，这些Linux系统各有用途。对外提供着不同的服务，同时内部之间也需要相互连通，因此这些虚拟机都同时处在两个局域网中：一个连接到公司的局域网中，用于连接外网；一个连接到由主机创建的虚拟路由器，提供内部Linux虚拟机之间互相访问的高速通道。非常典型的内、外网双网卡结构。

## 简单谈谈nmcli

在CentOS 8（准确的说是RHEL8及其衍生版），默认已经推荐使用nmcli这个工具来管理网络了，以前的修改script的方式已经快要淘汰了，系统中也找不到对应的script文件了，因此本文的配置网络，都是通过nmcli来进行管理的

```shell
nmcli connection show

nmcli connnection

nmcli c
```
上面的三条命令是等效的，第一条为完整的命令，第二条命令是因为connection的默认操作就是show,因此可以省略后面的show，第三条命令是因为nmcli查找命令的时候并不需要输入完整的命令，而是只要输入的命令可以确定到唯一对象就行了，因此可以用c直接代替connection

nmcli能够管理连接，也就是本文中的connection，除了connection对象，还有device对象，管理设备，用的最多的就是这两个对象，当然还有其他对象，但是这里就只是简单的讲一下connection对象中的关于默认路由的配置和自动连接网络，因为我主要做开发，Linux只能算半罐水，目前遇到的网络问题也就这两个，如果后面遇到新的了，到时候再更新

## 查看网络配置

前面提到了`nmcli connection show`可以查看系统中的网络连接基本信息，如果要看对应的详细信息，则在show的后面跟对应的连接名即可，也就是这条命令
```shell
nmcli connection show eth1

nmcli c show eth1
```
这条命令就是查看对应的连接eth1的详情，下面的是将connection简写为c的版本，需要注意的是，因为带了参数，此时的show讲不能再省略

通过这条命令，就可以看到连接的详细信息
```shell
connection.id:                          eth1
connection.uuid:                        a073ba38-4fe1-4edc-b0c8-0e7bae0375d1
connection.stable-id:                   --
connection.type:                        802-3-ethernet
connection.interface-name:              eth1
connection.autoconnect:                 是
connection.autoconnect-priority:        0
connection.autoconnect-retries:         -1 (default)
connection.multi-connect:               0（default）
connection.auth-retries:                -1
connection.timestamp:                   1662868627
connection.read-only:                   否
connection.permissions:                 --
connection.zone:                        --
connection.master:                      --
connection.slave-type:                  --
connection.autoconnect-slaves:          -1（default）
connection.secondaries:                 --
connection.gateway-ping-timeout:        0
connection.metered:                     未知
connection.lldp:                        default
connection.mdns:                        -1（default）
connection.llmnr:                       -1（default）
connection.dns-over-tls:                -1（default）
connection.wait-device-timeout:         -1
802-3-ethernet.port:                    --
802-3-ethernet.speed:                   0
802-3-ethernet.duplex:                  --
802-3-ethernet.auto-negotiate:          否
802-3-ethernet.mac-address:             --
802-3-ethernet.cloned-mac-address:      --
802-3-ethernet.generate-mac-address-mask:--
802-3-ethernet.mac-address-blacklist:   --
802-3-ethernet.mtu:                     自动
802-3-ethernet.s390-subchannels:        --
802-3-ethernet.s390-nettype:            --
802-3-ethernet.s390-options:            --
802-3-ethernet.wake-on-lan:             default
802-3-ethernet.wake-on-lan-password:    --
802-3-ethernet.accept-all-mac-addresses:-1（default）
ipv4.method:                            manual
ipv4.dns:                               --
ipv4.dns-search:                        --
ipv4.dns-options:                       --
ipv4.dns-priority:                      0
ipv4.addresses:                         192.168.12.202/24
ipv4.gateway:                           --
ipv4.routes:                            --
ipv4.route-metric:                      -1
ipv4.route-table:                       0 (unspec)
ipv4.routing-rules:                     --
ipv4.ignore-auto-routes:                否
ipv4.ignore-auto-dns:                   否
ipv4.dhcp-client-id:                    --
ipv4.dhcp-iaid:                         --
ipv4.dhcp-timeout:                      0 (default)
ipv4.dhcp-send-hostname:                是
ipv4.dhcp-hostname:                     --
ipv4.dhcp-fqdn:                         --
ipv4.dhcp-hostname-flags:               0x0（none）
ipv4.never-default:                     是
ipv4.may-fail:                          是
ipv4.required-timeout:                  -1 (default)
ipv4.dad-timeout:                       -1 (default)
ipv4.dhcp-vendor-class-identifier:      --
ipv4.dhcp-reject-servers:               --
ipv6.method:                            auto
ipv6.dns:                               --
ipv6.dns-search:                        --
ipv6.dns-options:                       --
ipv6.dns-priority:                      0
ipv6.addresses:                         --
ipv6.gateway:                           --
ipv6.routes:                            --
ipv6.route-metric:                      -1
ipv6.route-table:                       0 (unspec)
ipv6.routing-rules:                     --
ipv6.ignore-auto-routes:                否
ipv6.ignore-auto-dns:                   否
ipv6.never-default:                     否
ipv6.may-fail:                          是
ipv6.required-timeout:                  -1 (default)
ipv6.ip6-privacy:                       -1（unknown）
ipv6.addr-gen-mode:                     stable-privacy
ipv6.ra-timeout:                        0 (default)
ipv6.dhcp-duid:                         --
ipv6.dhcp-iaid:                         --
ipv6.dhcp-timeout:                      0 (default)
ipv6.dhcp-send-hostname:                是
ipv6.dhcp-hostname:                     --
ipv6.dhcp-hostname-flags:               0x0（none）
ipv6.token:                             --
proxy.method:                           none
proxy.browser-only:                     否
proxy.pac-url:                          --
proxy.pac-script:                       --
GENERAL.NAME:                           eth1
GENERAL.UUID:                           a073ba38-4fe1-4edc-b0c8-0e7bae0375d1
GENERAL.DEVICES:                        eth1
GENERAL.IP-IFACE:                       eth1
GENERAL.STATE:                          已激活
GENERAL.DEFAULT:                        是
GENERAL.DEFAULT6:                       否
GENERAL.SPEC-OBJECT:                    --
GENERAL.VPN:                            否
GENERAL.DBUS-PATH:                      /org/freedesktop/NetworkManager/ActiveC>
GENERAL.CON-PATH:                       /org/freedesktop/NetworkManager/Setting>
GENERAL.ZONE:                           --
GENERAL.MASTER-PATH:                    --
IP4.ADDRESS[1]:                         192.168.12.202/24
IP4.GATEWAY:                            --
IP4.ROUTE[1]:                           dst = 192.168.12.0/24, nh = 0.0.0.0, mt>
IP6.ADDRESS[1]:                         fe80::d9f:c18d:165f:167f/64
IP6.GATEWAY:                            --
IP6.ROUTE[1]:                           dst = fe80::/64, nh = ::, mt = 1024
```

## 启用网卡自动连接

前面说到了show加连接名可以看到网络的详细配置，如果要启用自动连接，只需要将`connection.autoconnect`设置为是(或者是true，显示跟系统语言有关系)，我这里因为已经配过了，因此已经显示为是了。下面是配置语句
```
nmcli c modify eth1 connection.autoconnect true
```
查看使用的是show操作，而修改则是modify操作，后面跟修改的连接名，再跟需要修改的属性，再跟要修改的值。通过这条命令，就是讲eth1这个连接的自动连接设置为true,也就是会自动进行连接

## 配置默认路由，默认使用连接外网的网卡

当使用双网卡打开了两个连接，两个连接默认都会设置默认路由，这时候通过`route`命令，会有两条default的路由，在通过域名进行访问的时候，有时候就会走内网的default路由，这时候就表现为不能上网，这时候与两种选择，一是搞一个软路由，让内网的流量继续向外走到外网；一是删除内网的默认路由。我们选择的是删除内网的默认路由，因为确实没必要再搞个软路由转一圈。

删除内网的默认路由可以直接在路由表上删除，也就是route命令去删除，但是这种方式在连接下次建立之后，又会重新建立，因此根本上的解决办法，还是禁止自动创建default路由

控制这是否创建default路由的是`ipv4.never-default`属性，如果是ipv6则是ipv6前缀，这个属性默认是false，也就是每次都会创建default路由，因此需要将对应的属性值改为true，下面是对应的命令
```shell
nmcli c modify eth1 ipv4.never-default true
```
never-default设置为true，永不创建default路由，这样就只有外网的连接有default路由，这样内部的访问除了通过对应的内网ip网段直接访问的，其他的都会走外网路由，双网卡的网络也就正常了