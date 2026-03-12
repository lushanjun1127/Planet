# Planet 导航站 - 项目结构说明

## 📁 完整的项目目录结构

```
Planet/
├── functions/                    # Cloudflare Pages Functions（后端 API）
│   └── [[path]].js              # 统一路由处理函数
│
├── index.html                    # 主页面
├── style.css                     # 样式文件（包含双主题）
├── app.js                        # 前端 JavaScript 逻辑
│
├── package.json                  # 项目配置和依赖
├── vite.config.js                # Vite 构建配置
├── wrangler.toml                 # Cloudflare Workers 配置
├── schema.sql                    # D1 数据库初始化脚本
│
├── README.md                     # 项目说明文档
├── DEPLOY.md                     # 详细部署指南
├── deploy.ps1                    # PowerShell 自动化部署脚本
├── .gitignore                    # Git 忽略规则
│
└── dist/                         # 构建输出目录（运行后生成）
    ├── index.html
    ├── assets/
    │   ├── index-[hash].css
    │   └── index-[hash].js
    └── _routes.json
```

## 🎯 核心功能模块

### 1️⃣ 前端部分

#### **index.html** - 主页面结构
- 响应式布局
- 语义化标签
- SEO 友好

#### **style.css** - 样式系统
- CSS 变量定义主题颜色
- 亮色/暗色主题切换
- 响应式设计（移动优先）
- 卡片动画效果
- 渐变和阴影美化

#### **app.js** - 前端交互逻辑
- 网站数据渲染
- 实时搜索功能
- 分类筛选
- 主题切换（localStorage 持久化）
- 点击跳转

### 2️⃣ 后端部分

#### **functions/[[path]].js** - API 服务器
Cloudflare Pages Functions 提供以下 API：

```javascript
GET  /api/websites      // 获取所有网站
POST /api/websites      // 添加网站
PUT  /api/websites/:id  // 更新网站
DELETE /api/websites/:id // 删除网站
GET  /api/search?q=xxx  // 搜索网站
```

**特性：**
- ✅ CORS 跨域支持
- ✅ KV 缓存（5 分钟过期）
- ✅ D1 数据库持久化
- ✅ 错误处理
- ✅ RESTful API 设计

### 3️⃣ 数据存储

#### **D1 数据库** - 关系型数据存储
```sql
表名：websites
字段:
- id: 主键（自增）
- name: 网站名称
- icon: 图标 emoji
- url: 网站链接
- description: 描述
- category: 分类（anime/game/tool/social/study）
- tags: 标签数组（JSON 格式）
- created_at: 创建时间
```

#### **KV 存储** - 高速缓存
- `websites_cache`: 缓存网站列表（5 分钟 TTL）
- 减少 D1 查询次数，提高性能

### 4️⃣ 配置文件

#### **package.json**
```json
{
  "scripts": {
    "dev": "vite",           // 启动开发服务器
    "build": "vite build",   // 生产构建
    "preview": "wrangler pages dev dist",  // 本地预览生产版
    "deploy": "npm run build && wrangler pages deploy dist"  // 部署
  }
}
```

#### **vite.config.js**
- 输出目录：`dist/`
- 开发端口：`3000`
- 资源目录：`assets/`

#### **wrangler.toml**
```toml
# D1 数据库绑定
[[d1_databases]]
binding = "DB"
database_id = "6230ca31-358f-4e95-9d6b-1fe4bd7e6ebf"

# KV 命名空间绑定
[[kv_namespaces]]
binding = "NAVIGATION_KV"
id = "79ebba1b99c14578a1dc882520c059ba"
```

#### **schema.sql**
- 创建 websites 表
- 插入 12 条示例数据
- 创建索引优化查询

## 🎨 设计特点

### 视觉设计
- ✨ 二次元风格配色
- 🌈 渐变色彩运用
- 🎭 毛玻璃效果（backdrop-filter）
- 💫 流畅的过渡动画
- 📦 卡片式设计

### 用户体验
- ⚡ 快速加载（Vite 构建优化）
- 🔍 即时搜索反馈
- 🌓 主题切换记忆
- 📱 移动端适配
- 🖱️ 悬停交互效果

## 🔄 工作流程

### 开发流程
```
1. npm run dev
   ↓
2. Vite 启动开发服务器（端口 3000）
   ↓
3. 热重载（HMR）实时更新
   ↓
4. 浏览器访问 localhost:3000
```

### 部署流程
```
1. npm run build
   ↓
2. Vite 构建生产版本
   ↓
3. 输出到 dist/ 目录
   ↓
4. wrangler pages deploy dist
   ↓
5. 上传到 Cloudflare Pages CDN
   ↓
6. 全球边缘节点分发
```

### API 请求流程
```
前端请求
   ↓
Pages Functions (functions/[[path]].js)
   ↓
检查 KV 缓存
   ├─→ 命中缓存 → 返回缓存数据
   └─→ 未命中 → 查询 D1 数据库
         ↓
       写入 KV 缓存（5 分钟）
         ↓
       返回 JSON 响应
```

## 🛠️ 技术亮点

### 1. **零服务器架构**
- 完全无服务器运行
- Cloudflare 边缘计算
- 按请求付费（免费额度充足）

### 2. **高性能缓存策略**
- KV 内存缓存（毫秒级响应）
- D1 SQLite 数据库
- CDN 全球分发

### 3. **现代化构建**
- Vite 极速冷启动
- ESBuild 快速打包
- Tree-shaking 代码优化

### 4. **数据持久化**
- D1 关系型数据库
- SQL 查询能力
- 事务支持

## 📊 默认数据分类

| 分类 | 数量 | 代表网站 |
|------|------|---------|
| 📺 动漫 | 3 | Bilibili, Pixiv, YouTube |
| 🎮 游戏 | 2 | Steam, Epic Games |
| 💻 工具 | 2 | GitHub, Notion |
| 🐦 社交 | 3 | Twitter, Discord, V2EX |
| 📚 学习 | 2 | Coursera, MDN |

## 🔐 安全特性

- ✅ HTTPS 强制（Cloudflare SSL）
- ✅ CORS 头配置
- ✅ SQL 注入防护（参数化查询）
- ✅ XSS 防护（内容转义）
- ✅ DDoS 保护（Cloudflare）

## 📈 扩展方向

### 短期优化
- [ ] 添加用户认证系统
- [ ] 后台管理界面
- [ ] 网站提交审核功能
- [ ] 访问统计功能

### 长期规划
- [ ] 多语言支持
- [ ] 自定义主题编辑器
- [ ] 网站评分系统
- [ ] 收藏夹功能
- [ ] PWA 离线支持

## 💰 成本估算

### Cloudflare 免费额度
- **Pages**: 无限请求 + 500MB 带宽/天
- **D1**: 5GB 存储 + 10 万次读操作/天
- **KV**: 10 万次读操作/天

**结论**: 个人使用完全免费！

## 🎓 学习价值

通过这个项目你可以学到：
- ✅ Cloudflare Workers 开发
- ✅ Pages Functions 路由
- ✅ D1 数据库操作
- ✅ KV 缓存策略
- ✅ Vite 构建工具
- ✅ 响应式网页设计
- ✅ RESTful API 设计
- ✅ SQL 基础操作

---

**祝你部署顺利！🚀**

如有问题，请查看 `DEPLOY.md` 获取详细部署步骤。
