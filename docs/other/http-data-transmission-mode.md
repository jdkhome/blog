# HTTP数据传输方式

最近研究了http协议的数据包，结构大概是

```
请求方法 URI 协议/版本
请求头

请求正文

```

其中在URI 请求头 请求正文中 都可以放自定义的数据

这里总结一些常用方法

## url传参

```
GET /api/test?key=xxxxx HTTP/1.1

```

这种在各种method中都能使用，缺点是长度有限



## application/x-www-form-urlencoded

```
POST /api/test HTTP/1.1
Content-Type: application/x-www-form-urlencoded;charset=utf-8
key1=val1&key2=val2

```

这是最常见的传参方式,浏览器表单、还有jquery的ajax默认都是这种。
所有参数会拼成一串传递,key和val都要进行URL转码


## multipart/form-data

```
POST /api/test HTTP/1.1
Content-Type: multipart/form-data; boundary=--------------------------388849051993559283843200

----------------------------388849051993559283843200
Content-Disposition: form-data; name="key1"

val1
----------------------------388849051993559283843200
Content-Disposition: form-data; name="key2"

val2
----------------------------388849051993559283843200--

```

表单上传文件时，常用这种方式，相对复杂一些，首先是生成一个boundary放到请求头中

然后消息主体中 用 --boundary 来切割每个参数，最后以--boundary--标识结束

## application/json 、application/xml、 application/text 等

```
POST /api/test HTTP/1.1 
Content-Type: application/json;charset=utf-8
{"key":"vaue","list":[1,2,3]}
```

前面几种方式都是以key/value的形式传参，而本类方式则适合传递复杂结构的参数, Content-Type 中告诉服务端，是用json、xml、还是直接用字符串解析











