# 它需要使用者做什么

你需要为你的每一个涉及到权限控制的方法加上 @Twiggy 注解，Twiggy会在项目启动时扫描它，并自动生成权限实体  
在开发的同时就可以轻松完成它，无需对权限实体做额外的配置和维护

@Twiggy注解中 包含 **功能鉴权表达式** 和 **资源鉴权表达式** 这两个属性。  
不要被表达式吓到，因为Twiggy的表达式灵活自由，功能强大，且**非常简单，几乎没有学习的成本**

Twiggy 会为系统中 每一个用户都创建一个独立的token，你需要将此token与你的用户进行关联，除此之外，Twiggy不会再侵入你的业务数据库。  
token与业务资源的关联是由Twiggy 自己维护的，所以你需要在创建资源的同时 调用Twiggy的方法用于关联token  

Twiggy 不为某一特定业务开发，所以Twiggy中不储存任何业务信息(比如用户名、密码)，Twiggy也不提供前端页面。

最后，Twiggy需要连接mysql和redis，分别用来存储权限关系以及缓存。你需要单独创建数据库并为Twiggy初始化表信息。