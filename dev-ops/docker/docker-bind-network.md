---
sidebar: auto
---


# docker 绑定宿主机的网卡

如果你的宿主机，有多个网卡，每个网卡的ip地址不同，这个时候，容器内部出网流量的ip就无法指定。
Docker 并没有直接提供实现该需求的方法。

但是这个需求，可以通过iptable做NAT转发实现。

## 查看要绑定的宿主机ip

```sh
ip addr
```

比如我这里的ip是 192.168.12.48

## 将docker的流量转发

docker默认网桥是 172.17.0.0

```sh
iptables -t nat -I POSTROUTING -p all -s 172.17.0.0/16 -j SNAT --to-source 192.168.12.48
```

一般来说启动容器的时候，没有指定网桥的话，就会是这个，这样就能够把这个网桥上的所有流量都转到192.168.12.48了

如果想对指定某一个容器进行这样的流量转发，你需要把这个容器单独指定网桥，然后再像上面这样去做