# 部署nginx服务

这是Hello World级别的教程笔记, 大神勿喷..

## 部署Pod

nginx-deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
```

默认部署在default namespace

```
kubectl apply -f nginx-deployment.yaml
```

查看deployment

```
kubectl get deployment
```

查看部署的pod

```
kubectl get pod
```

## 部署service

nginx-service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
  labels:
    app: nginx
spec:
  ports:
  - port: 12580
    targetPort: 80
  selector:
    app: nginx
  type: NodePort
```

发布服务

```
kubectl create -f nginx-service.yaml
```

查看已发布的服务

```
ubuntu@master:~$ kubectl get svc
NAME            TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)           AGE
kubernetes      ClusterIP   10.96.0.1       <none>        443/TCP           3h22m
nginx-service   NodePort    10.111.51.126   <none>        12580:30297/TCP   7m19s
```

可以看到外部端口为30297


