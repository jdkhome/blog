# blzo-ex-redission 分布式锁集成

> 引入此包可以在blzo中直接获得基于redission实现的分布式锁。

目前实现了 公平锁 和 联锁。

blzo-ex-redission 跟随项目的redis 配置，所以只要你的项目里有使用redis，那么就可以直接用。

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-redission
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-redission', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-redission -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-redission</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

### 公平锁
```java
FairLockActuator.create("key").exec(() -> {
    // 这里执行你的代码
});
```

### 联锁
```java
MultiLockActuator.create(List.of("key1","key2")).exec(() -> {
    // 这里执行你的代码
});
```