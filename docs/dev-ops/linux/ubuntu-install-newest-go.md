---
sidebar: auto
---

# ubuntu 安装最新版本go

## 获取最新的软件包源，并添加至当前的apt库

```sh
add-apt-repository ppa:longsleep/golang-backports
```

## 更新 apt库

```sh
apt-get update
```

## 安装go

```sh
sudo apt-get install golang-go
```

## 鉴定是否安装成功

```sh
go version
```