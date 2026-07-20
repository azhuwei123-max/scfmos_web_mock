<template>
  <Dialog v-model="visible" title="客户建档" width="90%" top="5vh">
    <ContentWrap>
      <div class="flex items-container justify-between">
        <div style="font-size: larger; font-weight: bolder;">{{currentData.projectname}} 供应链项目</div>
        <div>
           <el-button type="primary" class="mt-15px mb-15px" @click="toModel4">
           <Icon class="mr-5px" icon="ep:plus" />
            新增
      </el-button>
        </div>
      </div>
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
        <!-- <template #action="{ row }">
          <el-button link type="danger" @click="addCustomer(row)">
            <Icon class="mr-5px" icon="ep:delete" />
            删除</el-button>
        </template> -->
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

const projectName = ref();
const currentData = ref();
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
} = useTableList(Api.customerListByProject, {}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.exposuresum1 = formatValue(v.exposuresum, 'currency')
  })
})

const columns = [
  { label: '客户号', field: 'mfcustomerid', minWidth: 120 },
  { label: '客户类型', field: 'customertype', minWidth: 120 },
  { label: '客户名称', field: 'customername', minWidth: 120 },
  { label: '客户证件类型', field: 'certtype', minWidth: 120 },
  { label: '客户证件号码', field: 'certid', minWidth: 120 },
  // { label: '操作', field: 'action', minWidth: 120 }
]

const visible = ref(false)
const route = useRoute() // 路由对象
const open = (row) => {
  setDefaultParams({ curCustomerID: route.query.customerID ,projectid:row.projectid})
  visible.value = true
  currentData.value = row
  getList()
}

const emit = defineEmits(['confirm', 'back'])

const saving = ref(false)

const toModel4 = (row) => {
  visible.value = false
  emit('toModel4',currentData.value)
}

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

const toModel1 = () => {
  visible.value = false
  emit('toModel1')
}

const addCustomer = () => {
  
}

defineExpose({
  open
})
</script>
