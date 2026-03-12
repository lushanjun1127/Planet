# Planet 导航站

一个部署在 Cloudflare Pages 上的二次元风格导航站，支持双主题切换、实时搜索等功能。

## ✨ 功能特性

- 🎨 **双主题切换**：亮色/暗色主题自由切换
- 🔍 **实时搜索**：快速查找所需网站
- 📱 **响应式设计**：完美适配各种设备
- 🗄️ **D1 数据库**：使用 Cloudflare D1 存储数据
- 💾 **KV 缓存**：使用 KV 存储提高性能
- 🚀 **快速部署**：一键部署到 Cloudflare

## 🛠️ 技术栈

- **前端**：原生 HTML/CSS/JavaScript
- **构建工具**：Vite
- **后端**：Cloudflare Workers (Pages Functions)
- **数据库**：Cloudflare D1
- **缓存**：Cloudflare KV

## 📦 安装和配置

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化 D1 数据库

```bash
# 创建数据库（如果还没有创建）
wrangler d1 create planet-navigation-db

# 执行 SQL 脚本初始化数据库
wrangler d1 execute planet-navigation-db --file=schema.sql
```

### 3. 创建 KV 命名空间

```bash
wrangler kv:namespace create "NAVIGATION_KV"
```

创建后会返回 ID，请将其更新到 `wrangler.toml` 文件中。

### 4. 配置 wrangler.toml

确保 `wrangler.toml` 中的数据库 ID 和 KV 命名空间 ID 已正确配置：

```toml
database_id = "你的 D1 数据库 ID"
id = "你的 KV 命名空间 ID"
```

## 🚀 开发

启动本地开发服务器：

```bash
npm run dev
```

访问 http://localhost:3000 预览效果。

## 🌐 部署

### 部署到 Cloudflare Pages

```bash
npm run deploy
```

此命令会自动构建项目并部署到 Cloudflare Pages。

### 本地预览生产版本

```bash
npm run preview
```

## 📊 API 接口

### 获取所有网站
```
GET /api/websites
```

### 添加网站
```
POST /api/websites
Content-Type: application/json

{
  "name": "网站名称",
  "icon": "🔗",
  "url": "https://example.com",
  "description": "描述",
  "category": "tool",
  "tags": ["标签 1", "标签 2"]
}
```

### 更新网站
```
PUT /api/websites/:id
Content-Type: application/json

{
  "name": "新名称",
  ...
}
```

### 删除网站
```
DELETE /api/websites/:id
```

### 搜索网站
```
GET /api/search?q=关键词
```

## 📝 自定义

### 修改默认数据

编辑 `app.js` 中的 `websites` 数组来修改默认显示的网站。

### 修改主题颜色

编辑 `style.css` 中的 CSS 变量来自定义主题颜色。

## 📄 License

MIT
