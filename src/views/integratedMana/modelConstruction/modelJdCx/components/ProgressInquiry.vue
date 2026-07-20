<template>
  <ContentWrap :v-loading="tableObject.loading">
    <Form ref="formRef" :schema="schema" @register="registerFrom" isCol  /> 
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      highlight-current-row
    />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { queryModelDevProgress } from '../api'
import { FormSchema } from '@/types/form'
import { useOldDictStore } from '@/store/modules/oldDict'
import { useForm } from '@/hooks/web/useForm'

const props = defineProps<{
  onSuccess?: (done: Function) => void, 
  onClose: (args?: any) => void,
  requirementid: String,
  serialno: String
}>()

const { getDictFetch, getDictLabel } = useOldDictStore()
const { register: registerFrom, methods } = useForm()

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
    componentProps: {
      readonly: true,
    }
  },
  {
    field: 'aprvst',
    label: '审批状态',
    component: 'Input',
    componentProps: {
      readonly: true,
    }
  },
  {
    field: 'appnm',
    label: '审批人',
    component: 'Input',
    componentProps: {
      readonly: true,
    }
  },
])

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '模型编号',
    field: 'modelNo',
    minWidth: 160
  },
  {
    label: '模型名称',
    field: 'modelNm',
    minWidth: 160
  },
  {
    label: '全流程阶段',
    field: 'stgSt',
    formatter: (row) => {
      return getDictLabel('ModelDevStgSt', row.stgSt) || ''
    }
  },
  {
    label: '阶段状态',
    field: 'stgNm',
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableObject = reactive({
  tableList: [],
  loading: false
})

async function getList() {
  tableObject.loading = true
  const res = await queryModelDevProgress({
    requirementid: props.requirementid
  }).finally(()=> tableObject.loading = false)
  methods?.setValues({
    aprvst: getDictLabel('ModelDevAprvSt', res.aprvSt),
    appnm: res.appNm
  })
  tableObject.tableList = res.modelRsltArray || []
}

onMounted(() => {
  methods?.setValues({
    requirementid: props.requirementid,
    serialno: props.serialno
  })
  Promise.all([getDictFetch(['ModelDevStgSt', 'ModelDevAprvSt'])]).then(()=> {
    getList()
  })
})
</script>