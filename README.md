# 我的博客

这是 feitian124 的博客, 基于 Astro 和主题 AstroPaper, 欢迎阅读和交流。

- 源码 https://github.com/feitian124/blog
- 网址 https://p2y.top

## Memos 功能

博客集成了 Memos 功能，使用 Cloudflare D1 数据库存储。

### 数据库 Schema

```sql
CREATE TABLE IF NOT EXISTS memos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 部署步骤

1. **初始化远程数据库**（首次部署时执行）：
```bash
npx wrangler d1 execute my-memos-db --remote --command "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);"
```

2. **配置环境变量**：在 Cloudflare Pages 设置中添加 `MEMO_API_KEY`

3. **部署**：
```bash
pnpm build
npx wrangler pages deploy dist
```

### 本地开发

创建 `.dev.vars` 文件：
```
MEMO_API_KEY=your-api-key
```

## 感谢

- Astro: https://astro.build/
- AstroPaper 主题: https://github.com/satnaing/astro-paper
