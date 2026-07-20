<template>
  <Form ref="formRef" :schema="schema" :rules="rules"> 
    <template #serialNo-append>
      <el-button @click="openRelativeDialog">
          <Icon icon="ep:more" />
      </el-button>
    </template>
  </Form>
</template>

<script setup lang="tsx">
import { FormExpose } from '@/components/Form';
import type { FormSchema } from '@/types/form';
import RelativeList from '../RelativeList/index.vue'
import { addDialog } from '@/components/Dialog';

defineOptions({
  name: 'AddForm'
})

const emit = defineEmits<{
  (e: 'close', args: { command: string; data?: any }): void
}>()

const formRef = ref<FormExpose>()

const schema = reactive<FormSchema[]>([
  {
    field: 'serialNo',
    label: '关联批复流水号',
    component: 'Input',
    componentProps: {
      readonly: true,
      slots: {
        append: true
      }
    }
  },
  {
    field: 'businessTypeName',
    label: '业务品种',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'customerId',
    label: '客户编号',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'customerName',
    label: '客户名称',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'operateOrgName',
    label: '登记机构',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'operateUserName',
    label: '登记人',
    component: 'Input',
    componentProps: {
      disabled: true
    }
  },
  {
    field: 'operateDate',
    label: '登记日期',
    component: 'DatePicker',
    componentProps: {
      disabled: true,
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      type: 'date'
    }
  },
])

const rules = {
  serialNo: [{
    required: true, message: '请输入关联批复流水号'
  }],
  customerId: [{ required: true, message: '请输入客户编号' }],
  customerName: [{ required: true, message: '请输入客户名称' }]
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

// ======= 可用的批复变更列表 =======
let contentRef: any = null
const openRelativeDialog = async () => {
  addDialog({
    title: '请选择关联批复流水号:',
    width: '1200px',
    contentRenderer: ()=>(
      <RelativeList 
        ref={(el: any)=>{
          contentRef = el
        }}
      />
    ),
    beforeSure: async (done) => {
      const formData = await contentRef?.validate()
      formData.creditSourceFlag = '01'
      if(formData) {
        formRef.value?.setValues(formData)
        done()
      }
    },
  })

}
</script>
