# blzo-ex-google-auth google身份认证集成

> 引入此包可以在blzo中直接获得google身份认证能力。

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-google-auth
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-google-auth', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-google-auth -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-google-auth</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

### 生成secret和二维码

```java
// 注意这里的参数只能是数字/英文
GoogleAuthBean bean = GoogleAuth.generator("用户标识");
```

### 验证google验证码

```java
Boolean result = GoogleAuth.validCode("secret", "code");
```