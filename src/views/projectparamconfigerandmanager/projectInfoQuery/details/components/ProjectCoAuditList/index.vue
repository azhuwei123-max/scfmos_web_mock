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
import { getProjectCoreviewPage } from '../../../api';

const props = defineProps({
  params: {
    type: Object,
    default: ()=>({})
  },
  onClose: {
    type: Function
  }
})

const router = useRouter()

const crudSchemas = reactive<CrudSchema[]>([
  { label: '协审编号', field: 'serialNo', minWidth: 220 },
  { label: '项目名称', field: 'projectName', minWidth: 320 },
  { label: '客户名称', field: 'customerName' },
  { label: '客户编号', field: 'customerId', minWidth: 130 },
  { label: '审批结果', field: 'phaseNo', minWidth:60},
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getProjectCoreviewPage,
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
  router.push({
    path: '/projectMana/projectCollReviMana/projectCollReviManaDetail',
    query: {
      serialNo: currentRowRef.value.serialNo,
      readonly: '1',
      t: Date.now()
    }
  })
  if(props.onClose) {
    props.onClose({ command: 'cancel'})
  }
  
}

onActivated(() => {
  getList()
})
</script>
