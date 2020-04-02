---
sidebar: auto
---

# Docker 启动容器报错 : service endpoint with name xxx already exists.

使用docker部署服务，启动容器时有时会遇到如标题上的这种报错。  
意思是这个端口已经被名为xxx的容器占用了。
而执行 docker ps 又找不到这个容器，这种情况，通常是xxx容器没有正常删除导致的。

## 解决方案

### 1.确保xxx容器已被删除

首先查看当前所有容器

```sh
docker ps -a
```

如果存在xxx容器，则将其强制删除

```sh
docker rm -f xxx
```

### 2.清理次容器的网络占用

```sh
docker network disconnect --force 网络模式 容器名称

# eg.
# docker network disconnect --force bridge xxx
```

这里的网络模式对应的就是你的容器的网桥的名称

### 3.尝试启动容器

```
docker run ...
```

> 如果还是不能启动，重启docker服务再来一遍。

## 参考链接

[service endpoint with name xxx already exists.](https://blog.csdn.net/weixin_39800144/article/details/79352053) IT云清