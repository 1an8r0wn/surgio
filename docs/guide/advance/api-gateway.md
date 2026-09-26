# 前言

相信很多人都用过网络上处理规则的 API 接口，也有人在使用过 Surgio 后觉得更新规则不太灵活。虽然我们已经能够通过自动化的方法每隔一段时间更新一次规则，但还是无法做到实时更新。这篇文章就是想教大家，利用现成的 SAAS(Software as a Service) 服务，来实现一个 Surgio 规则仓库的 API。

本节的教程基于 Surgio v4 和 `@surgio/gateway` v3，要求仓库已经迁移为 `surgio.project.ts`。还在使用 `surgio.conf.js` 的仓库请先阅读 [v4 升级指南](/guide/upgrade-guide-v4)。

可以选择以下几种部署方式，它们共用同一个 `surgio.project.ts`：

- [Cloudflare Workers](/guide/advance/api-gateway/cloudflare-workers)：在构建期预编译模板，缓存使用 Cloudflare KV。
- [Netlify Functions](/guide/advance/api-gateway/netlify)：Serverless 函数，不需要维护服务器。
- [Railway](/guide/advance/api-gateway/railway)：容器化部署，推送到 GitHub 后自动更新。
- [Docker](/guide/advance/api-gateway/docker)：部署在自己的服务器上，不提供技术支持。
