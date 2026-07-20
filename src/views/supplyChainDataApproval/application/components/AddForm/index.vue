<template>
  <Form ref="formRef" :schema="schema" :rules="rules" @register="register" :v-loading="loading"> 
    <template #projectName-append>
      <el-button @click="openProjectListDialog">
          <Icon icon="ep:more" />
      </el-button>
    </template>
    <template #customerName-append>
      <el-button @click="openCustomerListDialog">
          <Icon icon="ep:more" />
      </el-button>
    </template>
  </Form>
</template>

<script setup lang="tsx">
import { FormExpose } from '@/components/Form';
import type { FormSchema } from '@/types/form';
import { addDialog } from '@/components/Dialog';
import { getBorrowerType } from '../../api'
import ProjectList from '../ProjectList/index.vue'
import CustomerList from '../CustomerList/index.vue'
import { useForm } from '@/hooks/web/useForm';

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
    field: 'projectName',
    label: '合作项目名称',
    component: 'Input',
    componentProps: {
      readonly: true,
      slots: {
        append: true
      }
    },
  },
  {
    field: 'debtProjectName',
    label: '债项/产品方案',
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'isAutoJudgeName',
    label: '是否启用决策审批',
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'jcModelNoName',
    label: '决策审批模型',
    component: 'Input',
    componentProps: {
      readonly: true,
    }
  },
  {
    field: 'borrowerType',
    label: '客户类型',
    component: 'Select',
    componentProps: {
      disabled: true,
      options: [],
      optionsAlias: {
        labelField: 'itemName',
        valueField: 'itemNo'
      }
    }
  },
  {
    field: 'customerId',
    label: '客户编号',
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'customerName',
    label: '客户名称',
    component: 'Input',
    componentProps: {
      readonly: true,
      slots: {
        append: true
      }
    }
  },
  {
    field: 'certId',
    label: '证件号',
    component: 'Input',
    componentProps: {
      readonly: true
    }
  },
  {
    field: 'operateDate',
    label: '登记日期',
    component: 'DatePicker',
    componentProps: {
      readonly: true,
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      type: 'date'
    }
  },
])

const rules = {
  projectName: [{
    required: true, message: '请输入合作项目名称'
  }],
  debtProjectName: [{ required: true, message: '请输入债项/产品方案' }],
  customerName: [{ required: true, message: '请输入客户名称' }]
}

// ====== 获得借款人类型列表 ======
const borrowerTypeList = ref<Recordable[]>([])
async function getBorrowerTypeList(projectId: string) {
  loading.value = true
  const res = await getBorrowerType({ projectId }).finally(()=> loading.value = false)
  borrowerTypeList.value = res
  if(res?.length === 1) {
    formRef.value?.setValues({
      borrowerType: res[0].itemNo
    })
    formRef.value?.setSchema([{
      field: 'borrowerType',
      path: 'componentProps.disabled',
      value: true,
    }])
  }else {
    formRef.value?.setValues({
      borrowerType: ''
    })
    formRef.value?.setSchema([{
      field: 'borrowerType',
      path: 'componentProps.disabled',
      value: false,
    }])
  }
  formRef.value?.setSchema([{
    field: 'borrowerType',
    path: 'componentProps.options',
    value: res,
  }])
}

onMounted(() => {
  // getBorrowerTypeList()
})

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
  if(formData) {
    getBorrowerTypeList(formData.projectId)
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

// ======= 客户名称列表 =======
let customerListContentRef: any = null
const customerOnSuccess = async (done) => {
  const formData = await customerListContentRef?.validate()
  if(formData) {
    formRef.value?.setValues(formData)
    done()
  }
}
const openCustomerListDialog = async () => {
  const formData = await methods.getFormData()
  if(!formData?.borrowerType) {
    ElMessage.warning('请选择客户类型')
    return
  }
  addDialog({
    title: '请选择客户:',
    width: '1200px',
    contentRenderer: ()=>(
      <CustomerList 
        borrowerType = {formData.borrowerType}
        ref={(el: any)=>{
          customerListContentRef = el
        }}
      />
    ),
    props: {
      onSuccess: customerOnSuccess
    },
    beforeSure: (done) => customerOnSuccess(done),
  })

}
</script>
