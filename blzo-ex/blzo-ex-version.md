# blzo-ex-version 接口版本控制

引入此包可以直接在blzo中实现版本控制。

我们在迭代过程中，经常会有同一个接口，不同版本响应内容不同的情况，此时可以使用blzo-ex-version来实现接口版本控制

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-version
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-version', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-version -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-version</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

### 服务端版本控制

```java
@MinVersion(value = "1.5.0", max = "2.0.0") // 版本控制
@Api("测试用接口") // 日志
@RequestMapping(value = "/aaa", method = RequestMethod.POST)
public ApiResponse apiTestAaa(@Version String version) {

    // 加上 @MinVersion 注解 即可实现版本控制

    // 参数中加入 @Version String version 即可获取当前请求的版本号 ，你可以根据不同的版本号来做不同的处理

    return ApiResponse.success();
}
```

### 客户端请求时加入版本号

在header中增加version

```info
version = '1.6.2'
```