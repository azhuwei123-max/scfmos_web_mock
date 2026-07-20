<template>
  <el-input
    :model-value="modelValue"
    type="textarea"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    :autosize="autosize"
    v-bind="$attrs"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'DynamicDetailTextarea' })

interface Props {
  modelValue?: string
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  readonly?: boolean
  rows?: number
  maxlength?: number
  showWordLimit?: boolean
  autosize?: boolean | { minRows?: number; maxRows?: number }
}

withDefaults(defineProps<Props>(), {
  placeholder: '请输入',
  clearable: true,
  disabled: false,
  readonly: false,
  rows: 3,
  showWordLimit: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()

const handleChange = (value: string | undefined) => {
  emit('update:modelValue', value)
}
</script>
