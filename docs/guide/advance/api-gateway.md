# 前言

相信很多人都用过网络上处理规则的 API 接口，也有人在使用过 Surgio 后觉得更新规则不太灵活。虽然我们已经能够通过自动化的方法每隔一段时间更新一次规则，但还是无法做到实时更新。这篇文章就是想教大家，利用现成的 SAAS(Software as a Service) 服务，来实现一个 Surgio 规则仓库的 API。

目前 Surgio 多个部署平台，推荐 Railway 和 Netlify。你也可以部署在自己的主机上，不过没有技术支持。

需要保证 Surgio 版本号大于 `v1.20.0`。
