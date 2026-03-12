// Cloudflare Pages 函数 - API 路由
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // CORS 头设置
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // 处理 OPTIONS 预检请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // API 路由：获取所有网站
    if (url.pathname === '/api/websites' && request.method === 'GET') {
      return await handleGetWebsites(env, corsHeaders);
    }

    // API 路由：添加网站
    if (url.pathname === '/api/websites' && request.method === 'POST') {
      return await handleAddWebsite(request, env, corsHeaders);
    }

    // API 路由：更新网站
    if (url.pathname.match(/^\/api\/websites\/\d+$/) && request.method === 'PUT') {
      const id = url.pathname.split('/').pop();
      return await handleUpdateWebsite(id, request, env, corsHeaders);
    }

    // API 路由：删除网站
    if (url.pathname.match(/^\/api\/websites\/\d+$/) && request.method === 'DELETE') {
      const id = url.pathname.split('/').pop();
      return await handleDeleteWebsite(id, env, corsHeaders);
    }

    // 搜索 API
    if (url.pathname === '/api/search' && request.method === 'GET') {
      const query = url.searchParams.get('q');
      return await handleSearch(query, env, corsHeaders);
    }

    // 默认返回 404
    return new Response('Not Found', { 
      status: 404,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// 获取所有网站
async function handleGetWebsites(env, corsHeaders) {
  try {
    // 尝试从 KV 缓存获取
    const cached = await env.NAVIGATION_KV.get('websites_cache');
    if (cached) {
      return new Response(cached, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'X-Cache': 'HIT'
        }
      });
    }

    // 从 D1 数据库获取
    const { results } = await env.DB.prepare(
      'SELECT * FROM websites ORDER BY created_at DESC'
    ).all();

    const response = JSON.stringify(results || []);
    
    // 缓存到 KV（5 分钟）
    await env.NAVIGATION_KV.put('websites_cache', response, { expirationTtl: 300 });

    return new Response(response, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'X-Cache': 'MISS'
      }
    });
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
}

// 添加网站
async function handleAddWebsite(request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { name, icon, url, description, category, tags } = body;

    // 验证必填字段
    if (!name || !url) {
      return new Response(
        JSON.stringify({ error: '名称和 URL 是必填项' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 插入数据库
    const result = await env.DB.prepare(`
      INSERT INTO websites (name, icon, url, description, category, tags, created_at)
      VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(name, icon || '🔗', url, description || '', category || 'other', JSON.stringify(tags || [])).run();

    // 清除缓存
    await env.NAVIGATION_KV.delete('websites_cache');

    return new Response(
      JSON.stringify({ 
        success: true, 
        id: result.meta?.last_row_id,
        message: '网站添加成功'
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error adding website:', error);
    return new Response(
      JSON.stringify({ error: '添加失败' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// 更新网站
async function handleUpdateWebsite(id, request, env, corsHeaders) {
  try {
    const body = await request.json();
    const { name, icon, url, description, category, tags } = body;

    // 更新数据库
    await env.DB.prepare(`
      UPDATE websites 
      SET name = ?, icon = ?, url = ?, description = ?, category = ?, tags = ?
      WHERE id = ?
    `).bind(name, icon, url, description, category, JSON.stringify(tags), id).run();

    // 清除缓存
    await env.NAVIGATION_KV.delete('websites_cache');

    return new Response(
      JSON.stringify({ success: true, message: '网站更新成功' }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error updating website:', error);
    return new Response(
      JSON.stringify({ error: '更新失败' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// 删除网站
async function handleDeleteWebsite(id, env, corsHeaders) {
  try {
    await env.DB.prepare('DELETE FROM websites WHERE id = ?').bind(id).run();

    // 清除缓存
    await env.NAVIGATION_KV.delete('websites_cache');

    return new Response(
      JSON.stringify({ success: true, message: '网站已删除' }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error deleting website:', error);
    return new Response(
      JSON.stringify({ error: '删除失败' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}

// 搜索网站
async function handleSearch(query, env, corsHeaders) {
  try {
    if (!query) {
      return new Response(
        JSON.stringify({ error: '请提供搜索关键词' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // 从 D1 数据库搜索
    const searchTerm = `%${query}%`;
    const { results } = await env.DB.prepare(`
      SELECT * FROM websites 
      WHERE name LIKE ? OR description LIKE ?
      ORDER BY created_at DESC
    `).bind(searchTerm, searchTerm).all();

    return new Response(JSON.stringify(results || []), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error searching:', error);
    throw error;
  }
}
