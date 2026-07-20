# CodeViewer 代码展示组件

一个通用的代码展示组件，支持多种编程语言的语法高亮显示，包括 XML、JSON、JavaScript、TypeScript、Java、SQL 等。

## 功能特性

- ✅ 支持多种编程语言语法高亮（XML、JSON、JavaScript、TypeScript、Java、SQL、CSS、SCSS、Python、Bash、YAML 等）
- ✅ 自动检测语言类型
- ✅ 一键复制代码
- ✅ 可自定义高度和标题
- ✅ 响应式滚动显示
- ✅ 美观的代码样式

## 基础用法

```vue
<template>
  <CodeViewer :code="xmlCode" language="xml" />
</template>

<script setup>
import { CodeViewer } from '@/components/CodeViewer'

const xmlCode = `<?xml version="1.0" encoding="UTF-8"?>
<root>
  <item>示例</item>
</root>`
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| code | 代码内容 | `string` | `''` |
| language | 语言类型（xml, json, javascript, typescript, java, sql, css, scss, python, bash, yaml 等） | `string` | `'xml'` |
| title | 标题 | `string` | `''` |
| showCopy | 是否显示复制按钮 | `boolean` | `true` |
| height | 代码区域高度 | `string` | `'400px'` |
| autoDetect | 是否自动检测语言类型 | `boolean` | `false` |

## 使用示例

### 展示 XML 代码

```vue
<template>
  <CodeViewer :code="xmlData" language="xml" title="XML 数据" height="500px" />
</template>

<script setup>
import { CodeViewer } from '@/components/CodeViewer'

const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<CustomerData>
  <Customer>
    <Id>001</Id>
    <Name>张三</Name>
  </Customer>
</CustomerData>`
</script>
```

### 展示 JSON 代码

```vue
<template>
  <CodeViewer :code="jsonData" language="json" title="JSON 数据" />
</template>

<script setup>
import { CodeViewer } from '@/components/CodeViewer'

const jsonData = JSON.stringify(
  {
    name: '张三',
    age: 30,
    address: '北京市'
  },
  null,
  2
)
</script>
```

### 自动检测语言类型

```vue
<template>
  <CodeViewer :code="codeData" :auto-detect="true" title="代码展示" />
</template>

<script setup>
import { CodeViewer } from '@/components/CodeViewer'

// 组件会自动检测是 XML 还是 JSON
const codeData = `<?xml version="1.0"?>
<root>...</root>`
</script>
```

### 展示 JavaScript 代码

```vue
<template>
  <CodeViewer :code="jsCode" language="javascript" title="JavaScript 代码" />
</template>

<script setup>
import { CodeViewer } from '@/components/CodeViewer'

const jsCode = `function hello(name) {
  console.log('Hello, ' + name)
}

hello('World')`
</script>
```

### 不显示复制按钮

```vue
<template>
  <CodeViewer :code="codeData" language="xml" :show-copy="false" />
</template>
```

### 自定义高度

```vue
<template>
  <CodeViewer :code="codeData" language="xml" height="600px" />
</template>
```

## 支持的语言类型

组件支持以下语言类型（通过 `language` prop 指定）：

- `xml` / `html` - XML/HTML
- `json` - JSON
- `javascript` / `js` - JavaScript
- `typescript` / `ts` - TypeScript
- `java` - Java
- `sql` - SQL
- `css` - CSS
- `scss` / `sass` - SCSS/SASS
- `python` / `py` - Python
- `bash` / `shell` / `sh` - Bash/Shell
- `yaml` / `yml` - YAML

## 样式定制

组件使用了 `highlight.js` 的 `github` 主题。如果需要自定义样式，可以通过以下方式：

```vue
<style scoped>
:deep(.code-viewer-container .hljs) {
  background-color: #1e1e1e !important;
  color: #d4d4d4 !important;
}
</style>
```

## 注意事项

1. 组件会自动注册语言支持，无需手动配置
2. 使用 `autoDetect` 时，组件会根据代码内容自动判断语言类型
3. 复制功能依赖浏览器的 Clipboard API，部分浏览器可能不支持
4. 代码内容较长时，建议设置合适的 `height` 值，并使用滚动查看
