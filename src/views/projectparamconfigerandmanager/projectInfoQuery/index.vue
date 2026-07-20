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
      @row-dblclick="handleProjectDetails"
    />

  </ContentWrap>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { addDialog } from '@/components/Dialog'
import { projectInfoQryPage } from "./api";
import { ProjectStatus, ProjectAuditStatus } from '../maintainProjectInfo/config'

defineOptions({
  name: 'ProjectInfoQuery'
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
    isSearch: true,
    minWidth: 200,
  },
  {
    label: '核心企业客户号',
    field: 'mfCustomerId',
    minWidth: 200,
  },
  {
    label: '客户编号',
    field: 'customerId',
    minWidth: 200,
  },
  {
    label: '客户名称',
    field: 'teamworkName',
    minWidth: 300,
    isSearch: true
  },
  {
    label: '客户类型',
    field: 'teamworkTypeName',
    minWidth: 150,
  },
  // {
  //   label: '合作方类型',
  //   field: 'typeName',
  //   width: 150,
  // },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 300,
    isSearch: true
  },
  {
    label: '项目协审状态',
    field: 'projectAuditStatus',
    minWidth: 150,
    formatter: (row)=> {
      return ProjectAuditStatus.find(f=> f.value === row.projectAuditStatus)?.label ?? ''
    }
  },
  {
    label: '是否有效',
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
    minWidth: 150,
  },
  {
    label: '失效人',
    field: 'invaliduserId',
    minWidth: 150,
  },
  {
    label: '失效时间',
    field: 'invalidTime',
    minWidth: 150,
  },
  {
    label: '失效机构',
    field: 'invalidOrgid',
    minWidth: 150,
  },
  {
    label: '管户客户经理',
    field: 'managerUserId',
    minWidth: 150,
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, tableMethods } = useTable({
  getListApi: projectInfoQryPage,
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
    key: 'projectDetails',
    label: '项目详情',
    plain: true,
    onClick: (btn) => handleProjectDetails(btn)
  },
  {
    key: 'partnerDetails',
    label: '合作方详情',
    plain: true,
    onClick: (btn) => handlePartnerDetails(btn)
  },
])

const handlePartnerDetails = (btn: ActionButton) => {
  if (!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  try{
    router.push({
      name: 'compCustManalDetail',
      query: {
        customerId: currentRowRef.value.customerId,
        orgNature: currentRowRef.value.orgNature,
        mfcustomerID: currentRowRef.value.mfCustomerId,
        t: new Date().getTime()
      }
    })
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
  
}

const handleProjectDetails = (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  // if (currentRowRef.value.projectStatus === '0') {
  //   ElMessageBox.confirm(`项目名称【${currentRowRef.value.projectName}】已失效，无法查看详情，请确认`,'提示', {
  //     type: 'warning'
  //   })
  //   return
  // }
  try {
    router.push({
      name: 'ProjectInfoQueryProjectDetails',
      query: {
        customerId: currentRowRef.value.customerId,
        objectType: 'projectSearch',
        projectId: currentRowRef.value.projectId,
        type: currentRowRef.value.type,
        businessType: currentRowRef.value.businessType,
        serialNoByList: currentRowRef.value.serialNo,
      }
    })
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
  
}
</script>
