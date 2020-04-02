---
sidebar: auto
---

# docker 安装 cloudreve

> 在我之前，已有[@ilemonrain](https://hub.docker.com/r/ilemonrain/cloudreve/)提供了docker安装cloudreve的方法，但他的项目不太适合我的需求，所以又重新折腾了一遍。  
> 我也不是很懂php，所以如果遇到Bug还请移步到[Cloudreve](https://github.com/cloudreve/Cloudreve)咯。  
> 祝Cloudreve越来越好！！

特点:

- 😎尽我所能的开箱即用
- 已配置好各种扩展(pdo、fileinfo、curl、gd)
- 集成[taskqueue](https://github.com/cloudreve/taskqueue)
- 集成[Aria2](http://aria2.github.io/)
- 内置定时访问**http://{host}:{port}/Cron**
- ❌用于2步验证的依赖库未安装(应该是用有这个依赖的项目重新打包就可以)

## 准备工作

### docker环境

略过...

### mysql

> 这一步是用于准备一个mysql数据库

1. [mysql搭建](/dev-ops/deploy/database.html#mysql)
2. [创建数据库、创建用户以及授权](/mysql/mysql-create-db-and-user.html)

## 部署

### 启动cloudreve

```sh
docker run -d \
--restart=always \
--name cloudreve \
-p 80:80 \
jdkhome/cloudreve:1.1.1
```

### 初始化cloudreve

启动后浏览器访问: 

http://{host}:{port}/CloudreveInstaller/index.php

按照提示进行即可

> 如果你访问http://{host}:{port} 得到报错页面，大概率是你忘记访问上面的初始化链接了

管理员账号密码

```
admin@cloudreve.org
admin
```

## 后续步骤

### 修改管理员密码

略过...

### 配置离线下载

用管理员账号进到后台 管理面板 > 离线下载 > 配置

```
RPC Token   : 123456
下载临时目录  : /var/www/html/temp
```

然后给相应用户组开启离线下载权限即可

> 如果希望自定义RPC Token, 可以设置容器环境变量**ARIA2_TOKEN**

### 配置Onedrive

设置任务队列的token 管理面板 > 其他 > 任务队列 > 配置

```
Token : 123456
```
完成设置之后，需要重启一下cloudreve的docker容器以启动taskqueue

> 如果希望自定义RPC Token, 可以设置容器环境变量**CLOUDREVE_TOKEN**

```sh
docker restart cloudreve
```

接下来按照[Cloudreve官方的对接说明](https://github.com/cloudreve/Cloudreve/wiki/Onedrive%E5%AF%B9%E6%8E%A5%E8%AF%B4%E6%98%8E)操作即可

## 最后最后

项目开源到了[jdkhome/cloudreve](https://github.com/jdkhome/cloudreve),如有问题可以给我提Issue

如果有帮到你麻烦给我和 [Cloudreve官方](https://github.com/cloudreve/Cloudreve) 来个Star~

enjoy!


