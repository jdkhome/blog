
# 里程碑-20190718

> 博客第五次重构，就在我大功告成之际，执行升级文章结构的脚本时，一个BUG清空了原先的所有博文！

## BUG就应该裱起来

```
articleBasicService.getAllArticle(null,null,null,null).forEach(article -> {
            articleService.change(article.getId(),null,"# "+article.getTitle()+"\n"+article.getContent(),null,null
                    ,null,null,null,null,null);
        });
```

是的，只是想把所有文章的内容前增加一行 H1标题 

但是 却忽视了 mybatis-generator 生成方法中 **selectByExample** 是没有大文本的 应该使用 **selectByExampleWithBLOBs**


白了个白 Orz..