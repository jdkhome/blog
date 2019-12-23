# 其他服务搭建

## EMQ

```sh
sudo docker run -d -ti \
--restart=always \
--name emqx \
-p 18083:18083 \
-p 1883:1883 \
-p 8083:8083 \
-p 8084:8084 \
-p 8080:8080 \
emqx/emqx
```

默认账户密码 admin/pubic  
部署之后进到后台(18083端口) 然后修改密码


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

```sh
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

```sh
sudo docker run -d \
--restart always \
--name consul \
-p 8500:8500 \
consul
```

默认是没有访问权限控制的，可以再部署一个[nginx](nginx.md)来做访问控制

## sonarqube

```sh
docker run -d --name sonarqube \
    -p 9000:9000 \
    -v /data/sonar/conf:/opt/sonarqube/conf \
    -v /data/sonar/data:/opt/sonarqube/data \
    -v /data/sonar/logs:/opt/sonarqube/logs \
    -v/data/sonar/extensions:/opt/sonarqube/extensions \
    sonarqube
```

默认账户密码 admin/admin  
部署之后进到后台(9000端口) 然后修改密码

## rabbitmq

```sh
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

默认账户密码 guest/guest  
部署之后进到后台(15672端口) 然后修改密码