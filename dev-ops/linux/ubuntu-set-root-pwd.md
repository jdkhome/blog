---
sidebar: auto
---

# ubuntu设置root密码

```sh
ubuntu@ubuntu:~$ sudo passwd
[sudo] password for ubuntu: 
Enter new UNIX password: 
Retype new UNIX password: 
passwd: password updated successfully
```

之后就可以用su 来切换到root用户了

```sh
su root
```