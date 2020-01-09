---
sidebar: auto
---

# Omni链 USDT 交易全流程

目标:

使用命令行, 构造一笔USDT原始交易 转账1个USDT, 并使用第3个地址来支付BTC矿工费。

准备如下:

地址 | 描述 |  余额  
-|-|-
1Ggbcnw6uo45zBMP1AZVYkLStzwcajSwfq | 从该地址转出USDT | 9 USDT & 0.00000546 BTC|
1P9oRFKX6StetGwDnQ5oAYA7HACFfruQXP | 使用该地址接收USDT | -- |
19gcfLWRcLHpsnR4bJzhUDhBm4FYNdZ5eZ | 使用该地址支付手续费 | 0.00089454 BTC |

## 交易形态

目标的交易将会有 2个交易输入，3个交易输出。

### 交易输入

序号 | 金额 | 描述 
-|-|-
0 | 0.00000546 | 转出USDT的地址的一笔unspent | 
1 | 0.00089454 | 用于支付BTC矿工费的unspent | 

注意这里的交易输入, 第一笔用来标记USDT转出方, 所以第一笔必须是USDT转出方的unspent  
后面的unspent不受限制

### 交易输出

序号 | 地址 | 金额 | 描述 
-|-|-|-
0 | 支付BTC矿工费的地址| 待计算 | 得到交易的找零 | 
1 | (可选)特殊的: 转出USDT的地址 | 0.00000546 | 转出地址仍有USDT余额，为方便以后继续转出，所以这里为它添加一笔UTXO  |
2 | 接受USDT的地址 |  0.00000546 | 得到最小交易额的BTC |
3 | -- | 0 | Omni交易的payload | 

交易输出同样有顺序要求, 除开payload, 最后一个地址代表转入方

## 准备unspent

> https://bitcoincore.org/en/doc/0.18.0/rpc/wallet/listunspent/

按照交易输入的规划，先列出计划的2笔unspent

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli "listunspent" 1 9999999 "[\"1Ggbcnw6uo45zBMP1AZVYkLStzwcajSwfq\",\"19gcfLWRcLHpsnR4bJzhUDhBm4FYNdZ5eZ\"]"
[
  {
    "txid": "ffc30b3a3b1ec06428f54aaf67d515ef60afaa32318bb6487862bad5db5a6164",
    "vout": 0,
    "address": "1Ggbcnw6uo45zBMP1AZVYkLStzwcajSwfq",
    "label": "",
    "scriptPubKey": "76a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac",
    "amount": 0.00000546,
    "confirmations": 12,
    "spendable": true,
    "solvable": true,
    "desc": "pkh([dde4e4d2/0'/0'/61']032d490398d4437d55aafc90c2bdc036d8445221bd8a026430a216285b49561a98)#9jknc64t",
    "safe": true
  },
  {
    "txid": "457c7a5f32deb4e7a5427baf5fda5cb77a8c864f860e7b7e59e4f8b637352ea8",
    "vout": 1,
    "address": "19gcfLWRcLHpsnR4bJzhUDhBm4FYNdZ5eZ",
    "label": "",
    "scriptPubKey": "76a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac",
    "amount": 0.00089454,
    "confirmations": 14,
    "spendable": true,
    "solvable": true,
    "desc": "pkh([dde4e4d2/0'/0'/24']03b31f0fd70c0de45b2b976ea3224b791118cf71654324ee0bbc63b9cdd7895748)#4wq4wjns",
    "safe": true
  }
]
```

## 准备payload

> https://github.com/OmniLayer/omnicore/blob/master/src/omnicore/doc/rpc-api.md#omni_createpayload_simplesend

这里希望转账1个USDT, USDT在omni中的代号是31 所以生成payload如下:

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli "omni_createpayload_simplesend" 31 "1"
000000000000001f0000000005f5e100
```

## 计算手续费

### 计算size

2笔输入，4笔输出，那么按照通常的size计算公式就是

```
size = from * 148 + to * 34 + 10
     = 2 * 148 + 4 * 34 + 10
     = 442
```

### 获取千字节费率

> https://bitcoincore.org/en/doc/0.18.0/rpc/util/estimatesmartfee/

第2个参数代表我们希望 2个块内被确认，可以用它来控制交易速度

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli estimatesmartfee 2
{
  "feerate": 0.00024419,
  "blocks": 2
}
```

### 矿工费和找零金额

那么最终的矿工费就是

```
>>> 442 * 0.00024419 / 1000
0.00010793198
```

为了演示方便，这里就取个整: **0.0001**

所以找零金额为

```
>>> (0.00089454 + 0.00000546) - (0.00000546 + 0.00000546) - 0.0001
0.00078908
```

## 构建原始交易

### BTC原始交易

> https://bitcoincore.org/en/doc/0.18.0/rpc/rawtransactions/createrawtransaction/

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli createrawtransaction "[{\"txid\":\"ffc30b3a3b1ec06428f54aaf67d515ef60afaa32318bb6487862bad5db5a6164\",\"vout\":0},{\"txid\":\"457c7a5f32deb4e7a5427baf5fda5cb77a8c864f860e7b7e59e4f8b637352ea8\",\"vout\":1}]" "[{\"19gcfLWRcLHpsnR4bJzhUDhBm4FYNdZ5eZ\":0.00078908},{\"1Ggbcnw6uo45zBMP1AZVYkLStzwcajSwfq\":0.00000546},{\"1P9oRFKX6StetGwDnQ5oAYA7HACFfruQXP\":0.00000546}]"
020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff0000000000ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c450100000000ffffffff033c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac00000000
```

### 为交易附加omni-payload

> https://github.com/OmniLayer/omnicore/blob/master/src/omnicore/doc/rpc-api.md#omni_createrawtx_opreturn

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli "omni_createrawtx_opreturn" "020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff0000000000ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c450100000000ffffffff033c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac00000000" "000000000000001f0000000005f5e100"
020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff0000000000ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c450100000000ffffffff043c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac0000000000000000166a146f6d6e69000000000000001f0000000005f5e10000000000
```

保险起见，这里再把交易解码用于检查

> https://bitcoincore.org/en/doc/0.18.0/rpc/rawtransactions/decoderawtransaction/

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli decoderawtransaction "020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff0000000000ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c450100000000ffffffff043c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac0000000000000000166a146f6d6e69000000000000001f0000000005f5e10000000000"
{
  "txid": "ab6b3efbe006e1bc93748ac3f5a0a554fc7522836e73338b4e9501ebd643b4ba",
  "hash": "ab6b3efbe006e1bc93748ac3f5a0a554fc7522836e73338b4e9501ebd643b4ba",
  "version": 2,
  "size": 225,
  "vsize": 225,
  "weight": 900,
  "locktime": 0,
  "vin": [
    {
      "txid": "ffc30b3a3b1ec06428f54aaf67d515ef60afaa32318bb6487862bad5db5a6164",
      "vout": 0,
      "scriptSig": {
        "asm": "",
        "hex": ""
      },
      "sequence": 4294967295
    },
    {
      "txid": "457c7a5f32deb4e7a5427baf5fda5cb77a8c864f860e7b7e59e4f8b637352ea8",
      "vout": 1,
      "scriptSig": {
        "asm": "",
        "hex": ""
      },
      "sequence": 4294967295
    }
  ],
  "vout": [
    {
      "value": 0.00078908,
      "n": 0,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 5f3eff3f4dc66711d4af126237ff6dc687a16c98 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "19gcfLWRcLHpsnR4bJzhUDhBm4FYNdZ5eZ"
        ]
      }
    },
    {
      "value": 0.00000546,
      "n": 1,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 ac07019440151fbcffa16ea4cbd0db74ef1c797a OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "1Ggbcnw6uo45zBMP1AZVYkLStzwcajSwfq"
        ]
      }
    },
    {
      "value": 0.00000546,
      "n": 2,
      "scriptPubKey": {
        "asm": "OP_DUP OP_HASH160 f2fcd7c009958accec2e1b6210d82854fd791884 OP_EQUALVERIFY OP_CHECKSIG",
        "hex": "76a914f2fcd7c009958accec2e1b6210d82854fd79188488ac",
        "reqSigs": 1,
        "type": "pubkeyhash",
        "addresses": [
          "1P9oRFKX6StetGwDnQ5oAYA7HACFfruQXP"
        ]
      }
    },
    {
      "value": 0.00000000,
      "n": 3,
      "scriptPubKey": {
        "asm": "OP_RETURN 6f6d6e69000000000000001f0000000005f5e100",
        "hex": "6a146f6d6e69000000000000001f0000000005f5e100",
        "type": "nulldata"
      }
    }
  ]
}
```

## 签名与广播

### 签名交易

> https://bitcoincore.org/en/doc/0.18.0/rpc/rawtransactions/signrawtransactionwithkey/

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli signrawtransactionwithkey "020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff0000000000ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c450100000000ffffffff043c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac0000000000000000166a146f6d6e69000000000000001f0000000005f5e10000000000" "[\"***人工打马***USDT输出地址的私钥***\",\"***人工打马***支付BTC矿工费的地址的私钥***\"]"
{
  "hex": "020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff000000006a4730440220130a59785b3ae45e02ab808e1a01fa47aeb9e4d4f009729bc075efd3a58fcc950220160432fc06e134432466459f9c896f1d5fbf48bf5335607bd7d3e0e16e8194e90121032d490398d4437d55aafc90c2bdc036d8445221bd8a026430a216285b49561a98ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c45010000006a473044022065d356ead55f376c43b3ac0a031be94e960750367c70a6d181246ac26656b274022039571f885e51deab46cf0ab938517dc1588bfc5192bbaf92b55c43d023df276a012103b31f0fd70c0de45b2b976ea3224b791118cf71654324ee0bbc63b9cdd7895748ffffffff043c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac0000000000000000166a146f6d6e69000000000000001f0000000005f5e10000000000",
  "complete": true
}

```

### 广播交易

> https://bitcoincore.org/en/doc/0.18.0/rpc/rawtransactions/sendrawtransaction/

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli sendrawtransaction "020000000264615adbd5ba627848b68b3132aaaf60ef15d567af4af52864c01e3b3a0bc3ff000000006a4730440220130a59785b3ae45e02ab808e1a01fa47aeb9e4d4f009729bc075efd3a58fcc950220160432fc06e134432466459f9c896f1d5fbf48bf5335607bd7d3e0e16e8194e90121032d490398d4437d55aafc90c2bdc036d8445221bd8a026430a216285b49561a98ffffffffa82e3537b6f8e4597e7b0e864f868c7ab75cda5faf7b42a5e7b4de325f7a7c45010000006a473044022065d356ead55f376c43b3ac0a031be94e960750367c70a6d181246ac26656b274022039571f885e51deab46cf0ab938517dc1588bfc5192bbaf92b55c43d023df276a012103b31f0fd70c0de45b2b976ea3224b791118cf71654324ee0bbc63b9cdd7895748ffffffff043c340100000000001976a9145f3eff3f4dc66711d4af126237ff6dc687a16c9888ac22020000000000001976a914ac07019440151fbcffa16ea4cbd0db74ef1c797a88ac22020000000000001976a914f2fcd7c009958accec2e1b6210d82854fd79188488ac0000000000000000166a146f6d6e69000000000000001f0000000005f5e10000000000"
ecf0e40b6c22ae8e3126a9d6570acbddeeca836a111142e616903bc1575c81b2
```

广播交易返回的结果就是txid

### 查看交易

```sh
[root@d0ea558e20d3 bin]# ./omnicore-cli omni_gettransaction "ecf0e40b6c22ae8e3126a9d6570acbddeeca836a111142e616903bc1575c81b2"
{
  "txid": "ecf0e40b6c22ae8e3126a9d6570acbddeeca836a111142e616903bc1575c81b2",
  "fee": "0.00010000",
  "sendingaddress": "1Ggbcnw6uo45zBMP1AZVYkLStzwcajSwfq",
  "referenceaddress": "1P9oRFKX6StetGwDnQ5oAYA7HACFfruQXP",
  "ismine": true,
  "version": 0,
  "type_int": 0,
  "type": "Simple Send",
  "propertyid": 31,
  "divisible": true,
  "amount": "1.00000000",
  "confirmations": 0
}
```

当然也可以在区块浏览器上查看交易

- [BTC区块浏览器](https://btc.com/ecf0e40b6c22ae8e3126a9d6570acbddeeca836a111142e616903bc1575c81b2)
- [OMNI区块浏览器](https://www.omniexplorer.info/search/ecf0e40b6c22ae8e3126a9d6570acbddeeca836a111142e616903bc1575c81b2)
