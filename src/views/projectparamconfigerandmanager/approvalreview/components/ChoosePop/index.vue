<template>
  <Dialog v-model="visible" title="挑选" width="1000px" top="5vh">
    <ContentWrap>
      <el-form inline>
         <el-form-item label="申请编号">
          <el-input v-model="queryParams.serialNo" placeholder="搜索申请编号" clearable />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="queryParams.projectName" placeholder="搜索项目名称" clearable />
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
        :selection="true"
        :pagination="{
          total: total
        }"
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
import { aprrovalOptionPage, aprrovalOptionConfirm } from '../../api'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})
console.log('[ props.params ] >', props.params)
const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange
} = useTableList(
  aprrovalOptionPage,
  { phaseNo: props.params.phaseNo, flowNo: props.params.flowNo, type: props.params.type, objectType: props.params.objectType}
)

const visible = ref(false)

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
  getList()
}

const columns = [
  {
    label: '申请编号',
    field: 'serialNo',
    fixed: 'left',
    minWidth: 220
  },
  {
    label: '核心企业名称',
    field: 'customerName',
    minWidth: 200
  },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 320
  },
  {
    label: '项目类型',
    field: 'projectTypeNm'
  },
  {
    label: '当前流程',
    field: 'flowName',
  },
  {
    label: '当前阶段',
    field: 'phaseName'
  },
  {
    label: '申请机构',
    field: 'inputOrgID'
  },
  {
    label: '申请日期',
    field: 'inputDate'
  },
]

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value?.length) {
    ElMessage.warning('请选择')
    return
  }

  saving.value = true
  aprrovalOptionConfirm({
    serialNo: currentRow.value.map(v => v.ftSerialNo).join(','),
    approveType: 'ParamAdjustApproveGYL',
  })
    .then((res) => {
      ElMessage.success('保存成功')

      visible.value = false
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

defineExpose({
  open
})
</script>
