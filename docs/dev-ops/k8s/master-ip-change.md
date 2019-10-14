# k8s 修改Master的Ip

## 前言

昨天本地机器停电, 重启之后, 发现Master节点对应的机器ip变了   

目前找到了重置的办法, 原先的服务还需要重新启一遍, 如何实现只改IP配置 保留原有服务, 还需要继续研究研究

## 解决过程

在Master上执行

```
sudo kubeadm reset
sudo kubeadm init
```

这样就可以重新生成新的join命令

```
sudo kubeadm join 192.168.12.78:6443 --token pqi2ud.mhpaxlp4l7i0dbu8 \
--discovery-token-ca-cert-hash sha256:17115c0c6e62a5ce4e13fb859e2b25b277815f6064cdc3c88a21f04b99588ea2   
```

接下来按照提示执行

```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

记住还要重装网络插件

```
kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

其他Worker节点执行

```
sudo kubeadm reset
```

然后重新加入即可

## 参考资料

- [kubernetes安装过程中错误（kube-dns 状态一直是Pending，master节点是NotReady）](https://blog.csdn.net/u013355826/article/details/82786649) 谦190
- [kubernetes 更换master ip](http://www.linuxqq.com/archives/1803.html) 小Q