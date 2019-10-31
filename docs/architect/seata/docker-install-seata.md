# 使用docker安装seata

```Dockerfile
FROM openjdk:8
MAINTAINER main@jdkhome.com

WORKDIR /var/app

RUN wget https://github.com/seata/seata/releases/download/v0.9.0/seata-server-0.9.0.tar.gz
RUN tar -zxvf

CMD ["sh","./seata/bin/seata-server.sh"]
```

```
wget https://github.com/seata/seata/releases/download/v0.9.0/seata-server-0.9.0.tar.gz

```

```
docker run -d \
--restart always \
--name seata-server \
-p 8091:8091 \
jdkhome/seata:0.9.0
```