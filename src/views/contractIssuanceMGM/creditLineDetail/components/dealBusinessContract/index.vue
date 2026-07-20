<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <el-form
    ref="queryFormRef"
      v-show="isExpand"
      :model="queryParams"
      class="search-form"
      label-width="auto"
      @keyup.enter="search1"
    >
      <el-form-item label="合同流水号" prop="serialno">
        <el-input
          v-model="queryParams.serialno"
          class="!w-240px"
          clearable
          placeholder="请输入合同流水号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customername">
        <el-input
          v-model="queryParams.customername"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="业务品种" prop="businesstypename">
        <el-input
          v-model="queryParams.businesstypename"
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
  
    <div style="display: flex; justify-content: space-between; margin-bottom: 17px">
      <!-- <div style="font-size: 18px; font-weight: 700"> 查询结果</div> -->
      <div>

        <el-button v-if="addBusiTypeVIf" @click="addBusiType" plain tpye=""> 登记额度项下合同 </el-button>
        <el-button @click="contractDetail" plain type="">
          合同详情
        </el-button>
        <el-button v-if="cancelContractVIf" @click="cancelContract" plain tpye=""> 取消合同 </el-button>
        <el-button v-if="signOpinionVIf" @click="handleSignOpinion" plain tpye=""> 签署意见 </el-button>
        <el-button v-if="viewPhaseOpinionVIf" @click="viewPhaseOpinion" plain tpye=""> 查看意见 </el-button>
        <el-button v-if="riskVIf" @click="doRiskDetection"> 自动风险探测 </el-button>
        <el-button  v-if="preViewReportVIf" @click="preViewReport"> 查看关联额度批复通知书 </el-button>
        <el-button @click="viewEdpfReport" :loading="loading3" plain tpye="">
          查看批复通知书
        </el-button>

<!--        <el-button @click="syncContractInfo" plain tpye=""> 同步合同信息 </el-button>-->
        <el-button v-if="returnOnlineBankVIf" @click="returnOnlineBank" plain tpye=""> 退回网银 </el-button>
        <el-button  @click="syncVideo"> 同步视频系统 </el-button>

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
      @row-dblclick="contractDetail"
    />

    <addBusiTypePop ref="addBusiTypePopRef" objectType="Inside" @confirm="getList" />
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @confirm="handleSignOpinionConfirm"
      @cancel="
      handleSignOpinionCancel"
    />

    <!-- 查看额度批复通知书 -->
    <preViewReportPop ref="preViewReportRef" />

    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import addBusiTypePop from '@/views/contractIssuanceMGM/components/addBusiTypePop/index.vue'
import { useMessage } from '@/hooks/web/useMessage'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import viewPhaseOpinionPop from '@/views/contractIssuanceMGM/viewEDPhaseOpinion/index.vue'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const addBusiTypeVIf = computed(() => ['1010'].includes(route.query.parentMenuKey))

// 退回网银显隐
const returnOnlineBankVIf = computed(() => ['1010', '1030'].includes(route.query.parentMenuKey))

const isExpand = ref(false)

const route = useRoute()

const {
  queryParams,
  getList,
  loading,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange
} = useTableList(Api.getCustomerInfoEntPage, {
  dealtype: props.params.dealtype,
  objectno: route.query.serialNo
})

const search1 = () => {
  if (queryParams.endtime1?.length) {
    queryParams.endtimestart = queryParams.endtime1[0]
    queryParams.endtimeend = queryParams.endtime1[1]
  } else {
    queryParams.endtimestart = ''
    queryParams.endtimeend = ''
  }
  search()
}

const router = useRouter() // 路由

const columns = [
  { label: '合同流水号', field: 'serialno', minWidth: 190 },
  { label: '批复流水号', field: 'relativeserialno', minWidth: 190 },
  { label: '客户编号', field: 'customerid', minWidth: 220 },
  { label: '客户名称', field: 'customername', minWidth: 320 },
  { label: '电子合同签署状态', field: 'bcdzhtstatus', minWidth: 150 },
  { label: '业务品种', field: 'businesstypename', minWidth: 190 },
  { label: '币种', field: 'currency' },
  { label: '业务金额', field: 'businesssum' },
  { label: '发生类型', field: 'occurtypename' },
  { label: '主要担保方式', field: 'vouchtypename', minWidth: 190 },
  { label: '期限（月）', field: 'termmonth', minWidth: 100 },
  { label: '期限（天）', field: 'termday', minWidth: 100 },
  { label: '供应链标识', field: 'gylflagname', minWidth: 120 },
  { label: '供应链客户类型', field: 'gylcustomertype', minWidth: 190 },
  { label: '所属项目名称', field: 'projectname', minWidth: 320 },
  { label: '起始日期', field: 'putoutdate', minWidth: 120 },
  { label: '到期日期', field: 'maturity', minWidth: 120 },
  { label: '管户人', field: 'manageusername' },
  { label: '管户机构', field: 'manageorgname', minWidth: 120 },
  { label: '登记日期', field: 'inputdate', minWidth: 120 },
  { label: '完成时间', field: 'endtime', minWidth: 150 }
]

const contractDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择')

  router.push({
    path: '/contractIssuanceMGM/contractDetail',
    query: {
      businessType: currentRow.value.businesstype,
      customerID: currentRow.value.customerid,
      serialNo: currentRow.value.serialno,
      isEdit: route.query.isEdit,
      parentMenuKey: route.query.parentMenuKey,
      creditSourceFlag: route.query.creditSourceFlag,
      t: Date.now()
    }
  })
}

// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.viewEdpfReport({
    objectNo: currentRow.value.serialno
  })
    .then((res) => {
      if (res.checkflag !== 'true') {
        ElMessage.warning(res.msg)
        return
      }

      window.open(res.url)
    })
    .finally(() => (loading3.value = false))
}

// 登记额度项下合同
const addBusiTypePopRef = ref()
const addBusiType = () => {

  props.params.detailInfo.creditSourceFlag = route.query.creditSourceFlag
  props.params.detailInfo.parentMenuKey = route.query.parentMenuKey
  addBusiTypePopRef.value.open(props.params.detailInfo)
}

// 签署意见
const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])
const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.serialno,
    businessType: selectedRows.businesstype,
    phaseNo: props.params.dealtype?.split('^')[2],
    objectType: 'BusinessContract'
  }
  signOpinionVisible.value = true
}

const { confirmFetch } = useMessage()
// 同步合同信息
const syncContractInfo = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定同步合同信息',
    fetchFunc: () => Api.syncContractInfo({ serialNo: currentRow.value.serialno })
  }).then((_) => {
    ElMessage.success('同步成功')

    getList()
  })
}

// 同步合同信息
const syncVideo = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定同步视频系统',
    fetchFunc: () => Api.syncVideo({
      objectno: currentRow.value.serialno,
      objectType: 'BusinessContract',
    })
  }).then((_) => {
    ElMessage.success('同步成功')

    getList()
  })
}

// 退回网银
const returnOnlineBank = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定退回网银？',
    fetchFunc: () =>
      Api.returnOnlineBank({ serialNo: currentRow.value.serialno, objectType: 'BusinessContract' })
  }).then((_) => {
    ElMessage.success('已退回')

    getList()
  })
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')

// 取消合同显隐
const cancelContractVIf = computed(() => {
  console.log(props.params.key)
  return ['080'].includes(props.params.key) && ['1010', '1030'].includes(route.query.parentMenuKey)
})

// 签署显隐
const signOpinionVIf = computed(() => {
  return ['080'].includes(props.params.key) && ['1010', '1030'].includes(route.query.parentMenuKey)
})

// 查看意见显隐
const viewPhaseOpinionVIf = computed(() => {
  return ['080'].includes(props.params.key) && ['1030'].includes(route.query.parentMenuKey)
})
const cancelContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '您确定取消该信息吗？',
    fetchFunc: () =>
      Api.cancelContract({ objectType: 'BusinessContract', serialNo: currentRow.value.serialno })
  }).then((_) => {
    ElMessage.success('取消成功')

    getList()
  })
}
const button1 = () => {
  ElMessage.info('功能待实现')
}

// 风险探测
const riskVIf = computed(() => {
  return ['080'].includes(props.params.key) && !['1030'].includes(route.query.parentMenuKey)
})

// 查看关联额度批复通知书
const preViewReportVIf = computed(() => {
  return !['1070'].includes(route.query.parentMenuKey)
})

const doRiskDetection = async (rskTp = 1) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  serialNo.value = currentRow.value.serialno
  phaseNo.value = props.params.dealtype.split("^")[2]
  
  riskData.value = {
    scenarioId: '020',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      SerialNo: serialNo.value,
      ObjectType: 'BusinessContract',
      PhaseNo:  phaseNo.value,
      CustomerID: currentRow.value.customerid,
      ObjectNo: serialNo.value
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

// 查看意见
const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  viewPhaseOpinionRef.value.open({serialNo:currentRow.value.serialno})

}

// 查看额度批复通知书
const preViewReportRef = ref()
const preViewReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  preViewReportRef.value.open({ objectNo: currentRow.value.serialno })
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

</script>
