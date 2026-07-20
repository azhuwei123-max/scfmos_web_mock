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
      @keyup.enter="search"
    >
      <el-form-item label="申请编号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          class="!w-240px"
          clearable
          placeholder="请输入申请编号"
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          class="!w-240px"
          clearable
          placeholder="请输入项目名称"
        />
      </el-form-item>
      <!-- <el-form-item label="客户编号" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          class="!w-240px"
          clearable
          placeholder="请输入客户编号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item> -->
      <!-- <el-form-item label="申请人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          class="!w-240px"
          clearable
          placeholder="请输入申请人"
        />
      </el-form-item>
      <el-form-item label="申请分行" prop="branchName">
        <el-input
          v-model="queryParams.branchName"
          class="!w-240px"
          clearable
          placeholder="请输入申请分行"
        />
      </el-form-item> -->
     <!-- <el-form-item label="完成时间" prop="endtime1" class="!w-350px">
       <el-date-picker
         class="!w-240px"
         v-model="queryParams.endtime1"
         type="daterange"
         value-format="YYYY/MM/DD"
         start-placeholder="开始日期"
         end-placeholder="结束日期"
       />
     </el-form-item> -->
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="display: flex; margin-bottom: 17px">
      <el-button @click="goDetail">
        <Icon class="mr-5px" icon="ep:edit" />
        详情
      </el-button>
      <el-button v-if="signOpinionVIf" @click="handleSignOpinion">
        <Icon class="mr-5px" icon="ep:edit" />
        签署意见
      </el-button>
      <el-button @click="viewPhaseOpinion">
        <!-- <Icon class="mr-5px" icon="ep:edit" /> -->
        查看意见
      </el-button>
      <el-button  v-if="props.params.type === 'Y'" @click="toRecord"> 查看流转记录 </el-button>
      <el-button v-if="props.params.type === 'N'" @click="submit"> 提交 </el-button>
      <el-button v-if="props.params.type === 'N'" @click="doBack"> 退回前一步 </el-button>
      <!-- <el-button v-if="props.params.type === 'Y'" @click="takeBack"> 收回 </el-button> -->
      <!-- <el-button v-if="props.params.type === 'N' && btnShow1" @click="aprrovalOptionConfirm"> 挑选 </el-button>
      <el-button v-if="props.params.type === 'N' && btnShow1" @click="aprrovalOptionCancel" :loading="loading1">
        取消挑选
      </el-button> -->
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
      :object-type="'GYLModelApply'"
      @confirm="reLoadAll"
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
      hideTip
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
    />

    <!-- <choosePop ref="choosePopRef" :params="params" @confirm="reLoadAll" /> -->

    <!-- <approval-opinion ref="approvalOpinionRef" /> -->
    <flowRecordPop ref="flowRecordRef" :params="flowParams" />

    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import { Dialog } from '@/components/Dialog'
import * as CreditFlowApi from '@/api/creditflow'
import ApprovalOpinion from '@/components/approvalOpinionForModel/index.vue'
import { useOldDictStore } from '@/store/modules/oldDict'
import choosePop from './components/choosePop.vue'
// import approvalOpinion from './components/approvalOpinion.vue/index.vue'
import viewPhaseOpinionPop from '../../../viewPutOutPhaseOpinion/index.vue'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

// 签署意见
const signOpinionVIf = computed(() => {
  return props.params.type === 'N'
})


console.log('props.paramsprops.paramsprops.params',props.params);

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
} = useTableList(Api.aprrovalPage, {
  phaseNo: props.params.phaseNo,
  flowNo: props.params.flowNo,
  type: props.params.type,
  modelApplyType:'02'
}, false)

const { getDictFetch, getDictLabels } = useOldDictStore()

fetchCback((list) => {
  checkRight()
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.exposureSum1 = formatValue(v.exposureSum, 'currency')
    v.loanProductCategory1 = getDictLabels('GYLLoanProductCategory', v.loanProductCategory, false)
    if (v.modelcategory) {
      v.modelcategory = v.modelcategory === '01'?'贷前决策审批模型':'业务合同-放款决策审批模型'
    }
  })
})

const initFetch = () => {
  Promise.all([getDictFetch('GYLLoanProductCategory')]).then((res) => {
    getList()
  })
}
onActivated(() => {
  initFetch()
})


const btnShow1 = ref()

const checkRight = () => {
  // if (!list.value.length) return btnShow1.value = false
  btnShow1.value = ['0030', '0050', '0055'].includes(props.params.phaseNo)
}

const router = useRouter() // 路由

const columns = [
{ label: '申请编号', field: 'serialno', minWidth: 220 },
  { label: '模型名称', field: 'modelname', minWidth: 320 },
  { label: '模型分类', field: 'modelcategory' },
  { label: '申请时间', field: 'inputtime', minWidth: 130 },
  { label: '申请人', field: 'inputusername' },
  { label: '申请机构', field: 'inputorgname' }
]

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
    console.log('currentRow.value',currentRow.value);
  router.push({
    path: 'modelChangeDetail',
    query: {
      serialno: currentRow.value.serialno,
      // fromPage: 'projectCollReviAppr',
      type: 'readonly',
      readonly: '0',
      // readonly: '1',
      t: Date.now()
    }
  })
}

// 查看意见
const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  viewPhaseOpinionRef.value.open(currentRow.value)
  // router.push({
  //   path: 'modelOpinion',
  //   query: {
  //     serialNo: currentRow.value.serialno,
  //     phaseNo:props.params.phaseNo,
  //     t: new Date().getTime()
  //   }
  // })
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
    serialNo: currentRow.value.serialno,
    phaseNo: props.params.phaseNo,
    objectType: 'GYLModelApply',
    nextUserRole: '退回前一步',
    nextUserInfo: ''
  })
  ElMessage.success('退回成功')
  backMsgConfirmShow.value = false
  // getList()
  reLoadAll()
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
  phaseNo.value = currentRow.value.phaseNo
  riskData.value = {
    scenarioId: '015',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      EDObjectNo: serialNo.value,
      EDObjectType: 'GYLModelApply',
      EDPhaseNo: phaseNo.value,
      EDCustomerID: currentRow.value.customerID
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const objectType = ref('')

const checkCommentExec = async(serialNo,objectType,phaseNo) => {
  
  const resp = await Api.checkComment({serialNo,objectType,phaseNo}).then(res => res)
  return resp;

}

const submit = async () => {
  // await doRiskDetection()
  // submitFlag.value = true

  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

   const data = await checkCommentExec(currentRow.value.serialno,"GYLModelApply", props.params.phaseNo)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${currentRow.value.serialno}签署意见未保存`)
    return
  }

  serialNo.value = currentRow.value.serialno
  phaseNo.value = props.params.phaseNo,
  objectType.value = 'GYLModelApply'

  creditFlowApprovalVisible.value = true
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

// 签署意见
const signOpinionVisible = ref()
const currentProcessInstanceForOpinion = ref([])
const handleSignOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  const selectedRows = currentRow.value
console.log('asdasdasdasd',selectedRows);

  currentProcessInstanceForOpinion.value = {
    businessId: selectedRows.serialno,
    businessType: selectedRows.businessType,
    phaseNo: selectedRows.phaseNo,
    objectType: 'GYLModelApply',
    ftserialno:selectedRows.ftserialno
  }
  // const selectedRows = currentRow.value
  // currentProcessInstanceForOpinion.value = {
  //   businessId: selectedRows.serialNo,
  //   businessType: selectedRows.businessType,
  //   phaseNo: selectedRows.phaseNo,
  //   objectType: 'ProjectCoreview'
  // }
   signOpinionVisible.value = true
  // approvalOpinionRef.value.open(currentRow.value)
}
const { confirmFetch } = useMessage()
// 收回
const takeBack = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: currentRow.value.serialNo,
      phaseNo: currentRow.value.phaseNo,
      objectType: 'ProjectCoreviewGYL',
      nextUserRole: '收回',
      nextUserInfo: '',
      ftSerialNo:currentRow.value.ftserialno,
      flag:2
    })
  })
  ElMessage.success('收回成功')
  getList()
}

// 查看流转记录
// const toRecord = () => {
//   if (!currentRow.value) return ElMessage.warning('请选择 1 条')
//
//   router.push({
//     path: '/revApprMan/creditreviewapprovalrecord',
//     query: {
//       serialNo: currentRow.value.serialNo,
//       objectType: 'ProjectCoreview',
//       t: new Date().getTime() // 解决重复打开相同详情，详情页面不加载的问题
//     }
//   })
// }

// 查看流转记录
const flowParams = reactive({
  objectType: 'ProjectCoreviewGYL'
})
const flowRecordRef = ref()
const toRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  flowParams.objectType='GYLModelApply'
  flowParams.serialNo = currentRow.value.serialno
  flowRecordRef.value.open(flowParams)
}

const choosePopRef = ref()
const aprrovalOptionConfirm = () => {
  choosePopRef.value.open()
}

// 取消挑选
const loading1 = ref()
const aprrovalOptionCancel = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  await ElMessageBox.confirm('确认将任务退回池中吗？退回后将清空意见！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
  })

  loading1.value = true
  Api.aprrovalOptionCancel({
    serialNo: currentRow.value.ftSerialNo,
    approveType: 'ProjectCoreviewApproveGYL'
  })
    .then((res) => {
      ElMessage.success('已取消')

      reLoadAll()
    })
    .finally((_) => (loading1.value = false))
}

const emit = defineEmits(['reLoad'])
const reLoadAll = () => {
  emit('reLoad')

  getList()
}
onActivated(() => {
  search()
})
</script>
