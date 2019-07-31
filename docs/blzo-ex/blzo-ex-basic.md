# blzo-ex-basic blzo基础包


## 说明

这是blzo脚手架基础包，它定义了：

- 接口日志
- 异常枚举
- 请求响应体
- json处理器
- 异常处理器

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-basic
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-basic', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-basic -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-basic</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

### 打印请求日志
```java
@RestController
@RequestMapping("/api")
public class TestController {

    @Api("测试接口") // 日志
    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public ApiResponse apiTest() {
        return ApiResponse.success("asdasdas");
    }

}
```

### 异常处理

定义异常枚举
```java
@Getter
public enum ResponseError implements BaseError {

    XXXXX_ERROR(66666, "XXXXX业务异常");

    Integer code;
    String msg;

    ResponseError(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

}
```

在任何地方抛出异常

```java
throw new ServiceException(ResponseError.XXXXX_ERROR);
```

响应结果

```json
{
    "code": 66666,
    "msg": "XXXXX业务异常",
    "data": null,
    "debug": null
}
```
