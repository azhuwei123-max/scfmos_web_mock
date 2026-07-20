# HoldingTypeSelect 控股类型选择组件

一个用于选择企业控股类型的输入框组件，内置树形选择对话框，支持从后端接口获取数据或使用本地 mock 数据。

## 功能特性

- ✅ 直接显示为输入框，类似 `RegionSelect` 组件
- ✅ 点击 `...` 按钮打开树形选择对话框
- ✅ 支持从后端接口获取完整的控股类型树形数据
- ✅ 接口失败时自动降级使用 mock 数据
- ✅ 只能选择叶子节点（具体的控股类型）
- ✅ 支持数据回显（根据已选值自动定位）
- ✅ 支持清空选择
- ✅ 支持 `v-model` 双向绑定

## 使用方法

### 基础用法

```vue
<template>
  <el-form-item label="控股类型" prop="holdingType">
    <HoldingTypeSelect v-model="formData.holdingType" placeholder="请选择控股类型" />
  </el-form-item>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  holdingType: ''
})
</script>
```

### 禁用接口，使用 mock 数据

```vue
<template>
  <HoldingTypeSelect v-model="formData.holdingType" placeholder="请选择控股类型" :use-api="false" />
</template>
```

### 禁用状态

```vue
<template>
  <HoldingTypeSelect v-model="formData.holdingType" placeholder="请选择控股类型" disabled />
</template>
```

## Props

| 参数        | 说明                                       | 类型      | 默认值             |
| ----------- | ------------------------------------------ | --------- | ------------------ |
| modelValue  | 绑定值（控股类型的 title）                 | `string`  | `''`               |
| placeholder | 输入框占位文本                             | `string`  | `'请选择控股类型'` |
| clearable   | 是否可以清空选项                           | `boolean` | `true`             |
| disabled    | 是否禁用                                   | `boolean` | `false`            |
| useApi      | 是否使用接口数据，`false` 时使用 mock 数据 | `boolean` | `true`             |

## Events

| 事件名            | 说明             | 回调参数        |
| ----------------- | ---------------- | --------------- |
| update:modelValue | 选中值改变时触发 | `value: string` |
| change            | 选中值改变时触发 | `value: string` |

## 数据格式

### 后端接口返回格式

后端接口应返回树形结构数据，格式如下：

```typescript
{
  code: 0,
  data: [
    {
      key: string        // 节点代码
      value: string      // 节点值（与 key 相同）
      title: string      // 节点名称
      isLeaf: boolean    // 是否为叶子节点
      id: string         // 节点ID
      parentId: string   // 父级ID（根节点为 null）
      disabled: boolean  // 是否禁用
      children: Array    // 子节点数组（叶子节点为 null）
    }
  ]
}
```

### 选择逻辑

- `isLeaf: false` → 非叶子节点，禁用选择，只能展开查看子节点
- `isLeaf: true` → 叶子节点，可以选择
- 只有叶子节点可以确认选择并更新 `v-model` 值

### v-model 返回值

`v-model` 绑定的是选中节点的 `title` 字段（控股类型名称），例如：

```typescript
'外商相对控股' // 选中后的值
```

## 完整示例

```vue
<template>
  <el-form :model="formData" :rules="rules" ref="formRef">
    <el-form-item label="控股类型" prop="holdingType">
      <HoldingTypeSelect v-model="formData.holdingType" placeholder="请选择控股类型" />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive } from 'vue'

const formData = reactive({
  holdingType: ''
})

const rules = {
  holdingType: [{ required: true, message: '请选择控股类型', trigger: 'change' }]
}
</script>
```

## API 接口预留

组件已预留 API 接口位置，在 `src/components/HoldingTypeSelect/index.vue` 中：

```typescript
// TODO: 接口对接后，取消注释下面的代码，并删除 mock 数据逻辑
// import { HoldingTypeApi } from '@/api/system/holdingType'
// const res = await HoldingTypeApi.getHoldingTypeTree()
// treeData.value = res.data || []
```

需要创建对应的 API 文件：`src/api/system/holdingType.ts`

## Mock 数据

组件包含完整的 Mock 数据，包括：

- 内资企业（国有企业、集体企业、私人控股）
- 港、澳、台控股
- 外商控股
- 个体经营

所有层级结构完整，符合实际业务需求。

## 注意事项

1. 组件默认使用接口数据，如果接口失败会自动降级使用 mock 数据
2. mock 数据仅包含部分主要控股类型的示例数据，生产环境建议使用接口数据
3. 只有叶子节点（`isLeaf: true`）可以选择，非叶子节点会自动禁用
4. `v-model` 绑定的是选中节点的 `title` 字段（控股类型名称）
5. 组件会自动处理数据回显，打开对话框时会自动定位到已选中的节点
