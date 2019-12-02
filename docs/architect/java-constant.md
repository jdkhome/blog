---
sidebar: auto
---

# java 常量之哲学

在java里 我们常用有2种方式定义常量
- Class 
- Interface

## Class 常量类

```java
//final修饰符
public final class Constants {
    //私有构造方法
    private Constants() {}

    public static final int ConstantA = 100;
    public static final int ConstantB = 100;
    ......
}
```

## Interface 常量接口

```java
public interface Constants {
    int ConstantA = 100;
    int ConstantB = 100;
    ......
}
```
## 用哪个呢

首先我们使用常量的原因是为了杜绝魔法变量，我们将常用值放到常量类(或者接口)中统一管理，当某一天我们希望改变这个值时，能够一改都改(而不是东改一下西改一下，牵一发而动全身)。

那么另一个场景是，你的程序已经部署，正在运行，此时你希望修改某个常量。  
通常来说你可以使用**热部署的方式**，直接把常量类(或者接口)编译成class，然后替换运行中程序的这个class文件。

此时就提现出了常量类 和 常量接口的区别

常量类使用热部署是完全OK的，但是常量接口却不是，某个类通过常量接口引入了常量时，该类被编译时，这个常量会直接写死到class中。

所以，如果你使用常量接口，又希望热部署的话，你需要把所有使用了该常量类的类全部重新编译并替换才可以。

搞清楚了区别，下面说说我的想法。

直接无脑使用常量类，当然是最稳的方案。但是架不住我喜欢常量接口的简洁啊。  
其次，现在都是分布式的程序，在容器中运行，虽然也存在分布式热部署的运维工具，但是如果预先知道这种场景(配置有可能会调整)，我会使用配置中心来管理这些配置(比如consul、阿波罗等)。  
实在万不得已要发版解决，也可以使用灰度的方式保证用户的服务。
在**这样的条件下**，我选常量接口。

## 参考链接

[Java Interface 是常量存放的最佳地点吗？](https://www.ibm.com/developerworks/cn/java/l-java-interface/index.html)	bright