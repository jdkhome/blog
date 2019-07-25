---
sidebar: auto
---

# docker设置自动启动

## docker服务设置自动启动

查看已启动的服务

```sh
systemctl list-units --type=service
```

查看是否设置开机启动

```sh
systemctl list-unit-files | grep enable
```

设置开机启动

```sh
systemctl enable docker.service
```

关闭开机启动

```sh
systemctl disable docker.service
```

## docker容器设置自动启动

启动时加 --restart=always

- no 不自动重启容器. (默认value)
- on-failure 容器发生error而退出(容器退出状态不为0)重启容器
- unless-stopped 在容器已经stop掉或Docker stoped/restarted的时候才重启容器
- always 在容器已经stop掉或Docker stoped/restarted的时候才重启容器

如果是已经启动的容器，可以使用update更新

```sh
docker update --restart=always 容器名
```