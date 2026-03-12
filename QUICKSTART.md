# ⚡ 快速开始指南

## 🎯 3 分钟快速部署

### 方式一：使用自动化脚本（推荐）

```powershell
# 1. 打开 PowerShell，进入项目目录
cd C:\Users\Administrator\Desktop\dev\Planet

# 2. 运行自动化部署脚本
.\deploy.ps1
```

脚本会自动完成：
- ✅ 检查 Node.js 安装
- ✅ 设置执行策略
- ✅ 安装依赖
- ✅ 登录 Cloudflare
- ✅ 创建 D1 数据库
- ✅ 创建 KV 命名空间

### 方式二：手动分步执行

#### 步骤 1：解决权限问题（首次运行）
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

#### 步骤 2：安装依赖
```powershell
npm install
```

#### 步骤 3：登录 Cloudflare
```powershell
npx wrangler login
```

#### 步骤 4：创建 D1 数据库
```powershell
# 创建数据库
npx wrangler d1 create planet-navigation-db

# 复制返回的 database_id，更新到 wrangler.toml

# 初始化表结构
npx wrangler d1 execute planet-navigation-db --file=schema.sql
```

#### 步骤 5：创建 KV 命名空间
```powershell
npx wrangler kv:namespace create "NAVIGATION_KV"

# 复制返回的 id，更新到 wrangler.toml 的 id 和 preview_id
```

#### 步骤 6：本地测试
```powershell
npm run dev
```

访问 http://localhost:3000

#### 步骤 7：部署上线
```powershell
npm run deploy
```

## 🔧 关键配置项

### 更新 wrangler.toml

文件位置：`wrangler.toml`

需要替换两个 ID：

```toml
# D1 数据库 ID（替换为你的 D1 数据库 ID）
database_id = "你的 D1 数据库 ID"

# KV 命名空间 ID（替换为你的 KV 命名空间 ID）
[[kv_namespaces]]
binding = "NAVIGATION_KV"
id = "你的 KV 命名空间 ID"
preview_id = "你的 KV 命名空间 ID"
```

**注意**：项目中已经预设了 ID，如果是新项目需要替换成你自己的。

## 📝 常用命令速查

```powershell
# 开发
npm run dev              # 启动开发服务器

# 构建
npm run build            # 生产环境构建
npm run preview          # 本地预览生产版本

# 部署
npm run deploy           # 一键部署到 Cloudflare

# 数据库管理
npx wrangler d1 create planet-navigation-db     # 创建数据库
npx wrangler d1 execute planet-navigation-db --file=schema.sql  # 执行 SQL
npx wrangler d1 info planet-navigation-db       # 查看数据库信息

# KV 管理
npx wrangler kv:namespace create "NAVIGATION_KV"  # 创建 KV
npx wrangler kv:key put NAVIGATION_KV key value   # 写入键值
npx wrangler kv:key get NAVIGATION_KV key         # 读取键值

# 其他工具
npx wrangler login       # 登录 Cloudflare
npx wrangler whoami      # 查看当前账号
```

## 🌐 访问已部署的网站

部署成功后，Wrangler 会显示类似信息：

```
✨ Deployment complete!
Your deployment is now available at:
https://planet-navigation.xxx.pages.dev
```

访问这个 URL 即可看到你的导航站！

## 🐛 常见问题速查

### 问题 1：PowerShell 无法运行脚本
**解决**：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### 问题 2：npm install 失败
**解决**：
- 检查 Node.js 版本 >= 16
- 使用管理员权限运行 PowerShell
- 或直接使用 CMD

### 问题 3：wrangler login 失败
**解决**：
- 检查网络连接
- 清除浏览器缓存后重试
- 或手动访问 https://dash.cloudflare.com/oauth/authorize

### 问题 4：D1 数据库错误
**解决**：
```powershell
# 查看数据库列表
npx wrangler d1 list

# 删除重建
npx wrangler d1 delete planet-navigation-db
npx wrangler d1 create planet-navigation-db
```

### 问题 5：KV 缓存不工作
**解决**：
- 检查 wrangler.toml 中的 id 是否正确
- 确保 preview_id 也已更新
- 重新部署：`npm run deploy`

## 🎨 自定义内容

### 修改默认网站数据

编辑 `app.js` 文件中的 `websites` 数组：

```javascript
const websites = [
    {
        id: 1,
        name: '你的网站',
        icon: '🌐',
        url: 'https://example.com',
        description: '描述',
        category: 'tool',
        tags: ['标签 1', '标签 2']
    }
];
```

### 修改主题颜色

编辑 `style.css` 中的 CSS 变量：

```css
:root {
    --accent-color: #667eea;  /* 主色调 */
    --bg-primary: #f5f7fa;    /* 背景色 */
    /* ... 更多颜色 */
}
```

### 添加新分类

1. 在 `index.html` 添加分类按钮：
```html
<button class="category-btn" data-category="your_category">分类名</button>
```

2. 在 `app.js` 添加对应网站数据

## 📊 查看部署状态

### 在 Cloudflare Dashboard 查看

1. 访问 https://dash.cloudflare.com
2. 进入 Workers & Pages
3. 选择你的项目
4. 查看部署历史和日志

### 命令行查看

```powershell
# 查看部署列表
npx wrangler pages deployment list

# 查看项目信息
npx wrangler pages project view
```

## 🚀 下一步

- ✅ 测试所有功能是否正常
- ✅ 添加你自己的网站数据
- ✅ 自定义主题颜色
- ✅ 考虑绑定自定义域名
- ✅ 分享给朋友使用！

---

**祝你使用愉快！如有问题请查看 `DEPLOY.md` 获取详细文档。**
