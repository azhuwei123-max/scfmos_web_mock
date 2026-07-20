<template>
  <el-input-number
    :model-value="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :min="min"
    :max="max"
    :step="step"
    :precision="precision"
    :controls-position="controlsPosition"
    v-bind="$attrs"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'DynamicDetailNumber' })

interface Props {
  modelValue?: number
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  min?: number
  max?: number
  step?: number
  precision?: number
  controlsPosition?: 'right' | ''
}

withDefaults(defineProps<Props>(), {
  placeholder: '请输入数字',
  clearable: true,
  disabled: false,
  step: 1,
  controlsPosition: 'right'
})

const emit = defineEmits<{
  'update:modelValue': [value: number | undefined]
}>()

const handleChange = (value: number | undefined) => {
  emit('update:modelValue', value)
}
</script>
