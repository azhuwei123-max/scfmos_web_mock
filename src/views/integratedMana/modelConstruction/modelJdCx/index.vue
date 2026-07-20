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
      @current-change="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />

  </ContentWrap>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { getModelDevPage, saveGYLModelReqID} from './api'
import MaintenanceFrom from './components/MaintenanceFrom.vue'
import ProgressInquiry from './components/ProgressInquiry.vue'
import { addDialog } from '@/components/Dialog'
import { checkRoleIds } from '@/utils/permission'

defineOptions({
  name: 'ModelDevProgressQuery'
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '申请编号',
    field: 'serialno',
    fixed: 'left',
    minWidth: 220,
    isSearch: true
  },
  {
    label: '需求编号 (模型管理系统)',
    field: 'requirementid',
    minWidth: 220
  },
  {
    label: '模型名称',
    field: 'modelname',
    isSearch: true,
    minWidth: 220
  },
  {
    label: '模型分类',
    field: 'modelcategory',
    minWidth: 200,
  },
  {
    label: '申请时间',
    field: 'inputtime',
    minWidth: 220,
    
  },
  {
    label: '申请人',
    field: 'inputusername',
  },
  
  {
    label: '申请机构',
    field: 'inputorgname',
    minWidth: 200,
  },
])
const { allSchemas } = useCrudSchemas(crudSchemas)
const { register, tableObject, tableMethods } = useTable({
  getListApi: getModelDevPage
})
const currentRowRef = computed(() => {
  return tableObject.currentRow ? tableObject.currentRow : null
})
const { setSearchParams, getList } = tableMethods
const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}
onMounted(()=> {
  getList()
})
onActivated(() => {
  getList()
})

const buttons = ref<ActionButton[]>([
  {
    key: 'progressInquiry',
    label: '进度查询',
    plain: true,
    show: () => {
      return checkRoleIds(['480','099','0GG','2AK','0AK','428','410','29C'])
    },
    onClick: () => handleProgressInquiry()
  },
  {
    key: 'maintenance',
    label: '维护',
    plain: true,
    show: () => {
      return checkRoleIds(['099','0GG','2AK','0AK','428','410'])
    },
    onClick: () => handleMaintenance()
  }
])

let progressInquiryRef: any = null
const handleProgressInquiry = () => {
  if(!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  if(!currentRowRef.value.requirementid) {
    ElMessage.warning('请联系分行产品经理或业务团队长维护模型管理系统需求编号。')
    return
  }
  addDialog({
    title: '进度查询',
    width: '1200px',
    hideFooter: true,
    contentRenderer: () => (
      <ProgressInquiry 
        ref={(el: any)=>{
          progressInquiryRef = el
        }}
      />
    ),
    props: {
      serialno: currentRowRef.value.serialno,
      requirementid: currentRowRef.value.requirementid,
    }
  })
}
let maintenanceRef: any = null
const handleMaintenance = () => {
  if(!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  addDialog({
    title: '维护',
    width: '500px',
    contentRenderer: () => (
      <MaintenanceFrom 
        ref={(el: any)=>{
          maintenanceRef = el
        }}
      />
    ),
    props: {
      formData: {
        serialno: currentRowRef.value.serialno,
        requirementid: currentRowRef.value.requirementid,
      }
    },
    beforeSure: async (done, {button}) => {
      const formData = await maintenanceRef?.validate()
      if(formData) {
        button.btn!.loading = true
        await saveGYLModelReqID(formData).finally(()=> button.btn!.loading = false)
        ElMessage.success('保存成功')
        getList()
        done()
      }
    }
  })
}

</script>
