# BLZO管理后台权限管理使用文档

> BLZO脚手架自带管理后台集成了**blzo-ex-authj**权限框架。  
> 本文主要讲解在BLZO自带管理后台中，用户如何进行权限管理。

## 功能简述

- 可以自由的创建管理员账户
- 有权限的管理员可以为没权限的管理员设置权限
- 每个管理员都可以自由的定制自己的菜单


## 概念

### 用户(管理员)

用户是指所有能够登陆管理后台的人，建议为每个使用管理后台的人创建并分配一个独立的账户。  

其中 用户id=0 的管理员为系统的超级管理员。

### 权限实体

权限实体(也简称"权限")代表了具体的功能点，可以是某一个页面(如:商品列表页)，也可以是某一个按钮/功能(如:添加商品)。  
权限实体不需要用户自己配置，BLZO管理后台会自动根据开发人员实现的功能，为用户列出系统现有的权限。  

在"我的权限"页面 ，"我继承的权限"选项卡，能够看到当前登录的管理员账户有权使用的所有权限。  
> 特殊的: 超级管理员拥有系统的所有权限。

权限实体还可以设置"菜单"属性，这是由开发人员进行设置的，如果希望某个页面能够出现在菜单中，开发人员可以为这个页面的权限设置"菜单"属性。  
用户使用自己拥有的带有"菜单"属性的权限为自己自由定制菜单。

### 权限组

管理员可以创建权限组，可以将自己拥有的权限赋予权限组，可以将其他管理员添加到自己创建的权限组。

BLZO管理后台中的权限传递，就是通过权限组实现的。

### 菜单

即管理后台左侧的功能列表，BLZO管理后台目前支持2级菜单，第一级称为"菜单组"，展开后的第二级称为"菜单项"。

每个用户都可以自由定制自己的菜单，但是能够将哪些内容显示到菜单里面，这取决于该用户拥有的有"菜单"属性的权限。

## 操作引导

### 传递权限

超级管理员拥有系统的所有权限，而其他新创建的管理员初始是没有任何权限的。  
通过权限组功能，可以将自己拥有的权限传递赋予给其他管理员。

在"我的权限"页面，"我的权限组"选项卡，能够看到并管理当前登录的管理员账户创建的所有权限组。  
权限组的管理主要在 "授权" 和 "成员管理" 两个方面。

#### 授权

可以把自己拥有的权限授权给自己的权限组。也可以取消授权。  
含有"菜单"属性的权限实体，权限名称前会有"[菜单]"标记。

#### 成员管理

可以将其他管理员添加到自己创建的权限组里，权限组中的管理员会获得权限组中被授权的权限。

> 注: "创建权限组" 也是一个权限实体，所以如果你希望某个账户能够传递自己的权限，需要先为其赋予"创建权限组"的权限！

#### 有效权限

传递出去的权限也可以随时收回(无论传递了多少级！)

如果你把某个权限通过权限组传递给了其他用户，但是一段时间后你失去了这个权限(传递给你这个权限的人收回了这个权限)，那么你传递出去的该权限也会失效。  
如果其他用户在权限失效前也传递了这个权限，那么一样会失效，因为这些权限最终是由你赋予的。

> 通过blzo-authj的权限传递机制，你可以很方便的实现以下场景:  
> 我是一个小组组长，我希望把我拥有的权限赋予给我的下级，并随时收回。

### 修改菜单

在"我的菜单"页面，你可以轻松的对自己拥有的菜单进行编排:

- 选中一个菜单组，然后点击绿色的菜单按钮即可为菜单组增加菜单
- 点击红色的菜单按钮，可以将菜单移除出菜单组
- 你可以新增菜单组或者删除菜单组
- 拖动菜单组可以改变菜单组的顺序，拖动红色的菜单按钮可以改变菜单的顺序

修改菜单后需要点击保存按钮，并重新登陆。

如果某个菜单，你没有把它放进任何一个菜单组中，那么该菜单将会出现在"未分组"里。

点击"初始化"按钮，将会更具你继承权限的结构，自动生成菜单配置。

> 注: 超级管理员的权限不是继承而来，所以如果超级管理员没有加入权限组，那么点击初始化也无法自动生成所有菜单配置。


### 账户安全

BLZO管理后台实现了Google身份验证功能，可以从管理后台的主页进入引导设置。


## *组织

权限组带来了"功能权限"的DIY能力，而组织则是针对"数据权限"而提供的一套解决方案。

并不是每一个系统都会用到"组织"的功能，下面先列举一个场景(只是举例子，并不代表真实情况就是这样):

中国电信在深圳和武汉两个地区都有宽带业务，而这两个地区的运营人员使用的是同一个管理后台系统。  
在中国电信的管理后台系统中，有一个"宽带报装订单列表页"这样一个页面。负责报装管理的运营账户拥有这个页面的权限。  
但是我们希望，深圳地区的运营，只能够看到深圳地区的报装订单，武汉地区的运营，只能够看到武汉地区的报装订单。  

此时前面描述的"功能权限"就已经无法满足这样的需求了。

### 组织的功能点

系统默认会有一个"总组织"，属于总组织的管理员可以管理其他的组织。

超级管理员账户就数据"总组织"，并且不可更换到其他组织。

目前你可以使用总组织的账户在"组织列表页"过为你的系统创建多个组织，每一个组织对应一个独立的运营主体。

总组织的账户在创建管理员时会有一个组织的选择，你也可以在管理员创建之后再去更改其所在的组织。

不同组织的管理员，是互相隔离的，他们互相不可见，并且创建管理员时也只能创建自己组织的管理员。

基于这个规则，业务功能开发人员为数据绑定组织属性，即可在组织上实现"数据权限"。