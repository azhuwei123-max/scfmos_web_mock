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
      @row-dblclick="dblclick"
      highlight-current-row
      :onRowClick="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { selectBoCustomer } from '../../../api'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  onSuccess: propTypes.func.def(),
  onClose: propTypes.func.def()
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '客户编号',
    field: 'customerId',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入客户编号'
      }
    },
    minWidth: 220,
  },
  {
    label: '客户名称',
    field: 'customerName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入客户名称'
      }
    },
    minWidth: 320,
  },
  {
    label: '证件号码',
    field: 'certId',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入证件号码'
      }
    }
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: selectBoCustomer
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
    if (!tableObject.currentRow) {
      ElMessage.warning('请选择一条数据')
      return null
    }
    return tableObject.currentRow
  }
})
const done = () => {
  props.onClose?.({ command: 'cancel'})
}

const dblclick = ()=> {
  props.onSuccess?.(done)
}
</script>