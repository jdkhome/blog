# frp内网穿透搭建

## 服务端

/data/frps/frps.ini

```ini
[common]
bind_port = 11000
auth_token = 自定义密码
```

启动命令

```sh
docker run -d \
--restart=always \
--name frps \
--privileged=true \
-p 11000-13000:11000-13000 \
-v /data/frps:/conf \
cloverzrg/frps-docker:0.31.1
```

## 客户端

/data/frpc/frpc.ini

```ini
[common]
server_addr = frps服务的ip
server_port = frps服务的端口
auth_token = frps服务的密码

[ssh-xxxx]
type = tcp
local_ip = localhost
local_port = 22
remote_port = xxx

[other-xxxx]
type = tcp
local_ip = 192.168.12.xxx
local_port = xxx
remote_port = xxx
```

启动命令

```sh
docker run -d \
--restart=always \
--name frpc \
--privileged=true \
--network=host \
-v /data/frpc:/conf \
cloverzrg/frpc-docker:0.31.1
```
