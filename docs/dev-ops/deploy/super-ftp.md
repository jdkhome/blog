# "超级" ftp服务搭建

> 

## 话不多说, 先放成果

- 只需启动一个docker容器即可获得开箱即用的ftp服务，这个ftp服务**自带5TB的存储空间**。
- 容器是**无状态**的，你上传到这个ftp中的内容不会因为你删除了容器而丢失。

## 开箱即用

### 准备工作

### 部署

```sh
docker run -d -id \
--name ftp \
--privileged \
--restart=always \
jdkhome/ftp
```





## 其他



### Dockerfile

```vsftpd.conf
background=YES
anonymous_enable=NO   #关闭匿名访问模式
local_enable=YES
write_enable=YES
local_umask=022
local_root=/data   #指定本地用户的FTP根目录
chroot_local_user=YES   #将用户权限禁锢在FTP目录
allow_writeable_chroot=YES   #允许对FTP根目录执行写入操作
dirmessage_enable=YES
xferlog_enable=YES
connect_from_port_20=YES
xferlog_std_format=YES
listen_port=2231
listen=NO
listen_ipv6=YES
pam_service_name=vsftpd
userlist_enable=YES
tcp_wrappers=YES
pasv_min_port=45000
pasv_max_port=49000
```

```sh
echo -e "${FTP_USER}\n${FTP_PASS}" > /etc/vsftpd/virtual_users.txt
/usr/bin/db_load -T -t hash -f /etc/vsftpd/virtual_users.txt /etc/vsftpd/virtual_users.db
chmod 600 /etc/vsftpd/vuser.db
rm -f /etc/vsftpd/vuser.txt

# Run vsftpd:
&>/dev/null /usr/sbin/vsftpd /etc/vsftpd/vsftpd.conf
```

```Dockerfile
FROM ubuntu:18.04

WORKDIR /var/app
COPY onedriver /var/app
RUN apt update -y
RUN apt install -y gcc pkg-config libwebkit2gtk-4.0-dev fuse vsftpd
RUN mkdir -p /data

COPY vsftpd.conf /etc/vsftpd/
COPY run.sh /usr/sbin/
ENV FTP_USER **String**
ENV FTP_PASS **Random**

#CMD ["./onedriver","/data"]
CMD ["/usr/sbin/run.sh"]
```

### 开源项目

- https://github.com/jstaf/onedriver


```
FROM fauria/vsftpd:latest

WORKDIR /var/app
COPY onedriver /var/app
RUN yum install -y gcc pkg-config libwebkit2gtk-4.0-dev

RUN mkdir -p /usr/lib/x86_64-linux-gnu/
COPY libwebkit2gtk-4.0.so.37 /usr/lib/x86_64-linux-gnu/



FROM ubuntu:18.04

WORKDIR /var/app
COPY onedriver /var/app
RUN apt update -y
RUN apt install -y gcc pkg-config libwebkit2gtk-4.0-dev fuse vsftpd
RUN mkdir -p /data

CMD ["./onedriver","/data"]





docker build -t jdkhome/ftp .

-v /my/data/directory:/home/vsftpd \

docker rm -f 
docker run -d \
-p 20:20 -p 21:21 -p 21100-21110:21100-21110 \
-e FTP_USER=myuser -e FTP_PASS=mypass \
-e PASV_ADDRESS=127.0.0.1 -e PASV_MIN_PORT=21100 -e PASV_MAX_PORT=21110 \
--name ftp --restart=always jdkhome/ftp


docker run -d -it \
--name ftp \
--privileged \
--restart=always \
-p 20:20 -p 21:21 -p 21100-21110:21100-21110 \
-e FTP_USER=myuser -e FTP_PASS=mypass \
-e PASV_ADDRESS=127.0.0.1 -e PASV_MIN_PORT=21100 -e PASV_MAX_PORT=21110 \
jdkhome/ftp /bin/bash

./onedriver /home/vsftpd/



test1@ceyl.top
Test8888
亲可以用测试账户先试一下功能，满意后可下单。







FROM fauria/vsftpd:latest

WORKDIR /var/app
COPY onedriver /var/app
RUN yum update -y
RUN yum install -y gcc pkg-config libwebkit2gtk-4.0-dev fuse
RUN mkdir -p /data
COPY run.sh /var/app

CMD ["./run.sh"]


```