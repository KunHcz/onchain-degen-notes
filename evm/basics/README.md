# EVM 基础知识

## 核心概念

### 账户类型
- **EOA (Externally Owned Account)**: 由私钥控制的普通账户
- **Contract Account**: 智能合约账户

### 交易结构
- nonce: 交易序号
- gasPrice / maxFeePerGas: Gas 价格
- gasLimit: Gas 上限
- to: 接收地址
- value: 转账金额 (wei)
- data: 调用数据

### Gas 机制
- Gas = 计算资源单位
- Gas Price = 每单位 Gas 的价格 (Gwei)
- Transaction Fee = Gas Used * Gas Price

## 常用工具

- ethers.js / web3.js: JavaScript SDK
- viem: 现代 TypeScript SDK
- Foundry: 开发框架

## 学习资源

- [ ] Ethereum 官方文档
- [ ] Etherscan 区块浏览器使用
