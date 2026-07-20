<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
      @keyup.enter="search"
    >
      <el-form-item label="协审编号" prop="customerID">
        <el-input
          v-model="queryParams.customername"
          class="!w-240px"
          clearable
          placeholder="请输入协审编号"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="code">
        <el-input
          v-model="queryParams.businesstype"
          class="!w-240px"
          clearable
          placeholder="请输入项目名称"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="code">
        <el-input
          v-model="queryParams.businesstype"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="客户编号" prop="code">
        <el-input
          v-model="queryParams.businesstype"
          class="!w-240px"
          clearable
          placeholder="请输入客户编号"
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
        <el-button v-if="addVIf" @click="add" tpye="">
          <Icon class="mr-5px" icon="ep:circle-plus-filled" />
          新增
        </el-button>
        <el-button @click="goDetail" type="">
          <Icon class="mr-5px" icon="ep:edit" />
          详情
        </el-button>
        <el-button v-if="delVIf" @click="del" type="danger">
          <Icon class="mr-5px" icon="ep:delete" />
          删除
        </el-button>
        <el-button v-if="delVIf" @click="handleSignOpinion" plain tpye=""> 签署意见 </el-button>
        <el-button @click="submit" plain tpye=""> 提交 </el-button>
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
      highlight-current-row
      @current-change="tableCurrentChange"
      @page-change="getList"
      @row-dblclick="goDetail"
    />

    <!-- 新增 -->
    <addPop ref="addPopRef" />

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
    />

    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="'BusinessContract'"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import addPop from './components/addPop.vue'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

// 新增权限
const addVIf = computed(() => ['010'].includes(props.params.key))

// 删除权限
const delVIf = computed(() => ['010'].includes(props.params.key))

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
} = useTableList(Api.getCustomerInfoEntPage, { dealtype: props.params.dealtype })

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
})

const router = useRouter() // 路由

const columns = [
  { label: '协审编号', field: 'serialno', minWidth: 220 },
  { label: '项目名称', field: 'relativeserialno', minWidth: 320 },
  { label: '客户名称', field: 'customername' },
  { label: '客户编号', field: 'businesstype', minWidth: 220 },
  { label: '协审方式', field: 'occurtype' },
  { label: '协审类型', field: 'businesscurrency' },
  { label: '申请人', field: 'businesssum1' },
  { label: '申请分行', field: 'vouchtypename' },
  { label: '申请分行业务团队', field: 'inputusername', minWidth: 130 },
  { label: '项目额度', field: 'inputorgname', minWidth: 100 },
  { label: '项目敞口', field: 'endtime', minWidth: 120 },
  { label: '是否分行权限', field: 'endtime', minWidth: 120 },
  { label: '产品方案', field: 'endtime', minWidth: 120 },
  { label: '所属行业', field: 'endtime', minWidth: 120 }
]

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/assistApprProject/assistApprDetail',
    query: {
      serialno: currentRow.value.serialno,
      occurtype: currentRow.value.occurtype,
      businesstype: currentRow.value.businesstype,
      t: Date.now()
    }
  })
}

const addPopRef = ref()
const add = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  addPopRef.value.open(currentRow.value)
}

const { confirmFetch } = useMessage()
// 删除
const del = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '确认删除',
    fetchFunc: () => Api.bookInContract({ relativeserialno: currentRow.value.relativeserialno,creditSourceFlag: '01' })
  }).then((_) => {
    ElMessage.success('已删除')

    getList()
  })
}

// 签署意见
const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])

const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.objectNo,
    businessType: selectedRows.businessType,
    phaseNo: selectedRows.phaseNo,
    objectType: 'BusinessContract'
  }
  signOpinionVisible.value = true
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const creditFlowApprovalVisible = ref(false)

const doRiskDetection = async (rskTp = 1) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  serialNo.value = currentRow.value.objectNo
  phaseNo.value = currentRow.value.phaseNo
  riskData.value = {
    scenarioId: '015',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      EDObjectNo: serialNo.value,
      EDObjectType: 'BusinessContract',
      EDPhaseNo: phaseNo.value,
      EDCustomerID: currentRow.value.customerID
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const submit = async () => {
  await doRiskDetection(2)
  submitFlag.value = true
}

const handleRiskMonitorConfirm = async (hasFailure) => {
  console.log('hasFailure', hasFailure)
  if (!submitFlag.value) {
    await handleRiskMonitorCancel()
    return
  }
  riskMonitorVisible.value = false

  creditFlowApprovalVisible.value = true
}

const handleRiskMonitorCancel = async () => {
  riskMonitorVisible.value = false
}
const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}
</script>
