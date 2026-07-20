<template>
  <el-switch
    :model-value="modelValue"
    :disabled="disabled"
    :active-text="activeText"
    :inactive-text="inactiveText"
    :active-value="activeValue"
    :inactive-value="inactiveValue"
    v-bind="$attrs"
    @update:model-value="handleChange"
  />
</template>

<script lang="ts" setup>
defineOptions({ name: 'DynamicDetailBoolean' })

interface Props {
  modelValue?: boolean | string | number
  disabled?: boolean
  activeText?: string
  inactiveText?: string
  activeValue?: boolean | string | number
  inactiveValue?: boolean | string | number
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  activeValue: true,
  inactiveValue: false
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | string | number | undefined]
}>()

const handleChange = (value: boolean | string | number | undefined) => {
  emit('update:modelValue', value)
}
</script>
