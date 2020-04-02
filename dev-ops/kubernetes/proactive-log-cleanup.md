# 主动清理日志

我们部署了ELK来收集K8S所有Node的日志, 现在还需要一些措施, 让我们的集群更具自维护性。

## 无状态服务的思路

通过各种配置, 使服务的日志输出到控制台, 而不是日志文件; 无需向docker阶段一样, 将日志挂载至宿主机, 所有日志统一由filebeat从容器控制台输出收集.

## 自动清理ELK收集到的日志

其实也可以更细致的设置 保留几天之类的

> CronJob 详细介绍 https://kubernetes.io/zh/docs/concepts/workloads/controllers/cron-jobs/

elk-clean.yaml

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: elk-clean
spec:
  schedule: "0 12 * * 2" # 设置每周二 中午12点执行
  successfulJobsHistoryLimit: 0
  failedJobsHistoryLimit: 0
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: elk-clean
            image: curlimages/curl:7.66.0
            args:
            - "-XDELETE"
            - "http://elk-elastic-service:9200/filebeat-*"
          restartPolicy: OnFailure
```

启动定时任务

```
kubectl create -f elk-clean.yaml
```

## 自动清理Node的日志

结合 [清理docker占用的磁盘空间](/dev-ops/clean-docker-disk.md)

在每个Node部署自动清理的定时任务:

```sh
ubuntu@worker2:/data$ sudo crontab -l
# 每天1点30清理
30 1 * * * sh /data/clean-all.sh
```

clean-all.sh **记得赋予执行权限**

```sh
#!/bin/sh  

for log in $(find /var/lib/docker/containers/ -name *-json.log)
        do  
                echo "clean logs : $log"  
                cat /dev/null > $log  
        done  

for log in $(find /var/log/containers -name *-json.log)
        do  
                echo "clean logs : $log"  
                cat /dev/null > $log  
        done  

for log in $(find /var/log/pods -name *-json.log) 
        do  
                echo "clean logs : $log"  
                cat /dev/null > $log  
        done  
```

