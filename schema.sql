-- 创建网站数据表
CREATE TABLE IF NOT EXISTS websites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT DEFAULT '🔗',
    url TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'other',
    tags TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 插入示例数据
INSERT INTO websites (name, icon, url, description, category, tags) VALUES 
('Bilibili', '📺', 'https://www.bilibili.com', '国内知名的视频弹幕网站，拥有丰富的动漫、游戏等内容', 'anime', '["视频", "弹幕", "二次元"]'),
('Steam', '🎮', 'https://store.steampowered.com', '全球最大的综合性数字游戏发行平台', 'game', '["游戏", "平台", "PC"]'),
('GitHub', '💻', 'https://github.com', '全球最大的代码托管平台和开发者社区', 'tool', '["代码", "Git", "开源"]'),
('Twitter', '🐦', 'https://twitter.com', '全球知名的社交媒体平台，实时资讯分享', 'social', '["社交", "资讯", "分享"]'),
('Coursera', '📚', 'https://www.coursera.org', '世界顶尖大学提供的在线课程学习平台', 'study', '["教育", "课程", "学习"]'),
('Pixiv', '🎨', 'https://www.pixiv.net', '日本知名的插画师作品分享网站', 'anime', '["插画", "艺术", "二次元"]'),
('Discord', '💬', 'https://discord.com', '游戏玩家和社区的语音聊天软件', 'social', '["聊天", "语音", "社区"]'),
('Notion', '📝', 'https://www.notion.so', '多功能笔记和协作工具', 'tool', '["笔记", "效率", "协作"]'),
('V2EX', '🌐', 'https://www.v2ex.com', '创意工作者们的讨论社区', 'social', '["社区", "技术", "讨论"]'),
('MDN Web Docs', '📖', 'https://developer.mozilla.org', '权威的 Web 开发技术文档', 'study', '["文档", "Web", "学习"]'),
('Epic Games', '🎯', 'https://www.epicgames.com', '知名游戏发行商，每周免费游戏', 'game', '["游戏", "平台", "免费"]'),
('YouTube', '▶️', 'https://www.youtube.com', '全球最大的视频分享网站', 'anime', '["视频", "分享", "全球"]');

-- 创建索引以提高搜索性能
CREATE INDEX IF NOT EXISTS idx_category ON websites(category);
CREATE INDEX IF NOT EXISTS idx_name ON websites(name);
