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
import { getSelectAutoProjectList } from '../../api'
import { getCodeLibraryList } from '@/api/dynamicForm/index'

const props = defineProps<{
  onSuccess?: (done: Function) => void, 
  onClose: (args?: any) => void
}>()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '客户编号',
    field: 'customerId',
    minWidth: 220,
  },
  {
    label: '客户名称',
    field: 'customerName',
    minWidth: 320,
  },
  {
    label: '项目编号',
    field: 'projectId',
    minWidth: 220,
  },
  {
    label: '项目名称',
    field: 'projectName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入合作项目名称'
      }
    },
    minWidth: 320,
  },
  {
    label: '项目类型',
    field: 'projectType',
    isSearch: true,
    search: {
      component: "Select",
      componentProps: {
        placeholder: '请选择合作项目名称',
        optionsAlias: {
          labelField: 'itemName',
          valueField: 'itemNo'
        },
        options: []
      }
    },
    formatter: (row) => {
      return row.projectTypeNm || ''
    }
  },
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getSelectAutoProjectList,
})

const { setSearchParams, getList } = tableMethods

const getProjectType = async () => {
  const res = await getCodeLibraryList({ codeNos: 'ProjectModel' })
  console.log('[ res ] >', res)
  const index = allSchemas.searchSchema.findIndex(v => v.field === 'projectType')
  if(index !== -1) {
    allSchemas.searchSchema[index].componentProps!.options = res.ProjectModel
  }
}

onMounted(() => {
  getList()
  getProjectType()
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