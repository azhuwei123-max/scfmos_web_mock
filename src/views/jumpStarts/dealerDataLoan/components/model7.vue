<template>
  <Dialog v-model="visible" title="手动关联项目" width="1300px" top="5vh">
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
        @row-dblclick="addCustomer"
      >
        <template #action="{ row }">
          <el-button link type="primary" @click.stop="addCustomer(row)">查看详情</el-button>
          <el-button link type="primary" @click.stop="link(row)">关联</el-button>
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

    <!-- 关联 -->
    <model7_1 ref="model7_1Ref" />
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import model7_1 from './model7-1.vue'

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
} = useTableList(Api.getSingUnitCount, {}, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.exposuresum1 = formatValue(v.exposuresum, 'currency')
  })
})

const columns = [
  { label: '核心企业名称', field: 'customername', minWidth: 120 },
  { label: '供应链项目名称', field: 'projectname', minWidth: 120 },
  { label: '项下成员', field: 'counts', minWidth: 120 },
  { label: '操作', field: 'action', fixed: 'right', minWidth: 140 }
]

const visible = ref(false)
const route = useRoute() // 路由对象
const open = (row) => {
  setDefaultParams({ curCustomerID: route.query.customerID })
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm', 'back', 'toModel8', 'toModel7_1'])

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

const toModel1 = () => {
  visible.value = false
  emit('toModel1')
}

const addCustomer = (row) => {
  visible.value = false
  emit('toModel8', row)
}

const model7_1Ref = ref()
const link = async (row) => {
  // if (!Object.keys(chooseRow).length) return ElMessage.warning('请先选择')

  // const checkResult = await model7_1Ref.value.openCheck(row, chooseRow)
  // if (!checkResult) return

  // model7_1Ref.value.open(row)
  visible.value = false
  emit('toModel7_1', row)
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
