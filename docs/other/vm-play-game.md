---
sidebar: auto
---

# 解决VM虚拟机玩游戏被检测

我使用WMward Workstation安装虚拟机，然后启动游戏的时候被提示不能在虚拟机中进行游戏。

经过一番搜索，是有一些方法可以避开这些检测的，缺点就是会牺牲一些性能。

## 方法一
记事本打开 VMX 文件  类似  Windows * .vmx，在文本末尾加入一行
```
monitor_control.restrict_backdoor = "TRUE"
```
保存文件
现在启动虚拟机  就不会被Themida检测到了

## 方法二

如果方法一还被检测可以再加入一行
```
disable_acceleration = "TRUE"
```
这样处理以后 有个后遗症 就是 VMTools 无法加载了

## 方法三

打开注册表路径:
```
HKEY_LOCAL_MACHINE/SYSTEM/CurrentControlSet/Control/Class/{4D36E968-E325-11CE-BFC1-08002BE10318}/0000
```
删除你在DriverDesc子项目下看到的值，比如我装的Win7，是"VMWare SVGA 3D"，直接删掉  
一般就可以运行了
