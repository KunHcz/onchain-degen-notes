# Onchain Degen Notes

链上学习笔记系统 - 革命性的 Web3 学习体验

**Live Demo**: https://kunhcz.github.io/onchain-degen-notes/

## 特色功能

### 3D 知识星图 (Knowledge Universe)
- 可交互的 3D 星空，每个笔记是一颗星球
- 星球大小代表内容深度，亮度代表学习进度
- 星球之间的连线展示知识关联
- 支持旋转、缩放、点击探索

### RPG 技能树 (Skill Tree)
- 游戏化的学习路径可视化
- 完成前置知识解锁下一节点
- 状态显示：锁定 → 可学习 → 学习中 → 已掌握
- 每个技能节点关联 XP 奖励

### 间隔重复系统 (Spaced Repetition)
- 基于 SM-2 算法的智能复习
- 从笔记自动生成闪卡
- 记忆强度可视化
- 评分系统：Again / Hard / Good / Easy

### 交易仪表盘 (Trading Dashboard)
- 盈亏曲线图表
- 按链分类统计 (Solana/BSC/Base/ETH)
- 情绪标签记录 (Confident/Neutral/FOMO/Fear)
- 胜率和总 P&L 分析

### 游戏化系统 (Gamification)
- 经验值 (XP) 和等级系统
- 连续学习天数 (Streak)
- 成就徽章解锁
- 从 "Noob" 升级到 "Degen Master"

## 技术栈

| 技术 | 用途 |
|------|------|
| React 18 + TypeScript | 前端框架 |
| Vite | 构建工具 |
| Three.js / React Three Fiber | 3D 可视化 |
| Framer Motion | 动画效果 |
| Zustand | 状态管理 |
| Chart.js | 图表 |
| Tailwind CSS | 样式系统 |
| Fuse.js | 模糊搜索 |

## 本地运行

```bash
# 克隆仓库
git clone https://github.com/KunHcz/onchain-degen-notes.git
cd onchain-degen-notes

# 安装依赖
cd web
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
onchain-degen-notes/
├── web/                        # 前端应用
│   ├── src/
│   │   ├── components/
│   │   │   ├── KnowledgeUniverse/  # 3D 知识星图
│   │   │   ├── SkillTree/          # 技能树
│   │   │   ├── Flashcards/         # 闪卡复习
│   │   │   ├── Dashboard/          # 交易仪表盘
│   │   │   ├── Gamification/       # 游戏化系统
│   │   │   ├── NoteViewer/         # 笔记查看器
│   │   │   └── Layout/             # 布局组件
│   │   ├── stores/                 # Zustand 状态
│   │   └── data/                   # 数据定义
│   └── package.json
├── evm/                        # EVM 链学习笔记
│   ├── basics/
│   ├── bsc/
│   ├── base/
│   └── fourmeme/
├── solana/                     # Solana 链学习笔记
│   ├── basics/
│   └── pumpfun/
├── trading-journal/            # 交易日志
│   └── gmgn/
└── resources/                  # 学习资源
```

## 学习路线

### Phase 1: 基础
- [ ] EVM 基础 (账户、交易、Gas)
- [ ] Solana 基础 (账户模型、Program)
- [ ] Web3.js / Ethers.js / Solana Web3

### Phase 2: 合约交互
- [ ] 读取合约数据
- [ ] 发送交易
- [ ] 事件监听

### Phase 3: Meme 平台
- [ ] PumpFun (Solana) 机制研究
- [ ] FourMeme (BSC) 机制研究
- [ ] 链上数据分析

### Phase 4: 实战
- [ ] 交易策略
- [ ] 风险控制
- [ ] 复盘总结

## 核心平台

| 平台 | 链 | 说明 |
|------|-----|------|
| PumpFun | Solana | Meme 发射平台 |
| FourMeme | BSC | Meme 发射平台 |
| GMGN | Multi-chain | 链上数据分析 |

## Roadmap

查看 [Issues](https://github.com/KunHcz/onchain-degen-notes/issues) 了解开发计划：

- [x] 3D 知识星图
- [x] RPG 技能树
- [x] 间隔重复闪卡
- [x] 交易仪表盘
- [x] 游戏化系统
- [x] GitHub Pages 部署
- [ ] 导入真实 Markdown 笔记
- [ ] 交互式代码沙盒
- [ ] AI 学习助手
- [ ] 增强交易分析

## License

MIT

---

> 未来一定是链上的
