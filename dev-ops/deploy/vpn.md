# VPN部署

```sh
docker run -d \
--name vpn \
--privileged \
--restart=always \
-e VPN_IPSEC_PSK=自定义PSK密码 \
-e VPN_USER=自定义用户名 \
-e VPN_PASSWORD=自定义用户密码 \
-p 500:500/udp \
-p 4500:4500/udp \
-v /lib/modules:/lib/modules:ro \
hwdsl2/ipsec-vpn-server
```

## vpn客户端连接

see https://github.com/hwdsl2/setup-ipsec-vpn/blob/master/docs/clients-zh.md