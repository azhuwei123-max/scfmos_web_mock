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
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="certId">
        <el-input
          v-model="queryParams.certId"
          class="!w-240px"
          clearable
          placeholder="请输入统一社会信用代码"
        />
      </el-form-item>
      <el-form-item label="核心企业名称" prop="coreCustName">
        <el-input
          v-model="queryParams.coreCustName"
          class="!w-240px"
          clearable
          placeholder="请输入核心企业名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search" tpye=""
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
        <el-button v-if="payConfirmVIf" @click="payConfirm" :loading="btnLoading1" plain tpye="">
          确认购买
        </el-button>
        <el-button v-if="editPayAccountVIf" @click="editPayAccount" :loading="btnLoading2" plain tpye="">
          修改收款账号
        </el-button>
        <el-button v-if="passVIf" @click="pass" :loading="btnLoading2" plain tpye="">
          通过
        </el-button>
        <el-button v-if="backVIf" @click="back" :loading="btnLoading3" plain tpye="">
          退回
        </el-button>
      </div>
    </div>
    <tempTable
      ref="tempTableRef"
      tempNo="CTPutOutList"
      :tableListAttr="tableListAttr"
      :customVisible="customVisible"
    />

    <!-- 修改收款账号 -->
    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="dialogVisible"
      width="1000px"
      :columns="dialogColumns"
      @confirm="(item) => popConfirm('customerID', item)"
      :api-method="Api.getCustomerInfoEntPage"
      :extra-params="{ dealtype: '01' }"
    />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import tempTable from '@/components/dynamicForm/components/tempTable.vue'

defineOptions({
  name: 'letterTicketList'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})


const tableListAttr = useTableList(Api.pagePutOutList, {
  phaseType: props.params.key,
  applyType: 'CTCreditApply',
  codeNo: props.params.codeNo
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
} = tableListAttr

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum1, 'currency')
    v.subbillamt = formatValue(v.subbillamt, 'currency')
  })
})

const router = useRouter() // 路由

const columns = [
  { label: '流水号', field: 'serialNo', minWidth: 130 },
  { label: '出账渠道号', field: 'channelID', minWidth: 130 },
  { label: '借据号', field: 'customerName' },
  { label: '客户名称', field: 'certId', minWidth: 150 },
  { label: '出账金额', field: 'subBillNum' },
  { label: '子票金额', field: 'subBillAmt' },
  { label: '客户卡号', field: 'interestate' },
  { label: '开户银行', field: 'rootBillNum' },
  { label: '母票票号', field: 'rootBillIssuAmt' },
  { label: '子票票号', field: 'rootBillIssuDt', minWidth: 130 },
  { label: '出账日期', field: 'rootBillPayDt', minWidth: 130 },
  { label: '保理手续费付款方', field: 'subBillEntNm', minWidth: 150 },
  { label: '预付利息付息方', field: 'coreCustName', minWidth: 120 },
]

const tempTableRef = ref()

const customVisible = {
  UpdateDate: ['1070'].includes(props.params.key)
}

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
  return ['1010','1020','2010','2020'].includes(props.params.key)
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
