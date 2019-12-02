---
sidebar: auto
---

# docker 容器内访问宿主机 "No route to host"

原因我也没有深入了解，但是解决了我的问题

## 解决方法

按顺序执行

```sh
nmcli connection modify docker0 connection.zone trusted
systemctl stop NetworkManager.service
firewall-cmd --permanent --zone=trusted --change-interface=docker0
systemctl start NetworkManager.service
nmcli connection modify docker0 connection.zone trusted
systemctl restart docker.service
```

## 参考链接

[docker 解决容器内访问宿主机“No route to host”的问题](https://blog.csdn.net/weixin_42264901/article/details/84790869) 小淘马