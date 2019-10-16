# Kubernetes 部署 ELK 日志收集

## 镜像准备

我是很中意 [sebp/elk](https://hub.docker.com/r/sebp/elk) 这个镜像的  
但是[官方文档](https://elk-docker.readthedocs.io/#disabling-ssl-tls)中表示ssl是默认开启的.  
在局域网中使用ssl会有很多限制. 所以这里基于 sebp/elk 改一点点

02-beats-input.conf

```conf
input {
  beats {
    port => 5044
  }
}
```

Dockerfile

```Dockerfile
FROM sebp/elk:680
COPY ./02-beats-input.conf /etc/logstash/conf.d/02-beats-input.conf
```

## 创建Pod
elk-deployment.yaml 

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
     containers:
     - name: elk
       image: jdkhome/elk:0.0.1
       tty: true
       ports: 
       - containerPort: 5601
       - containerPort: 5044
       - containerPort: 9200
```

如上所示，暴露了2个端口

- kibana的5601
- logstash的5044

接下来执行create命令创建Pod

```
kubectl create -f elk-deployment.yaml
```

可以使用get命令获取pod情况

```
ubuntu@master:~/my-study-data/elk$ kubectl get pod
NAME                                READY   STATUS    RESTARTS   AGE
elk-deployment-788969848c-84j6q     1/1     Running   2          5m22s
```

## 部署Service

elk-kibana-service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: elk-kibana-service
spec:
  type: NodePort
  ports:
       - port: 5601
         nodePort: 30001
  selector:
    app: elk
```

将kibana的5601端口以NodePort的方式对外暴露，这样外部就可以通过节点IP地址来访问kibana服务了，创建部署脚本elk-kibana-service.yaml，kibana的服务通过node节点的30001端口对外暴露

elk-elastic-service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: elk-elastic-service
spec:
  type: ClusterIP
  ports:
       - port: 9200
         targetPort: 9200
  selector:
    app: elk
```

将elasticsearch的9200端口以ClusterIP的方式对外暴露，方便集群服务维护日志(比如查询、清理等)

elk-logstash-service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: elk-logstash-service
spec:
  type: ClusterIP
  ports:
       - port: 5044
         targetPort: 5044
  selector:
    app: elk
```

将logstash的5044端口以ClusterIP的方式对外暴露，这样其他pod的filebeat就可以通过服务名加5044端口来访问logstash服务了，创建部署脚本elk-logstash-service.yaml，logstash的服务通过5044端口对K8S内部的pod暴露

发布服务

```
kubectl create -f elk-kibana-service.yaml
kubectl create -f elk-elastic-service.yaml
kubectl create -f elk-logstash-service.yaml
```

打开浏览器, 输入任意节点ip:30001, 即可访问到Kibana服务.

## 参考文档

- [Docker下ELK三部曲之三：K8S上的ELK和应用日志上报](https://blog.csdn.net/boling_cavalry/article/details/80141800) 程序员欣宸
- [elk-docker](https://elk-docker.readthedocs.io/#disabling-ssl-tls) readthedocs.io