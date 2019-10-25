# USDT(Omni-Layer)节点 搭建

## 获取最新的发新版

> https://github.com/OmniLayer/omnicore/releases

选择和你所在系统对应的版本进行下载

```
sudo wget https://github.com/OmniLayer/omnicore/releases/download/v0.6.0/omnicore-0.6.0-x86_64-linux-gnu.tar.gz
```

解压缩

```
sudo tar -zxvf omnicore-0.6.0-x86_64-linux-gnu.tar.gz
```


## 运行

```
cd /data2/omnicore-0.6.0/bin/
sudo ./omnicored --datadir=/data2/usdt -txindex -daemon -server -rest -rpcallowip=0.0.0.0/0 -rpcuser=jdk -rpcpassword=1234abc -startclean
```
## 一些命令

```
# 查看工作状态
./omnicore-cli getnetworkinfo
```