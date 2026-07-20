<template>
  <Form ref="formRef" :schema="schema" :rules="rules" @register="register" :v-loading="loading"> 
    <template #projectName-append>
      <el-button @click="openProjectListDialog">
          <Icon icon="ep:more" />
      </el-button>
    </template>
  </Form>
</template>

<script setup lang="tsx">
import { FormExpose } from '@/components/Form';
import type { FormSchema } from '@/types/form';
import { addDialog } from '@/components/Dialog';
import { useForm } from '@/hooks/web/useForm';
import ProjectList from '../ProjectList/index.vue'
import dayjs from 'dayjs';

defineOptions({
  name: 'AddForm'
})

const emit = defineEmits<{
  (e: 'close', args: { command: string; data?: any }): void
}>()

const loading = ref(false)
const formRef = ref<FormExpose>()
const { register, methods } = useForm()

const schema = reactive<FormSchema[]>([
  {
    field: 'coreEntName',
    label: '核心企业名称',
    component: 'Input',
    componentProps: {
      readonly: true,
    }
  },
  {
    field: 'projectName',
    label: '项目名称',
    component: 'Input',
    componentProps: {
      readonly: true,
      slots: {
        append: true
      }
    }
  },
  {
    field: 'applyTm',
    label: '申请日期',
    component: 'DatePicker',
    value: dayjs().format('YYYY/MM/DD'),
    componentProps: {
      readonly: true,
      valueFormat: 'YYYY/MM/DD',
      format: 'YYYY/MM/DD',
      type: 'date',
    }
  },
])

const rules = {
  coreEntName: [{
    required: true, message: '请输入合作方客户名称'
  }],
  projectName: [{ required: true, message: '请输入合作方项目名称' }],
}

defineExpose({
  async validate() {
    const elForm = formRef.value?.getElFormRef()
    const valid = await elForm?.validate().catch(() => false)
    if (valid) {
      return formRef.value?.formModel
    }
    return null
  },
  setValues(data: Recordable) {
    formRef.value?.setValues(data)
  }
})

// ======= 合作项目名称列表 =======
let projectListContentRef: any = null
const projectOnSuccess = async (done) => {
  const formData = await projectListContentRef?.validate()
  console.log('[ formData ] >', formData)
  formData.coreEntName = formData.customerName
  if(formData) {
    formRef.value?.setValues(formData)
    done()
  }
}
const openProjectListDialog = async () => {
  addDialog({
    title: '请选择合作项目:',
    width: '1200px',
    contentRenderer: ()=>(
      <ProjectList 
        ref={(el: any)=>{
          projectListContentRef = el
        }}
      />
    ),
    props: {
      onSuccess: projectOnSuccess
    },
    beforeSure: (done) => projectOnSuccess(done)
  })
}
</script>
