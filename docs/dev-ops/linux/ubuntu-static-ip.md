---
sidebar: auto
---

# ubuntu 设置静态ip

## 环境 

我进行设置静态ip的机器是 ubuntu18.04 Server版

## 找到要设置的网卡

```sh
root@ubuntu:/home/ubuntu# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host 
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP group default qlen 1000
    link/ether 00:50:56:34:05:a8 brd ff:ff:ff:ff:ff:ff
    inet 192.168.12.169/24 brd 192.168.12.255 scope global dynamic ens33
       valid_lft 83640sec preferred_lft 83640sec
    inet6 fe80::250:56ff:fe34:5a8/64 scope link 
       valid_lft forever preferred_lft forever
```

可以看到 ens33 这个是我们要改的网卡

## 修改网卡配置文件

这是默认的配置文件

```sh
root@ubuntu:/home/ubuntu# cat /etc/netplan/50-cloud-init.yaml
# This file is generated from information provided by
# the datasource.  Changes to it will not persist across an instance.
# To disable cloud-init's network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    ethernets:
        ens33:
            dhcp4: true
    version: 2
```

我希望把ip修改为192.168.12.144

```
root@ubuntu:/home/ubuntu# cat /etc/netplan/50-cloud-init.yaml 
# This file is generated from information provided by
# the datasource.  Changes to it will not persist across an instance.
# To disable cloud-init's network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    ethernets:
        ens33:
            dhcp4: no
            addresses: [192.168.12.144/24]
            optional: true
            gateway4: 192.168.12.1    
    version: 2
```

## 应用配置

```
root@ubuntu:/home/ubuntu# sudo netplan apply
```

这一步之后，如果你是通过原ip远程上的机器，就需要关闭终端会话用新ip去连接了

检查

```sh
ip addr
```