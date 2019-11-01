# 以太坊节点搭建

主链
```
sudo docker run -d \
--name ethereum \
--restart=always \
-v /data/ethereum:/root \
-p 8545:8545 -p 8546:8546 -p 30303:30303 \
ethereum/client-go \
--rpcapi admin,db,debug,eth,miner,net,personal,shh,txpool,web3 \
--rpc --rpcaddr 0.0.0.0 
```

测试链
```
sudo docker run -d \
--name ethereum \
--restart=always \
-v /data/ethereum:/root \
-p 8545:8545 -p 8546:8546 -p 30303:30303 \
ethereum/client-go \
--rpcapi admin,db,debug,eth,miner,net,personal,shh,txpool,web3 \
--rpc --rpcaddr 0.0.0.0 \
--testnet
```