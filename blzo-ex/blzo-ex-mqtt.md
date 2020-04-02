# blzo-ex-mqtt EMQ推送服务集成

引入此包可在blzo中直接集成基于EMQ服务器的MQTT推送功能。

目前只实现了服务端推送消息到EMQ服务器的功能，更多使用方法有待扩展。

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-mqtt
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-mqtt', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-mqtt -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-mqtt</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

### 配置文件

```yml
mqtt:
  #  emq 服务地址
  host: tcp://192.168.1.244:1883
  #  emq 用户名
  username: admin
  #   emq 密码
  password: public
  #   客户端标识
  clientId: ${spring.cloud.consul.discovery.instanceId}
  # post url
  publish_url: http://192.168.1.244:8080/api/v3/mqtt/publish
  app_id: 536c0891820c
  app_key: Mjg4Mjc0NTc5MDM5ODMzMDM5NDk0NjY1NzI3MjY2NjUyMTG
```

### 使用

```java
@Autowired
MqttService mqttService;


// 基于tcp的推送
mqttService.send("topic","message");

// 基于http的推送
mqttService.httpSend("topic","message");

```