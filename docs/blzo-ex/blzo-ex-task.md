# blzo-ex-task 分布式定时任务

> 注意: 只是基于理论开发了这个包，但是还没有正式使用过。

引入此包可以直接在blzo中实现 基于分布式锁实现的分布式定时任务。

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-task
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-task', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-task -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-task</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

```java
@Scheduled(fixedDelay = 1000L)
private void task() {
    // 任务名称="task" 执行间隔=1s
    TimingTaskActuator.create("task", 1).exec(() -> {
        // 这里执行你的代码
    });
}
```

## todo

后续会尝试用注解的方式实现

