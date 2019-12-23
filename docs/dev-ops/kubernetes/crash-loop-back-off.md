# Kubernetes 启动Pod 遇到 CrashLoopBackOff 解决方案

## 简述

CrashLoopBackOff 的含义是:

> Kubernetes试图启动该Pod, 但是过程中出现错误, 导致容器启动失败或者正在被删除。

遇到这个问题, 必须得就事论事, 没有统一的解决方案。但是要说思路, 那无非就是看日志, 修改, 尝试启动, 再看日志.

## 实例 elk服务出现 CrashLoopBackOff

我在搭建elk时, elk的Pod 一直处于 CrashLoopBackOff.

### 登录master获取pod状态

```sh
ubuntu@master:~/my-study-data/elk$ kubectl get pod
NAME                                READY   STATUS             RESTARTS   AGE
elk-deployment-788969848c-84j6q     0/1     CrashLoopBackOff   6          16m
nginx-deployment-54f57cf6bf-5zqlx   1/1     Running            0          16h
```

### 查看异常pod的详细详细

```sh
ubuntu@master:~/my-study-data/elk$ kubectl describe pod elk-deployment-788969848c-84j6q
# ... 省略 ...
Node:         worker2/192.168.12.77
# ... 省略 ...
```

### 查看pod的日志

```sh
ubuntu@master:~/my-study-data/elk$ kubectl logs elk-deployment-788969848c-84j6q

# ... 省略 ...
[1]: max virtual memory areas vm.max_map_count [65530] is too low, increase to at least [262144]
# ... 省略 ...
```

这就找到了起不起来的原因

### 解决

**vm.max_map_count**参数，是允许一个进程在VMAs拥有最大数量（VMA：虚拟内存地址， 一个连续的虚拟地址空间），当进程占用内存超过时， 直接OOM。

elasticsearch占用内存较高。官方要求max_map_count需要配置到最小262144。

max_map_count配置文件写在系统的**/proc/sys/vm**中

前面使用 **describe** 已经知道, elk的Pod现在是在 **worker2/192.168.12.77**

那么我们进到worker2机器

通过 **docker inspect** 命令, 可查看docker使用宿主机的/proc/sys作为只读路径之一。

```sh
ubuntu@worker2:~$ sudo docker inspect 8ad12516c611
# ... 省略 ...
            "ReadonlyPaths": [
                "/proc/bus",
                "/proc/fs",
                "/proc/irq",
                "/proc/sys",
                "/proc/sysrq-trigger"
            ]
# ... 省略 ...
```

说明镜像使用宿主机的max_map_count参数。因此直接修改宿主机的max_map_count参数即可。

查看 max_map_count 值:

```sh
ubuntu@worker2:~$ more /proc/sys/vm/max_map_count
65530
```

修改有2种方法:

```
sudo sysctl -w vm.max_map_count=262144
```

但是这种方法, 机器重启后会失效。

永久修改:

在 /etc/sysctl.conf  文件最后添加一行

```
vm.max_map_count=262144
```

然后执行

```
sudo sysctl -p
```

补充

> 要么在Kubernets 把elk的Pod部署在固定的Node, 要么修改所有Node的vm.max_map_count。 我选择了前者，见[分配pod到指定的节点](kubernetes-assigning-pod-to-nodes.md)。