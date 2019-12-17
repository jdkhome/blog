# 快速了解

Twiggy 通过在接口方法上加上 **@Twiggy** 注解来标记权限实体，接口被请求时  
Twiggy会在切面中验证 请求者header中的vToken是否拥有对应权限实体的权限

这里先简单的例举 一些场景下权限控制的例子

## 前置资源鉴权



下面是一段简单的 获取订单列表 接口的业务代码 

这里的场景是 有2种类型 的用户 : 商户、用户
**@Twiggy** 注解中 **fun**属性 即表示 这2个角色都有权利访问**获取订单列表**

比如这是外卖订单，订单是属于用户和商户的，业务中我们希望:

- 用户可以获取自己的订单列表 但是不能查看到其他用户的订单
- 商户可以获取自己的订单列表 同样也不能查看不属于自己的订单

请求参数中的 **@TwiggyRes** 注解 标识了这些参数对应的资源名，如果资源名与参数名不同，也可以显式的填写资源名
**@Twiggy** 注解中 **res**属性 即表示 请求者拥有的 userId/accountNo 资源必须要有任意一项与请求参数相符
 
> 注意
> 请不要直接仿照这段代码用到你的项目，一般来说 你应该分成2个项目来分别为 这2种不同类型的角色提供服务 不要像我一样混在一起，这只是演示！   

```java
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
```

## 后置资源鉴权

在**通过订单号获取订单**这个业务中，请求参数中并不包含需要被鉴权的资源项，此时只能够查询到数据后再做处理

类**OrderResAuthImpl**中 标明了 这个实体的资源鉴权表达式 以及 实体属性与资源名称的映射

```java
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

        if (!orderResAuth.authOne(order)) {
            throw new TwiggyPermissionDeniedException();
        }

        return order;
    }
```

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
