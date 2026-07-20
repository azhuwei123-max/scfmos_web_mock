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
        <el-button
          v-if="appliSubPassVIf"
          @click="appliSubPass(1, 'ApplyPass')"
          :loading="btnLoading.loading1"
          plain
          tpye=""
        >
          进件通过
        </el-button>
        <el-button
          v-if="appliSubRefuseVIf"
          @click="appliSubRefuse"
          plain
          tpye=""
        >
          进件拒绝
        </el-button>
        <el-button
          v-if="appliChangeWYVIf"
          @click="selectUser"
          :loading="btnLoading.loading3"
          plain
          tpye=""
        >
          进件移交
        </el-button>
        <el-button
          v-if="backToApprVIf"
          @click="appliSubPass(4, 'StepBack')"
          :loading="btnLoading.loading4"
          plain
          tpye=""
        >
          退回待审核
        </el-button>
      </div>
    </div>
    <tempTable
      ref="tempTableRef"
      tempNo="TSELCreditApplyList"
      :tableListAttr="tableListAttr"
      :customVisible="customVisible"
    />

    <!-- 进件移交 -->
    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="dialogVisible"
      width="1000px"
      :columns="dialogColumns"
      :searchFields="searchFields"
      @confirm="appliSubPass(3, 'ChangeWYApply')"
      :api-method="Api.selectAllUser"
      :extra-params="{ }"
    />

    <refusePop ref="refusePopRef" @confirm="getList" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import tempTable from '@/components/dynamicForm/components/tempTable.vue'
import refusePop from './components/refusePop.vue'

const tempTableRef = ref()

defineOptions({
  name: 'scmltsPushInfoMGMApplicationList'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const tableListAttr = useTableList(Api.getList, {
  phaseType: props.params.key,
  applyType: 'TSELCreditApply',
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
const router = useRouter() // 路由

// const columns = [
//   { label: '流水号', field: 'serialNo', minWidth: 130 },
//   { label: '渠道号', field: 'channelID', minWidth: 130 },
//   { label: '客户名称', field: 'customerName' },
//   { label: '统一社会信用代码', field: 'certId', minWidth: 150 },
//   { label: '子票票号', field: 'subBillNum' },
//   { label: '子票金额', field: 'subBillAmt' },
//   { label: '融资利率', field: 'interestate' },
//   { label: '母票票号', field: 'rootBillNum' },
//   { label: '母票金额', field: 'rootBillIssuAmt' },
//   { label: '母票签发日期', field: 'rootBillIssuDt', minWidth: 130 },
//   { label: '母票付款日期', field: 'rootBillPayDt', minWidth: 130 },
//   { label: '子票上有供应链', field: 'subBillEntNm', minWidth: 150 },
//   { label: '核心企业名称', field: 'coreCustName', minWidth: 120 },
//   { label: '业务品种', field: 'bussTypeName', minWidth: 120 },
//   { label: '进件时间', field: 'inputDate', minWidth: 120 },
//   { label: '客户账号', field: 'accountNo', minWidth: 120 },
//   { label: '客户账号开户行名称', field: 'accountBankName', minWidth: 180 }
// ]

const customVisible = {
  PassDate: ['1020'].includes(props.params.key),
  BaSerialNo: ['1020'].includes(props.params.key),
  RefuseDate: ['1030'].includes(props.params.key),
  Remark: ['1030'].includes(props.params.key)
}

// 进件通过显隐
const appliSubPassVIf = computed(() => {
  return ['1010'].includes(props.params.key)
})

// 进件拒绝显隐
const appliSubRefuseVIf = computed(() => {
  return ['1010'].includes(props.params.key)
})

// 进件移交
const appliChangeWYVIf = computed(() => {
  return ['1010'].includes(props.params.key)
})

// 退回待审核显隐
const backToApprVIf = computed(() => {
  return ['1020'].includes(props.params.key)
})

fetchCback((list) => {
  list.forEach(v => {
    v.subbillamt = formatValue(v.subbillamt, 'currency')
  })
})

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/contractIssuanceMGM/approvalDetail',
    query: {
      serialno: currentRow.value.serialno,
      occurtype: currentRow.value.occurtype,
      businesstype: currentRow.value.businesstype,
      customerType: currentRow.value.customertype,
      relativeserialno: currentRow.value.relativeserialno,
      t: Date.now()
    }
  })
}

const refusePopRef = ref()
const appliSubRefuse = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  refusePopRef.value.open(currentRow.value)
}

const btnLoading = reactive({
  loading1: false,
  loading2: false,
  loading3: false,
  loading4: false,
})

const appliSubPass = (index, objectType) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  btnLoading[`loading${index}`] = true
  Api.applyProcess({
    objectType,
    customerid: currentRow.value.customerid,
    userid: currentRow.value.customerid,
    serialno: currentRow.value.serialno
  })
    .then((res) => {
      ElMessage.success('操作成功')

      getList()
    })
    .finally(() => (btnLoading[`loading${index}`] = false))
}

const dialogColumns = [
  { label: '用户ID', prop: 'userid' },
  { label: '用户姓名', prop: 'username' },
  { label: '用户所属机构ID', prop: 'belongorg' },
  { label: '用户所属机构名称', prop: 'belongorgname' },
]

const searchFields = [
  { label: '用户ID', prop: 'userid' },
  { label: '用户姓名', prop: 'username' },
]

const dialogVisible = ref()
const selectUser = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  dialogVisible.value = true
}
</script>
