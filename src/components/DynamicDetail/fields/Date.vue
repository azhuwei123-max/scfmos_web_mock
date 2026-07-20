<template>
  <el-date-picker
    :model-value="modelValue"
    type="date"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :readonly="readonly"
    :format="format"
    :value-format="valueFormat"
    v-bind="$attrs"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'DynamicDetailDate' })

interface Props {
  modelValue?: string | Date
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  format?: string
  valueFormat?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: '请选择日期',
  clearable: true,
  disabled: false,
  readonly: false,
  format: 'YYYY-MM-DD',
  valueFormat: 'YYYY-MM-DD'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | Date | undefined]
}>()

const handleChange = (value: string | Date | undefined) => {
  emit('update:modelValue', value)
}
</script>
