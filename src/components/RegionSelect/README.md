# RegionSelect 地区选择组件

一个用于选择中国省/市/区的级联选择组件，支持从后端接口获取数据或使用本地 mock 数据。

## 功能特性

- ✅ 支持从后端接口 `/system/area/tree` 获取完整的省市区数据
- ✅ 自动转换后端数据格式为 cascader 需要的格式
- ✅ 接口失败时自动降级使用 mock 数据
- ✅ 支持所有 `el-cascader` 的常用属性
- ✅ 支持 `v-model` 双向绑定
- ✅ 支持搜索过滤
- ✅ 支持清空选择

## 使用方法

### 基础用法

```vue
<template>
  <el-form-item label="地区" prop="region">
    <RegionSelect v-model="formData.region" placeholder="请选择省/市/区" />
  </el-form-item>
</template>

<script setup>
import { RegionSelect } from '@/components/RegionSelect'

const formData = reactive({
  region: []
})
</script>
```

### 禁用接口，使用 mock 数据

```vue
<template>
  <RegionSelect 
    v-model="formData.region" 
    :use-api="false"
    placeholder="请选择地区"
  />
</template>
```

### 禁用状态

```vue
<template>
  <RegionSelect 
    v-model="formData.region" 
    disabled
    placeholder="请选择地区"
  />
</template>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| modelValue | 绑定值，支持 `string \| number \| (string \| number)[]` | `string \| number \| (string \| number)[]` | - |
| placeholder | 输入框占位文本 | `string` | `'请选择省/市/区'` |
| clearable | 是否可以清空选项 | `boolean` | `true` |
| filterable | 是否可搜索 | `boolean` | `true` |
| disabled | 是否禁用 | `boolean` | `false` |
| showAllLevels | 输入框中是否显示选中值的完整路径 | `boolean` | `false` |
| useApi | 是否使用接口数据，`false` 时使用 mock 数据 | `boolean` | `true` |

## Events

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| update:modelValue | 选中值改变时触发 | `value: string \| number \| (string \| number)[] \| undefined` |
| change | 选中值改变时触发 | `value: string \| number \| (string \| number)[] \| undefined` |

## 数据格式

### 后端接口返回格式

后端接口 `/system/area/tree` 返回的数据格式：

```typescript
{
  key: string        // 地区代码
  value: string      // 地区代码（与 key 相同）
  title: string      // 地区名称
  isLeaf: boolean    // 是否为叶子节点
  id: string         // 地区ID
  parentId: string   // 父级ID
  departName: string // 部门名称（备用）
  disabled: boolean  // 是否禁用
  children: Array    // 子节点数组
}
```

### 组件内部转换格式

组件会自动将后端数据转换为 `el-cascader` 需要的格式：

```typescript
{
  value: string      // 地区代码
  label: string      // 地区名称
  disabled: boolean  // 是否禁用
  children: Array    // 子节点数组
}
```

### v-model 返回值

当 `emitPath` 为 `true`（默认）时，返回选中节点的完整路径数组，例如：

```typescript
['11', '1101', '110101']  // 北京市 -> 北京市市辖区 -> 东城区
```

## 注意事项

1. 组件默认使用接口数据，如果接口失败会自动降级使用 mock 数据
2. mock 数据仅包含部分主要省市区的示例数据，生产环境建议使用接口数据
3. 组件支持所有 `el-cascader` 的原生属性，可以通过 `v-bind="$attrs"` 传递

## 示例

### 完整表单示例

```vue
<template>
  <el-form :model="formData" :rules="rules" ref="formRef">
    <el-form-item label="户籍地址(区域)" prop="householdRegion">
      <RegionSelect
        v-model="formData.householdRegion"
        placeholder="请选择户籍地址区域"
      />
    </el-form-item>
    
    <el-form-item label="常住地址(区域)" prop="permanentRegion">
      <RegionSelect
        v-model="formData.permanentRegion"
        placeholder="请选择常住地址区域"
      />
    </el-form-item>
  </el-form>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RegionSelect } from '@/components/RegionSelect'

const formRef = ref()
const formData = reactive({
  householdRegion: [],
  permanentRegion: []
})

const rules = {
  householdRegion: [
    { required: true, message: '请选择户籍地址区域', trigger: 'change' }
  ],
  permanentRegion: [
    { required: true, message: '请选择常住地址区域', trigger: 'change' }
  ]
}
</script>
```

