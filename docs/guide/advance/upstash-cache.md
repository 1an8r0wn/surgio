---
toc_max_heading_level: 2
---

# 开启 Upstash REST 缓存

Serverless 平台的本地文件会在重新部署或实例回收后丢失。Upstash REST 通过 HTTP 访问 Redis，每次请求独立完成，不需要维持连接，适合 Netlify、AWS Lambda 这类每次调用都可能冷启动的环境。

能维持 TCP 连接的常驻 Node 服务（Docker、Railway、自建服务器）可以直接使用 [Redis 缓存](/guide/advance/redis-cache)。Cloudflare Worker 应该使用 [KV binding](/guide/advance/api-gateway/cloudflare-workers)。

## 创建数据库

在 Upstash 创建 Redis 数据库后，取得以下两项 REST 凭据：

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

这里需要 REST 凭据，不是 `redis://` 或 `rediss://` 连接地址。

## 配置

Upstash 缓存只在 Node 中使用，写在 `surgio.project.ts` 的 `nodeOptions()` 中。推荐把凭据设置为部署平台的 secret，Surgio 会读取上面两个官方环境变量：

```ts
// surgio.project.ts
import type { SurgioNodeOptions } from 'surgio/project'

export const nodeOptions = async (): Promise<SurgioNodeOptions> => ({
  cache: { type: 'upstash' },
})
```

凭据保存在其他环境变量中时，可以用 `upstashRestUrl` 和 `upstashRestToken` 指定。它们的优先级高于官方环境变量，两项可以只填一项，另一项继续读取对应的官方环境变量：

```ts
import { env, type SurgioNodeOptions } from 'surgio/project'

export const nodeOptions = async (): Promise<SurgioNodeOptions> => ({
  cache: {
    type: 'upstash',
    upstashRestUrl: env('MY_UPSTASH_REST_URL'),
    upstashRestToken: env('MY_UPSTASH_REST_TOKEN'),
  },
})
```

URL 或 Token 缺失时，Surgio 在第一次访问缓存前报错。

## 数据与清理

Surgio 的所有 key 都带有 `surgio:` 前缀，过期时间与缓存 TTL 相同，由 Upstash 负责清理。`surgio clean-cache` 只删除 `surgio:` 前缀下的 key，同一个数据库中其他应用的数据不受影响。
