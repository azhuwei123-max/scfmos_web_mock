<template>
  <DictSelect
    :model-value="modelValue"
    :dict-type="dictType"
    :value-type="valueType"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :filterable="filterable"
    v-bind="$attrs"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
import { DictSelect } from '@/components/DictSelect'
import { DICT_TYPE } from '@/utils/dict'

defineOptions({ name: 'DynamicDetailDict' })

interface Props {
  modelValue?: string | number | boolean | null
  dictType: string | keyof typeof DICT_TYPE // 字典类型
  valueType?: 'str' | 'int' | 'bool' // 字典值类型，默认为 'str'
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  multiple?: boolean
  filterable?: boolean
}

withDefaults(defineProps<Props>(), {
  valueType: 'str',
  placeholder: '请选择',
  clearable: true,
  disabled: false,
  multiple: false,
  filterable: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean | null | undefined]
}>()

const handleChange = (value: string | number | boolean | null | undefined) => {
  emit('update:modelValue', value)
}
</script>
