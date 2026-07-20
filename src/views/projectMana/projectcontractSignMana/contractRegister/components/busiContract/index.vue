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
    <div class="mb-15px flex">
      <el-button v-if="addBusiTypeVIf" @click="addBusiType" plain tpye="">
        登记额度项下合同
      </el-button>
      <el-button v-if="goDetailVIf" @click="goDetail" plain type="">
        合同详情
      </el-button>
      <el-button v-if="cancelContractVIf" @click="cancelContract" plain tpye="">
        取消合同
      </el-button>
      <el-button v-if="bookInContractVIf" @click="bookInContract" plain tpye="">
        登记合同
      </el-button>
      <el-button v-if="signOpinionVIf" @click="handleSignOpinion" plain tpye="">
        签署意见
      </el-button>
      <el-button v-if="riskVIf" @click="doRiskDetection"> 自动风险探测 </el-button>
      <el-button v-if="submitVIf" @click="submit"> 提交 </el-button>
      <el-button v-if="viewRecordVIf" @click="toRecord"> 查看流转记录 </el-button>
      <el-button v-if="takeBackVIf" @click="takeBack"> 收回 </el-button>
      <el-button v-if="viewOpinionIf" @click="viewPhaseOpinion" plain tpye="">
        查看意见
      </el-button>


      <el-button  v-if="preViewReportVIf" @click="preViewReport"> 查看关联额度批复通知书 </el-button>
      <el-button v-if="watchApprovalVIf" @click="watchApproval"> 查看批复通知书 </el-button>

      <!-- <el-button  @click="externalDate"> 放款辅助审查工具 </el-button> -->
      <el-button v-if="returnOnlineBankVIf" @click="returnOnlineBank" plain tpye="">
        退回网银
      </el-button>
      <el-button v-if="syncVideoVIf" @click="syncVideo"> 同步视频系统 </el-button>
      <el-button v-if="concentratedWorkOptionVIf" @click="concentratedWorkOption" plain tpye="">
        集中作业任务挑选
      </el-button>

      <el-button v-if="concentratedWorkBackVIf" @click="concentratedWorkBack" plain tpye="">
        集中作业退回
      </el-button>
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
    <addBusiTypePop ref="addBusiTypePopRef" objectType="Outside" @confirm="getList" />


    <!-- 查看额度批复通知书 -->
    <preViewReportPop ref="preViewReportRef" />



    <!-- IFrame Dialog（覆盖显示） -->
    <Dialog
      v-model="iframeDialogVisible"
      :title="iframeTitle"
      width="90%"
      :fullscreen="true"
      :scroll="false"
    >
      <IFrame
        v-if="iframeDialogVisible && iframeUrl"
        :src="iframeUrl"
        :auto-height="true"
        :min-height="'600px'"
        :height-offset="94.5"
      />
    </Dialog>
    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import addBusiTypePop from '@/views/contractIssuanceMGM/components/addBusiTypePop/index.vue'
import { useMessage } from '@/hooks/web/useMessage'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import * as CreditFlowApi from "@/api/creditflow";
import {associatedCreditApi} from "@/api/creditapplication/associatedCredit";
import {addDialog} from "@/components/Dialog";
import viewPhaseOpinionPop from '@/views/contractIssuanceMGM/viewEDPhaseOpinion/index.vue'
import { useUserStore } from '@/store/modules/user'
import {checkRoleIds} from "@/utils/permission";
import { getColumns } from './common.js'

defineOptions({
  name: 'ConTractCreditContract'
})

const isExpand = ref(false)
const userStore = useUserStore()

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
  setCurrentRow
} = useTableList(Api.getYWCreditBusContraPage, { dealType: props.params.dealtype,creditSourceFlag:'01' }, false)

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

const columns = getColumns(props.params.key)

// 等级合同显影，只有待登记合同显示
const bookInContractVIf = computed(() => {
  return ['01'].includes(props.params.key)
})

const parentMenuKey = props.params.dealtype.split('^')[0]

// 取消合同显隐
const cancelContractVIf = computed(() => {
  return ['1010','1025','1030'].includes(parentMenuKey)
})

// 签署意见
const signOpinionVIf = computed(() => {
  return ['1010','1025','1030'].includes(parentMenuKey)
})

// 登记额度项下合同显隐
const addBusiTypeVIf = computed(() => {
  return ['1010','1025'].includes(parentMenuKey)
})

// 退回网银显隐
const returnOnlineBankVIf = computed(() => {
  return ['1010','1025','1030'].includes(parentMenuKey)
})

// 查看流转记录
const viewRecordVIf = computed(() => {
  return ['1020'].includes(parentMenuKey)
})

// 收回
const takeBackVIf = computed(() => {
  return ['1020'].includes(parentMenuKey)
})

// 风险探测
const riskVIf = computed(() => {
  return ['1010','1025'].includes(parentMenuKey)
})

// 提交
const submitVIf = computed(() => {
  return ['1010','1025','1030'].includes(parentMenuKey)
})

// 查看意见
const viewOpinionIf = computed(() => {
  return !['1010','1070'].includes(parentMenuKey)
})

// 集中作业任务挑选
const concentratedWorkOptionVIf = computed(() => {
  return ['1070'].includes(parentMenuKey)
})
// 集中作业任务退回
const concentratedWorkBackVIf = computed(() => {
  return ['1010'].includes(parentMenuKey)
})

// 合同详情
const goDetailVIf = computed(() => {
  return !['1070'].includes(parentMenuKey)
})
// 查看关联额度批复通知书
const preViewReportVIf = computed(() => {
  return !['1070'].includes(parentMenuKey)
})

// 查看批复通知书
const watchApprovalVIf = computed(() => {
  return !['1070'].includes(parentMenuKey)
})

// 同步视频系统
const syncVideoVIf = computed(() => {
  return !['1070'].includes(parentMenuKey)
})
watch(() => props.params.key,() => {
  console.log('key111',props.params.key)
  console.log('key111',props.params)
},{deep:true})
const goDetail = () => {
  if(!goDetailVIf.value) return;
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const has289 = checkRoleIds(['289'])
   const isEdit = (['0010','3000'].includes(currentRow.value.phaseno)) || (props.params.key ==='1020' && has289)
   console.log(currentRow.value.phaseno);
  router.push({
    path: '/contractIssuanceMGM/contractDetail',
    query: {
      businessType: currentRow.value.businessType,
      customerID: currentRow.value.customerID,
      serialNo: currentRow.value.serialNo,
      phaseNo: currentRow.value.phaseno,
      tempSaveFlag: currentRow.value.tempSaveFlag,
      readonly: props.params.dealtype?.split('^')[2],
      customerType:  currentRow.value.customerType,
      isEdit,
      creditSourceFlag: '01',
      parentMenuKey,
      t: Date.now(),
      _tagTitle: '项目业务合同详情', // 对tag页签中的title，重命名
    }
  })
}
// 登记额度项下合同
const addBusiTypePopRef = ref()
const addBusiType = () => {
  addBusiTypePopRef.value.open({creditSourceFlag:'01',parentMenuKey})
}

const { confirmFetch } = useMessage()
const bookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '你确定要根据选中的电子最终审批意见登记合同吗？确定后生成合同',
    fetchFunc: () => Api.bookInContract({ relativeserialno: currentRow.value.relativeserialno,creditSourceFlag:'01' })
  }).then((_) => {
    ElMessage.success('登记成功')
  })
}

// 退回网银
const returnOnlineBank = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定退回网银？',
    fetchFunc: () =>
      Api.returnOnlineBank({
        serialNo: currentRow.value.serialNo,
        objectType: 'BusinessContract'
      })
  }).then((_) => {
    ElMessage.success('已退回')

    getList()
  })
}

const cancelContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '您确定取消该信息吗？',
    fetchFunc: () =>
      Api.cancelContract({ objectType: 'BusinessContract', serialNo: currentRow.value.serialNo })
  }).then((_) => {
    ElMessage.success('取消成功')

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

const doRiskDetection = async (rskTp = 1,otherParams = {}) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  serialNo.value = currentRow.value.serialNo
  phaseNo.value = currentRow.value.phaseno
  riskData.value = {
    scenarioId: '020',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      SerialNo: serialNo.value,
      ObjectType: 'BusinessContract',
      PhaseNo: phaseNo.value,
      CustomerID: currentRow.value.customerID,
      ObjectNo: serialNo.value
    },
    otherParams
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}
const checkCommentExec = async(serialNo,objectType,phaseNo) => {
  const resp = await Api.checkComment({serialNo,objectType,phaseNo}).then(res => res)
  return resp;

}

const submit = async (checkFlag) => {
  if(checkFlag != 1){
    const data = await checkCommentExec(currentRow.value.serialNo,"BusinessContract",currentRow.value.phaseno)
    console.log("data:",data)
    if (!data?.phaseOpinion) {
    ElMessage.warning(`${currentRow.value.serialNo}签署意见未保存`)
      return
    }
  }

   const checkBusType =  await Api.checkBusTypeAndLoanProductCategory({"serialNo":currentRow.value.serialNo,"projectType":"01"})
    if(checkBusType){
        ElMessage.warning(`${currentRow.value.serialNo} 此业务不允许在供应链作业系统发起`)
      return
    }


   const submitRisk =  await Api.checkSubmitIsRisk({"objectNo":currentRow.value.serialNo,"objectType":"BusinessContract","phaseNo":currentRow.value.phaseno})
    //需要强控
    console.log("ispass:",submitRisk)
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

// 签署意见
const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])
const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.serialNo,
    businessType: selectedRows.businessType,
    phaseNo: selectedRows.phaseno,
    objectType: 'BusinessContract',
    flowNo: 'BusinessContract'
  }
  signOpinionVisible.value = true
}

const handleRiskMonitorCancel = async () => {
  riskMonitorVisible.value = false
}
const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}

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
      objectType: 'BusinessContract',
      nextUserInfo: '',
      flag:1 // 申请
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


// 查看额度批复通知书
const preViewReportRef = ref()
const preViewReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  preViewReportRef.value.open({ objectNo: currentRow.value.serialNo })
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

const watchApproval =async () => {
  // 查看批复通知书
  if (!currentRow.value) {
    message.warning('请选择一条数据')
    return
  }


  const res = await associatedCreditApi.handleViewEdpfReport({
    objectNo:currentRow.value.serialNo,
    // objectNo:'BC2025012300000051',
    //objectno:'BC2025120900000001'
  })
  if (res.checkflag !== 'true') {
    ElMessage.warning(res.msg)
    return
  }

  console.log('查看批复通知书',res);
  // openIframeDialog(res.url,`调查报告-${currentRow.value.serialNo}`)
  window.open(res.url)

}

// 集中作业
const concentratedWorkOption = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定集中作业挑选？',
    fetchFunc: () =>
      Api.concentratedWorkOption({ serialNo: currentRow.value.serialNo, objectType: 'BusinessContract',CreditSourceFlag:props.params?.creditSourceFlag ?? '01' })
  }).then((_) => {
    ElMessage.success('挑选成功')
    setCurrentRow(null)
    getList()
  })
}

// 集中作业退回
const concentratedWorkBack = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定集中作业退回？',
    fetchFunc: () =>
      Api.concentratedWorkBack({ serialNo: currentRow.value.serialNo, objectType: 'BusinessContract',CreditSourceFlag:props.params?.creditSourceFlag ?? '01' })
  }).then((_) => {
    ElMessage.success('退回成功')
    setCurrentRow(null)
    getList()
  })
}


// 放款辅助审查工具
const externalDate = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessage.info('功能待实现')
}

onActivated(() => {
  search()
})
</script>
