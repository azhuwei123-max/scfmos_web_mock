<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      label-width="130"
      @keyup.enter="search"
    >
      <el-form-item label="根单号" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入根单号"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search1" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div style="display: flex; justify-content: space-between; margin-bottom: 17px">
      <div style="font-size: 18px; font-weight: 700"> 查询结果</div>
      <div>
        <el-button @click="checkDetail" plain tpye="">
          查看详情
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
      highlight-current-row
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="tableCurrentChange"
      @page-change="getList"
      @row-dblclick="checkDetail"
    />

  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const {
  queryParams,
  getList,
  loading,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback
} = useTableList(Api.pageQFDFList, { dealtype: props.params.dealtype })

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
})

const router = useRouter() // 路由

const columns = [
  { label: '核心企业客户编号', field: 'serialNo', minWidth: 220 },
  { label: '核心企业统一社会信用代码', field: 'channelID', minWidth: 130 },
  { label: '根单号', field: 'customerName' },
  { label: '汇总金额', field: 'certId', minWidth: 150 },
  { label: '接收日期', field: 'subBillNum' },
]

const dialogColumns = [
  { label: '账号', field: 'serialNo', minWidth: 130 },
  { label: '币种', field: 'serialNo', minWidth: 130 },
  { label: '账户属性', field: 'serialNo', minWidth: 130 },
  { label: '账户状态', field: 'serialNo', minWidth: 130 },
  { label: '开户机构', field: 'serialNo', minWidth: 130 },
  { label: '开户日期', field: 'serialNo', minWidth: 130 },
]

// 进件通过显隐
const payConfirmVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 收款账号显隐
const editPayAccountVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 通过
const passVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 退回
const backVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 确认购买
const btnLoading1 = ref(false)
const payConfirm = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  // btnLoading1.value = true
  // Api.aaa().then(res => {
  //   ElMessage.success('操作成功')
  // }).finally(() => btnLoading1.value = false)
}

// 修改收款账号
const dialogVisible = ref()
const editPayAccount = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  dialogVisible.value = true
}

// 通过
const btnLoading2 = ref(false)
const pass = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  // btnLoading2.value = true
  // Api.aaa().then(res => {
  //   ElMessage.success('操作成功')
  // }).finally(() => btnLoading2.value = false)
}

// 退回
const btnLoading3 = ref(false)
const back = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  // btnLoading3.value = true
  // Api.aaa().then(res => {
  //   ElMessage.success('操作成功')
  // }).finally(() => btnLoading3.value = false)
}
</script>
