# mongoDB 搭建和基础操作

## 部署mongo

```sh
sudo docker run -d \
--restart=always \
--name mongodb \
-p 27017:27017 \
-v /mongo-data/:/data/db \
mongo
```

## 进入mongo 命令行

```sh
docker exec -it mongodb mongo
```

## 常见操作

> 这里演示 建库、建表(集合)、建索引、创建用户、为用户授权

```javascript
// 创建一个管理员用户
db.createUser({ user: 'root', pwd: 'xxxxxxx', roles: [ { role: 'userAdminAnyDatabase', db: 'admin' } ]});

// 创建库
use indicators_db

// 创建集合
db.getCollection("kline").drop();
db.createCollection("kline");

// 创建索引
db.getCollection("kline").createIndex({
    exchange: NumberInt("1"),
    symbol: NumberInt("1"),
    reference: NumberInt("1"),
    type: NumberInt("1"),
    time: NumberInt("-1")
}, {
    name: "exchange_1_symbol_1_reference_1_type_1_time_-1",
    background: true
});
db.getCollection("kline").createIndex({
    exchange: NumberInt("1"),
    symbol: NumberInt("1"),
    reference: NumberInt("1"),
    time: NumberInt("1"),
    type: NumberInt("1")
}, {
    name: "exchange_1_symbol_1_reference_1_time_1_type_1",
    unique: true
});

// 创建新用户
db.createUser({ user: 'indicators_user', pwd: 'xxxx', roles: [ { role: 'readWrite', db: 'indicators_db' } ]});

// 退出
exit
```