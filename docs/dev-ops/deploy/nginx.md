# nginx 部署

## 服务搭建

```sh
docker run -d \
--restart=always \
-p 80:80 -p 443:443 \
--privileged=true \
--name nginx \
-v /data/nginx/conf.d:/etc/nginx/conf.d \
-v /data/nginx/ssl:/ssl \
-v /data/nginx/nginx.conf:/etc/nginx/nginx.conf \
-v /data/nginx/static:/static \
nginx
```

## nginx.conf

```conf
user  nginx;
worker_processes  2;

error_log  /var/log/nginx/error.log warn;
pid        /var/run/nginx.pid;


events {
    use epoll;
    worker_connections  60000;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  65;

    #gzip  on;


    #client_header_buffer_size 16k;
    #large_client_header_buffers 48k

    include /etc/nginx/conf.d/*.conf;

}
```

## 示例配置

> **.conf**配置文件放到宿主机的 **/data/nginx/conf.d** 目录  
> 密钥文件放到宿主机的 **/data/nginx/ssl** 目录

```conf
server {
    listen	443 ssl;
    server_name  xxx.domain.com;

    ssl_certificate /ssl/xxx/xxx.crt;
    ssl_certificate_key /ssl/xxx/xxx.key;
	    
    location / {
        proxy_pass   http://192.168.1.123:8080;
    #    proxy_redirect  off;
        proxy_set_header        Host    xxx.domain.com;
        proxy_set_header        X-Real-IP       $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   Cookie $http_cookie;
        chunked_transfer_encoding       off;
    }

#    port_in_redirect off;  
}

# http自动转到https协议
server {
    listen 80;
    server_name xxx.domain.com;
    return 301 https://$server_name$request_uri;
}

```

## 设置访问密码

```sh
# 安装密钥文件生成工具
sudo apt install apache2-utils -y

# 生成密钥文件 xxxx-passwd为你要生成的密钥文件名 username为你要生成的密钥的用户名
htpasswd -c xxxx-passwd username
# 执行后输入要设置的密码并确认即可
```

```conf
server {
listen      80;
server_name  xxx.xxx.com;

auth_basic "Please input password"; # 这里是验证时的提示信息
auth_basic_user_file /etc/nginx/conf.d/xxx-passwd; # 这是前面生成的密钥文件路径

location / {
    proxy_pass              http://xxxxx.com;
    proxy_redirect          off;
    proxy_set_header        Host    xxxxx.com;
    proxy_set_header        X-Real-IP       $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header        Cookie $http_cookie;
    chunked_transfer_encoding       off;
}

}
```


