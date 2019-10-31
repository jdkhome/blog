---
sidebar: auto
---
# mysql创建数据库,添加用户,授权

## 整合命令

```sql

# 创建名称为“test_db”数据库，并设定编码集为utf8mb4
CREATE DATABASE IF NOT EXISTS test_db DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

# 创建了一个名为：test_user 密码为：123456 的用户
CREATE USER test_user@'%' identified BY '123456';

# 将testdb所有权限 授权给 用户test_user
GRANT ALL PRIVILEGES ON test_db.* TO test_user@'%';

```

## 精细控制

### 登陆限制

```sql

# localhost 代表该用户只能在本地登陆
create user test@'localhost' identified by '123456';

# 可以限定登陆的IP地址
create user test@'192.168.1.20' identified by '123456';

# 允许在任何机器上登陆
create user test@'%' identified by '123456';
```

### 权限限制

```sql

# 精细控制授予的各项权限 
grant create,alter,drop,select,insert,update,delete on testdb.* to test@'%'; 
```