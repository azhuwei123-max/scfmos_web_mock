<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="handleExpand">
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
    <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="发生类型" prop="occurTypeName">
        <el-select
          v-model="queryParams.occurTypeName"
          placeholder="请选择发生类型"
          class="!w-240px"
        >
          <el-option label="新增" value="新增" />
          <el-option label="借新还旧" value="借新还旧" />
          <el-option label="还旧借新-风险化解" value="还旧借新-风险化解" />
          <el-option label="续作" value="续作" />
          <el-option label="复议" value="复议" />
          <el-option label="展期" value="展期" />
          <el-option label="提额" value="提额" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应链标识" prop="gylFlagName">
        <el-select
          v-model="queryParams.gylFlagName"
          placeholder="请选择供应链标识"
          class="!w-240px"
        >
          <el-option label="纯供应链" value="纯供应链" />
        </el-select>
      </el-form-item>
      <el-form-item label="供应链客户类型" prop="gylCustomerTypeName">
        <el-input
          v-model="queryParams.gylCustomerTypeName"
          class="!w-240px"
          clearable
          placeholder="请输入供应链客户类型"
        />
      </el-form-item>
      <el-form-item label="所属项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          class="!w-240px"
          clearable
          placeholder="请输入所属项目名称"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="endTime">
      
          <el-date-picker
            v-model="queryParams.endTime"
            type="data"
            placeholder="请选择完成时间"
            value-format="YYYY-MM-DD"
            clearable
            @change="handleQuery"
            class="!w-240px"
          />
          <!-- <el-input
          v-model="queryParams.endTime"
          class="!w-240px"
          clearable
          placeholder="请输入完成时间"
        /> -->
      
      </el-form-item>
      <el-form-item>
        <el-button @click="search1" size="default" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch" size="default"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="display: flex; margin-bottom: 17px">
      <!-- <div style="font-size: 18px; font-weight: 700"> 查询结果</div> -->
      <div>
        <el-button v-if="props.params.type === 'N' && btnShow1" @click="openDialog3"> 挑选 </el-button>
        <el-button v-if="props.params.type === 'N' && btnShow1" @click="aprrovalOptionCancel" :loading="loading4">
          取消挑选
        </el-button>
        <el-button @click="goDetail" plain >
          <Icon class="mr-5px" icon="ep:edit" />
          申请详情
        </el-button>
        <el-button  @click="viewPhaseOpinion" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
          查看意见
        </el-button>
        <el-button v-if="signOpinionVIf" @click="handleSignOpinion" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
          签署意见
        </el-button>
        <el-button v-if="props.params.type === 'Y'" @click="toRecord"> 查看流转记录</el-button>
        <el-button v-if="props.params.type === 'Y'" @click="takeBack"> 收回  </el-button>

        <el-button v-if="props.params.type === 'N'" @click="doRiskDetection"> 自动风险探测 </el-button>
        <el-button v-if="props.params.type === 'N'" @click="doBack"> 退回前一步 </el-button>
        <el-button v-if="props.params.type === 'N'" @click="preViewReport"> 查看额度批复通知书 </el-button>
        <el-button v-if="props.params.type === 'N'" @click="viewEdpfReport" :loading="loading3"> 查看批复通知书 </el-button>
        <el-button v-if="props.params.type === 'N'" @click="submit"> 提交 </el-button>
        <el-button v-if="props.params.type === 'N' && showBackHost" :loading="backHostBtnLoad" @click="backHost" plain type="">
          退回主办
        </el-button>
        <el-button v-if="props.params.type === 'N'" @click="doMoreBack" plain type="">
          快捷退回/否决
        </el-button>
        <el-button
          type=""
          plain
          @click="handleExport"
          :loading="exportLoading">
          <Icon icon="ep:download" class="mr-5px" /> 导出
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

    <Dialog v-model="backMsgConfirmShow" title="提示">
      <span>您确认要将该申请退回上一环节吗？</span>
      <template #footer>
        <el-button tpye="" @click="backConfirm">确 认</el-button>
        <el-button @click="backMsgConfirmShow = false">取 消</el-button>
      </template>
    </Dialog>

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
      :hide-back="true"
      @back="doMoreBack"
    />

    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />

    <selectTable2Pop ref="selectTable2Ref" :params="{ applyType: 'ApproveBusinessContract',creditSourceFlag: '02' }" @confirm="getList" />

    <!-- 查看额度批复通知书 -->
    <preViewReportPop ref="preViewReportRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import {addDialog, Dialog} from "@/components/Dialog";
import * as CreditFlowApi from "@/api/creditflow";
import selectTable2Pop from '@/components/busiComp/selectTable2Pop/index.vue'
import viewPhaseOpinionPop from '@/views/contractIssuanceMGM/viewEDPhaseOpinion/index.vue'
import download from '@/utils/download'
import {
  exportExcel
} from "@/views/singBusMana/signDistMana/applyQuotaContraCheck/components/workList/api";
import preViewReportPop from '@/components/busiComp/preViewReportPop/index.vue'
import { useOldDictStore } from '@/store/modules/oldDict'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const message = useMessage()


const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

// 签署意见
const signOpinionVIf = computed(() => {
  return props.params.type === 'N'
})

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const isEdit = (['0035','4000'].includes(currentRow.value.phaseNo) && props.params.type === 'N')
  // router.push({
  //   path: '/contractIssuanceMGM/approvalDetail',
  //   query: {
  //     serialno: currentRow.value.objectNo,
  //     occurtype: currentRow.value.occurType,
  //     businesstype: currentRow.value.businessType,
  //     customerid: currentRow.value.customerID,
  //     t: Date.now()
  //   }
  // })
  router.push({
    path: '/contractIssuanceMGM/contractDetail',
    query: {
      businessType: currentRow.value.businessType,
      customerID: currentRow.value.customerID,
      serialNo: currentRow.value.objectNo,
      tempSaveFlag: currentRow.value.tempSaveFlag,
      readonly: true,
      isEdit,
      creditSourceFlag: '02',
      type:props.params.type,
      t: Date.now()
    }
  })

  
}

const { getDictFetch, getDictOptions } = useOldDictStore()

// 发生类型选项
const occurrenceTypeOptions = ref([])
getDictFetch(['OccurType']).then(()=>{
  occurrenceTypeOptions.value = getDictOptions('OccurType')
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
} = useTableList(Api.ywContractList, { ...props.params,creditSourceFlag:'02'} , false)

fetchCback((list) => {
  checkRight()
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businesssum, 'currency')
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
{ label: '申请流水号', field: 'objectNo', minWidth: 200 },
  { label: '业务品种', field: 'businessTypeName', minWidth: 150 },
  { label: '发生类型', field: 'occurTypeName' },
  { label: '币种', field: 'currencyName' },
  { label: '合同金额', field: 'businessSum1', minWidth: 120 },
  // { label: '敞口金额', field: 'exposureSum1', minWidth: 120 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '当前阶段', field: 'phaseName', minWidth: 120 },
  { label: '渠道来源', field: 'channelsource' },
  { label: '供应链标识', field: 'gylflagName', minWidth: 100 },
  { label: '供应链客户类型', field: 'gylcustomerType', minWidth: 130 },
  { label: '所属项目名称', field: 'projectName', minWidth: 320 },
  { label: '完成时间', field: 'endTime', minWidth: 180 },
  { label: '收到业务时间', field: 'beginTime', minWidth: 180 }
]

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
    objectType: 'BusinessContract',
    flowNo:'BusinessContract'
  }
  signOpinionVisible.value = true
}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const titleObj = {
    customerName:currentRow.value.customerName,
    serialNo: currentRow.value.objectNo
  }
  viewPhaseOpinionRef.value.open({serialNo:currentRow.value.objectNo}, titleObj)
  //   router.push({
  //   path: '/contractIssuanceMGM/viewEDPhaseOpinion',
  //   query: {
  //     serialNo: currentRow.value.objectNo,
  //   }
  // })

}

const exportLoading = ref(false) // 导出的加载中

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const params = {
      ...queryParams,
      phaseNo: props.params.phaseNo,
      flowNo: props.params.flowNo,
      creditSourceFlag:"02",
      type: props.params.type
    }
    const data = await Api.exportExcel(params)
    download.excel(data, '链属客户业务合同审批.xls')
    ElMessage.success('导出成功')
  } finally {
    exportLoading.value = false
  }
}


const button1 = () => {
  ElMessage.info('功能待实现')
}
const backMsgConfirmShow = ref(false)

const doBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  backMsgConfirmShow.value = true
}

const backConfirm = async () => {
  await CreditFlowApi.submit({
    objectType:"BusinessContract",
    serialNo: currentRow.value.objectNo,
    phaseNo: currentRow.value.phaseNo,
    nextUserRole: "退回前一步",
    nextUserInfo: '',
    ftSerialNo:currentRow.value.serialNo
  })
  ElMessage.success("退回成功")
  backMsgConfirmShow.value = false
  getList()
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const creditFlowApprovalVisible = ref(false)

const doRiskDetection = async (rskTp = 1,otherParams = {}) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  serialNo.value = currentRow.value.objectNo
  phaseNo.value = currentRow.value.phaseNo
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
  if (!currentRow.value) return ElMessage.warning('请选择一条数据')
    if(checkFlag != 1){
      const data = await checkCommentExec(currentRow.value.objectNo,"BusinessContract",currentRow.value.phaseNo)
      console.log("data:",data)
      if (!data?.phaseOpinion) {
      ElMessage.warning(`${currentRow.value.objectNo}签署意见未保存`)
        return
    }
  }
  const checkBusType =  await Api.checkBusTypeAndLoanProductCategory({"serialNo":currentRow.value.objectNo,"projectType":"02"})
    if(checkBusType){
        ElMessage.warning(`${currentRow.value.objectNo} 此业务不允许在供应链作业系统发起`)
      return
    }
    const submitRisk =  await Api.checkSubmitIsRisk({"objectNo":currentRow.value.objectNo,"objectType":"BusinessContract","phaseNo":currentRow.value.phaseNo})
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

const { confirmFetch } = useMessage()
// 收回
const takeBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: currentRow.value.objectNo,
      phaseNo: currentRow.value.phaseNo,
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
  //  console.log('asdasdas');
  // router.push({
  //   path: 'creditreviewapprovalrecord',
  //   query: {
  //     serialNo: currentRow.value.objectNo,
  //     objectType: "BusinessContract",
  //     t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
  //   }
  // })
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={currentRow.value.objectNo} objectType={'BusinessContract'} />
    )
  })
}

// 挑选
const btnShow1 = ref()

const checkRight = () => {
  // if (!list.value.length) return btnShow1.value = false
  btnShow1.value = ['0035', '0210'].includes(props.params.phaseNo)
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
    serialNo: currentRow.value.serialNo,
    approveType: 'ApproveBusinessContract'
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
    serialNo: currentRow.value.objectNo,
    phaseNo: currentRow.value.phaseNo,
    objectType: currentRow.value.objectType,
    ftSerialNo: currentRow.value.serialNo,
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
      ftSerialNo: currentRow.value.serialNo
    })
    ElMessage.success("退回主办成功")
  } catch (e) {
    backHostBtnLoad.value = false
  }


  getList()
}

// 查看额度批复通知书
const preViewReportRef = ref()
const preViewReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  preViewReportRef.value.open({ objectNo: currentRow.value.objectNo })
}

// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.viewEdpfReport({
    objectNo: currentRow.value.objectNo
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading3.value = false)
}

</script>
