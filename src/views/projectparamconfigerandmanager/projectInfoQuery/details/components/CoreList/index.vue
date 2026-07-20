<template>
  <ContentWrap>
    <ActionBar :buttons="buttons" />
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      :onRowClick="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { CrudSchema } from '@/hooks/web/useCrudSchemas';
import { getCustomerInfoEntPage } from '../../../api';

const props = defineProps({
  params: {
    type: Object,
    default: ()=>({})
  },
})
console.log('[ props ] >', props)
const router = useRouter()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '客户名称',
    field: 'customerName',
  },
  {
    label: '核心客户号',
    field: 'mfCustomerId',
  },
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getCustomerInfoEntPage,
  defaultParams: { projectId: props.params.projectId, isInner: 1 }
})

const currentRowRef = computed(() => {
  return tableObject.currentRow ? tableObject.currentRow : null
})

const { setSearchParams, getList } = tableMethods

onMounted(() => {
  getList()
})

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}

const buttons = ref<ActionButton[]>([
  {
    key: 'detail',
    label: '详情',
    plain: true,
    onClick: () => handleDetail()
  }
])

const handleDetail = () => {
  if (!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  try {
    router.push({
      name: 'compCustManalDetail',
      query: {
        customerId: currentRowRef.value.customerId,
        orgNature: currentRowRef.value.orgNature,
        mfcustomerID: currentRowRef.value.mfCustomerId,
        readonly: '1',
        t: new Date().getTime()
      }
    })
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
  
}

onActivated(() => {
  getList()
})
</script>