# 其他服务搭建

## EMQ

```
sudo docker run -d -ti \
--restart=always \
--name emqx \
-p 18083:18083 \
-p 1883:1883 \
-p 8083:8083 \
-p 8084:8084 \
emqx/emqx
```

## 容器内安装aws-cli

```
curl -O https://bootstrap.pypa.io/get-pip.py
python get-pip.py --user
echo "export PATH=~/.local/bin:$PATH" >> ~/.bashrc
source ~/.bashrc
pip install awscli --upgrade --user

aws configure
$(aws ecr get-login --no-include-email --region ap-northeast-1)
```

## shadowsocks

```
sudo docker run -dt \
--restart=always \
--name ss \
-p 9300:9300 \
mritd/shadowsocks -s "-s 0.0.0.0 -p 9300 -m chacha20 -k xxxxx"
```

## consul

```
sudo docker run -d \
--restart always \
--name consul \
-p 8500:8500 \
consul
```


## rabbitmq

```
sudo docker run -d \
--restart=always \
--name rabbitmq \
-p 5671:5671 \
-p 5672:5672 \
-p 4369:4369 \
-p 25672:25672 \
-p 15672:15672 \
-p 15671:15671 \
-v /data/rabbitmq-plugins/:/plugins/my \
rabbitmq:3.7.8-management
```
初始账号 guest/guest