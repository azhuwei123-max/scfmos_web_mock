<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="90px"
      @keyup.enter="search1"
    >
      <el-form-item label="合同流水号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          class="!w-240px"
          clearable
          placeholder="请输入合同流水号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="业务品种" prop="businessTypeName">
        <el-input
          v-model="queryParams.businessTypeName"
          class="!w-240px"
          clearable
          placeholder="请输入业务品种"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="endtime1">
        <el-date-picker
          class="!w-1/1"
          v-model="queryParams.endtime1"
          type="daterange"
          value-format="YYYY/MM/DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
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
        <el-button v-if="cancelContractVIf" @click="cancelContract" plain tpye="">
          取消合同
        </el-button>
        <el-button v-if="bookInContractVIf" @click="bookInContract" plain tpye=""> 登记合同 </el-button>
        <el-button @click="goDetail" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
          合同详情
        </el-button>
        <el-button @click="doRiskDetection">
          自动风险探测
        </el-button>
        <el-button @click="submit">
          提交
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
      @row-dblclick="goDetail"
    />

    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="'BusinessContract'"
      @cancel="handleCreditFlowApprovalCancel"
    />
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"/>
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'

defineOptions({
  name: 'ConTractCreditContract'
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
  fetchCback,
} = useTableList(Api.getCustomerInfoEntPage, { dealType: props.params.dealtype })

fetchCback((list) => {
  list.forEach(v => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.exposureSum1 = formatValue(v.exposureSum, 'currency')
  })
})

const search1 = () => {
  if (queryParams.endtime1?.length) {
    queryParams.endTimeStart = queryParams.endtime1[0]
    queryParams.endTimeEnd = queryParams.endtime1[1]
  } else {
    queryParams.endTimeStart = ''
    queryParams.endTimeEnd = ''
  }
  search()
}

const router = useRouter() // 路由

const columns = [
  { label: '合同流水号', field: 'serialNo', minWidth: 190 },
  { label: '批复流水号', field: 'relativeserialNo', minWidth: 190 },
  { label: '客户编号', field: 'customerID', minWidth: 220 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 120 },
  { label: '发生类型', field: 'occurTypeName' },
  { label: '币种', field: 'currency' },
  { label: '额度金额', field: 'businessSum1', minWidth: 130 },
  { label: '敞口金额', field: 'exposureSum1', minWidth: 130 },
  { label: '期限', field: 'termMonth' },
  { label: '主要担保方式', field: 'vouchTypeName', minWidth: 120 },
  { label: '起始日期', field: 'putOutDate', minWidth: 120 },
  { label: '到期日期', field: 'maturity', minWidth: 120 },
  { label: '供应链标识', field: 'gylflagName', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomerType', minWidth: 130 },
  { label: '所属项目名称', field: 'projectName', minWidth: 320 },
  { label: '管户人', field: 'manageUserName' },
  { label: '管户机构', field: 'manageOrgName', minWidth: 150 },
  { label: '登记日期', field: 'inputDate', minWidth: 120 },
  { label: '完成时间', field: 'endTime', minWidth: 180 },
]

// 等级合同显影，只有待登记合同显示
const bookInContractVIf = computed(() => {
  return ['01'].includes(props.params.key)
})

// 取消合同显隐
const cancelContractVIf = computed(() => {
  return ['030010'].includes(props.params.key)
})

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: currentRow.value.businessType,
      customerID: currentRow.value.customerID,
      serialNo: currentRow.value.serialNo,
      t: Date.now()
    }
  })
}

const bookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessageBox.confirm('你确定要根据选中的电子最终审批意见登记合同吗？确定后生成合同', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消',
    beforeClose: (action, instance, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      Api.bookInContract({ relativeserialno: currentRow.value.relativeserialno,creditSourceFlag:'01' })
        .then((res) => {
          done()
        })
        .catch((e) => {
          instance.confirmButtonText = '确 认'
        })
        .finally((_) => (instance.confirmButtonLoading = false))
    }
  }).then((res) => {
    ElMessage.success('登记成功')
  })
}

const cancelContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessageBox.confirm('您确定取消该信息吗？', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消',
    beforeClose: (action, instance, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      Api.cancelContract({ objectType: 'BusinessContract', serialNo: currentRow.value.serialNo })
        .then((res) => {
          done()
        })
        .catch((e) => {
          instance.confirmButtonText = '确 认'
        })
        .finally((_) => (instance.confirmButtonLoading = false))
    }
  }).then((res) => {
    ElMessage.success('登记成功')

    getList()
  })
}

const button1 = () => {
  ElMessage.info('功能待实现')
}





const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const creditFlowApprovalVisible = ref(false)

const doRiskDetection = async (rskTp = 1) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  serialNo.value = currentRow.value.serialNo
  phaseNo.value = props.params.dealtype.split("^")[2]
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
  console.log('hasFailure',hasFailure)
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
  getList()
  creditFlowApprovalVisible.value = false
}
</script>
