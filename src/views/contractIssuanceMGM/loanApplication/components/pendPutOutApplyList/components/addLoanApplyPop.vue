<template>
  <Dialog v-model="visible" title="选择" width="1200px" top="5vh">
    <ContentWrap>
      <el-form inline>
        <el-form-item label="合同流水号">
          <el-input class="!w-240px" v-model="queryParams.serialno" placeholder="搜索合同流水号" clearable />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input class="!w-240px" v-model="queryParams.customername" placeholder="搜索客户名称" clearable />
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
        highlight-current-row
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @current-change="tableCurrentChange"
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
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'

const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback,
} = useTableList(Api.getBusinessContractPage, {creditSourceFlag:'02'}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.balance1 = formatValue(v.balance, 'currency')
  })
})

const visible = ref(false)

const columns = [
  { label: '合同流水号', field: 'serialno', minWidth: 180 },
  { label: '客户名称', field: 'customername', minWidth: 180 },
  { label: '业务品种', field: 'businesstypename', minWidth: 160 },
  { label: '发生类型', field: 'occurtypename' },
  { label: '币种', field: 'currencyname' },
  { label: '合同金额', field: 'businesssum1', minWidth: 130 },
  { label: '合同余额', field: 'balance1', minWidth: 130 },
  { label: '管户人', field: 'manageusername', minWidth: 180 },
  { label: '管户机构', field: 'manageorgname' },
  { label: '支付方式', field: 'paymode', minWidth: 180 },
]

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value) {
    ElMessage.warning('请选择一条数据')
    return
  }

  saving.value = true
  Api.newApply({ contractserialno: currentRow.value.serialno }).then(res => {
    ElMessage.success('新增成功')
    visible.value = false
    emit('confirm')
  }).finally(_ => saving.value = false)
}

defineExpose({
  open
})
</script>
