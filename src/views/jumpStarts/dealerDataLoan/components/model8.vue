<template>
  <Dialog v-model="visible" title="手动关联项目" width="1300px" top="5vh">
    <ContentWrap>
      <el-form inline @keyup.enter="search">
        <el-form-item label="成员客户编号">
          <el-input
            class="!w-200px"
            v-model="queryParams.relativeId"
            placeholder="搜索成员客户编号"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input
            class="!w-200px"
            v-model="queryParams.customerName"
            placeholder="搜索客户名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="证件号码">
          <el-input
            class="!w-200px"
            v-model="queryParams.certId"
            placeholder="搜索证件号码"
            clearable
          />
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
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @current-change="tableCurrentChange"
        @page-change="getList"
      />
      <el-button class="mt-15px" @click="back">
        <Icon class="mr-5px" icon="ep:arrow-left" />
        返回
      </el-button>
    </ContentWrap>
    <template #footer>
      <!-- <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button> -->
      <el-button @click="toModel1">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
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
  setDefaultParams,
  fetchCback
} = useTableList(Api.getUnderMembersPage, {}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.exposuresum1 = formatValue(v.exposuresum, 'currency')
  })
})

const columns = [
  { label: '成员客户编号', field: 'relativeId', minWidth: 220 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '客户类型', field: 'customerTypeName', minWidth: 120 },
  { label: '证件类型', field: 'certTypeName', minWidth: 120 },
  { label: '证件号码', field: 'certId', minWidth: 120 },
  { label: '合同余额', field: 'balance', minWidth: 120 },
  { label: '主办客户经理', field: 'userName', minWidth: 120 },
]

const visible = ref(false)
const route = useRoute() // 路由对象
const open = (row) => {
  setDefaultParams({ projectId: row.projectid })
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm', 'back', 'toModel3'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value?.customerName) {
    ElMessage.warning('请选择')
    return
  }

  emit('confirm', currentRow.value)
  visible.value = false
}

const back = () => {
  visible.value = false
  emit('back')
}

const addCustomer = (row) => {
  visible.value = false
  emit('toModel3', row)
}

const toModel1 = (row) => {
  visible.value = false
  emit('toModel1', row)
}

const model7_1Ref = ref()
const link = async (row) => {
  // if (!Object.keys(chooseRow).length) return ElMessage.warning('请先选择')

  // const checkResult = await model7_1Ref.value.openCheck(row, chooseRow)
  // if (!checkResult) return

  model7_1Ref.value.open(row)
}

const model7_2Ref = ref()
const choose = () => {
  model7_2Ref.value.open()
}

// 选择确认
let chooseRow = {}
const model7_2Confirm = (row) => {
  chooseRow = row
}

defineExpose({
  open
})
</script>
