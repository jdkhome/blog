---
sidebar: auto
---

# linux 关闭交换空间


## 取消当前所有的swap
```
# 停掉所有交换空间
sudo swapoff -a
# 查看所有的交换空间 如果没有任何输出则说明关成功了
sudo swapon -s
# 查看内存
free -h
```

## 修改配置文件

修改/etc/fstab，注释掉对应的swap行