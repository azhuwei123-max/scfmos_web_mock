# DictSelect 字典选择器组件

一个基于 Element Plus 的字典选择器组件，用于快速集成数据字典到表单中。

## 特性

- ✅ 支持 `v-model` 双向绑定
- ✅ 支持字符串、整数、布尔三种值类型
- ✅ 支持传入 `DICT_TYPE` 枚举或字符串类型的字典类型
- ✅ 支持所有 `el-select` 的原生属性
- ✅ 自动从字典 Store 获取数据

## 安装

组件已位于 `src/components/DictSelect/`，直接导入使用即可。

## 基础用法

### 字符串类型（默认）

```vue
<template>
  <el-form-item label="状态" prop="status">
    <DictSelect
      v-model="formData.status"
      :dict-type="DICT_TYPE.COMMON_STATUS"
      placeholder="请选择状态"
      clearable
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { DictSelect } from '@/components/DictSelect'
import { DICT_TYPE } from '@/utils/dict'

const formData = reactive({
  status: ''
})
</script>
```

### 整数类型

```vue
<template>
  <el-form-item label="提现类型" prop="type">
    <DictSelect
      v-model="formData.type"
      :dict-type="DICT_TYPE.BROKERAGE_WITHDRAW_TYPE"
      value-type="int"
      placeholder="请选择提现类型"
      clearable
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { DictSelect } from '@/components/DictSelect'
import { DICT_TYPE } from '@/utils/dict'

const formData = reactive({
  type: undefined
})
</script>
```

### 布尔类型

```vue
<template>
  <el-form-item label="是否启用" prop="enabled">
    <DictSelect
      v-model="formData.enabled"
      :dict-type="DICT_TYPE.INFRA_BOOLEAN_STRING"
      value-type="bool"
      placeholder="请选择"
      clearable
    />
  </el-form-item>
</template>
```

## Props 参数

| 参数 | 说明 | 类型 | 默认值 | 必填 |
|------|------|------|--------|------|
| `modelValue` | 绑定值 | `string \| number \| boolean \| null` | - | 否 |
| `dictType` | 字典类型，可以是 `DICT_TYPE` 枚举值或字符串 | `string \| keyof typeof DICT_TYPE` | - | 是 |
| `valueType` | 字典值类型 | `'str' \| 'int' \| 'bool'` | `'str'` | 否 |

## 事件

| 事件名 | 说明 | 回调参数 |
|--------|------|----------|
| `update:modelValue` | 值变化时触发 | `(value: string \| number \| boolean \| null \| undefined)` |

## 支持的 el-select 属性

组件通过 `$attrs` 透传所有 `el-select` 的原生属性，包括但不限于：

- `placeholder` - 输入框占位文本
- `clearable` - 是否可以清空选项
- `disabled` - 是否禁用
- `multiple` - 是否多选
- `filterable` - 是否可搜索
- `size` - 输入框尺寸
- `class` - 自定义类名
- `style` - 自定义样式
- 等等...

## 使用示例

### 在查询表单中使用

```vue
<template>
  <el-form :model="queryParams" :inline="true">
    <el-form-item label="状态" prop="status">
      <DictSelect
        v-model="queryParams.status"
        :dict-type="DICT_TYPE.COMMON_STATUS"
        placeholder="请选择状态"
        clearable
        class="!w-240px"
      />
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <DictSelect
        v-model="queryParams.type"
        :dict-type="DICT_TYPE.BROKERAGE_WITHDRAW_TYPE"
        value-type="int"
        placeholder="请选择类型"
        clearable
        class="!w-240px"
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { DictSelect } from '@/components/DictSelect'
import { DICT_TYPE } from '@/utils/dict'

const queryParams = reactive({
  status: undefined,
  type: undefined
})
</script>
```

### 在编辑表单中使用

```vue
<template>
  <el-form :model="formData" :rules="formRules">
    <el-form-item label="审核状态" prop="auditStatus">
      <DictSelect
        v-model="formData.auditStatus"
        :dict-type="DICT_TYPE.CRM_AUDIT_STATUS"
        placeholder="请选择审核状态"
        clearable
      />
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { DictSelect } from '@/components/DictSelect'
import { DICT_TYPE } from '@/utils/dict'

const formData = reactive({
  auditStatus: ''
})

const formRules = {
  auditStatus: [
    { required: true, message: '请选择审核状态', trigger: 'change' }
  ]
}
</script>
```

### 使用字符串类型的字典类型

```vue
<template>
  <DictSelect
    v-model="formData.status"
    dict-type="custom_status"
    placeholder="请选择状态"
  />
</template>
```

### 多选模式

```vue
<template>
  <DictSelect
    v-model="formData.types"
    :dict-type="DICT_TYPE.COMMON_STATUS"
    multiple
    placeholder="请选择多个状态"
  />
</template>

<script setup lang="ts">
const formData = reactive({
  types: [] // 多选时使用数组
})
</script>
```

### 可搜索模式

```vue
<template>
  <DictSelect
    v-model="formData.status"
    :dict-type="DICT_TYPE.COMMON_STATUS"
    filterable
    placeholder="请输入或选择状态"
  />
</template>
```

## 与原有方式的对比

### 原有方式

```vue
<el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
  <el-option
    v-for="dict in getStrDictOptions(DICT_TYPE.COMMON_STATUS)"
    :key="dict.value"
    :label="dict.label"
    :value="dict.value"
  />
</el-select>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
</script>
```

### 使用 DictSelect 组件

```vue
<DictSelect
  v-model="queryParams.status"
  :dict-type="DICT_TYPE.COMMON_STATUS"
  placeholder="请选择状态"
  clearable
/>

<script setup lang="ts">
import { DictSelect } from '@/components/DictSelect'
import { DICT_TYPE } from '@/utils/dict'
</script>
```

**优势：**
- ✅ 代码更简洁，减少重复代码
- ✅ 统一字典选择器的使用方式
- ✅ 自动处理值类型转换
- ✅ 更好的类型提示

## 注意事项

1. **字典类型**：确保传入的 `dictType` 在字典系统中已配置
2. **值类型**：根据后端接口返回的数据类型选择合适的 `valueType`
   - `str`：字符串类型（默认）
   - `int`：整数类型
   - `bool`：布尔类型
3. **多选模式**：使用 `multiple` 时，`v-model` 绑定值应为数组类型
4. **字典数据**：组件会自动从字典 Store 获取数据，确保字典数据已初始化

## 相关文件

- 组件源码：`src/components/DictSelect/index.vue`
- 字典工具：`src/utils/dict.ts`
- 字典 Store：`src/store/modules/dict.ts`
- 字典 API：`src/api/system/dict/dict.data.ts`

