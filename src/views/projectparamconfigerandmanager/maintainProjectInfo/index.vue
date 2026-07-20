<template>
  <ContentWrap>
    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      @search="setSearchParams"
      @reset="setSearchParams"
    />
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
      @row-dblclick="handleDetail"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { projectInfoMaintenancePage, paramAdjustSetHis } from './api'
import { ProjectStatus, ProjectAuditStatus, TeamWorkType } from './config'

defineOptions({
  name: 'MaintainProjectInfo'
})

const router = useRouter()

onMounted(() => {
  getList()
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '合作项目编号',
    field: 'projectId',
    fixed: 'left',
    minWidth: 220,
    isSearch: true
  },
  {
    label: '合作项目名称',
    field: 'projectName',
    isSearch: true,
    minWidth: 320
  },
  {
    label: '核心企业客户号',
    field: 'customerId',
    minWidth: 200,
    isSearch: true
  },
  {
    label: '客户名称',
    field: 'customerName',
    minWidth: 300,
    isSearch: true
  },
  {
    label: '客户类型',
    field: 'customerTypeName',
    isSearch: true,
    minWidth: 200,
  },
  {
    label: '项目协审状态',
    field: 'projectAuditStatus',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        options: ProjectAuditStatus
      }
    },
    formatter: (row)=> {
      return ProjectAuditStatus.find(f=> f.value === row.projectAuditStatus)?.label ?? ''
    },
    minWidth: 200,
  },
  {
    label: '项目状态',
    field: 'projectStatus',
    isSearch: true,
    search: {
      component: 'Select',
      componentProps: {
        options: ProjectStatus
      }
    },
    formatter: (row)=> {
      return ProjectStatus.find(f=> f.value === row.projectStatus)?.label ?? ''
    },
    minWidth: 200,
  },
  // {
  //   label: '合作类型',
  //   field: 'teamWorkType',
  //   isSearch: true,
  //   search: {
  //     component: 'Select',
  //     componentProps: {
  //       options: TeamWorkType
  //     }
  //   },
  // },
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, tableMethods } = useTable({
  getListApi: projectInfoMaintenancePage
})
const currentRowRef = computed(() => {
  return tableObject.currentRow ? tableObject.currentRow : null
})
const { setSearchParams, getList } = tableMethods
const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}

const buttons = ref<ActionButton[]>([
  {
    key: 'detail',
    label: '详情',
    plain: true,
    onClick: (btn) => handleDetail(btn)
  },
  {
    key: 'setHistory',
    label: '置为历史',
    plain: true,
    onClick: (btn) => handleSetHistory(btn)
  },
  {
    key: 'creditLineDetails',
    label: '授信额度详情',
    plain: true,
    onClick: (btn) => handleCreditLineDetails(btn)
  }
])

const handleDetail = (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  if (currentRowRef.value.projectStatus === '失效') {
    ElMessageBox.confirm(`项目名称【${currentRowRef.value.projectName}】已失效，无法查看详情，请确认`,'提示', {
      type: 'warning'
    })
    return
  }
  try{
    router.push({
      name: 'ProjectInfoQueryProjectDetails',
      query: {
        customerId: currentRowRef.value.customerId,
        projectId: currentRowRef.value.projectId,
        objectType: 'projectMaintain',
        type: currentRowRef.value.type,
        businessType: currentRowRef.value.businessType,
        serialNoByList: currentRowRef.value.serialNo,
        isMaintainProjectInfo: '1'
      }
    })
  }catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
    
}

const handleSetHistory = async (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')

   await ElMessageBox.confirm('您真的想该信息置为历史吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  
  btn.loading = true
  await paramAdjustSetHis({
    projectId: currentRowRef.value.projectId,
    customerID: currentRowRef.value.customerId
  }).finally(() => (btn.loading = false))
  ElMessage.success('操作成功')
  getList()
}

const handleCreditLineDetails = (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  if (!currentRowRef.value?.serialNo) return ElMessage.warning('当前项目没有有效的授信额度，请确定！')
  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: currentRowRef.value.businessType,
      customerID: currentRowRef.value.customerId,
      serialNo: currentRowRef.value.serialNo,
      t: Date.now()
    }
  })
}
</script>
