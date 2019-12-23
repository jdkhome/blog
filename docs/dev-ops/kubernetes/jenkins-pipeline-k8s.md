# jenkins pipeline 自动构建并部署至k8s

**目标**: 通过jenkins-pipeline 将git仓库中的 java-gradle项目 自动构建并打成docker 镜像推送至 harbor 仓库 然后在k8s集群中发布

> 示例项目: [blzo-microservice-k8s](https://gitee.com/jdkhome/blzo/tree/master/start/blzo-microservice-k8s)

## 前置准备

- 搭建k8s 集群 
- 搭建jenkins , 安装 Git、Pipeline、Gradle 插件
- 搭建harbor

记得要在集群中先建好namespace

```sh
kubectl create namespace xxxx
```

## 配置jenkins基本凭证

### 配置harbor账号与密码

进入到: Jenkins > 凭据 > 系统 > 全局凭据(unrestricted) > Add Credentials

```
Kind: Username with password
    Scope: 全局
    Username: xxx(harbor账号)
    Password: xxx(harbor密码)
    ID: jenkins-harbor-creds
    Description: 
```

### 配置k8s的kube.config配置信息

登陆到k8s集群的master机器

kubeconfig的配置文件是 ```~/.kube/config```

将该文件用base64编码

```sh
cd ~/.kube/
base64 config > config-base64.txt
```

进入到: Jenkins > 凭据 > 系统 > 全局凭据(unrestricted) > Add Credentials

```
Kind: Secret text
    Scope: 全局
    Secret: xxxxx(config-base64.txt中的内容)
    ID: jenkins-k8s-config
    Description: 
```

## Jenkinsfile

项目中为要部署的模块编写Jenkinsfile 可以参考我的模版，只需要在parameters中配置相关信息即可

```Jenkinsfile
pipeline {
    agent any
    environment {
        HARBOR_CREDS = credentials('jenkins-harbor-creds')
        K8S_CONFIG = credentials('jenkins-k8s-config')
    }
    parameters {
        string(name: 'K8S_NAMESPACE', defaultValue: 'blzo-microservice-k8s', description: 'k8s的namespace名称')
        string(name: 'REGISTRY_URL', defaultValue: 'xxxxxx', description: '仓库地址')
        string(name: 'PROJECT_NAME', defaultValue: 'blzo-microservice-k8s', description: '项目名称')
        string(name: 'APP_NAME', defaultValue: 'app-user', description: '应用名称')
        string(name: 'SERVER_PORT', defaultValue: '8002', description: '服务端口号')
        string(name: 'NODE_PORT', defaultValue: '31002', description: '开发环境nodeport')
        string(name: 'CONFIG_ENV', defaultValue: 'dev', description: '配置文件环境')
        // 开发环境部署 除了deployment 和 clusterip 之外 还需额外 起一个 nodeport 方便本地环境调用 , 部署测试环境时使用 deployment 即可
        string(name: 'YAML_FILE', defaultValue: 'deployment-with-nodeport', description: 'YAML 文件名')
    }
    stages {
        stage('Gradle Build') {
            agent any
            steps {
                sh "${tool 'gradle5.5'}/bin/gradle ${params.APP_NAME}:bootJar"
            }
            // 也可以用下面的方式
            // agent { docker 'gradle:5.4.1-jdk11' }
            // steps {
            //     sh "gradle ${params.APP_NAME}:bootJar"
            // }
        }
        stage('Docker Build') {
            agent any
            steps {
                sh "docker login -u ${HARBOR_CREDS_USR} -p ${HARBOR_CREDS_PSW} ${params.REGISTRY_URL}"
                sh "docker build -t ${params.REGISTRY_URL}/${params.PROJECT_NAME}/${params.APP_NAME}:build.${env.BUILD_ID} ./${params.APP_NAME}"
                sh "docker push ${params.REGISTRY_URL}/${params.PROJECT_NAME}/${params.APP_NAME}:build.${env.BUILD_ID}"
            }
        }
        stage('K8S Deploy') {
            agent { docker 'lwolf/helm-kubectl-docker' }
            steps {
                sh "mkdir -p ~/.kube"
                sh "echo ${K8S_CONFIG} | base64 -d > ~/.kube/config"
                sh "sed -e 's#{PROJECT_NAME}#${params.PROJECT_NAME}#g;s#{APP_NAME}#${params.APP_NAME}#g;s#{SERVER_PORT}#${params.SERVER_PORT}#g;s#{REGISTRY_URL}#${params.REGISTRY_URL}#g;s#{IMAGE_TAG}#build.${env.BUILD_ID}#g;s#{CONFIG_ENV}#${params.CONFIG_ENV}#g;s#{NODE_PORT}#${params.NODE_PORT}#g' k8s-yaml/${params.YAML_FILE}.tpl > deployment.yml"
                sh "kubectl apply -f deployment.yml --namespace=${params.K8S_NAMESPACE}"
            }
        }
    }
}
```

## Dockerfile

为要部署的模块编写Dockerfile, 这里是一个简单的java web 程序

```Dockerfile
FROM openjdk:11
MAINTAINER main@jdkhome.com

# 拷贝可执行程序
COPY build/libs /var/app

# 端口
EXPOSE 8002

CMD ["java", "-jar", "-Dfile.encoding=UTF8", "-Duser.timezone=GMT+08", "-Dfastjson.parser.autoTypeSupport=true", "/var/app/app-user.jar"]
```

## deployment.yaml 配置

一般来说，部署分布式项目的一个微服务 需要在集群内启动 Deployment 和对应的 Service(ClusterIp)   
但是为了开发时方便 本地机器访问集群内的服务，所以开发环境还需要额外起一个 Service(NodePort)   
这里给出两个模版请根据实际情况使用  

### deployment.tpl

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: {PROJECT_NAME}-{APP_NAME}-service
spec:
  type: ClusterIP
  ports:
    - port: {SERVER_PORT}
      targetPort: {SERVER_PORT}
  selector:
    app: {PROJECT_NAME}-{APP_NAME}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {PROJECT_NAME}-{APP_NAME}-deployment
  labels:
    app: {PROJECT_NAME}-{APP_NAME}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {PROJECT_NAME}-{APP_NAME}
  template:
    metadata:
      labels:
        app: {PROJECT_NAME}-{APP_NAME}
    spec:
      containers:
        - name: {PROJECT_NAME}-{APP_NAME}
          image: {REGISTRY_URL}/{PROJECT_NAME}/{APP_NAME}:{IMAGE_TAG}
          ports:
            - containerPort: {SERVER_PORT}
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: {CONFIG_ENV}
            - name: SEATA_CONFIG_ENV
              value: {CONFIG_ENV}
```

### deployment-with-nodeport.tpl

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: {PROJECT_NAME}-{APP_NAME}-nodeport
spec:
  type: NodePort
  ports:
    - port: {SERVER_PORT}
      nodePort: {NODE_PORT}
  selector:
    app: {PROJECT_NAME}-{APP_NAME}
---
apiVersion: v1
kind: Service
metadata:
  name: {PROJECT_NAME}-{APP_NAME}-service
spec:
  type: ClusterIP
  ports:
    - port: {SERVER_PORT}
      targetPort: {SERVER_PORT}
  selector:
    app: {PROJECT_NAME}-{APP_NAME}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {PROJECT_NAME}-{APP_NAME}-deployment
  labels:
    app: {PROJECT_NAME}-{APP_NAME}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {PROJECT_NAME}-{APP_NAME}
  template:
    metadata:
      labels:
        app: {PROJECT_NAME}-{APP_NAME}
    spec:
      containers:
        - name: {PROJECT_NAME}-{APP_NAME}
          image: {REGISTRY_URL}/{PROJECT_NAME}/{APP_NAME}:{IMAGE_TAG}
          ports:
            - containerPort: {SERVER_PORT}
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: {CONFIG_ENV}
            - name: SEATA_CONFIG_ENV
              value: {CONFIG_ENV}
```



## 参考文档

- [采用jenkins pipeline实现自动构建并部署至k8s](https://www.jianshu.com/p/2d89fd1b4403) tinylk


