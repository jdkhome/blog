---
sidebar: auto
---

# 清理docker占用的磁盘空间


## 清理无用的磁盘占用

**docker system df** 命令，类似于Linux上的df命令，用于查看Docker的磁盘使用情况：

```sh
$ sudo docker system df
TYPE                TOTAL               ACTIVE              SIZE                RECLAIMABLE
Images              41                  35                  2.403GB             2.162GB (89%)
Containers          35                  35                  14.22MB             0B (0%)
Local Volumes       0                   0                   0B                  0B
Build Cache         0                   0                   0B                  0B
```

**docker system prune** 命令可以用于清理磁盘，删除关闭的容器、无用的数据卷和网络，以及dangling镜像（即无tag的镜像）。

**docker system prune -a** 命令清理得更加彻底，可以将没有容器使用Docker镜像都删掉。注意，这两个命令会把你暂时关闭的容器，以及暂时没有用到的Docker镜像都删掉。

## 容器控制台日志

docker运行的服务，输出到控制台的日志(不是你挂载出来的日志文件)是不会自动清理的，日积月累会占用大量的磁盘空间。

### 脚本

```sh
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

## 其他清理

如果你容器中的服务，把日志或者其他内容，直接保存到了容器内部，没有挂载到宿主机，也没有自动清理，那么时间久了就会堆积占用很大的空间，而这部分空间，只用删除容器的时候才会释放，此时就需要手动排查，是哪个容器占用这么大。

```sh
sudo docker system df -v
```

使用上面这个命令，可以查看到每个容器的磁盘空间占用情况，然后执行

```sh
sudo docker rm -fv 容器名
```

这里的 -f 是指强制删除容器，-v 是指带着数据卷一起删除。

## 挂载出来的日志

这部分不属于docker占用的清理了，不过经常一起用，所以也整理到这里

```sh
sudo find /data -name "*.log.*" | sudo xargs rm -f
```




