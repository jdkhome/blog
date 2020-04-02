# Filebeat 使用 Node 方式收集k8s集群日志

> 关联文章 [Kubernetes 部署 ELK 日志收集](./deploy-elk.md)

## 思路简述

容器的日志在每台Node的 **/var/log/containers** 目录

我们可以使用**DaemonSet**的方式, 在每台机器上都部署一个Filebeat容器, 统一收集这些日志.   
既不侵入项目, 占用资源还少.

## 镜像准备

see [bringg/filebeat-kubernetes](https://hub.docker.com/r/bringg/filebeat-kubernetes)

## DaemonSet配置

filebeat-daemonset.yaml

```yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: pods-logger
spec:
  selector:
    matchLabels:
      name: pods-logger
  template:
    metadata:
      labels:
        name: pods-logger
    spec:
      containers:
      - name: filebeat
        image: bringg/filebeat-kubernetes
        imagePullPolicy: Always
        env:
        - name: LOGSTASH_HOSTS
          value: elk-logstash-service:5044
        - name: LOG_LEVEL
          value: info
        - name: FILEBEAT_HOST
          valueFrom:
              fieldRef:
                fieldPath: spec.nodeName

        resources:
          limits:
            cpu: 100m
            memory: 256Mi

        volumeMounts:
        - name: var-log-containers
          mountPath: /var/log/containers

        - name: var-log-pods
          mountPath: /var/log/pods
          readOnly: true

        - name: var-lib-docker-containers
          mountPath: /var/lib/docker/containers
          readOnly: true

      volumes:
      - name: var-log-containers
        hostPath: { path: /var/log/containers }

      - name: var-log-pods
        hostPath: { path: /var/log/pods }

      - name: var-lib-docker-containers
        hostPath: { path: /var/lib/docker/containers }
```

## 参考文档

- [kubernetes-node方式日志收集(filebeat->kafka)](https://blog.csdn.net/kozazyh/article/details/80574585) 大飞哥2