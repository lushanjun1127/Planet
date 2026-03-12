# Planet 导航站 - 部署指南

## 📋 前提条件

1. **Node.js** >= 16 (https://nodejs.org/)
2. **Cloudflare 账号** (https://dash.cloudflare.com/sign-up)
3. **Wrangler CLI**（会随 npm install 安装）

## 🔧 步骤一：解决 PowerShell 执行策略问题

如果遇到"无法加载文件"错误，需要修改 PowerShell 执行策略：

### 方法 1：临时允许当前会话（推荐）
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm install
```

### 方法 2：使用管理员权限永久修改
以管理员身份打开 PowerShell，运行：
```powershell
Set-ExecutionPolicy RemoteSigned -Force
```

### 方法 3：直接使用 CMD
切换到命令提示符 (CMD) 执行命令。

## 📦 步骤二：安装项目依赖

```bash
npm install
```

这将安装 Vite 和 Wrangler 等开发工具。

## ☁️ 步骤三：登录 Cloudflare

```bash
npx wrangler login
```

这会打开浏览器让你授权 Cloudflare。

## 🗄️ 步骤四：配置 D1 数据库

### 4.1 创建数据库（如果已创建可跳过）

```bash
npx wrangler d1 create planet-navigation-db
```

创建成功后会返回数据库 ID，复制该 ID。

### 4.2 更新 wrangler.toml

编辑 `wrangler.toml` 文件，将 database_id 替换为你的 D1 数据库 ID：

```toml
database_id = "你的 D1 数据库 ID"  # 替换这里
```

### 4.3 初始化数据库表结构

```bash
npx wrangler d1 execute planet-navigation-db --file=schema.sql
```

这会创建 websites 表并插入示例数据。

## 💾 步骤五：配置 KV 存储

### 5.1 创建 KV 命名空间

```bash
npx wrangler kv:namespace create "NAVIGATION_KV"
```

创建成功后会返回命名空间 ID，复制该 ID。

### 5.2 更新 wrangler.toml

编辑 `wrangler.toml` 文件，将 KV 的 id 和 preview_id 替换为你的 KV 命名空间 ID：

```toml
[[kv_namespaces]]
binding = "NAVIGATION_KV"
id = "你的 KV 命名空间 ID"           # 替换这里
preview_id = "你的 KV 命名空间 ID"   # 也替换这里
```

## 🚀 步骤六：本地开发测试

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

### 测试功能
- ✅ 切换主题（亮色/暗色）
- ✅ 搜索网站
- ✅ 分类筛选
- ✅ 点击卡片跳转

## 🌐 步骤七：部署到 Cloudflare Pages

### 7.1 构建项目

```bash
npm run build
```

这会在 `dist` 目录生成生产版本。

### 7.2 部署

```bash
npm run deploy
```

或者分步执行：

```bash
# 先构建
npm run build

# 再部署
npx wrangler pages deploy dist
```

首次部署时，Wrangler 会：
1. 创建一个新的 Pages 项目
2. 上传构建文件
3. 提供部署 URL（类似：https://planet-navigation.xxx.pages.dev）

## 🔍 验证部署

1. 访问部署后的 URL
2. 测试所有功能是否正常工作
3. 在 Cloudflare Dashboard 检查 D1 和 KV 配置

## 🛠️ 故障排查

### 问题 1：D1 数据库错误
确保：
- D1 数据库已创建
- database_id 正确
- SQL 脚本已成功执行

### 问题 2：KV 缓存错误
确保：
- KV 命名空间已创建
- id 和 preview_id 都已更新
- 绑定名称正确（NAVIGATION_KV）

### 问题 3：Pages Functions 不工作
检查：
- functions 目录结构是否正确
- [[path]].js 文件名正确
- export onRequest 语法正确

## 📊 管理已部署的应用

### 查看部署状态
```bash
npx wrangler pages deployment list
```

### 回滚到之前的版本
```bash
npx wrangler pages deployment rollback
```

### 查看日志
在 Cloudflare Dashboard -> Pages -> 你的项目 -> 部署 -> 查看日志

## 🔐 自定义域名（可选）

1. 在 Cloudflare Dashboard 进入 Pages 项目
2. 点击"自定义域名"
3. 添加你的域名
4. Cloudflare 会自动配置 DNS 和 SSL

## 💡 提示

- 项目使用了记忆中的 D1 和 KV ID 配置
- 所有网站数据存储在 D1 数据库中
- KV 用于缓存，提高查询性能（5 分钟过期）
- 前端默认显示本地数据，有后端 API 时会自动切换

## 📞 获取帮助

如遇到问题：
1. 检查 Cloudflare Dashboard 的错误日志
2. 查看 wrangler 输出信息
3. 确保所有配置 ID 都已正确替换
