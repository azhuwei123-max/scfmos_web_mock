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

    <detail ref="detailRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import detail from './components/detail.vue'

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
} = useTableList(Api.pageQFDFList, {
  phaseType: props.params.key,
  applyType: 'CTCreditApply',
  codeNo: props.params.codeNo
})

fetchCback((list) => {
  list.forEach((v) => {
    v.totalamt1 = formatValue(v.totalamt, 'currency')
  })
})

const router = useRouter() // 路由

const columns = [
  { label: '核心企业客户编号', field: 'coreentcustomerid', minWidth: 220 },
  { label: '核心企业统一社会信用代码', field: 'coreentcreditcode', minWidth: 130 },
  { label: '根单号', field: 'rootbillnum', minWidth: 150 },
  { label: '汇总金额', field: 'totalamt1', minWidth: 150 },
  { label: '接收日期', field: 'inputdate' },
]

const dialogColumns = [
  { label: '账号', field: 'serialNo', minWidth: 130 },
  { label: '币种', field: 'serialNo', minWidth: 130 },
  { label: '账户属性', field: 'serialNo', minWidth: 130 },
  { label: '账户状态', field: 'serialNo', minWidth: 130 },
  { label: '开户机构', field: 'serialNo', minWidth: 130 },
  { label: '开户日期', field: 'serialNo', minWidth: 130 },
]

const detailRef = ref()
const checkDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  detailRef.value.open(currentRow.value)
}
</script>
