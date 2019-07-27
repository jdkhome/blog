# BLZO管理后台开发指南

本文旨在帮助开发者:
- 理解blzo-ex-authj权限框架的原理
- 基于BLZO脚手架自带管理后台对业务功能进行开发
- 基于blzo-ex-authj开发自己的管理后台(如果你不愿意使用BLZO自带的后台的话..)

## blzo-ex-authj 原理

### 权限管理的现状

提到权限管理，其实市面上以及有相当多的权限框架了，比如：shiro 、 spring security 等等。

而提到拥有权限管理的管理后台脚手架，这就更加多了，[在码云上搜索脚手架](https://gitee.com/search?utf8=%E2%9C%93&q=%E8%84%9A%E6%89%8B%E6%9E%B6)，基本上都有这些功能。

但在这个什么都有的年代，我最终还是又造了一遍轮子，站在巨人的肩膀上，我希望这个轮子能够更进一步的减少开发者与使用者的工作。

#### 痛点一: 权限实体该由谁维护

何为权限实体？权限管理系统中，到底能管理哪些权限？  

一般来说 管理权限实体有2个方案：

1. 做成权限配置文件，比如shiro就可以使用权限配置文件来管理角色和uri。
2. 做成权限实体表，然后功能发布了，由使用者或者开发者登陆系统配置。

但是这两种方案带来的维护成本都不小，方案一很大程度上就限制了用户管理权限的自由性，而方案二，接口新增和变更都需要同步去维护权限实体表，这些工作，会在高速迭代的产品中愈发显现。

authj权限框架则提出了一个新的模式，系统中有哪些权限实体，是由这个系统中已有的功能决定的，程序启动时，authj会扫描系统中已有的功能，以此生成权限实体！

#### 痛点二: 权限管理的粒度

最常见的权限管理模型是 角色权限模型。 除了权限实体外，额外引入角色概念，指定每个角色能干哪些事情，并为每个管理员设置1个或多个角色身份，以此来实现细粒度的权限管理。

然而，这样的权限管理模型，每当需要进行权限变更的时候，都需要由拥有"角色管理"权限的账户来进行操作。这样随着运营后台使用人数的增加，势必会使拥有"角色管理"权限的账户频繁的操作以应对各种的权限分配需求。

就好比是，我是一个运营小组长，我想在我的有权范围管理我的2个下属的权限，这样的需求，需要去求助运营总监、或者行政总监才能完成！

authj权限框架并没有使用角色权限模型，而是提出了另一个模型: 权限组叠加。  
基于这个模型，用户可以很方便的将自己拥有的权限赋予给其他人，而不用求助于顶级管理员或者开发者。

### authj的工作原理

authj的工作原理主要在以下3点:

- 权限实体自动扫描
- 使用权限组实现权限传递
- 登陆时为session授权

#### 权限实体自动扫描

权限实体(也简称"权限")代表了具体的功能点，可以是某一个页面(如:商品列表页)，也可以是某一个按钮/功能(如:添加商品)。

在spring boot的代码中，其实就是controller层的方法，要么对应接口、要么对应页面。

使用authj权限框架，需要在controller层的方法上增加**@Authj**注解，管理后台项目启动时，会根据controller的包配置，扫描到所有的@Authj注解，以此来生成权限实体。

#### 权限组与权限传递

每一个管理员都可以创建和管理自己的权限组(前提是该管理员有 "创建权限组" 的权限)。

权限组的管理分为 授权管理 和 成员管理。

管理员可以通过授权功能，将自己拥有的权限授权给权限组，通过添加成员功能，为自己的权限组添加成员。

当你处在一个权限组里，你就拥有这个这个权限组里的所有有效权限，我把这个过程称为:从权限组继承权限。

你可以把自己拥有的所有有效权限(无论是从谁的组里继承来的)，授权给自己创建的其他权限组，并将其传递给其他的管理员。

系统中 userId=0 的用户 为 超级管理员，不难看出所有用户的权限都是继承自超级管理员的。

这里提到了 **有效权限** ，权限组里拥有的权限必须和权限组的创建者所拥有的权限取交集，剩下的这些才能是有效权限。

换句话说，就是，如果权限组的创建者本身都没有这个权限，那么由他传递出去的该权限也是无效的。

以上就是权限组与权限传递的规则。

#### 授权

授权操作是在用户登陆的时候进行的，authj会根据具登陆用户继承权限的关系，为登陆的session授权。

登陆用户加入的所有组的有效权限取并集就是该session被授权的权限。

最后，authj的拦截器会在每次请求时，会检查请求对应的权限实体，当前session是否有权访问，以此进行鉴权操作。

### 数据字典

authj 共有6张表，这些表的结构都很简单，其中的日志表会保存所有的页面接口请求记录。组织表的作用会在后面的内容中讲解。

```
- admins            管理员
- groups            权限组
- group_admin       权限组-管理员关联表
- group_auth        权限组-权限实体关联表
- logs              操作日志表
- organizes         组织表
```

每个管理员可以创建多个权限组，以及加入多个权限组，每个权限组可以包含多个权限实体

#### admins表

```sql
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '管理员Id',
  `nick_name` varchar(64) NOT NULL COMMENT '用户昵称',
  `username` varchar(50) NOT NULL COMMENT '登陆名',
  `password` varchar(32) NOT NULL COMMENT '密码(加盐MD5)',
  `salt` varchar(64) NOT NULL COMMENT '盐',
  `google_secret` varchar(255) DEFAULT NULL COMMENT 'google验证码secret',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `status` int(2) NOT NULL DEFAULT '0' COMMENT '状态(暂未实装) 0:初始状态 1:正常使用 -1:冻结',
  `last_ip` varchar(20) DEFAULT NULL COMMENT '最后登录的IP',
  `last_time` datetime DEFAULT NULL COMMENT '最后登录的时间',
  `remark` varchar(255) DEFAULT '' COMMENT '备注',
  `layer` varchar(8192) DEFAULT NULL COMMENT '菜单配置',
  `organize_id` int(11) DEFAULT NULL COMMENT '组织id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_KEY` (`username`) USING BTREE,
  KEY `phone_KEY` (`phone`) USING BTREE,
  KEY `email_KEY` (`email`) USING BTREE,
  KEY `status_KEY` (`status`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';
```

#### groups、group_admin、group_auth 表

```sql
DROP TABLE IF EXISTS `groups`;
CREATE TABLE `groups` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `name` varchar(32) NOT NULL COMMENT '管理员组名称',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_admin_id` int(11) NOT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `create_KEY` (`create_admin_id`) USING BTREE,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限组';

DROP TABLE IF EXISTS `group_admin`;
CREATE TABLE `group_admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '组ID',
  `group_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `create_admin_id` int(11) NOT NULL COMMENT '创建人ID',
  `remark` varchar(255) NOT NULL DEFAULT '' COMMENT '备注',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id_admin_id_UNIQUE` (`group_id`,`admin_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='权限组-管理员关联表';

DROP TABLE IF EXISTS `group_auth`;
CREATE TABLE `group_auth` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `group_id` int(11) NOT NULL,
  `uri` varchar(255) NOT NULL,
  `create_admin_id` int(11) NOT NULL COMMENT '创建人ID',
  `remark` varchar(255) DEFAULT '' COMMENT '备注',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id_auth_uri_UNIQUE` (`group_id`,`uri`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=386 DEFAULT CHARSET=utf8mb4 COMMENT='权限组-权限实体关联表';
```

## 管理后台开发指南

### 技术栈

#### blzo 脚手架 / blzo-ex-authj 权限组件

spring boot 2.x + mybatis

#### 页面渲染：thymeleaf 模板引擎

> thymeleaf 是spring boot官方推荐的模板引擎

[Thymeleaf 官方文档](https://www.thymeleaf.org/documentation.html)thymeleaf.org  
[Thymeleaf 教程](https://waylau.gitbooks.io/thymeleaf-tutorial/content/)waylau  

#### 前端主题模板

> 建议把这个模板clone下来，它可以给你在开发时带来诸多参考

[BucketAdmin](https://gitee.com/themehub/BucketAdmin)themehub

### 管理后台项目结构

```
src/main
    |- java
    |   |- com.jdkhome.blzo.manage
    |       |- configuration    // 配置包，多数据源配置或者一些自定义的bean放在这里
    |       |- controller       // controller层代码
    |       |   |- CommonControllerAdvice.java // 所有@Controller执行之前，会先执行这里
    |       |   |- ...
    |       |    
    |       |- pojo                     // 无逻辑对象包
    |       |- ManageApplication.java   // 启动类，可以在这里增加一些启动后自动执行的方法
    |
    |- resource
        |- static       // 静态资源文件
        |   |- common   // 放logo等其他图片
        |   |- manage 
        |       |- custom       // 自定义的js文件目录
        |       |   |- common   // 公共js
        |       |   |   |- base.js      // 封装ajax请求
        |       |   |   |- request.js   // 接口声明js
        |       |   |   |- search.js    // 搜索功能实现
        |       |   |    
        |       |   |- page // 自定义页面的js
        |       |
        |       |- js // 管理后台的一些js插件建议放在这里
        |       |- ...
        |
        |- templates    // thymeleaf 模板文件目录
        |   |- error    // 404、500页面
        |   |- manage   // 管理后台的thymeleaf模板目录
        |       |- common   // 功能模板组件，比如菜单、分页器等
        |       |- page     // 自定义页面的模板目录
        |       |- ...
        |
        |- application.yml      // 主配置文件
        |- application-dev.yml  // 开发环境配置文件
        |- application-test.yml // 测试环境配置文件
        |- application-pro.yml  // 生产环境配置文件

```

### 快速开始

现在我们开始在BLZO管理后台中开发你的第一个页面和接口！

#### controller层 接口和页面的控制器

[DemoApiController.java](https://github.com/jdkhome/blzo-ex/blob/master/blzo-manage/src/main/java/com/jdkhome/blzo/manage/controller/demo/DemoApiController.java) demo接口controller


[DemoPageController.java](https://github.com/jdkhome/blzo-ex/blob/master/blzo-manage/src/main/java/com/jdkhome/blzo/manage/controller/demo/DemoPageController.java) demo页面controller

#### 前端页面和js

[demo.html](https://github.com/jdkhome/blzo-ex/blob/master/blzo-manage/src/main/resources/templates/manage/demo.html)demo页面html模板

在[request.js](https://github.com/jdkhome/blzo-ex/blob/master/blzo-manage/src/main/resources/static/manage/custom/common/request.js)中声明你的接口
```js
// DEMO API
Request.apiDemoApi = function (context, data, event, callbacks) {
    Base.doPost('/api/manage/demo/my_api', context, data, event, callbacks);
};
```

[demo.js](https://github.com/jdkhome/blzo-ex/blob/master/blzo-manage/src/main/resources/static/manage/custom/page/demo.js) demo页面对应的js文件

#### 启动!

使用超级管理员账户登录BLZO管理后台

在"未分组"菜单组中 即可找到**demo页面**。

### 特性使用

#### 打印日志

任何接口，加上@Api注解即可自动打印日志

#### 设置权限实体

任何接口，加入@Authj注解即可完成权限实体的设置

Authj目前有4个属性

- value     权限实体的名称，如果不设置则会从@Api注解中获取
- auth      是否需要鉴权 如果不设置，则默认为true
- menu      是否能够作为菜单 如果不设置，则默认为false
- common    是否为公共权限 如果不设置，则默认为false

公共权限: 只要登录就有权限

#### 列表页常见需求

数据筛选，blzo管理后台的列表数据筛选是通过页面控制器改变请求参数实现的  
在页面的Controller方法中设置你要筛选的条件，并在html中初始化Search对象
```html
<script>
    window.onload = function () {
        var search = new window.controller.Search();
        search.init();
    };
</script>
```

分页器，blzo使用mybatis-pagehelper插件实现分页  
在需要分页的页面控制器，Model中传入"PageInfo"，在页面中引入分页器模板组件即可实现分页
```html
<div th:replace="manage/common/paginate"></div>
```

> 你可以参考 管理员列表页 来获取这些功能的示例

#### 在任何地方获取管理员Id

注入AuthjManager，然后在你需要的地方使用getUserId()方法
```java
@Autowired
AuthjManager authjManager;
...
Integer userId = authjManager.getUserId();
...
```

#### 获取更多页面示例

请参考前端主题模板  
[BucketAdmin](https://gitee.com/themehub/BucketAdmin)themehub

### 数据权限开发

在authj中，使用组织的方式实现数据权限。组织功能是可选的，并不会强制使用。

#### 业务场景

使用组织功能之前，你需要明确你的项目是否真的需要它，组织功能是有侵入业务的。

一个典型的使用场景是:  
管理后台被两个不同地区的业务团队所使用，两个地区运营的业务相同，但是我们希望A地区的运营，只能看到A地区的数据，B地区的运营，只能看到B地区的数据。

在这样的场景下，你有两种处理方案:

1. 为A、B地区各部署一套服务，两套服务数据分库互不干扰
2. 使用authj的"组织"功能 为每一个希望有数据权限的表增加"组织Id字段"

两个方案各有各的好处，方案1不会侵入业务，方案2则在管理上更具统一性。

#### 组织功能的现有能力

系统默认userId=0的用户为超级管理员，同样，组织Id=0的组织为总组织。

每个用户都只能加入一个组织，不同组织的管理员，互相不可见。属于总组织的用户可以管理所有组织。

## 开发自己的管理后台

blzo自带的管理后台能够适用大多数场景，但正如所有脚手架一样，快捷的同时也会在一定程度上产生约束。

如果你的产品(或是客户)，希望能够定制管理后台的其他样式；又或是你希望用其他技术栈去实现体验更好的管理后台(比如vue)；那么你可能需要重新开发一个新的管理后台。

本节默认你已经通读了前面的内容，并且已经阅读了[blzo-ex-authj](https://github.com/jdkhome/blzo-ex/tree/master/blzo-ex-authj)的代码。

### 管理员登陆

使用 authjManager.grant(userId) 方法，为当前登录的session进行授权。

```java
@Autowired
AuthjManager authjManager;
...
// 对当前登陆的session进行授权
authjManager.grant(userId);
// 对当前登录的session移除授权
authjManager.delGrant();
...
```

### 授权实体

授权实体中包含了当前session的所有权限 和 菜单配置

```java
@Autowired
AuthjManager authjManager;
...
// 获取当前登陆用户的授权实体
UserAuthjConfBean userAuthjConfBean = authjManager.getUserAuthjConfBean();
...
```

