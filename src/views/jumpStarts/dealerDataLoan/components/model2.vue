<template>
  <Dialog v-model="visible" title="经销商数据贷" width="1300px" top="5vh">
    <ContentWrap>
      <el-form inline @keyup.enter="search">
        <el-form-item label="核心企业名称">
          <el-input
            class="!w-200px"
            v-model="queryParams.customername"
            placeholder="搜索核心企业名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="供应链项目名称">
          <el-input
            class="!w-200px"
            v-model="queryParams.projectname"
            placeholder="搜索供应链项目名称"
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
      >
        <template #action="{ row }">
          <el-button link type="primary" @click="addCustomer(row)">客户建档</el-button>
        </template>
      </Table>
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
} = useTableList(Api.coreEntpProList, {}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.exposuresum1 = formatValue(v.exposuresum, 'currency')
  })
})

const columns = [
  { label: '批复号', field: 'relativeserialno', minWidth: 150 },
  { label: '核心企业名称', field: 'customername', minWidth: 150 },
  { label: '供应链项目名称', field: 'projectname', minWidth: 150 },
  { label: '业务品种', field: 'businesstype', minWidth: 150 },
  { label: '批复金额', field: 'exposuresum1', minWidth: 150 },
  { label: '敞口金额', field: 'businesssum1', minWidth: 150 },
  { label: '合同流水号', field: 'serialno', minWidth: 150 },
  { label: '起始日', field: 'putoutdate', minWidth: 120 },
  { label: '到期日', field: 'maturity', minWidth: 120 },
  { label: '操作', field: 'action', fixed: 'right' , minWidth: 120 }
]

const visible = ref(false)
const route = useRoute() // 路由对象
const open = (row) => {
  setDefaultParams({ curCustomerID: route.query.customerID })
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm', 'back', 'toModel3', 'toModel1'])

const saving = ref(false)
const confirm = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  emit('confirm', currentRow.value)
  visible.value = false
}

const back = () => {
  visible.value = false
  emit('back')
}

const addCustomer = (row) => {
  visible.value = false
  emit('toModel3',row)
}

const toModel1 = () => {
  visible.value = false
  emit('toModel1')
}

defineExpose({
  open
})
</script>
