# blzo-ex-usignin 用户登陆功能集成

## 说明

引入此包可以在blzo中直接实现用户登陆、鉴权等功能。

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-usignin
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-usignin', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-usignin -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-usignin</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

### 登陆

在身份验证通过后，生成登陆token
```java
@Autowired
TokenManager tokenManager;

String token = tokenManager.createToken(user.getId());
```

### 服务端接口鉴权

```java
@UserSignin
@Api("测试用户登陆")
@RequestMapping(value = "/test", method = RequestMethod.POST)
public ApiResponse apiTest(@CurrentUser Integer userId) {

    // 在controller方法上加上@UserSignin注解 表示使用该接口需要用户登录

    // 在方法参数中加入 @CurrentUser Integer userId ，以获取调用该接口的用户Id userId一定不会为空
    
    return ApiResponse.success();
}
```

```java
@UserMaybeSignin
@Api("测试用户可能登陆")
@RequestMapping(value = "/test2", method = RequestMethod.POST)
public ApiResponse apiTest(@CurrentUser Integer userId) {

    // 在controller方法上加上@UserMaybeSignin注解 表示使用该接口需要用户登录，也可以不登录

    // 在方法参数中加入 @CurrentUser Integer userId ，以获取调用该接口的用户Id userId可能为空
    
    return ApiResponse.success();
}
```

### 前端接口传递token

在header中增加token

```info
token = 'xxxxx'
```