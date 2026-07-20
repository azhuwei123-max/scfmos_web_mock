<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :filterable="true"
    :remote="true"
    :remote-method="remoteMethod"
    :loading="loading"
    v-bind="$attrs"
    @update:model-value="handleChange"
  >
    <el-option
      v-for="option in options"
      :key="option.value"
      :label="option.label"
      :value="option.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import request from '@/config/axios'

defineOptions({ name: 'DynamicDetailRemoteSelect' })

interface RemoteConfig {
  /** API 地址 */
  url: string
  /** 请求方法 */
  method?: 'GET' | 'POST'
  /** 搜索参数字段名 */
  searchField?: string
  /** 响应数据解析配置 */
  responseParser?: {
    /** 列表数据路径 */
    listPath?: string
    /** 自定义解析函数 */
    parseFunc?: (response: any) => Array<{ label: string; value: any }>
  }
  /** 显示字段 */
  labelField?: string
  /** 值字段 */
  valueField?: string
}

interface Props {
  modelValue?: string | number | boolean | Array<string | number | boolean>
  remoteConfig?: RemoteConfig
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入搜索',
  clearable: true,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [
    value: string | number | boolean | Array<string | number | boolean> | undefined
  ]
}>()

const loading = ref(false)
const options = ref<Array<{ label: string; value: any }>>([])

// 获取嵌套对象的值
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

// 远程搜索方法
const remoteMethod = async (query: string) => {
  if (!props.remoteConfig?.url) {
    return
  }

  if (!query) {
    options.value = []
    return
  }

  loading.value = true
  try {
    const searchField = props.remoteConfig.searchField || 'keyword'
    let response: any

    if (props.remoteConfig.method === 'POST') {
      response = await request.post({
        url: props.remoteConfig.url,
        data: { [searchField]: query }
      })
    } else {
      response = await request.get({
        url: props.remoteConfig.url,
        params: { [searchField]: query }
      })
    }

    // 解析响应数据
    let list: any[] = []

    if (props.remoteConfig.responseParser?.parseFunc) {
      list = props.remoteConfig.responseParser.parseFunc(response)
    } else {
      const listPath = props.remoteConfig.responseParser?.listPath || 'data.list'
      list = getNestedValue(response, listPath) || response.list || []
    }

    // 转换为选项格式
    const labelField = props.remoteConfig.labelField || 'label'
    const valueField = props.remoteConfig.valueField || 'value'

    options.value = list.map((item) => ({
      label: item[labelField] || item.name || item.label,
      value: item[valueField] || item.id || item.value
    }))
  } catch (error) {
    console.error('远程搜索失败:', error)
    options.value = []
  } finally {
    loading.value = false
  }
}

const handleChange = (
  value: string | number | boolean | Array<string | number | boolean> | undefined
) => {
  emit('update:modelValue', value)
}

// 初始化时如果有值，加载选项
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && !options.value.find((opt) => opt.value === newValue)) {
      // 如果有值但选项中没有，可以调用一次搜索来加载
      // 这里可以根据实际需求实现
    }
  },
  { immediate: true }
)
</script>
