<template>
  <Dialog v-model="visible" title="挑选" width="90%" top="5vh">
    <ContentWrap>
      <el-form inline>
        <el-form-item label="协审编号">
          <el-input class="!w-240px" v-model="queryParams.serialNo" placeholder="搜索协审编号" clearable />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input class="!w-240px" v-model="queryParams.projectName" placeholder="搜索项目名称" clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input class="!w-240px" v-model="queryParams.customerName" placeholder="搜索客户名称" clearable />
        </el-form-item>
        <el-form-item>
          <el-button @click="search" tpye=""
            ><Icon class="mr-5px" icon="ep:search" /> 查询
          </el-button>
          <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>
      <Table
        :columns="columns"
        :data="list"
        :loading="loading"
        :pagination="{
          total: total
        }"
        :selection="true"
        highlight-current-row
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @selection-change="tableCurrentChange"
        @page-change="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from '../api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'
import { formatValue } from '@/utils/formatter'
import { useOldDictStore } from '@/store/modules/oldDict'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  fetchCback,
  tableCurrentChange
} = useTableList(
  Api.aprrovalOptionPage,
  { phaseNo: props.params.phaseNo, flowNo: props.params.flowNo, type: props.params.type }
)

const { getDictFetch, getDictLabels } = useOldDictStore()

fetchCback((list) => {
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.exposureSum1 = formatValue(v.exposureSum, 'currency')
    v.loanProductCategory1 = getDictLabels('GYLLoanProductCategory', v.loanProductCategory)
  })
})

const initFetch = () => {
  Promise.all([getDictFetch('GYLLoanProductCategory')]).then(res => {
    getList()
  })
}
initFetch()

const visible = ref(false)

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
  getList()
}

const columns = [
  { label: '协审编号', field: 'serialNo', minWidth: 220 },
  { label: '项目名称', field: 'projectName', minWidth: 320 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '客户编号', field: 'customerId', minWidth: 220 },
  { label: '协审方式', field: 'coreviewMethodNm', minWidth: 120 },
  { label: '协审类型', field: 'coreviewTypeNm', minWidth: 120 },
  { label: '申请人', field: 'userName', minWidth: 150 },
  { label: '申请分行', field: 'branchName', minWidth: 180 },
  { label: '申请分行业务团队', field: 'teamName', minWidth: 150 },
  { label: '项目额度（万元）', field: 'businessSum1', minWidth: 150 },
  { label: '项目敞口（万元）', field: 'exposureSum1', minWidth: 150 },
  { label: '是否分行权限', field: 'branchAccess', minWidth: 120 },
  { label: '产品方案', field: 'loanProductCategory1', minWidth: 180 },
  { label: '所属行业', field: 'industryType', minWidth: 180 }
]

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value?.length) {
    ElMessage.warning('请选择')
    return
  }

  saving.value = true
  Api.aprrovalOptionConfirm({
    serialNo: currentRow.value.map(v => v.ftSerialNo).join(','),
    approveType: 'ProjectCoreviewApproveGYL',
  })
    .then((res) => {
      ElMessage.success('保存成功')

      visible.value = false
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

const { confirmFetch } = useMessage()
const confirmCreate = (message) => {
  confirmFetch({
    title: message,
    fetchFunc: () =>
      Api.addTeamWorkCustomer({
        relativeid: rowItem.customerID,
        projectid: currentRow.value.projectid
      })
  }).then((_) => {
    visible.value = false
    ElMessage.success('保存成功')
  })
}

defineExpose({
  open
})
</script>
