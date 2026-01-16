# Solana 基础知识

## 核心概念

### 账户模型
- Solana 一切皆账户
- Program (智能合约) 也是账户
- 数据存储在独立的账户中

### 账户结构
- lamports: SOL 余额 (1 SOL = 10^9 lamports)
- owner: 拥有该账户的 Program
- data: 账户数据
- executable: 是否可执行

### Program
- 无状态，只包含逻辑
- 数据存储在 PDA (Program Derived Address)

### 交易特点
- 并行执行
- 400ms 出块
- 低 Gas 费

## 常用工具

- @solana/web3.js: JavaScript SDK
- Anchor: 开发框架
- Solscan / Solana Explorer: 区块浏览器

## 学习资源

- [ ] Solana 官方文档
- [ ] Anchor 框架教程
