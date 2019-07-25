# 数据库服务搭建

## mysql

```
sudo docker run -d \
--restart=always \
--name mysql \
-p 3306:3306 \
-v /data/mysql/data:/var/lib/mysql \
-e MYSQL_ROOT_PASSWORD=xxxxxx \
mysql:5.7
```

## redis

```
redis.conf

requirepass xxxxxx
maxmemory 1024m

sudo docker run -d \
--restart=always \
--name redis \
-p 6379:6379 \
-v /data/redis/data:/data \
-v /data/redis/redis.conf:/usr/local/etc/redis/redis.conf \
redis:4.0.8 redis-server /usr/local/etc/redis/redis.conf
```