# DynamicDetail 动态详情组件

一个通用的动态详情/表单组件，根据后端提供的 schema 配置自动渲染详情页面或表单。

## 功能特性

- ✅ 根据 schema 自动渲染详情或表单
- ✅ 支持多种字段类型：文本、数字、日期、选择框、文本域、开关、字典等
- ✅ 支持字段分组显示
- ✅ 支持只读模式和编辑模式
- ✅ 支持表单验证
- ✅ 支持自定义格式化函数
- ✅ 支持自定义组件
- ✅ 响应式布局

## 基础用法

```vue
<template>
  <DynamicDetail :schema="schema" :data="detailData" :loading="loading" :editable="false" />
</template>

<script setup>
import { DynamicDetail } from '@/components/DynamicDetail'

const schema = [
  {
    field: 'name',
    label: '姓名',
    type: 'text',
    group: '基本信息'
  },
  {
    field: 'age',
    label: '年龄',
    type: 'number',
    group: '基本信息'
  }
]

const detailData = {
  name: '张三',
  age: 30
}
</script>
```

## Props

| 参数        | 说明             | 类型                  | 默认值  |
| ----------- | ---------------- | --------------------- | ------- |
| schema      | Schema 配置数组  | `FieldSchema[]`       | `[]`    |
| data        | 数据对象         | `Record<string, any>` | `{}`    |
| editable    | 是否可编辑       | `boolean`             | `false` |
| readonly    | 是否只读         | `boolean`             | `false` |
| loading     | 是否显示加载状态 | `boolean`             | `false` |
| showActions | 是否显示操作按钮 | `boolean`             | `true`  |
| showBack    | 是否显示返回按钮 | `boolean`             | `true`  |
| showSave    | 是否显示保存按钮 | `boolean`             | `true`  |

## Events

| 事件名 | 说明       | 参数                          |
| ------ | ---------- | ----------------------------- |
| save   | 保存时触发 | `(data: Record<string, any>)` |
| back   | 返回时触发 | `()`                          |

## FieldSchema 字段配置

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| field | 字段名（必填） | `string` | - |
| label | 标签（必填） | `string` | - |
| type | 字段类型 | `'text' \| 'number' \| 'date' \| 'datetime' \| 'select' \| 'textarea' \| 'boolean' \| 'dict' \| 'tag' \| 'custom'` | `'text'` |
| value | 默认值 | `any` | - |
| required | 是否必填 | `boolean` | `false` |
| disabled | 是否禁用 | `boolean` | `false` |
| readonly | 是否只读 | `boolean` | `false` |
| span | 占位列数（1-24） | `number` | `12` |
| group | 分组名称 | `string` | - |
| dictType | 字典类型（type 为 dict 时使用） | `string` | - |
| options | 选项列表（type 为 select 时使用） | `Array<{label: string, value: any}>` | - |
| formatter | 格式化函数（自定义格式化，优先级高于 formatterType） | `(value: any) => string` | - |
| formatterType | 格式化类型（后端配置，如：currency, percentage, number, date, datetime 等） | `string` | - |
| formatterConfig | 格式化配置（配合 formatterType 使用） | `{ currencySymbol?: string, decimals?: number, dateFormat?: string, datetimeFormat?: string }` | - |
| component | 自定义组件名称 | `string` | - |
| componentProps | 自定义组件属性 | `Record<string, any>` | - |
| rules | 验证规则 | `any[]` | - |
| placeholder | 占位符 | `string` | - |
| dateFormat | 日期格式 | `string` | - |
| show | 是否显示 | `boolean` | `true` |

## 字段类型说明

### text

文本输入框

```javascript
{
  field: 'name',
  label: '姓名',
  type: 'text'
}
```

### number

数字输入框

```javascript
{
  field: 'age',
  label: '年龄',
  type: 'number'
}
```

### date

日期选择器

```javascript
{
  field: 'birthday',
  label: '生日',
  type: 'date',
  dateFormat: 'YYYY-MM-DD'
}
```

### datetime

日期时间选择器

```javascript
{
  field: 'createTime',
  label: '创建时间',
  type: 'datetime',
  dateFormat: 'YYYY-MM-DD HH:mm:ss'
}
```

### select

下拉选择框

```javascript
{
  field: 'gender',
  label: '性别',
  type: 'select',
  options: [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ]
}
```

### textarea

多行文本输入框

```javascript
{
  field: 'remark',
  label: '备注',
  type: 'textarea'
}
```

### boolean

开关

```javascript
{
  field: 'isActive',
  label: '是否激活',
  type: 'boolean'
}
```

### dict

字典选择（需要配合 DictSelect 组件）

```javascript
{
  field: 'status',
  label: '状态',
  type: 'dict',
  dictType: 'DICT_TYPE.STATUS'
}
```

## 使用示例

### 详情展示模式

```vue
<template>
  <DynamicDetail :schema="schema" :data="detailData" :editable="false" />
</template>

<script setup>
import { DynamicDetail } from '@/components/DynamicDetail'

const schema = [
  {
    field: 'name',
    label: '姓名',
    type: 'text',
    group: '基本信息'
  },
  {
    field: 'age',
    label: '年龄',
    type: 'number',
    group: '基本信息'
  },
  {
    field: 'salary',
    label: '薪资',
    type: 'number',
    formatter: (value) => (value ? `¥${value.toLocaleString()}` : '-'),
    group: '工作信息'
  }
]

const detailData = {
  name: '张三',
  age: 30,
  salary: 25000
}
</script>
```

### 编辑模式

```vue
<template>
  <DynamicDetail :schema="schema" :data="detailData" :editable="true" @save="handleSave" />
</template>

<script setup>
import { DynamicDetail } from '@/components/DynamicDetail'

const schema = [
  {
    field: 'name',
    label: '姓名',
    type: 'text',
    required: true,
    group: '基本信息'
  },
  {
    field: 'email',
    label: '邮箱',
    type: 'text',
    rules: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
    group: '基本信息'
  }
]

const detailData = ref({
  name: '张三',
  email: 'zhangsan@example.com'
})

const handleSave = async (data) => {
  console.log('保存数据:', data)
  // 调用 API 保存
}
</script>
```

### 使用 formatterType（推荐，后端配置）

后端可以通过 `formatterType` 字段指定格式化类型，前端会自动应用对应的格式化逻辑：

```javascript
{
  field: 'salary',
  label: '薪资',
  type: 'number',
  formatterType: 'currency', // 后端配置：货币格式
  formatterConfig: {
    currencySymbol: '¥',  // 货币符号，默认 ¥
    decimals: 2           // 小数位数，默认 2
  }
}

{
  field: 'interestRate',
  label: '利率',
  type: 'number',
  formatterType: 'percentage', // 后端配置：百分比格式
  formatterConfig: {
    decimals: 2  // 小数位数，默认 2
  }
}

{
  field: 'amount',
  label: '金额',
  type: 'number',
  formatterType: 'number' // 后端配置：千分位数字格式
}
```

### 支持的 formatterType 类型

| formatterType | 说明                 | 示例                        |
| ------------- | -------------------- | --------------------------- |
| `currency`    | 货币格式             | ¥1,000.00                   |
| `percentage`  | 百分比格式           | 10.50%                      |
| `number`      | 千分位数字格式       | 1,000                       |
| `date`        | 日期格式             | 2024-01-15                  |
| `datetime`    | 日期时间格式         | 2024-01-15 10:30:00         |
| `filesize`    | 文件大小格式         | 1.50 MB                     |
| `phone`       | 手机号格式（脱敏）   | 138\*\*\*\*8888             |
| `idcard`      | 身份证格式（脱敏）   | 110101**\*\*\*\***1234      |
| `bankcard`    | 银行卡号格式（脱敏） | \***\* \*\*** \*\*\*\* 1234 |

### 自定义格式化函数（兼容旧版本）

如果后端无法返回 `formatterType`，仍然可以使用自定义 `formatter` 函数：

```javascript
{
  field: 'salary',
  label: '薪资',
  type: 'number',
  formatter: (value) => {
    if (!value) return '-'
    return `¥${value.toLocaleString()}`
  }
}
```

**注意**：`formatter` 函数的优先级高于 `formatterType`，如果同时存在，会优先使用 `formatter` 函数。

### 字段分组

```javascript
const schema = [
  {
    field: 'name',
    label: '姓名',
    type: 'text',
    group: '基本信息' // 分组1
  },
  {
    field: 'company',
    label: '公司',
    type: 'text',
    group: '工作信息' // 分组2
  }
]
```

### 使用插槽自定义渲染

```vue
<template>
  <DynamicDetail :schema="schema" :data="detailData">
    <template #status="{ item, value }">
      <el-tag :type="value === 'active' ? 'success' : 'info'">
        {{ value === 'active' ? '激活' : '未激活' }}
      </el-tag>
    </template>
  </DynamicDetail>
</template>
```

## 注意事项

1. `field` 和 `label` 是必填字段
2. `data` 对象中的字段名必须与 `schema` 中的 `field` 对应
3. 使用 `group` 字段可以对字段进行分组显示
4. `formatter` 函数只在只读模式下生效
5. 编辑模式下，`required` 字段会自动添加必填验证
6. 可以通过 `show` 字段控制字段的显示/隐藏
