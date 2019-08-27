---
title: Artifact 产品
sidebarDepth: 2
---

# Artifact 产品

Surgio 会根据 Artifact 的值来生成配置文件。你可以一次性配置多个 Artifact，一次性生成所有需要的配置文件。

```js
{
  name: 'SurgeV3.conf',
  template: 'surge_v3',
  provider: 'demo',
}
```

## 属性

### name

- 类型: `string`
- 默认值: `undefined`
- <Badge text="必须" vertical="middle" />

配置文件名

### template

- 类型: `string`
- 默认值: `undefined`
- <Badge text="必须" vertical="middle" />

模板名。会在 `./template` 目录内寻找同名文件（`.tpl` 后缀可省略）。

### provider

- 类型: `string`
- 默认值: `undefined`
- <Badge text="必须" vertical="middle" />

模板名。会在 `./provider` 目录内寻找同名文件（`.js` 后缀可省略）。

## 方法

### proxyGroupModifier(nodeList, filters)

- 类型: `Function`
- 入参: `(NodeConfig[], { hkFilter, usFilter, netflixFilter, youtubePremiumFilter })`
- 返回值: `Object[]`

为了解决 Clash 的 `Proxy Group` 组装引入了这个构造函数。在使用 [`clashProxyConfig` 模板变量](/guide/custom-template#clashproxyconfig) 之前必须要自己实现这个方法。

方法返回的数组中可以包含以下几种对象：

*1. 完整的代理选择列表*

```js
{
  name: '🚀 Proxy',
  type: 'select',
}
```

*2. 经过过滤的代理选择列表*

```js
{
  name: '🎬 Netflix',
  filter: filters.netflixFilter,
  type: 'select',
}
```

:::tip
内置的 `filters` 会被 Provider 中定义的 filter 覆盖
:::

*3. 经过过滤的代理自动测速列表*

```js
{
  name: 'US',
  filter: filters.usFilter,
  type: 'url-test',
}
```

*4. 自定义的代理选择列表*

```js
{
  name: '🍎 Apple',
  proxies: ['DIRECT', '🚀 Proxy', 'US', 'HK'],
  type: 'select',
}
```

:::warning 注意
`proxies` 中的代理名称必须已被定义
:::

*4. 自定义的代理自动测速列表*

```js
{
  name: '🍎 Apple',
  proxies: ['🚀 Proxy', 'US', 'HK'],
  type: 'url-test',
}
```
