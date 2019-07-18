---
sidebar: auto
---

# docker控制台日志清理

## 起因

docker运行的服务，输出到控制台的日志(不是你挂载出来的日志文件)是不会自动清理的，日积月累会占用大量的磁盘空间。

## 脚本

```
#!/bin/sh  

echo "==================== start clean docker containers logs =========================="  

logs=$(find /var/lib/docker/containers/ -name *-json.log)  

for log in $logs  
        do  
                echo "clean logs : $log"  
                cat /dev/null > $log  
        done  


echo "==================== end clean docker containers logs   =========================="

```