// Note structure
export interface Note {
  id: string;
  title: string;
  path: string;
  category: 'solana' | 'evm' | 'trading' | 'tools' | 'resources';
  subcategory?: string;
  content: string;
  tags: string[];
  connections: string[]; // IDs of related notes
  progress: number; // 0-100
  lastViewed?: number;
  createdAt: number;
}

export interface SkillNode {
  id: string;
  title: string;
  description: string;
  noteIds: string[];
  prerequisites: string[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  xpReward: number;
  position: { x: number; y: number };
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: {
    type: 'notes_read' | 'streak' | 'trades' | 'xp' | 'skill_complete';
    target: number;
  };
  xpReward: number;
  unlockedAt?: number;
}

export interface Trade {
  id: string;
  date: number;
  token: string;
  chain: 'solana' | 'bsc' | 'base' | 'eth';
  contract?: string;
  buyPrice: number;
  sellPrice?: number;
  amount: number;
  pnl?: number;
  pnlPercent?: number;
  status: 'open' | 'closed';
  notes?: string;
  emotion?: 'confident' | 'fomo' | 'fear' | 'neutral';
  relatedNoteIds?: string[];
}

export interface Flashcard {
  id: string;
  noteId: string;
  question: string;
  answer: string;
  easeFactor: number; // SM-2 algorithm
  interval: number; // days
  repetitions: number;
  nextReview: number; // timestamp
  lastReview?: number;
}

// Initial notes data (will be populated from MD files)
export const initialNotes: Note[] = [
  {
    id: 'solana-basics',
    title: 'Solana 基础知识',
    path: 'solana/basics',
    category: 'solana',
    subcategory: 'basics',
    content: `# Solana 基础知识

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

Q: Solana 的出块时间是多少？
A: 400ms

Q: 1 SOL 等于多少 lamports？
A: 10^9 (10亿) lamports

Q: Solana 的 Program 是有状态还是无状态的？
A: 无状态，数据存储在 PDA 中`,
    tags: ['solana', 'basics', 'blockchain'],
    connections: ['solana-pumpfun'],
    progress: 0,
    createdAt: Date.now(),
  },
  {
    id: 'solana-pumpfun',
    title: 'PumpFun 研究笔记',
    path: 'solana/pumpfun',
    category: 'solana',
    subcategory: 'pumpfun',
    content: `# PumpFun 研究笔记

> Solana 上最热门的 Meme 发射平台

## 平台机制

### Bonding Curve
- 联合曲线定价
- 早期买入价格低，后期价格高
- 达到阈值后迁移到 Raydium

### 关键参数
- 初始流动性
- 曲线斜率
- 毕业阈值 (约 $69k)

## 合约交互

### 核心操作
- [ ] 创建代币
- [ ] 买入
- [ ] 卖出
- [ ] 查询价格

### Program ID
\`\`\`
待补充
\`\`\`

## 数据获取

- [ ] 新币监控
- [ ] 交易监控
- [ ] 持仓分析

## 交易策略

- [ ] 狙击策略
- [ ] 跟单策略
- [ ] 风险控制

Q: PumpFun 的毕业阈值大约是多少？
A: 约 $69k

Q: PumpFun 毕业后代币会迁移到哪个 DEX？
A: Raydium

Q: Bonding Curve 的特点是什么？
A: 早期买入价格低，后期价格高，价格随购买量增加而上升`,
    tags: ['solana', 'pumpfun', 'meme', 'defi'],
    connections: ['solana-basics', 'evm-fourmeme', 'trading-gmgn'],
    progress: 0,
    createdAt: Date.now(),
  },
  {
    id: 'evm-basics',
    title: 'EVM 基础知识',
    path: 'evm/basics',
    category: 'evm',
    subcategory: 'basics',
    content: `# EVM 基础知识

## 核心概念

### 账户类型
- EOA (外部账户): 由私钥控制
- 合约账户: 由代码控制

### 交易结构
- nonce: 交易序号
- gasPrice / maxFeePerGas: Gas 价格
- gasLimit: Gas 上限
- to: 接收地址
- value: 转账金额
- data: 调用数据

### Gas 机制
- Gas = 计算资源消耗
- Gas Price = 每单位 Gas 的价格
- 交易费 = Gas Used × Gas Price

## 常用工具

- ethers.js / viem: JavaScript SDK
- Hardhat / Foundry: 开发框架
- Etherscan: 区块浏览器

## EVM 兼容链

| 链 | 特点 |
|-----|------|
| BSC | 低 Gas，3s 出块 |
| Base | Coinbase L2 |
| Arbitrum | Optimistic Rollup |

Q: EVM 有哪两种账户类型？
A: EOA (外部账户) 和 合约账户

Q: 交易费如何计算？
A: 交易费 = Gas Used × Gas Price

Q: BSC 的出块时间是多少？
A: 3 秒`,
    tags: ['evm', 'basics', 'ethereum', 'bsc'],
    connections: ['evm-fourmeme'],
    progress: 0,
    createdAt: Date.now(),
  },
  {
    id: 'evm-fourmeme',
    title: 'FourMeme 研究笔记',
    path: 'evm/fourmeme',
    category: 'evm',
    subcategory: 'fourmeme',
    content: `# FourMeme 研究笔记

> BSC 链上的 Meme 发射平台

## 平台机制

### Bonding Curve
- 类似 PumpFun 的联合曲线
- BSC 链上运行
- 毕业后迁移到 PancakeSwap

### 与 PumpFun 对比
| 特性 | FourMeme | PumpFun |
|------|----------|---------|
| 链 | BSC | Solana |
| Gas 费 | 较低 | 极低 |
| 速度 | 3s | 400ms |
| DEX | PancakeSwap | Raydium |

## 合约交互

### 核心操作
- [ ] 创建代币
- [ ] 买入
- [ ] 卖出
- [ ] 查询价格

### 合约地址
\`\`\`
待补充
\`\`\`

## 数据获取

- [ ] 新币监控
- [ ] 交易监控
- [ ] 聪明钱追踪

## 交易策略

- [ ] 狙击策略
- [ ] 跟单策略
- [ ] 风险控制

Q: FourMeme 运行在哪条链上？
A: BSC (Binance Smart Chain)

Q: FourMeme 毕业后代币迁移到哪个 DEX？
A: PancakeSwap

Q: FourMeme 和 PumpFun 的主要区别是什么？
A: FourMeme 在 BSC 上，PumpFun 在 Solana 上；FourMeme 速度较慢(3s)但 Gas 费较低`,
    tags: ['evm', 'bsc', 'fourmeme', 'meme', 'defi'],
    connections: ['evm-basics', 'solana-pumpfun', 'trading-gmgn'],
    progress: 0,
    createdAt: Date.now(),
  },
  {
    id: 'trading-gmgn',
    title: 'GMGN 交易笔记',
    path: 'trading-journal/gmgn',
    category: 'trading',
    subcategory: 'gmgn',
    content: `# GMGN 交易笔记

> 链上数据分析 & 交易日志

## GMGN 工具使用

### 核心功能
- 新币发现
- 聪明钱追踪
- 持仓分析
- K线图表

### 常用筛选
- [ ] 市值范围
- [ ] 持仓集中度
- [ ] 开发者行为
- [ ] 聪明钱买入

## 交易日志模板

\`\`\`markdown
## [日期] [代币名称]

**链**: Solana / BSC / Base
**合约**:
**买入价格**:
**卖出价格**:
**盈亏**:

### 买入理由
-

### 卖出理由
-

### 复盘
- 做对了什么
- 做错了什么
- 下次改进
\`\`\`

## 月度统计

| 月份 | 交易次数 | 胜率 | 总盈亏 |
|------|----------|------|--------|
| 2026-01 | - | - | - |

Q: GMGN 的核心功能有哪些？
A: 新币发现、聪明钱追踪、持仓分析、K线图表

Q: 交易复盘应该包含哪些内容？
A: 做对了什么、做错了什么、下次改进`,
    tags: ['trading', 'gmgn', 'analysis'],
    connections: ['solana-pumpfun', 'evm-fourmeme'],
    progress: 0,
    createdAt: Date.now(),
  },
];

// Skill tree data
export const initialSkillTree: SkillNode[] = [
  // Solana Track
  {
    id: 'skill-solana-basics',
    title: 'Solana 基础',
    description: '学习 Solana 的账户模型和基本概念',
    noteIds: ['solana-basics'],
    prerequisites: [],
    status: 'available',
    xpReward: 100,
    position: { x: 100, y: 100 },
    category: 'solana',
  },
  {
    id: 'skill-solana-web3',
    title: 'Solana Web3.js',
    description: '掌握 @solana/web3.js SDK',
    noteIds: [],
    prerequisites: ['skill-solana-basics'],
    status: 'locked',
    xpReward: 150,
    position: { x: 250, y: 100 },
    category: 'solana',
  },
  {
    id: 'skill-pumpfun',
    title: 'PumpFun 机制',
    description: '深入理解 PumpFun 的 Bonding Curve',
    noteIds: ['solana-pumpfun'],
    prerequisites: ['skill-solana-web3'],
    status: 'locked',
    xpReward: 200,
    position: { x: 400, y: 100 },
    category: 'solana',
  },
  {
    id: 'skill-pumpfun-snipe',
    title: 'PumpFun 狙击',
    description: '学习 PumpFun 狙击策略',
    noteIds: [],
    prerequisites: ['skill-pumpfun'],
    status: 'locked',
    xpReward: 300,
    position: { x: 550, y: 100 },
    category: 'solana',
  },
  // EVM Track
  {
    id: 'skill-evm-basics',
    title: 'EVM 基础',
    description: '学习 EVM 的账户和交易模型',
    noteIds: ['evm-basics'],
    prerequisites: [],
    status: 'available',
    xpReward: 100,
    position: { x: 100, y: 250 },
    category: 'evm',
  },
  {
    id: 'skill-ethers',
    title: 'Ethers.js',
    description: '掌握 ethers.js SDK',
    noteIds: [],
    prerequisites: ['skill-evm-basics'],
    status: 'locked',
    xpReward: 150,
    position: { x: 250, y: 250 },
    category: 'evm',
  },
  {
    id: 'skill-fourmeme',
    title: 'FourMeme 机制',
    description: '深入理解 FourMeme 平台',
    noteIds: ['evm-fourmeme'],
    prerequisites: ['skill-ethers'],
    status: 'locked',
    xpReward: 200,
    position: { x: 400, y: 250 },
    category: 'evm',
  },
  {
    id: 'skill-fourmeme-snipe',
    title: 'FourMeme 狙击',
    description: '学习 FourMeme 狙击策略',
    noteIds: [],
    prerequisites: ['skill-fourmeme'],
    status: 'locked',
    xpReward: 300,
    position: { x: 550, y: 250 },
    category: 'evm',
  },
  // Trading Track
  {
    id: 'skill-trading-basics',
    title: '交易基础',
    description: '学习基本的交易概念和风险管理',
    noteIds: [],
    prerequisites: [],
    status: 'available',
    xpReward: 100,
    position: { x: 100, y: 400 },
    category: 'trading',
  },
  {
    id: 'skill-gmgn',
    title: 'GMGN 工具',
    description: '掌握 GMGN 数据分析工具',
    noteIds: ['trading-gmgn'],
    prerequisites: ['skill-trading-basics'],
    status: 'locked',
    xpReward: 150,
    position: { x: 250, y: 400 },
    category: 'trading',
  },
  {
    id: 'skill-smart-money',
    title: '聪明钱追踪',
    description: '学习追踪和分析聪明钱',
    noteIds: [],
    prerequisites: ['skill-gmgn'],
    status: 'locked',
    xpReward: 200,
    position: { x: 400, y: 400 },
    category: 'trading',
  },
  {
    id: 'skill-strategy',
    title: '交易策略',
    description: '制定和执行交易策略',
    noteIds: [],
    prerequisites: ['skill-smart-money', 'skill-pumpfun', 'skill-fourmeme'],
    status: 'locked',
    xpReward: 500,
    position: { x: 550, y: 400 },
    category: 'trading',
  },
];

// Achievements
export const initialAchievements: Achievement[] = [
  {
    id: 'first-blood',
    title: 'First Blood',
    description: '完成第一笔交易记录',
    icon: '🌱',
    condition: { type: 'trades', target: 1 },
    xpReward: 50,
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: '阅读 10 篇笔记',
    icon: '📚',
    condition: { type: 'notes_read', target: 10 },
    xpReward: 100,
  },
  {
    id: 'on-fire',
    title: 'On Fire',
    description: '连续学习 7 天',
    icon: '🔥',
    condition: { type: 'streak', target: 7 },
    xpReward: 200,
  },
  {
    id: 'diamond-hands',
    title: 'Diamond Hands',
    description: '记录 100 笔交易',
    icon: '💎',
    condition: { type: 'trades', target: 100 },
    xpReward: 500,
  },
  {
    id: 'smart-money',
    title: 'Smart Money',
    description: '完成聪明钱追踪模块',
    icon: '🧙',
    condition: { type: 'skill_complete', target: 1 },
    xpReward: 300,
  },
  {
    id: 'solana-master',
    title: 'Solana Master',
    description: '完成所有 Solana 技能',
    icon: '⚡',
    condition: { type: 'skill_complete', target: 4 },
    xpReward: 500,
  },
  {
    id: 'evm-master',
    title: 'EVM Master',
    description: '完成所有 EVM 技能',
    icon: '🔷',
    condition: { type: 'skill_complete', target: 4 },
    xpReward: 500,
  },
  {
    id: 'degen-master',
    title: 'Degen Master',
    description: '达到 10000 XP',
    icon: '👑',
    condition: { type: 'xp', target: 10000 },
    xpReward: 1000,
  },
];

// Level thresholds
export const levelThresholds = [
  { level: 1, title: 'Noob', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Apprentice', minXp: 100, maxXp: 300 },
  { level: 3, title: 'Trader', minXp: 300, maxXp: 600 },
  { level: 4, title: 'Analyst', minXp: 600, maxXp: 1000 },
  { level: 5, title: 'Expert', minXp: 1000, maxXp: 1500 },
  { level: 6, title: 'Master', minXp: 1500, maxXp: 2500 },
  { level: 7, title: 'Guru', minXp: 2500, maxXp: 4000 },
  { level: 8, title: 'Legend', minXp: 4000, maxXp: 6000 },
  { level: 9, title: 'Whale', minXp: 6000, maxXp: 10000 },
  { level: 10, title: 'Degen Master', minXp: 10000, maxXp: Infinity },
];
