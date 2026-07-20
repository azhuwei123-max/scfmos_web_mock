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
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />
  </ContentWrap>
</template>
<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { getUsedBusinessApproveList } from '../../api'
import { formatValue, FormatterType } from '@/utils/formatter'

defineOptions({
  name: 'RelativeList'
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    minWidth: 220,
    label: '批复流水号',
    field: 'serialNo'
  },
  {
    minWidth: 220,
    label: '客户编号',
    field: 'customerId',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入客户编号'
      }
    }
  },
  {
    minWidth: 320,
    label: '客户姓名',
    field: 'customerName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入客户姓名'
      }
    }
  },
  {
    minWidth: 180,
    label: '业务品种',
    field: 'businessTypeName'
  },
  {
    minWidth: 180,
    label: '业务金额',
    field: 'businessSum',
    formatter: ({businessSum}) => {
      return formatValue(businessSum, FormatterType.CURRENCY,{ currencySymbol:' ' })
    }
  },
  {
    minWidth: 180,
    label: '业务敞口',
    field: 'exposureSum',
    formatter: ({exposureSum}) => {
      return formatValue(exposureSum, FormatterType.CURRENCY,{ currencySymbol:' ' })
    }
  },
  {
    minWidth: 180,
    label: '币种',
    field: 'currencyName'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getUsedBusinessApproveList,
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
    ElMessage.error('请选择一条数据')
    return null
  }
})

</script>