// 网站数据（可以从后端 API 获取）
const websites = [
    {
        id: 1,
        name: 'Bilibili',
        icon: '📺',
        url: 'https://www.bilibili.com',
        description: '国内知名的视频弹幕网站，拥有丰富的动漫、游戏等内容',
        category: 'anime',
        tags: ['视频', '弹幕', '二次元']
    },
    {
        id: 2,
        name: 'Steam',
        icon: '🎮',
        url: 'https://store.steampowered.com',
        description: '全球最大的综合性数字游戏发行平台',
        category: 'game',
        tags: ['游戏', '平台', 'PC']
    },
    {
        id: 3,
        name: 'GitHub',
        icon: '💻',
        url: 'https://github.com',
        description: '全球最大的代码托管平台和开发者社区',
        category: 'tool',
        tags: ['代码', 'Git', '开源']
    },
    {
        id: 4,
        name: 'Twitter',
        icon: '🐦',
        url: 'https://twitter.com',
        description: '全球知名的社交媒体平台，实时资讯分享',
        category: 'social',
        tags: ['社交', '资讯', '分享']
    },
    {
        id: 5,
        name: 'Coursera',
        icon: '📚',
        url: 'https://www.coursera.org',
        description: '世界顶尖大学提供的在线课程学习平台',
        category: 'study',
        tags: ['教育', '课程', '学习']
    },
    {
        id: 6,
        name: 'Pixiv',
        icon: '🎨',
        url: 'https://www.pixiv.net',
        description: '日本知名的插画师作品分享网站',
        category: 'anime',
        tags: ['插画', '艺术', '二次元']
    },
    {
        id: 7,
        name: 'Discord',
        icon: '💬',
        url: 'https://discord.com',
        description: '游戏玩家和社区的语音聊天软件',
        category: 'social',
        tags: ['聊天', '语音', '社区']
    },
    {
        id: 8,
        name: 'Notion',
        icon: '📝',
        url: 'https://www.notion.so',
        description: '多功能笔记和协作工具',
        category: 'tool',
        tags: ['笔记', '效率', '协作']
    },
    {
        id: 9,
        name: 'V2EX',
        icon: '🌐',
        url: 'https://www.v2ex.com',
        description: '创意工作者们的讨论社区',
        category: 'social',
        tags: ['社区', '技术', '讨论']
    },
    {
        id: 10,
        name: 'MDN Web Docs',
        icon: '📖',
        url: 'https://developer.mozilla.org',
        description: '权威的 Web 开发技术文档',
        category: 'study',
        tags: ['文档', 'Web', '学习']
    },
    {
        id: 11,
        name: 'Epic Games',
        icon: '🎯',
        url: 'https://www.epicgames.com',
        description: '知名游戏发行商，每周免费游戏',
        category: 'game',
        tags: ['游戏', '平台', '免费']
    },
    {
        id: 12,
        name: 'YouTube',
        icon: '▶️',
        url: 'https://www.youtube.com',
        description: '全球最大的视频分享网站',
        category: 'anime',
        tags: ['视频', '分享', '全球']
    }
];

// DOM 元素
const websiteGrid = document.getElementById('websiteGrid');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const themeToggle = document.getElementById('themeToggle');
const categoryBtns = document.querySelectorAll('.category-btn');

// 当前状态
let currentCategory = 'all';
let searchQuery = '';

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    loadWebsites();
    initTheme();
    initEventListeners();
});

// 加载网站列表
function loadWebsites() {
    const filtered = filterWebsites();
    renderWebsites(filtered);
}

// 筛选网站
function filterWebsites() {
    return websites.filter(site => {
        const matchCategory = currentCategory === 'all' || site.category === currentCategory;
        const matchSearch = searchQuery === '' || 
            site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            site.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            site.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchCategory && matchSearch;
    });
}

// 渲染网站卡片
function renderWebsites(sites) {
    websiteGrid.innerHTML = '';
    
    if (sites.length === 0) {
        websiteGrid.innerHTML = '<div class="no-results">😕 没有找到匹配的网站</div>';
        return;
    }

    sites.forEach((site, index) => {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="icon">${site.icon}</div>
            <h3>${site.name}</h3>
            <p>${site.description}</p>
            <div class="tags">
                ${site.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;

        card.addEventListener('click', () => {
            window.open(site.url, '_blank');
        });

        websiteGrid.appendChild(card);
    });
}

// 主题切换
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', theme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// 事件监听器
function initEventListeners() {
    // 分类筛选
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            loadWebsites();
        });
    });

    // 搜索功能
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        } else {
            searchQuery = searchInput.value;
            loadWebsites();
        }
    });
}

function performSearch() {
    searchQuery = searchInput.value;
    loadWebsites();
}

// 从 API 加载数据（可选，用于连接后端）
async function loadFromAPI() {
    try {
        const response = await fetch('/api/websites');
        if (response.ok) {
            const data = await response.json();
            // 更新 websites 数组
            websites.splice(0, websites.length, ...data);
            loadWebsites();
        }
    } catch (error) {
        console.log('使用本地数据');
    }
}
