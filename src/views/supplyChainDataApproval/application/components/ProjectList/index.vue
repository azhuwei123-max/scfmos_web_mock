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

const props = defineProps<{
  onSuccess?: (done: Function) => void, 
  onClose: (args?: any) => void
}>()

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '合作项目编号',
    field: 'projectId',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入合作项目编号'
      }
    },
    minWidth: 220,
  },
  {
    label: '合作项目名称',
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
    label: '合作类型',
    field: 'teamWorkType',
    isTable: false,
    search: {
      componentProps: {
        placeholder: '请输入合作类型名称'
      }
    },
    minWidth: 150,
  },
  {
    label: '合作类型名称',
    field: 'teamWorkTypeName',
    search: {
      componentProps: {
        placeholder: '请输入合作类型名称'
      }
    },
    minWidth: 320,
  },
  {
    field: 'debtProject',
    label: '债项/产品方案',
    component: 'Input',
    isTable: false,
    componentProps: {
      placeholder: '请输入债项/产品方案'
    },
    minWidth: 320,
  },
  {
    field: 'debtProjectName',
    label: '债项/产品方案名称',
    component: 'Input',
    isSearch: true,
    isTable: false,
    componentProps: {
      placeholder: '请输入债项/产品方案名称'
    },
    minWidth: 320,
  },
  
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getSelectAutoProjectList,
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
