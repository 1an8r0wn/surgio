---
toc_max_heading_level: 2
---

# 开启 Redis 缓存

Surgio 默认把缓存写到本地文件，服务重新部署或迁移实例后，远程片段和 Provider 都要重新下载。Redis 缓存运行在独立的服务中，重新部署后仍然有效，多个 Surgio 实例也可以共用。

Redis 缓存通过 TCP 连接 Redis，适用于 Docker、Railway、自建服务器等常驻的 Node 服务。Cloudflare Worker 不能使用 Redis，应该使用 [KV binding](/guide/advance/api-gateway/cloudflare-workers)。每次请求都会冷启动的 Serverless 函数更适合 [Upstash REST 缓存](/guide/advance/upstash-cache)，它不需要维持连接。

## 准备 Redis

Railway 等平台可以直接添加 Redis 服务，也可以使用自建或托管的 Redis。准备好后取得连接地址：

```
redis://:password@example.com:6379/0
```

开启了 TLS 的实例使用 `rediss://`：

```
rediss://:password@example.com:6380/0
```

Surgio 服务和 Redis 最好部署在同一个区域，每次缓存读写都要经过一次网络往返。

## 配置

Redis 缓存只在 Node 中使用，写在 `surgio.project.ts` 的 `nodeOptions()` 中。推荐把连接地址设置为 `REDIS_URL` 环境变量：

```ts
// surgio.project.ts
import type { SurgioNodeOptions } from 'surgio/project'

export const nodeOptions = async (): Promise<SurgioNodeOptions> => ({
  cache: { type: 'redis' },
})
```

也可以用 `redisUrl` 指定连接地址，它的优先级高于 `REDIS_URL`：

```ts
import { env, type SurgioNodeOptions } from 'surgio/project'

export const nodeOptions = async (): Promise<SurgioNodeOptions> => ({
  cache: {
    type: 'redis',
    redisUrl: env('MY_REDIS_URL'),
  },
})
```

`redisUrl` 只接受 `redis://` 或 `rediss://` 开头的地址。`redisUrl` 和 `REDIS_URL` 都缺失时，Surgio 在第一次访问缓存前报错。

## 数据与清理

Surgio 的所有 key 都带有 `surgio:` 前缀，过期时间与缓存 TTL 相同，由 Redis 负责清理。`surgio clean-cache` 只删除 `surgio:` 前缀下的 key，同一个数据库中其他应用的数据不受影响。

Surgio 只在第一次读写缓存时建立连接，命令结束时断开，不读写缓存的命令不会连接 Redis。

## 连接失败

Redis 无法连接时，每次缓存读写只重试一次，随后报错，Surgio 不会改用文件缓存。错误信息包含 Redis 的地址和端口，不包含密码。常驻服务中的客户端会在后台继续重连，Redis 恢复后缓存自动可用。
