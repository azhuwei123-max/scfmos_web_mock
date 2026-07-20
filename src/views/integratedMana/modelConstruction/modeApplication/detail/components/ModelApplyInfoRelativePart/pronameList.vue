<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      @search="setSearchParams"
      @reset="setSearchParams"
    />
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      :onRowClick="handleSelectionChange"
      @row-dblclick="dblclick"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { selectParticipantCustomerInfoPageVo, selectCustomerInfoPage } from './pronameList'

const props = withDefaults(defineProps<{
  onSuccess?: (done: Function) => void
  onClose: (args?: any) => void
  customerType: string
  customerId: string
  type?: 'selectCustomerInfoPage' | 'selectParticipantCustomerInfoPageVo'
}>(), {
  type: 'selectCustomerInfoPage'
})
const currentRow = ref<Recordable | null>(null)

// ====== 列表 ======
const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '项目名称',
    field: 'relativeName',
    isSearch: true,
  },
  {
    label: '客户名称',
    field: 'customerName',
    // isSearch: true,
  },
  {
    label: '项目编号',
    field: 'relativeNo',
  },
  {
    label: '客户id',
    field: 'customerId',
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const apiMap = {
  'selectParticipantCustomerInfoPageVo': selectParticipantCustomerInfoPageVo,
  'selectCustomerInfoPage': selectCustomerInfoPage
}

const defaultParams = {
  // customerType: props.customerType,
  // customerId: props.type === 'selectCustomerInfoPage' ? '' : props.customerId
}

// if(props.type === 'selectCustomerInfoPage') {
//   defaultParams['right'] = '1'
// }

const { register, tableObject, tableMethods } = useTable({
  getListApi: apiMap[props.type],
  defaultParams
})

const { setSearchParams, getList } = tableMethods

getList()

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
  currentRow.value = row
}

const done = () => {
  props.onClose({ command: 'cancel'})
}

const dblclick = ()=> {
  props.onSuccess?.(done)
}

defineExpose({
  async validate() {
    if (tableObject.currentRow) {
      return tableObject.currentRow
    }
    ElMessage.warning('请选择一条数据')
    return null
  }
})
</script>