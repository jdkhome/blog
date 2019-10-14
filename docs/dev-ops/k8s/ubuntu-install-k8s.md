# 国内环境 ubuntu18 安装 k8s

## 环境准备

准备了三台ubuntu18 虚拟机

|  IP   | ROTE  | Hostname |
|  ----  | ----  |----  |
| 192.168.12.98  | master | master |
| 192.168.12.122  | worker | worker1 |
| 192.168.12.94  | worker | worker2 |

### 设置主机名

```
# 设置主机名
sudo hostnamectl set-hostname master

# host 添加一行 
sudo vim /etc/hosts
127.0.0.1 master
```

其他节点照着改名字即可


## 关闭swap

see [linux 关闭交换空间](./linux-close-swap.md)

### 关闭 SeLinux

```
setenforce 0
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config
```


### Master 额外执行下面命令

创建/etc/sysctl.d/k8s.conf文件，添加如下内容

```
sudo vim /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
```

执行命令使修改生效

```
sudo modprobe br_netfilter
sudo sysctl -p /etc/sysctl.d/k8s.conf
```

## 安装docker

```
sudo apt  install docker.io -y
```

## 安装 kubeadm, kubelet, kubectl

```
sudo apt-get update && sudo apt-get install -y apt-transport-https

sudo curl https://mirrors.aliyun.com/kubernetes/apt/doc/apt-key.gpg | sudo apt-key add -

sudo cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://mirrors.aliyun.com/kubernetes/apt/ kubernetes-xenial main
EOF

sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
```

## 准备镜像

这一步 可以说是最容易失败的步骤了, 简述一下原因:

1. kubeadm init 时要拉取 镜像仓库k8s.gcr.io下的镜像
2. 国内无法访问k8s.gcr.io
3. 为了kubeadm init能够正常执行, 我们要提前先准备好要pull的k8s.gcr.io下的镜像

通常，我们可以通过 [mirrorgooglecontainers](https://hub.docker.com/u/mirrorgooglecontainers) 来获取这些镜像  
然后使用 docker tag 命令把镜像名改成k8s.gcr.io下的镜像。我在网络上搜索到的主要解决方案也是这样。

```
# 拉取镜像
sudo docker pull mirrorgooglecontainers/kube-apiserver-amd64:v1.16.1
sudo docker pull mirrorgooglecontainers/kube-controller-manager-amd64:v1.16.1
sudo docker pull mirrorgooglecontainers/etcd-amd64:3.3.15-0
sudo docker pull mirrorgooglecontainers/kube-scheduler-amd64:v1.16.1
sudo docker pull mirrorgooglecontainers/kube-proxy-amd64:v1.16.1
sudo docker pull mirrorgooglecontainers/pause:3.1
sudo docker pull coredns/coredns:1.6.2

# 修改镜像名称
sudo docker tag mirrorgooglecontainers/kube-apiserver-amd64:v1.16.1 k8s.gcr.io/kube-apiserver:v1.16.1
sudo docker tag mirrorgooglecontainers/kube-controller-manager-amd64:v1.16.1 k8s.gcr.io/kube-controller-manager:v1.16.1
sudo docker tag mirrorgooglecontainers/kube-scheduler-amd64:v1.16.1 k8s.gcr.io/kube-scheduler:v1.16.1
sudo docker tag mirrorgooglecontainers/kube-proxy-amd64:v1.16.1 k8s.gcr.io/kube-proxy:v1.16.1
sudo docker tag mirrorgooglecontainers/etcd-amd64:3.3.15-0 k8s.gcr.io/etcd:3.3.15-0
sudo docker tag mirrorgooglecontainers/pause:3.1 k8s.gcr.io/pause:3.1
sudo docker tag coredns/coredns:1.6.2 k8s.gcr.io/coredns:1.6.2
```

## 初始化Master

```
sudo kubeadm init --pod-network-cidr=10.244.0.0/16
```

执行完成后就完成了Kubernetes Master的部署了, 最后还打印出加入Worker加入Master的命令, 需要找个地方记下来。

```
sudo kubeadm join 192.168.12.98:6443 --token tearz2.rvquwsv5gd7ds8tn \
    --discovery-token-ca-cert-hash sha256:dd0674653ecc31f204a8f81d0eb91a14664a005fb05a61f56532fd977f14c7a4 
```

如果不小心忘记了，可以执行

```
kubeadm token create --print-join-command --ttl 0
```

另外, kubeadm 还会提示我们第一次使用 Kubernetes 集群所需要的配置命令:

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

而需要这些配置命令的原因是: Kubernetes 集群默认需要加密方式访问。所以，这几条命令，就是将刚刚部署生成的 Kubernetes 集群的安全配置文件，保存到当前用户的.kube 目录下，
kubectl 默认会使用这个目录下的授权信息访问 Kubernetes 集群。

### 部署网络插件

```
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

查看pod状态

```
kubectl get pods -n kube-system
```

## 部署Worker节点

准备镜像完成后, 执行前面打印的 kubeadm join 命令即可

在master 执行

```
kubectl get nodes
```

可以看到节点情况，舒服~。

## 参考资料

- [使用 kubeadm 安装 kubernetes v1.16.0](https://www.cnblogs.com/chenzhenqi/p/10695959.html) eastonliu
- [国内环境安装k8s](https://www.cnblogs.com/eastonliu/p/11637929.html) chenzhenqi

Enjoy~
