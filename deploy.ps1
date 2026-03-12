# Planet 导航站 - 快速部署脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Planet 导航站 - 快速部署工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js
Write-Host "[1/6] 检查 Node.js 安装..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js 已安装：$nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ 错误：未检测到 Node.js，请先安装 Node.js (https://nodejs.org/)" -ForegroundColor Red
    exit 1
}

# 设置执行策略
Write-Host "`n[2/6] 设置 PowerShell 执行策略..." -ForegroundColor Yellow
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process -Force
Write-Host "✓ 执行策略已设置" -ForegroundColor Green

# 安装依赖
Write-Host "`n[3/6] 安装项目依赖..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ 依赖安装失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 依赖安装完成" -ForegroundColor Green

# Cloudflare 登录
Write-Host "`n[4/6] 登录 Cloudflare..." -ForegroundColor Yellow
Write-Host "提示：如果还未登录，将打开浏览器进行授权" -ForegroundColor Gray
npx wrangler login
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Cloudflare 登录失败" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Cloudflare 登录成功" -ForegroundColor Green

# D1 数据库配置
Write-Host "`n[5/6] 配置 D1 数据库..." -ForegroundColor Yellow
Write-Host "选项：" -ForegroundColor Gray
Write-Host "  1. 创建新的 D1 数据库" -ForegroundColor Gray
Write-Host "  2. 使用现有数据库（需要手动更新 wrangler.toml）" -ForegroundColor Gray
$dbChoice = Read-Host "请选择 (1/2)"

if ($dbChoice -eq "1") {
    Write-Host "创建 D1 数据库..." -ForegroundColor Gray
    npx wrangler d1 create planet-navigation-db
    Write-Host "✓ 数据库创建完成" -ForegroundColor Green
    Write-Host "提示：请复制返回的数据库 ID 并更新到 wrangler.toml" -ForegroundColor Yellow
    
    Write-Host "初始化数据库表结构..." -ForegroundColor Gray
    npx wrangler d1 execute planet-navigation-db --file=schema.sql
    Write-Host "✓ 数据库初始化完成" -ForegroundColor Green
} else {
    Write-Host "提示：请确保 wrangler.toml 中的 database_id 已正确配置" -ForegroundColor Yellow
}

# KV 命名空间配置
Write-Host "`n[6/6] 配置 KV 存储..." -ForegroundColor Yellow
Write-Host "选项：" -ForegroundColor Gray
Write-Host "  1. 创建新的 KV 命名空间" -ForegroundColor Gray
Write-Host "  2. 使用现有 KV（需要手动更新 wrangler.toml）" -ForegroundColor Gray
$kvChoice = Read-Host "请选择 (1/2)"

if ($kvChoice -eq "1") {
    Write-Host "创建 KV 命名空间..." -ForegroundColor Gray
    npx wrangler kv:namespace create "NAVIGATION_KV"
    Write-Host "✓ KV 命名空间创建完成" -ForegroundColor Green
    Write-Host "提示：请复制返回的命名空间 ID 并更新到 wrangler.toml" -ForegroundColor Yellow
} else {
    Write-Host "提示：请确保 wrangler.toml 中的 KV id 已正确配置" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  配置完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "接下来的步骤：" -ForegroundColor Yellow
Write-Host "1. 检查 wrangler.toml 中的 D1 database_id 和 KV id 是否正确" -ForegroundColor White
Write-Host "2. 运行 'npm run dev' 在本地测试" -ForegroundColor White
Write-Host "3. 运行 'npm run deploy' 部署到 Cloudflare" -ForegroundColor White
Write-Host ""
