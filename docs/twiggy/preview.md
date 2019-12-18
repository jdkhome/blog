# 一览

以下代码片段节选自demo项目

## 代码片段

OrderController.java
```java
@RestController
@RequestMapping("/api/test/order")
public class OrderController {

    @Autowired
    ResAuth<Order> orderResAuth;

    /**
     * 获取订单列表
     */
    @Data
    class GetOrderListParams {

        @TwiggyRes
        Integer userId;

        @TwiggyRes
        String accountNo;

    }

    @Twiggy(value = "获取订单列表", fun = "(merchant>0)||(user>0)", res = "userId||accountNo")
    @RequestMapping("/list")
    public List<Order> getOrderList(@Valid GetOrderListParams params) {

        // ... 根据请求的参数 从各种数据源或者rpc获取相应数据
        List<Order> orders = new ArrayList<>();
        orders.add(new Order(1, "ACC0001", "xxxx"));
        orders.add(new Order(2, "ACC0001", "xxxx"));
        orders.add(new Order(3, "ACC0001", "xxxx"));

        return orders;
    }

    /**
     * 通过订单号获取订单
     */
    @Data
    class GetOrderParams {
        String orderNo;
    }

    @Twiggy(value = "通过订单号获取订单", fun = "(merchant>0)||(user>0)")
    @RequestMapping("/get")
    public Order getOrder(@Valid GetOrderParams params) {

        Order order = new Order();
        order.setUserId(1);
        order.setValue("xxxx");
        order.setAccountNo("ACC0001");

        // 校验权限
        if (!orderResAuth.authOne(order)) {
            throw new TwiggyPermissionDeniedException();
        }

        return order;
    }

}
```
OrderResAuthImpl.java
```java
@Service
public class OrderResAuthImpl implements ResAuth<Order> {

    @Override
    public String getExpression() {
        return "accountNo||userId";
    }

    @Override
    public Map<String, String> getValMap(Order resource) {
        Map<String, String> valMap = new HashMap<>();
        valMap.put("accountNo", resource.getAccountNo());
        valMap.put("userId", resource.getUserId().toString());
        return valMap;
    }
}
```

## 解析

### 获取订单列表

```java
@Twiggy(value = "获取订单列表", fun = "(merchant>0)||(user>0)", res = "userId||accountNo")
```

#### 功能鉴权

**fun = "(merchant>0)||(user>0)"** 代表了这个接口 只有merchant角色等级大于0 或者 user角色大于0 才可以访问。

#### 数据权限

**res = "userId||accountNo"** 代表了 请求者拥有请求参数中的**userId**这个数据资源 或者 拥有请求参数中**accountNo**这个数据资源

这是一个典型的**前置资源鉴权**案例，请求参数中就已经包含要需要鉴权的资源项

### 通过订单号获取订单

```java
@Twiggy(value = "通过订单号获取订单", fun = "(merchant>0)||(user>0)")
...
// 校验权限
if (!orderResAuth.authOne(order)) {
    throw new TwiggyPermissionDeniedException();
}
```

#### 功能权限

同上

#### 数据权限

由于请求参数中只有orderNo , 所以无法进行前置资源鉴权，所以这里采用后置资源鉴权

获取到订单之后，再去验证请求者是否拥有这个订单的数据权限

**OrderResAuthImpl.java** 中定义了 Order对象的鉴权规则 以及Order对象与资源key的映射关系


