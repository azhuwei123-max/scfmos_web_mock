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
      <el-form-item label="完成时间" prop="endtime1" class="w-322px">
        <el-date-picker
          class="!w-240px"
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
  

  <!-- 列表 -->
  
    <div class="mb-15px flex">
      <!-- <div style="font-size: 18px; font-weight: 700"> 查询结果</div> -->
      <div>
        <el-button @click="goDetail" plain type="">
          合同详情
        </el-button>
        <el-button v-if="cancelContractVIf" @click="cancelContract" plain tpye="">
          取消合同
        </el-button>
        <el-button v-if="viewRecordVIf" @click="toRecord"> 查看流转记录 </el-button>

        <el-button v-if="takeBackVIf" @click="takeBack"> 收回  </el-button>
        <el-button v-if="signOpinionVIf" @click="handleSignOpinion" plain tpye="">
          签署意见
        </el-button>
        <el-button v-if="doRiskDetectionVIf" @click="doRiskDetection"> 自动风险探测 </el-button>
        <el-button v-if="submitVIf" @click="submit"> 提交 </el-button>
        <el-button v-if="viewOpinionIf" @click="viewPhaseOpinion" plain tpye="">
          查看意见
        </el-button>


        <el-button v-if="bookInContractVIf" @click="bookInContract" plain tpye="">
          登记合同
        </el-button>
        <el-button  @click="preViewReport"> 查看关联额度批复通知书 </el-button>
        <el-button  @click="viewEdpfReport" :loading="loading3" plain tpye=""> 查看批复通知书 </el-button>
        <!-- <el-button  @click="externalDate"> 放款辅助审查工具 </el-button>
        <el-button  @click="supplementContract"> 转授信分配方案录入 </el-button> -->
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
      @row-dblclick="goDetail"
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

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
    />
    <!-- 查看额度批复通知书 -->
    <preViewReportPop ref="preViewReportRef" />

    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import {addDialog} from '@/components/Dialog'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import { useMessage } from '@/hooks/web/useMessage'
import * as CreditFlowApi from "@/api/creditflow";
import {associatedCreditApi} from "@/api/creditapplication/associatedCredit";
import viewPhaseOpinionPop from '@/views/contractIssuanceMGM/viewEDPhaseOpinion/index.vue'
import {checkRoleIds} from "@/utils/permission";

defineOptions({
  name: 'ConTractCreditContract'
})

const isExpand = ref(false)

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
} = useTableList(Api.getCustomerInfoEntPage, { dealType: props.params.dealtype,creditSourceFlag:'02'  }, false)

fetchCback((list) => {
  list.forEach((v) => {
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
  { label: '业务品种', field: 'businessTypeName', minWidth: 160 },
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
  { label: '管户机构', field: 'manageOrgName', minWidth: 180 },
  { label: '登记日期', field: 'inputDate', minWidth: 120 },
  { label: '完成时间', field: 'endTime', minWidth: 180 }
]

// 等级合同显影，只有待登记合同显示
const bookInContractVIf = computed(() => {
  return ['01'].includes(props.params.key)
})


// 取消合同显隐
const cancelContractVIf = computed(() => {
  return ['030010', '030025', '030030'].includes(props.params.key)
})

// 签署意见
const signOpinionVIf = computed(() => {
  return ['030010','030025','030030'].includes(props.params.key)
})
//风险探测
const doRiskDetectionVIf = computed(() => {
  return ['030010','030025','030030'].includes(props.params.key)
})

//提交
const submitVIf = computed(() => {
  return ['030010','030025','030030'].includes(props.params.key)
})

// 登记额度项下合同显隐
const addBusiTypeVIf = computed(() => {
  return ['030010','030025'].includes(props.params.key)
})

// 退回网银显隐
const returnOnlineBankVIf = computed(() => {
  return ['030010','030025','030030'].includes(props.params.key)
})

// 查看流转记录
const viewRecordVIf = computed(() => {
  return ['030020'].includes(props.params.key)
})

// 收回
const takeBackVIf = computed(() => {
  return ['030020'].includes(props.params.key)
})


// 查看意见
const viewOpinionIf = computed(() => {
  return !['030010'].includes(props.params.key)
})

// 查看批复通知书
const viewEdpfReportVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const has289 = checkRoleIds(['289'])
  const isEdit = (['0010','3000'].includes(currentRow.value.phaseno)) || (props.params.key ==='030020' && has289)
  console.log('has289',has289,isEdit);
  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: currentRow.value.businessType,
      customerID: currentRow.value.customerID,
      serialNo: currentRow.value.serialNo,
      readonly: props.params.dealtype?.split('^')[2],
      isEdit,
      customerType: currentRow.value.customerType,
      phaseNo: currentRow.value.phaseno,
      // 用于合同详情中的批复详情serialNo
      relativeserialNoByCreditLine: currentRow.value.relativeserialNo,
      creditSourceFlag: '02',
      parentMenuKey: props.params.dealtype?.split('^')[0],
      t: Date.now(),
      _tagTitle: '链属额度合同详情', // 对tag页签中的title，重命名
    }
  })
}

const { confirmFetch } = useMessage()
const bookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '你确定要根据选中的电子最终审批意见登记合同吗？确定后生成合同',
    fetchFunc: () => Api.bookInContract({ relativeserialno: currentRow.value.relativeserialno,creditSourceFlag:'02' })
  }).then((_) => {
    ElMessage.success('登记成功')
  })
}

const cancelContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '您确定取消该信息吗？',
    fetchFunc: () => Api.cancelContract({ objectType: 'BusinessContract', serialNo: currentRow.value.serialNo })
  }).then((_) => {
    ElMessage.success('已取消')

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

const doRiskDetection = async (rskTp = 1, otherParams = {}) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  serialNo.value = currentRow.value.serialNo
  phaseNo.value = props.params.dealtype?.split('^')[2]
  riskData.value = {
    scenarioId: '015',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      EDObjectNo: serialNo.value,
      EDObjectType: 'BusinessContract',
      EDPhaseNo: phaseNo.value,
      EDCustomerID: currentRow.value.customerID
    },
    otherParams
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

// 签署意见
const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])
const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.serialNo,
    businessType: selectedRows.businessType,
    phaseNo: props.params.dealtype?.split('^')[2],
    objectType: 'BusinessContract',
    flowNo:'CreditContractFlow'
  }
  signOpinionVisible.value = true
}

const checkCommentExec = async(serialNo,objectType,phaseNo) => {
  const resp = await Api.checkComment({serialNo,objectType,phaseNo}).then(res => res)
  return resp;
}

const submit = async (checkFlag) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  if(checkFlag != 1){
    const data = await checkCommentExec(currentRow.value.serialNo,"BusinessContract",currentRow.value.phaseno)
    if (!data?.phaseOpinion) {
    ElMessage.warning(`${currentRow.value.serialNo}签署意见未保存`)
      return
    }
  }
  const checkBusType =  await Api.checkBusTypeAndLoanProductCategory({"serialNo":currentRow.value.serialNo,"projectType":"02"})
    if(checkBusType){
        ElMessage.warning(`${currentRow.value.serialNo} 此业务不允许在供应链作业系统发起`)
      return
    }
   const submitRisk =  await Api.checkSubmitIsRisk({"objectNo":currentRow.value.serialNo,"objectType":"BusinessContract","phaseNo":currentRow.value.phaseno})
    //需要强控
    await doRiskDetection(2, { isPass: !submitRisk })
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
// const { confirmFetch } = useMessage()
// 收回
const takeBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: currentRow.value.serialNo,
      phaseNo: currentRow.value.phaseno,
      nextUserRole: "收回",
      nextUserInfo: '',
      objectType:'BusinessContract',
      flag:1
    })
  })
  ElMessage.success('收回成功')
  getList()
}


// 同步合同信息
const syncVideo = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定同步视频系统',
    fetchFunc: () => Api.syncVideo({
      objectno: currentRow.value.serialNo,
      objectType: 'BusinessContract',
    })
  }).then((_) => {
    ElMessage.success('同步成功')

    getList()
  })
}



// 放款辅助审查工具
const externalDate = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessage.info('功能待实现')
}

//额度分配信息补录
const supplementContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessage.info('功能待实现')
}

//统一统一额度信息补录
const supplementCredit = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessage.info('功能待实现')
}

// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.viewEdpfReport({
    objectNo: currentRow.value.relativeserialNo
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading3.value = false)
}

/** 打开 IFrame Dialog */
const iframeDialogVisible = ref(false)
const iframeUrl = ref('')
const iframeTitle = ref('')

const openIframeDialog = (url, title = '详情预览') => {
  iframeUrl.value = url
  iframeTitle.value = title
  iframeDialogVisible.value = true
}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  const titleObj = {
    customerName:currentRow.value.customerName,
    serialNo: currentRow.value.serialNo
  }
  viewPhaseOpinionRef.value.open(currentRow.value, titleObj)
  //   router.push({
  //   path: '/contractIssuanceMGM/viewEDPhaseOpinion',
  //   query: {
  //     serialNo: currentRow.value.serialNo,
  //   }
  // })

}

// 监听 Dialog 关闭，延迟清空 URL（避免关闭动画闪烁）
watch(iframeDialogVisible, (visible) => {
  if (!visible) {
    // Dialog 关闭后延迟清空 URL
    setTimeout(() => {
      iframeUrl.value = ''
    }, 300)
  }
})


// 查看流转记录
const toRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  // router.push({
  //   path: '/revApprMan/creditreviewapprovalrecord',
  //   query: {
  //     serialNo: currentRow.value.serialNo,
  //     objectType: "BusinessContract",
  //     t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
  //   }
  // })
   
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={currentRow.value.serialNo} objectType={'BusinessContract'} />
    )
  })




}


// 查看额度批复通知书
const preViewReportRef = ref()
const preViewReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  preViewReportRef.value.open({ objectNo: currentRow.value.serialNo })
}

onActivated(() => {
  search()
})
</script>
