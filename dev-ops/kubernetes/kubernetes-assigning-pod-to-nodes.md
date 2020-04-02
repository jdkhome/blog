# 分配pod到指定的节点

## 为工作节点设置标签

```sh
# 查看所有node
ubuntu@master:~$ kubectl get nodes
NAME      STATUS     ROLES    AGE     VERSION
master    Ready      master   6m57s   v1.17.0
workelk   NotReady   <none>   6s      v1.17.0

# 查看node的标签
ubuntu@master:~$ kubectl get nodes --show-labels
NAME      STATUS   ROLES    AGE   VERSION   LABELS
master    Ready    master   18m   v1.17.0   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=master,kubernetes.io/os=linux,node-role.kubernetes.io/master=
workelk   Ready    <none>   11m   v1.17.0   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=workelk,kubernetes.io/os=linux

# 为某个node设置标签
ubuntu@master:~$ kubectl label node workelk type=elk
node/workelk labeled

# 再次查看 标签已经加上了
ubuntu@master:~$ kubectl get nodes --show-labels
NAME      STATUS   ROLES    AGE   VERSION   LABELS
master    Ready    master   19m   v1.17.0   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=master,kubernetes.io/os=linux,node-role.kubernetes.io/master=
workelk   Ready    <none>   12m   v1.17.0   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=workelk,kubernetes.io/os=linux,type=elk
```

## 部署配置设置标签选择器

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elk-deployment
  labels:
    app: elk
spec:
  replicas: 1
  selector:
    matchLabels:
      app: elk
  template:
    metadata:
     labels:
       app: elk
    spec:
     nodeSelector:
      type: elk
     containers:
     - name: elk
       image: jdkhome/elk:0.0.1
       tty: true
       ports: 
       - containerPort: 5601
       - containerPort: 5044
       - containerPort: 9200
```


## 参考文档

- [Kubernetes 分派 Pod 到指定節點](https://tachingchen.com/tw/blog/kubernetes-assigning-pod-to-nodes/)
- [【Kubernetes】Pod调度到指定Node](https://blog.csdn.net/u013201439/article/details/79436465)