# OcrRecognitionDialog OCR识别弹框组件

一个通用的 OCR 识别弹框组件，用于证件识别和信息录入。

## 功能特性

- ✅ 证件类型选择
- ✅ OCR 识别功能（支持 mock 数据）
- ✅ 证件号码输入和确认
- ✅ 客户名称输入
- ✅ 表单验证
- ✅ 可配置证件类型选项
- ✅ 支持初始数据回填

## 基础用法

```vue
<template>
  <OcrRecognitionDialog
    v-model="dialogVisible"
    title="OCR识别"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OcrRecognitionDialog } from '@/components/OcrRecognitionDialog'

const dialogVisible = ref(false)

const handleConfirm = (data) => {
  console.log('识别数据:', data)
  // data: { certType: string, certNumber: string, customerName: string }
}

const handleCancel = () => {
  console.log('取消操作')
}
</script>
```

## Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 弹框显示状态 | `boolean` | `false` |
| title | 弹框标题 | `string` | `'OCR识别'` |
| width | 弹框宽度 | `string` | `'600px'` |
| certTypeOptions | 证件类型选项 | `Array<{label: string, value: string}>` | 默认选项 |
| initialData | 初始数据（用于回填） | `{certType?: string, certNumber?: string, customerName?: string}` | - |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| confirm | 确认时触发 | `(data: {certType: string, certNumber: string, customerName: string})` |
| cancel | 取消时触发 | `()` |
| update:modelValue | 弹框显示状态变化 | `(value: boolean)` |

## 使用示例

### 基础用法

```vue
<template>
  <el-button @click="dialogVisible = true">打开OCR识别</el-button>
  
  <OcrRecognitionDialog
    v-model="dialogVisible"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OcrRecognitionDialog } from '@/components/OcrRecognitionDialog'

const dialogVisible = ref(false)

const handleConfirm = (data) => {
  console.log('识别结果:', data)
  // 处理识别结果，如跳转到新增页面
}
</script>
```

### 自定义证件类型选项

```vue
<template>
  <OcrRecognitionDialog
    v-model="dialogVisible"
    :cert-type-options="customCertTypeOptions"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OcrRecognitionDialog } from '@/components/OcrRecognitionDialog'
import { idTypeOptions } from '@/views/customer/personal/const/detail'

const dialogVisible = ref(false)
const customCertTypeOptions = idTypeOptions
</script>
```

### 带初始数据

```vue
<template>
  <OcrRecognitionDialog
    v-model="dialogVisible"
    :initial-data="initialData"
    @confirm="handleConfirm"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OcrRecognitionDialog } from '@/components/OcrRecognitionDialog'

const dialogVisible = ref(false)
const initialData = ref({
  certType: '身份证',
  certNumber: '110101199001011234',
  customerName: '张三'
})
</script>
```

## OCR 识别功能

### Mock 数据

组件内置了 mock OCR 识别功能，会根据选择的证件类型生成对应的 mock 数据：

- **身份证**: 生成 18 位身份证号码
- **护照**: 生成护照号码
- **港澳居民来往内地通行证**: 生成通行证号码
- **台湾居民来往大陆通行证**: 生成通行证号码
- **其他**: 生成随机号码

### 集成真实 OCR API

在 `handleOcrRecognition` 方法中，取消注释以下代码并实现：

```typescript
// TODO: 调用 OCR 识别接口
const res = await OcrApi.recognize({
  certType: formData.certType,
  image: imageFile // 需要上传图片文件
})
if (res && res.data) {
  formData.certNumber = res.data.certNumber || ''
  formData.certNumberConfirm = res.data.certNumber || ''
  formData.customerName = res.data.name || ''
  message.success('OCR识别成功')
}
```

## 表单验证

组件内置了以下验证规则：

- **证件类型**: 必填
- **证件号码**: 必填，长度 6-30 位
- **证件号码确认**: 必填，必须与证件号码一致
- **客户名称**: 必填，长度 2-50 位

## 注意事项

1. OCR 识别功能需要先选择证件类型
2. 证件号码确认字段会自动验证与证件号码的一致性
3. 组件会在弹框关闭时自动重置表单
4. 可以通过 `initialData` prop 回填已有数据

