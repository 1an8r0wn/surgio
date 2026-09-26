# 部署 - Cloudflare Workers

Surgio v4 的本地 CLI、Node Gateway 和 Cloudflare Worker 共用同一个
`surgio.project.ts`。Worker 部署使用 `@surgio/gateway`。

## 准备 Project

项目只需要维护一份配置：

```ts
// surgio.project.ts
import {
  defineClashProvider,
  defineSurgioProject,
  env,
  type SurgioNodeOptions,
} from 'surgio/project'

export default defineSurgioProject({
  artifacts: [
    {
      name: 'demo.conf',
      provider: 'demo',
      template: 'surge',
    },
  ],
  providers: {
    demo: () =>
      defineClashProvider({
        url: env('DEMO_SUBSCRIPTION_URL'),
      }),
  },
})

export const nodeOptions = async (): Promise<SurgioNodeOptions> => ({
  output: './dist',
  cache: { type: 'filesystem' },
})
```

`providers` 必须显式注册。`templateDir` 可以省略，默认是 `./template`。
`nodeOptions()` 只供本地 CLI 和 Node Gateway 使用，不会进入 Worker manifest。

必需的文本变量和 Secrets 可以通过 `env(name)` 读取。Worker 需要启用
[`nodejs_compat`](https://developers.cloudflare.com/workers/runtime-apis/nodejs/)，KV 和
Assets binding 则在 Worker 入口中传入。

## 构建 Worker

创建构建脚本：

```ts
// scripts/build-worker.ts
import { buildGatewayWorker } from '@surgio/gateway/worker/build'

await buildGatewayWorker()
```

运行后会生成：

- `.surgio/worker-manifest.mjs`
- `.surgio/gateway-assets`

`buildGatewayWorker()` 会自动读取当前目录的 `surgio.project.ts`，通常不需要传入任何
选项。

## 创建 Worker 入口

```ts
// worker.ts
import { createWorkerGateway } from '@surgio/gateway/worker'
import { createCloudflareKvStore } from 'surgio/cache/cloudflare'
import { TtlCache } from 'surgio/cache/core'

import manifest from './.surgio/worker-manifest.mjs'

export default createWorkerGateway<Env>(manifest, {
  bindings(env) {
    return {
      cache: new TtlCache({
        store: createCloudflareKvStore(env.SURGIO_CACHE),
      }),
      assets: env.ASSETS,
    }
  },
})
```

这里的 `Env` 由 Wrangler 根据配置生成。runtime 和缓存的复用由 Gateway 处理。

## 配置 Wrangler

在项目根目录创建 `wrangler.jsonc`：

```json
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "surgio-worker",
  "main": "worker.ts",
  "compatibility_date": "2026-08-17",
  "compatibility_flags": ["nodejs_compat"],
  "kv_namespaces": [
    {
      "binding": "SURGIO_CACHE",
      "id": "<KV namespace id>"
    }
  ],
  "assets": {
    "binding": "ASSETS",
    "directory": ".surgio/gateway-assets",
    "not_found_handling": "single-page-application",
    "run_worker_first": [
      "/api/*",
      "/get-artifact/*",
      "/export-providers",
      "/render"
    ]
  }
}
```

部署时请更新 `compatibility_date`。KV namespace id 会在下一步创建 KV 时获得。

在 `package.json` 中加入常用命令：

```json
{
  "scripts": {
    "build:worker": "node scripts/build-worker.ts",
    "types:worker": "wrangler types worker-configuration.d.ts",
    "worker:dev": "pnpm build:worker && wrangler dev",
    "worker:test": "pnpm build:worker && wrangler deploy --dry-run --outdir .surgio/dry-run",
    "worker:deploy": "pnpm build:worker && wrangler deploy"
  }
}
```

## 第一次部署

### 1. 安装 Wrangler 并登录

```bash
pnpm add -D wrangler
pnpm wrangler login
```

`login` 会打开浏览器，请选择准备部署 Surgio 的 Cloudflare 账号并授权。

### 2. 创建缓存空间

```bash
pnpm wrangler kv namespace create SURGIO_CACHE
```

命令完成后会输出一段包含 `id` 的配置。把这个 `id` 填入
`wrangler.jsonc` 中的 `<KV namespace id>`。

KV 只需要创建一次。以后重新部署代码时继续使用同一个 id。

### 3. 生成类型

```bash
pnpm wrangler types worker-configuration.d.ts
```

在 `tsconfig.json` 中包含生成的 `worker-configuration.d.ts`，之后就可以直接使用
`Env`、`SURGIO_CACHE` 和 `ASSETS` 的类型。

### 4. 准备本地变量

如果 Project 使用了 `env('DEMO_SUBSCRIPTION_URL')`，在项目根目录创建 `.dev.vars`：

```bash
DEMO_SUBSCRIPTION_URL="https://example.com/subscription"
```

把项目实际使用的其它变量也放进这个文件，并将 `.dev.vars*` 加入 `.gitignore`，不要
提交真实订阅地址、密码或 token。

现在可以在本地预览：

```bash
pnpm worker:dev
```

Wrangler 会在终端显示本地访问地址。

### 5. 首次发布

创建一个不会提交到 Git 的 `.env.production`，写入正式环境需要的变量：

```bash
DEMO_SUBSCRIPTION_URL="https://example.com/production-subscription"
```

然后执行：

```bash
pnpm build:worker
pnpm wrangler deploy --secrets-file .env.production
```

部署成功后，Wrangler 会显示类似
`https://surgio-worker.<your-subdomain>.workers.dev` 的访问地址。打开这个地址即可使用
Gateway。

记得将 `.env.production` 和其它 `.env*` 文件加入 `.gitignore`。

### 6. 以后更新

只修改了配置、Provider 或模板时，直接运行：

```bash
pnpm worker:deploy
```

已有 Secrets 会继续保留。如果只需要修改某个 Secret，可以运行：

```bash
pnpm wrangler secret put DEMO_SUBSCRIPTION_URL
```

按照提示粘贴新值即可。

## 部署前检查

```bash
pnpm types:worker
pnpm build:worker
pnpm worker:test
```

检查通过后运行 `pnpm worker:deploy`。如果部署失败，先确认已经登录、KV id 已填写，
以及 `.surgio/worker-manifest.mjs` 已由 `pnpm build:worker` 生成。

## 通过 GitHub 自动部署

完成[第一次部署](#第一次部署)后，可以把 Worker 连接到 GitHub 仓库。之后每次推送到
生产分支，Cloudflare 的 Workers Builds 会自动构建并发布，不需要再在本地运行
`pnpm worker:deploy`。

### 1. 准备仓库

- 提交 `wrangler.jsonc`、`worker-configuration.d.ts`、`scripts/build-worker.ts` 和
  `pnpm-lock.yaml`。`.surgio/` 由构建命令生成，`.dev.vars*` 和 `.env*` 包含凭据，
  这三者都不要提交。
- `wrangler.jsonc` 中的 `name` 必须和控制台中的 Worker 名称一致，否则构建会失败。
- 构建环境默认使用 Node.js 24，满足 Surgio 对 Node.js 22.22.2 及以上版本的要求。
  需要固定版本时，在仓库根目录添加内容为 `24` 的 `.node-version`。

### 2. 连接 GitHub

1. 打开 Cloudflare 控制台的 **Workers & Pages**，选择第一次部署时创建的 Worker。
2. 进入 **Settings** → **Builds**，点击 **Connect**，授权 GitHub 并选择仓库和生产分支。
3. 填写构建设置：

   | 设置 | 值 |
   | --- | --- |
   | Build command | `pnpm build:worker` |
   | Deploy command | `pnpm wrangler deploy` |
   | Root directory | 配置位于仓库子目录时填写该目录，否则留空 |

4. 保存后推送一次提交。构建状态和日志可以在 **Deployments** 页底部的
   **View build history** 中查看。

连接后建议只通过 Git 发布。本地继续运行 `pnpm worker:deploy` 也能部署，但线上版本会
和仓库中的提交对不上。

### 3. 管理变量

运行时变量和构建变量是两套配置，互不共享。

**运行时变量。** 第一次部署时通过 `--secrets-file` 写入的 Secrets 会一直保留，自动部署
不需要重新提供。新增或修改时运行 `pnpm wrangler secret put <NAME>`，或者在控制台的
**Settings** → **Variables & Secrets** 中添加，类型选择 Secret。在控制台添加的明文变量
会在下一次 `wrangler deploy` 时被删除，除非在 `wrangler.jsonc` 中设置
`"keep_vars": true`。

**构建变量。** `pnpm build:worker` 会在构建阶段导入 `surgio.project.ts`，而构建环境
读不到 Worker 的运行时变量。像上文的例子一样只在 Provider factory 中调用 `env()` 时，
构建不需要任何变量。如果 `urlBase`、Artifact 等顶层配置直接调用了 `env()`，构建会因为
变量缺失而失败。这时在 **Settings** → **Builds** 的 **Build variables and secrets** 中添加
同名变量，同时保留运行时的 Secret，因为 Worker 启动时会再次读取它。
