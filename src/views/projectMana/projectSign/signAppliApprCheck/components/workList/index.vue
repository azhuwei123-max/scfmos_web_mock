<template>
  <ContentWrap v-loading="pageLoading">
    <div class="flex items-center mb-2 w-[110px]" @click="isExpand = !isExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      v-show="isExpand"
      :model="queryParams"
      class="search-form"
      label-width="auto"
      @keyup.enter="search1"
    >
      <el-form-item label="起始日" prop="putoutdate1"> 
        <div class="w-240px">
          <el-date-picker
            class="!w-1/1"
            v-model="queryParams.putoutdate1"
            type="daterange"
            value-format="YYYY/MM/DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-form-item>
      <el-form-item label="出账流水号" prop="serialno">
        <el-input
          v-model="queryParams.serialno"
          class="!w-240px"
          clearable
          placeholder="请输入出账流水号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customername">
        <div class="w-240px">
          <el-input
            v-model="queryParams.customername"
            class="!w-240px"
            clearable
            placeholder="请输入客户名称"
          />
        </div>
      </el-form-item>
      <el-form-item label="完成时间" prop="endtime1">
        <div class="w-240px">
          <el-date-picker
            class="!w-1/1"
            v-model="queryParams.endtime1"
            type="daterange"
            value-format="YYYY/MM/DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-form-item>
      <el-form-item label="记账日期" prop="transdate1">
        <div class="w-240px">
          <el-date-picker
            class="!w-1/1"
            v-model="queryParams.transdate1"
            type="daterange"
            value-format="YYYY/MM/DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-form-item>
      <el-form-item label="收到业务时间" prop="begintime">
        <div class="w-240px">
          <el-date-picker
            class="!w-1/1"
            v-model="queryParams.begintime1"
            type="daterange"
            value-format="YYYY/MM/DD"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="search1" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
      <div class="mb-15px">
        <el-button @click="goDetail" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
           放贷详情
        </el-button>
        <el-button @click="viewPhaseOpinion" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
          查看意见
        </el-button>
        <el-button v-if="signOpinionVIf" @click="handleSignOpinion" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
          签署意见
        </el-button>
        <el-button v-if="props.params.type === 'Y'" @click="toRecord"> 查看流转记录 </el-button>
        <el-button v-if="props.params.type === 'Y'" @click="takeBack"> 收回  </el-button>

        <el-button v-if="doRiskDetectionVIf" @click="doRiskDetection"> 自动风险探测 </el-button>
        <el-button v-if="props.params.type === 'N'" @click="doBack"> 退回前一步 </el-button>
        <!-- <el-button v-if="props.params.type === 'N'" @click="handleNoticeBook"> 填写放贷通知书 </el-button> -->
        <el-button @click="viewFormatReport"> 查看放贷通知书 </el-button>

        <el-button v-if="submitVIf" @click="submit"> 提交 </el-button>
        <!-- <el-button @click="preViewReport"> 查看额度批复通知书 </el-button>
        <el-button @click="viewEdpfReport" :loading="loading3"> 查看批复通知书 </el-button> -->
        <el-button type="" @click="handleExport" :loading="exportLoading">
        <Icon icon="ep:download" class="mr-5px"/>导出EXCEL
        </el-button>
        <el-button v-if="props.params.type === 'N' && btnShow1" @click="openDialog3"> 挑选 </el-button>
        <el-button v-if="props.params.type === 'N' && showBackHost" :loading="backHostBtnLoad" @click="backHost" plain type="">
          退回主办
        </el-button>
        <el-button v-if="props.params.type === 'N' && btnShow1" @click="aprrovalOptionCancel" :loading="loading4">
          取消挑选
        </el-button>
        <el-button v-if="props.params.type === 'N'" @click="doMoreBack" plain type="">
          快捷退回/否决
        </el-button>
        <el-button v-if="props.params.type === 'N'" @click="returnOnlineBank" plain tpye="">
          退回网银
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
  </ContentWrap>

  <Dialog v-model="moreBackMsgConfirmShow" title="请选择">
    <el-select
      v-model="nextUserRole"
      placeholder="意见类型"
      clearable
      class="!w-300px"
    >
      <el-option label="退回补充资料" value="退回补充资料"/>
      <el-option label="退回补件" value="退回补件"/>
      <el-option label="否决" value="否决"/>
    </el-select>
    <template #footer>
      <el-button tpye=""  @click="moreBackConfirm">确 认</el-button>
      <el-button @click="moreBackMsgConfirmShow = false">取 消</el-button>
    </template>
  </Dialog>
  <ApprovalOpinion
    v-model="signOpinionVisible"
    :processInstance="currentProcessInstanceForOpinion"
    @confirm="handleSignOpinionConfirm"
    @cancel="handleSignOpinionCancel"
    @submit="submit"
    :hide-back="true"
    @back="doMoreBack"
  />
  <Dialog v-model="backMsgConfirmShow" title="提示">
    <span>您确认要将该申请退回上一环节吗？</span>
    <template #footer>
      <el-button tpye="" @click="backConfirm">确 认</el-button>
      <el-button @click="backMsgConfirmShow = false">取 消</el-button>
    </template>
  </Dialog>
   <CreditFlowApproval
    v-model="creditFlowApprovalVisible"
    :serial-no="serialNo"
    :phase-no="phaseNo"
    :object-type="'PutOutApply'"
    @refresh="getList"
    @cancel="handleCreditFlowApprovalCancel"
    />
    <RiskMonitor
    v-model="riskMonitorVisible"
    :risk-data="riskData"
    @confirm="handleRiskMonitorConfirm"
    @cancel="handleRiskMonitorCancel"
    />

    <!-- 查看额度批复通知书 -->
    <preViewReportPop ref="preViewReportRef" />

  <selectTable2Pop ref="selectTable2Ref" :params="{ applyType: 'ApprovePutOutApply',creditSourceFlag: '01' }" @confirm="getList" />

  <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />

  <!-- 填写放贷通知书 -->
  <treeListPop
    ref="treeListPopRef1"
    :api-func="Api.preEditFormatReport"
    :qry-params="getPutOut"
    @confirm="(item) => editFormatReport(item)"
  />
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import * as CreditFlowApi from "@/api/creditflow";
import {addDialog, Dialog} from "@/components/Dialog";
import preViewReportPop from '@/components/busiComp/preViewReportPop/index.vue'
import selectTable2Pop from '@/components/busiComp/selectTable2Pop/index.vue'
import viewPhaseOpinionPop from '@/views/contractIssuanceMGM/viewPutOutPhaseOpinion/index.vue'
import download from "@/utils/download";


defineOptions({
  name: 'ConTractToRegistered'
})

const isExpand = ref(false)

const props = defineProps({
  params: {
    type: Object,
    default: () => {
      creditSourceFlag:'01'
    }
  }
})

// 签署意见
const signOpinionVIf = computed(() => {
  return props.params.type === 'N'
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
} = useTableList(Api.ContractList, { ...props.params,creditSourceFlag:'01' }, false)

fetchCback((list) => {
  checkRight()
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
})

const search1 = () => {
  if (queryParams.endtime1?.length) {
    queryParams.endtimestart = queryParams.endtime1[0]
    queryParams.endtimeend = queryParams.endtime1[1]
  } else {
    queryParams.endtimestart = ''
    queryParams.endtimeend = ''
  }

  if (queryParams.putoutdate1?.length) {
    queryParams.putoutdatestart = queryParams.putoutdate1[0]
    queryParams.putoutdateend = queryParams.putoutdate1[1]
  } else {
    queryParams.putoutdatestart = ''
    queryParams.putoutdateend = ''
  }

  if (queryParams.transdate1?.length) {
    queryParams.transdatestart = queryParams.transdate1[0]
    queryParams.transdateend = queryParams.transdate1[1]
  } else {
    queryParams.transdatestart = ''
    queryParams.transdateend = ''
  }

  if (queryParams.begintime1?.length) {
    queryParams.begintimestart = queryParams.begintime1[0]
    queryParams.begintimeend = queryParams.begintime1[1]
  } else {
    queryParams.begintimestart = ''
    queryParams.begintimeend = ''
  }
  search()
}

const router = useRouter() // 路由

const columns = [
  { label: '出账流水号', field: 'objectno', minWidth: 200 },
  { label: '业务品种', field: 'businesstypename', minWidth: 150 },
  { label: '币种', field: 'currencyname' },
  { label: '金额', field: 'businesssum1', minWidth: 150 },
  { label: '放款渠道', field: 'putoutchannel', minWidth: 120 },
  { label: '客户名称', field: 'customername', minWidth: 220 },
  { label: '当前流程', field: 'flowname', minWidth: 120 },
  { label: '当前阶段', field: 'phasename', minWidth: 120 },
  { label: '发生类型', field: 'occurtypename' },
  { label: '起始日', field: 'putoutdate', minWidth: 120 },
  { label: '到期日', field: 'maturity', minWidth: 120 },
  { label: '出账状态', field: 'putoutstatusname' },
  { label: '记账日期', field: 'transdate' },
  { label: '供应链标识', field: 'gylflag', minWidth: 100 },
  { label: '供应链客户类型', field: 'gylcustomertype', minWidth: 130 },
  { label: '所属项目名称', field: 'projectname', minWidth: 120 },
  { label: '完成时间', field: 'endtime', minWidth: 180 },
  { label: '收到业务时间', field: 'begintime', minWidth: 180 }
]

const button1 = () => {
  ElMessage.info('功能待实现')
}

const signOpinionVisible = ref(false)
const currentProcessInstanceForOpinion = ref([])
const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const creditFlowApprovalVisible = ref(false)
const exportLoading = ref(false) // 导出的加载中

const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const selectedRows = currentRow.value
  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.objectno,
    //businessId:'BC2025112400000006',
    businessType: selectedRows.businesstype,
    phaseNo: selectedRows.phaseno,
    objectType: 'PutOutApply'
  }
  signOpinionVisible.value = true
}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
    if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  viewPhaseOpinionRef.value.open({serialNo:currentRow.value.objectno})
  //   path: '/contractIssuanceMGM/viewPutOutPhaseOpinion',
  //   query: {
  //     serialNo: currentRow.value.objectno,
  //   }
  // })

}

// 查看额度批复
const viewQuotaApprovalVIf = computed(() => {
  return ['1010','1020','1025','1030','1035','1040','1050','1060','1065','1070'].includes(props.params.key)
})
// 查看批复
const viewApprovalVIf = computed(() => {
  return ['1020','1025','1030','1035','1040','1050','1060','1065','1070'].includes(props.params.key)
})
// 风险探测
const doRiskDetectionVIf = computed(() => {
  return props.params.type === 'N'
})
// 提交
const submitVIf = computed(() => {
  return props.params.type === 'N'
})
//放款详情
const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const isEdit = (['0035','4000'].includes(currentRow.value.phaseno) && props.params.type === 'N')
  router.push({
    path: '/contractIssuanceMGM/loanDetail',
    query: {
      serialno: currentRow.value.objectno,
      businesstype: currentRow.value.businesstype,
      customerID: currentRow.value.customerid,
      customertype: currentRow.value.customertype,
      isEdit,
      t: Date.now()
    }
  })
}
const message = useMessage()
/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await Api.handleExport(queryParams)
    download.excel(data, '放贷数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 导出Excel
const exportExcelVIf = computed(() => {
  return ['1050','1020'].includes(props.params.key)
})

const doRiskDetection = async (rskTp = 1,otherParams = {}) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  serialNo.value = currentRow.value.objectno,
  phaseNo.value = props.params.phaseNo,
  riskData.value = {
    scenarioId: '003',
    rskTp: rskTp?.target ? 1 : rskTp,
        params: {
          BPObjectType: 'PutOutApply',
          BPSerialNo: currentRow.value.objectno,
          BPBusinessType: currentRow.value.businesstype,
          BPContractSerialNo: currentRow.value.contractserialno,
          BPPhaseNo: props.params.phaseNo,
          CustomerID: currentRow.value.customerid
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
  if (!currentRow.value) return ElMessage.warning('请选择一条数据')
  if(checkFlag != 1){
    const data = await checkCommentExec(currentRow.value.objectno,"PutOutApply",props.params.phaseNo)
      console.log("data:",data)
      if (!data?.phaseOpinion) {
      ElMessage.warning(`${currentRow.value.objectno}签署意见未保存`)
        return
      }
  }
   const checkBusType =  await Api.checkBusTypeAndLoanProductCategory({"serialNo":currentRow.value.objectno,"projectType":"01"})
    if(checkBusType){
        ElMessage.warning(`${currentRow.value.objectno} 此业务不允许在供应链作业系统发起`)
      return
    }
   const submitRisk =  await Api.checkSubmitIsRisk({"objectNo":currentRow.value.objectno,"objectType":"PutOutApply","phaseNo":props.params.phaseNo})
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

const handleRiskMonitorCancel = async () => {
  riskMonitorVisible.value = false
}
const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}

const notDoBtn = () => {
  ElMessage.warning('功能待实现')
}

const { confirmFetch } = useMessage()
// 收回
const takeBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: currentRow.value.objectno,
      phaseNo: currentRow.value.phaseno,
      objectType: 'PutOutApply',
      nextUserRole: "收回",
      nextUserInfo: '',
      ftSerialNo:currentRow.value.ftSerialNo,
      flag:2
    })
  })
  ElMessage.success('收回成功')
  getList()
}

// 查看流转记录
const toRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  // router.push({
  //   path: '/revApprMan/creditreviewapprovalrecord',
  //   query: {
  //     serialNo: currentRow.value.objectno,
  //     objectType: "PutOutApply",
  //     t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
  //   }
  // })
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={currentRow.value.objectno} objectType={'PutOutApply'} />
    )
  })
}


const backMsgConfirmShow = ref(false)

const doBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  backMsgConfirmShow.value = true
}

const backConfirm = async () => {
  await CreditFlowApi.submit({
    serialNo: currentRow.value.objectno,
    phaseNo: currentRow.value.phaseno,
    objectType: 'PutOutApply',
    nextUserRole: "退回前一步",
    nextUserInfo: '',
    ftSerialNo:currentRow.value.serialno,
  })
  ElMessage.success("退回成功")
  backMsgConfirmShow.value = false
  getList()
}

// 查看额度批复通知书
const preViewReportRef = ref()
const preViewReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  preViewReportRef.value.open({ objectNo: currentRow.value.contractserialno })
}

// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.viewEdpfReport({
    objectNo: currentRow.value.contractserialno
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading3.value = false)
}

// 挑选
const btnShow1 = ref()

const checkRight = () => {
  // if (!list.value.length) return btnShow1.value = false
  btnShow1.value = ['0035','0040','0050','0055','0200','0205','0210','0225','0230','0240','0250','0255'].includes(props.params.phaseNo)
}

const selectTable2Ref = ref()
const openDialog3 = () => {
  selectTable2Ref.value.open(props.params)
}

// 取消挑选
const loading4 = ref()
const aprrovalOptionCancel =async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  await ElMessageBox.confirm('确认将任务退回池中吗？退回后将清空意见！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  })

  loading4.value = true
  Api.aprrovalOptionCancel({
    serialNo: currentRow.value.serialno,
    approveType: 'ApprovePutOutApply'
  })
    .then((res) => {
      ElMessage.success('已取消')

      getList()
    })
    .finally((_) => (loading4.value = false))
}

onActivated(() => {
  search()
})



const nextUserRole = ref('')
const moreBackMsgConfirmShow = ref(false)

const doMoreBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  nextUserRole.value = ''
  moreBackMsgConfirmShow .value = true

}
const moreBackConfirm = async () => {
  if (!nextUserRole.value) {
    ElMessage.warning("请选择一意见")
    return;
  }
  await CreditFlowApi.submit({
    serialNo: currentRow.value.objectno,
    phaseNo: currentRow.value.phaseno,
    objectType: 'PutOutApply',
    ftSerialNo:currentRow.value.serialno,
    nextUserRole: nextUserRole.value,
    nextUserInfo: ''
  })
  ElMessage.success(nextUserRole.value + "成功")
  moreBackMsgConfirmShow.value = false
  getList()
}


const backHostBtnLoad = ref(false)
const showBackHost = computed(()=> ['0035', '4000', '4010'].includes(props.params.phaseNo))
const backHost = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  try {
    await ElMessageBox.confirm('您确认要将该申请退回主办吗！', '提示', {
      type: 'warning'
    })
    backHostBtnLoad.value = true
    await CreditFlowApi.backHost({
      ftSerialNo: currentRow.value.serialno
    })
    ElMessage.success("退回主办成功")
  } catch (e) {
    backHostBtnLoad.value = false
  }


  getList()
}


//填写放贷通知书
const treeListPopRef1 = ref()
const handleNoticeBook = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  const data = await Api.judgeFormatReport({
     objectNo:currentRow.value.objectno,
     objectType: 'PutOutApply'
  })
  if(data.length == 0){
    treeListPopRef1.value.open()
  }else{
      if(data.includes('放贷详情未保存')){
          ElMessage.warning(data)
      }else {
        ElMessageBox.confirm(data, '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type:"warning"
        })
        .then(() => {
            treeListPopRef1.value.open()
        }).catch(() =>{
             editFormatReport();
        })
      }
  }
}
//查看放贷通知书
const viewFormatReport = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const data = await Api.viewFormatReport({
     objectNo:currentRow.value.objectno,
     objectType: 'PutOutApply'
  })
    if(data.url?.length>0){
      window.open(data.url)
    } else {
      ElMessage.warning(data.msg || '暂时无法查看')
    }
}

//生成放贷申请书
const editFormatReport = async (item) => {
  // 出账信息
  const editFormatReportReq =  reactive({
     customerID: computed(() => currentRow.value.customerid),
     objectNo: computed(() => currentRow.value.objectno),
     objectType: computed(() =>'PutOutApply'),
     docID: computed(() => item ==null?"":item.itemNo) //如果是新生成的放贷通知书不传item ，如果已生成放贷，则编辑传item
  })
  const data = await Api.editFormatReport(editFormatReportReq)
  if(data.url.length>0){
    window.open(data.url)
  }
}

// 退回网银
const returnOnlineBank = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确定退回网银？',
    fetchFunc: () =>
      Api.returnOnlineBank({ serialNo: currentRow.value.objectno, objectType: 'PutOutApply' })
  }).then((_) => {
    ElMessage.success('已退回')

    getList()
  })
}
</script>
