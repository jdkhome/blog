# 其他服务搭建

## nginx

```
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

nginx.conf
```
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

示例 xxx.conf
```
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

## jenkins



```
docker run -d \
--restart=always \
--privileged=true \
--name jenkins \
-p 9090:8080 \
-v /data/jenkins:/var/jenkins_home \
-v /var/run/docker.sock:/var/run/docker.sock \
-v $(which docker):/usr/bin/docker \
-v /etc/sysconfig/docker:/etc/sysconfig/docker \
-v /usr/bin/docker-current:/usr/bin/docker-current \
-v /usr/lib/x86_64-linux-gnu/libltdl.so.7:/usr/lib/x86_64-linux-gnu/libltdl.so.7 \
-v /lib64/libgpgme.so.11:/usr/lib/libgpgme.so.11 -u 0 \
-v /lib64/libcrypto.so.10:/usr/lib/libcrypto.so.10 -u 0 \
jenkins/jenkins:lts-jdk11
```

启动之后，从日志中获取**initialAdminPassword**

```
docker logs -f jenkins
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

## sonarqube

```
docker run -d --name sonarqube \
    -p 9000:9000 \
    -v /data/sonar/conf:/opt/sonarqube/conf \
    -v /data/sonar/data:/opt/sonarqube/data \
    -v /data/sonar/logs:/opt/sonarqube/logs \
    -v/data/sonar/extensions:/opt/sonarqube/extensions \
    sonarqube
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