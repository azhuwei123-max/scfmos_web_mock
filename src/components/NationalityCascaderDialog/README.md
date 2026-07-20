# NationalityCascaderDialog 国籍级联选择对话框组件

一个用于选择国籍的级联选择对话框组件，支持洲/国家/地区的三级选择。

## 功能特性

- ✅ 级联选择器（洲/国家/地区）
- ✅ 支持搜索过滤
- ✅ 支持清空选择
- ✅ 支持初始值回显
- ✅ 可配置选项数据和级联配置
- ✅ 返回最后一级的值（国家或地区）

## 基础用法

```vue
<template>
  <el-button @click="dialogVisible = true">选择国籍</el-button>

  <NationalityCascaderDialog
    v-model="dialogVisible"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref } from 'vue'
import { NationalityCascaderDialog } from '@/components/NationalityCascaderDialog'

const dialogVisible = ref(false)

const handleConfirm = (nationalityValue: string) => {
  console.log('选择的国籍:', nationalityValue)
  // nationalityValue 是最后一级的值，例如：'中国大陆'、'日本'、'美国' 等
}

const handleCancel = () => {
  console.log('取消选择')
}
</script>
```

## 带初始值

```vue
<template>
  <NationalityCascaderDialog
    v-model="dialogVisible"
    :initial-value="currentNationality"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import { NationalityCascaderDialog } from '@/components/NationalityCascaderDialog'

const dialogVisible = ref(false)
const currentNationality = ref(['亚洲', '中国', '中国大陆']) // 级联路径数组

const handleConfirm = (nationalityValue: string) => {
  console.log('选择的国籍:', nationalityValue)
}
</script>
```

## 自定义选项数据

```vue
<template>
  <NationalityCascaderDialog
    v-model="dialogVisible"
    :options="customOptions"
    :cascader-props="customCascaderProps"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import { NationalityCascaderDialog } from '@/components/NationalityCascaderDialog'

const dialogVisible = ref(false)

const customOptions = [
  {
    value: '亚洲',
    label: '亚洲',
    children: [
      { value: '中国', label: '中国' },
      { value: '日本', label: '日本' }
    ]
  }
]

const customCascaderProps = {
  value: 'value',
  label: 'label',
  children: 'children',
  emitPath: true
}

const handleConfirm = (nationalityValue: string) => {
  console.log('选择的国籍:', nationalityValue)
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 弹框显示状态 | `boolean` | `false` |
| title | 弹框标题 | `string` | `'选择国籍'` |
| width | 弹框宽度 | `string` | `'800px'` |
| options | 级联选择器选项数据 | `any[]` | `nationalityOptions`（从常量文件导入） |
| cascaderProps | 级联选择器配置 | `object` | `nationalityCascaderProps`（从常量文件导入） |
| placeholder | 占位符 | `string` | `'请选择洲/国家/地区'` |
| clearable | 是否可清空 | `boolean` | `true` |
| filterable | 是否可搜索 | `boolean` | `true` |
| showAllLevels | 输入框中是否显示选中值的完整路径 | `boolean` | `false` |
| initialValue | 初始值（用于回显，级联路径数组） | `string \| string[]` | - |

## Events

| 事件名            | 说明             | 参数                                           |
| ----------------- | ---------------- | ---------------------------------------------- |
| confirm           | 确认选择时触发   | `(value: string)` - 最后一级的值（国家或地区） |
| cancel            | 取消选择时触发   | `()`                                           |
| update:modelValue | 弹框显示状态变化 | `(value: boolean)`                             |

## 数据结构

### options 数据结构

```typescript
interface CascaderOption {
  value: string
  label: string
  children?: CascaderOption[]
}

// 示例
const options: CascaderOption[] = [
  {
    value: '亚洲',
    label: '亚洲',
    children: [
      {
        value: '中国',
        label: '中国',
        children: [
          { value: '中国大陆', label: '中国大陆' },
          { value: '香港', label: '香港' }
        ]
      },
      {
        value: '日本',
        label: '日本'
      }
    ]
  }
]
```

### cascaderProps 配置

```typescript
const cascaderProps = {
  value: 'value', // 选项的值的字段名
  label: 'label', // 选项的标签的字段名
  children: 'children', // 选项的子选项的字段名
  emitPath: true // 是否返回完整路径
}
```

## 注意事项

1. 组件默认使用 `@/views/customer/personal/const/detail` 中的 `nationalityOptions` 和 `nationalityCascaderProps`
2. `confirm` 事件返回的是最后一级的值（国家或地区），而不是完整的路径
3. 如果需要完整路径，可以通过 `initialValue` 传入路径数组进行回显
4. 组件会自动处理弹框打开/关闭时的状态重置

## 使用场景

- 客户信息管理中的国籍选择
- 证件信息中的国籍选择
- 其他需要选择国籍的场景
