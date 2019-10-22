# linux添加磁盘和挂载

## 添加磁盘

确保先执行了你计划的操作，例如：

- 插入U盘、移动硬盘、插入SD卡
- 添加了固态、机械硬盘
- 云服务挂载(有些叫连接)云硬盘

视机器环境不同，有些可能需要重启，使用fdisk -l能够看到新加的磁盘信息就OK

```sh
sudo fdisk -l
### 省略... 

Disk /dev/xvdf: 500 GiB, 536870912000 bytes, 1048576000 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x2a29dea3

### 省略... 
```

根据你的需求，看是要读取这个磁盘的数据还是直接做为一块新硬盘加入到服务器。


## 初始化磁盘

> 如果你只是想读取该磁盘或是这个磁盘已经完成了初始化，请跳过此节

### 分区

```
sudo fdisk /dev/xvdf
```

一路回车最后按w保存即可

### 格式化

快速格式化

```
sudo mkfs.ext4 /dev/xvdf1
```

## 挂载

```
sudo mount /dev/xvdf1 /data/
```

附卸载命令:

```
sudo umount  /data/
```

## 设置开机自动mount

### 查看磁盘UUID

```sh
sudo blkid

# 省略....
/dev/xvdf1: UUID="b0c53b5e-cebe-4502-b82c-1f94cef21c68" TYPE="ext4" PARTUUID="2a29dea3-01"
# 省略....
```

### 修改fstab

按下面格式添加一行

```
sudo vim /etc/fstab

UUID=b0c53b5e-cebe-4502-b82c-1f94cef21c68 /data ext4 defaults  1  1
```