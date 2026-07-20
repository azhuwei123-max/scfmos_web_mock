<template>
  <el-select
    :model-value="props.modelValue"
    v-bind="$attrs"
    @update:model-value="handleChange"
  >
    <el-option
      v-for="(dict,index) in dictOptions"
      :key="`${dict.value}-${index}`"
      :label="dict.label"
      :value="dict.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getStrDictOptions, getIntDictOptions, getBoolDictOptions, DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'DictSelect' })

interface Props {
  modelValue?: string | number | boolean | null
  dictType: string | keyof typeof DICT_TYPE // 字典类型
  valueType?: 'str' | 'int' | 'bool' // 字典值类型，默认为 'str'
}

const props = withDefaults(defineProps<Props>(), {
  valueType: 'str'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | null | undefined]
}>()

// 根据 valueType 获取对应的字典选项
const dictOptions = computed(() => {
  const dictTypeValue = typeof props.dictType === 'string' 
    ? props.dictType 
    : DICT_TYPE[props.dictType]
  
  switch (props.valueType) {
    case 'int':
      return getIntDictOptions(dictTypeValue)
    case 'bool':
      return getBoolDictOptions(dictTypeValue)
    case 'str':
    default:
      return getStrDictOptions(dictTypeValue)
  }
})

// 处理值变化
const handleChange = (value: string | number | boolean | null | undefined) => {
  emit('update:modelValue', value)
}
</script>

