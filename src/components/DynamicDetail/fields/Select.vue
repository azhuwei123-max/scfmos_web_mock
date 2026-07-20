<template>
  <el-select
    :model-value="modelValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    :multiple="multiple"
    :filterable="filterable"
    v-bind="$attrs"
    @update:model-value="handleChange"
  >
    <el-option
      v-for="(option, index) in options"
      :key="`${option.value}-${index}`"
      :label="option.label"
      :value="option.value"
      :disabled="option.disabled"
    />
  </el-select>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DynamicDetailSelect' })

interface Option {
  label: string
  value: string | number | boolean
  disabled?: boolean
}

interface Props {
  modelValue?: string | number | boolean | Array<string | number | boolean>
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  multiple?: boolean
  filterable?: boolean
  options?: Option[]
}

withDefaults(defineProps<Props>(), {
  placeholder: '请选择',
  clearable: true,
  disabled: false,
  multiple: false,
  filterable: false,
  options: () => []
})

const emit = defineEmits<{
  'update:modelValue': [
    value: string | number | boolean | Array<string | number | boolean> | undefined
  ]
}>()

const handleChange = (
  value: string | number | boolean | Array<string | number | boolean> | undefined
) => {
  emit('update:modelValue', value)
}
</script>
