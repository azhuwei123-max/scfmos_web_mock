<template>
  <el-input
    :model-value="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :readonly="readonly"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    v-bind="$attrs"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'DynamicDetailText' })

interface Props {
  modelValue?: string | number
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  maxlength?: number
  showWordLimit?: boolean
}

withDefaults(defineProps<Props>(), {
  placeholder: '请输入',
  clearable: true,
  disabled: false,
  readonly: false,
  showWordLimit: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined]
}>()

const handleChange = (value: string | number | undefined) => {
  emit('update:modelValue', value)
}
</script>
