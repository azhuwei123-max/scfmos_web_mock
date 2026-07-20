<template>
  <Form ref="formRef" :schema="schema" :rules="rules" @register="register" :v-loading="loading" /> 
</template>

<script setup lang="tsx">
import { FormExpose } from '@/components/Form';
import type { FormSchema } from '@/types/form';
import { useForm } from '@/hooks/web/useForm';

defineOptions({
  name: 'AddForm'
})

const props = withDefaults(defineProps<{
  formData: Recordable
}>(),{})

const emit = defineEmits<{
  (e: 'close', args: { command: string; data?: any }): void
}>()

const loading = ref(false)
const formRef = ref<FormExpose>()
const { register, methods } = useForm()

const schema = reactive<FormSchema[]>([
  {
    field: 'serialno',
    label: '需求编号 (供应链)',
    component: 'Input',
    componentProps: {
      readonly: true,
    }
  },
  {
    field: 'requirementid',
    label: '需求编号 (模型管理系统)',
    component: 'Input',
  }
])

const rules = {
  serialno: [{
    required: true, message: '请输入需求编号 (供应链)'
  }],
  requirementid: [{ required: true, message: '请输入需求编号 (模型管理系统)' }],
}

onBeforeMount(()=> {
  methods?.setValues(props.formData)
})

defineExpose({
  async validate() {
    const elForm = formRef.value?.getElFormRef()
    const valid = await elForm?.validate().catch(() => false)
    if (valid) {
      return methods?.getFormData()
    }
    return null
  },
  setValues(data: Recordable) {
    methods?.setValues(data)
  }
})
</script>
