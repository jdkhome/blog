# 分布式定时任务解决方案

## 背景

定时任务在各种业务下都有广泛的使用, 一般来说定时任务和业务服务关联紧密, 开发的时候把他们写在一起很方便。  
但是在分布式多节点的部署模式下, 执行同一个定时任务的应用可能会被部署多个实例。每个实例在同一个时间点都会执行相同的定时任务。这会造成资源的浪费，一些特殊业务重复执行甚至可能造成严重的错误(如结算业务)。  
本文基于微服务的架构, 进一步的探讨, 分布式定时任务的解决方案。

## 一些思路

### 1.抽离定时任务单独部署

最简单的方法, 做一个开关, 控制启动的应用是否要执行定时任务。然后将要执行定时任务的应用"特殊照顾"单独部署一份。既不影响业务系统, 也不用再担心重复执行。

这种方案要注意确保执行任务的实例不能挂, 或者挂了立即告警。

### 2.抽离定时任务调度服务

每个实例都有能力执行定时任务, 但是定时任务由外部的调度服务统一触发。

可以使用http请求作为定时任务的触发方法, 配合网关, 使资源的每一个请求只会到达某一个实例, 这样定时任务也能够实现"负载均衡"。

### 3.定时任务执行Flag

就像分布式锁的处理方法一样, 执行前先获取锁, 无法获取锁就说明任务正在由其他实例执行。此时定时任务就会有排他性, 即可保证唯一执行。

关联项目 [blzo-ex-task 分布式定时任务](/blzo-ex/blzo-ex-task.md) 基于这个理论实现的分布式定时任务框架。

## 一些轮子

(下面几个服务, 我都没有深度使用过, 如有写错, 请指正哈)

主要还是基于 2和3 现成就有许多可选的方案：

### Quartz 、 elastic-job

Quartz基于方案3, 但是更加完善, 处理保证唯一执行外, 还会更具执行结果(成功/失败)来控制是否重试。

Elastic-job 是由当当网基于quartz 二次开发之后的分布式调度解决方案, 在quartz的基础上进一步的增强了管理、分布式等功能。

### xxl-job

基于方案2, 实现了一个可视化的调度中心。

## 我的方案

个人认为, 使用调度中心来实现分布式定时任务比Flag的方案更加成熟。 但是同时, 使用xxl-job又觉得有些太重了。

结合项目的实际运行环境(k8s), 我整理出下面的实现方案:

实现一个定时任务触发器(比较简单就不贴代码了):

```sh
./task -url 请求地址 -token 钉钉机器人token
```

- 向指定地址发POST请求
- 根据项目的返回数据判断定时任务十分执行成功
- 顺利执行程序返回系统调用code 0 失败返回 1

然后打到docker做成镜像

接下来将想要控制触发的定时任务，以CronJob的方式部署至k8s集群中:

xxx-task-cronjob.yaml

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: xxx-task-cronjob
spec:
  schedule: "0 * * * *" # corn表达式设置执行
  successfulJobsHistoryLimit: 0 # 不保留成功历史
  failedJobsHistoryLimit: 0 # 不保留失败历史
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: xxx-task-cronjob
            image: task:latest
            command: 
            - "./task"
            args:
            - "-url"
            - "http://xxxx-service:xxxx/api/xxxx" # 指定定时任务触发地址
            - "-token"
            - "xxxxxxxxxxxxxxxxxxxxx" # 出现异常钉钉告警, 这里填钉钉群token
          restartPolicy: OnFailure # 异常退出则重试
```

如此一来, 一个高可靠性的轻量的定时任务调度器就完成了！

## 参考文档

- [分布式定时任务调度框架](https://www.jianshu.com/p/ab438d944669) 偶像本人
- [【解决方案】分布式定时任务解决方案](https://www.cnblogs.com/fonxian/p/10858101.html) CoffeJoy
- [CronJob介绍](https://kubernetes.io/zh/docs/concepts/workloads/controllers/cron-jobs/) kubernetes.io