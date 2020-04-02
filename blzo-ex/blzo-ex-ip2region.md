# blzo-ex-ip2region 根据ip获取对应城市

封装了 由狮子的魂开发的[ip2region](https://gitee.com/lionsoul/ip2region)

在blzo中引入即可直接获得 ip定位城市的能力

## 引入

gradle
```groovy
// https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-ip2region
compile group: 'com.jdkhome.blzo', name: 'blzo-ex-ip2region', version: 0.3.0.1.RELEASE
```

maven
```xml
<!-- https://mvnrepository.com/artifact/com.jdkhome.blzo/blzo-ex-ip2region -->
<dependency>
    <groupId>com.jdkhome.blzo</groupId>
    <artifactId>blzo-ex-ip2region</artifactId>
    <version>0.3.0.1.RELEASE</version>
</dependency>
```

## 使用

```java
String city = IpRegionTools.getCity(IpTools.getIp(request));
```