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
import { selectBankNoName3 } from '../../../api'

const props = defineProps<{
  onSuccess?: (done: Function) => void, 
  onClose: (args?: any) => void
}>()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '行号',
    field: 'bankNo',
    isSearch: true
  },
  {
    label: '行名',
    field: 'bankName',
    isSearch: true
  },
  {
    label: '状态',
    field: 'status',
  },
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: selectBankNoName3,
})

const { setSearchParams, getList } = tableMethods

onMounted(() => {
  getList()
})

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
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

const done = () => {
  props.onClose({ command: 'cancel'})
}

const dblclick = ()=> {
  props.onSuccess?.(done)
}

</script>