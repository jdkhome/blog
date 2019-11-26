# omni节点搭建 

可以用作btc 和 usdt节点

```sh
docker run -d \
--restart always \
--name omnicore \
-p 8332:8332 \
-p 8333:8333 \
-v /data/bitcoin.conf:/root/.bitcoin/bitcoin.conf \
-v /data/omni:/data \
jdkhome/omnicore:0.6.0 \
./omnicored --datadir=/data -txindex -server -rest -rpcallowip=0.0.0.0/0 -rpcbind -rpcuser=RPC用户名 -rpcpassword=RPC密码 -startclean
```

附上我的Dockerfile

```Dockerfile
FROM centos:7
MAINTAINER main@jdkhome.com

RUN mkdir /var/app
RUN yum -y install wget
RUN wget https://github.com/OmniLayer/omnicore/releases/download/v0.6.0/omnicore-0.6.0-x86_64-linux-gnu.tar.gz
RUN tar -zxvf omnicore-0.6.0-x86_64-linux-gnu.tar.gz -C /var/app

WORKDIR /var/app/omnicore-0.6.0/bin

CMD ["./omnicored","--datadir=/data/usdt","-txindex","-server","-rest","-rpcallowip=0.0.0.0/0","-startclean"]
```

## 相关资源

- [BTC rpc文档](https://bitcoincore.org/en/doc/0.18.0/rpc/blockchain/getbestblockhash/)
- [omni rpc文档](https://github.com/OmniLayer/omnicore/blob/master/src/omnicore/doc/rpc-api.md)