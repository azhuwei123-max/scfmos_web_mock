<template>
  <ContentWrap>
    <Search
      v-if="allSchemas.searchSchema.length"
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      @search="setSearchParams"
      @reset="setSearchParams"
    />
    <ActionBar :buttons="visibleButtons" />
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      :onRowClick="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :object-type="objectType"
      :show-submit="true"
      :processInstance="currentProcessInstanceForOpinion"
      @submit="handleDoRisk"
    />

    <!-- 风险探测 -->
    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="objectType"
      @confirm="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />
  </ContentWrap>
  <ChoosePop ref="choosePopRef" :params="params" @confirm="reLoadAll" />
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useSignOpinion } from '@/views/creditApplicationMGM/approvalChangeRequest/hooks'
import { getParamAdjustAprrovalPage, aprrovalOptionCancel,checkComment } from '../../api'
import ApprovalOpinion from '../ApprovalOpinion/index.vue'
import ChoosePop from '../ChoosePop/index.vue'
import { addDialog } from '@/components/Dialog'
import ViewOpinion from '../../../paramadjustapply/components/ViewOpinion/index.vue'

defineOptions({
  name: 'SupplyChainDecisionApprovalList'
})

const router = useRouter()

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '申请编号',
    field: 'serialNo',
    fixed: 'left',
    minWidth: 220
  },
  {
    label: '核心企业名称',
    field: 'customerName',
    minWidth: 200
  },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 320
  },
  {
    label: '项目类型',
    field: 'projectTypeNm'
  },
  {
    label: '当前流程',
    field: 'flowName'
  },
  {
    label: '当前阶段',
    field: 'phaseName'
  },
  {
    label: '申请机构',
    field: 'inputOrgID'
  },
  {
    label: '申请日期',
    field: 'inputDate'
  }
])

const objectType = ref('')
const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getParamAdjustAprrovalPage,
  defaultParams: {
    phaseNo: props.params.phaseNo,
    flowNo: props.params.flowNo,
    type: props.params.type,
    phaseName: props.params.phaseName
  }
})

const currentRowRef = computed(() => {
  return tableObject.currentRow ? tableObject.currentRow : null
})

const { setSearchParams, getList } = tableMethods

const emit = defineEmits(['reLoad'])
const reLoadAll = () => {
  emit('reLoad')

  getList()
}

onMounted(() => {
  // getList()
})

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}

//  ====== 签署意见 ======
const { signOpinionVisible, currentProcessInstanceForOpinion, handleSignOpinion } =
  useSignOpinion(currentRowRef)

const openSignOpinion = () => {
  if (!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  objectType.value = currentRowRef.value.objectType
  handleSignOpinion()
}

// ====== 查看意见 ======
const viewPhaseOpinion = () => {
  if (!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  addDialog({
    title: '查看意见',
    width: '1200px',
    hideFooter: true,
    contentRenderer: () => (
      <ViewOpinion
        serialNo={currentRowRef.value.serialNo || currentRowRef.value.serialno}
        objectType={currentRowRef.value.objectType}
      />
    )
  })
}

// 详情
const handleDetail = () => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  const row = currentRowRef.value
  try{
    router.push({
      name: 'ParamAdjustApplyDetail',
      query: {
        serialno: row.serialNo,
        t: Date.now()
      }
    })
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
}

// ====== 提交相关 ======
const creditFlowApprovalVisible = ref(false)
const serialNo = ref('')
const phaseNo = ref('')

const checkCommentExec = async(serialNo,objectType,phaseNo) => {
  const resp = await checkComment({serialNo,objectType,phaseNo}).then(res => res)
  return resp;
}

const handleDoRisk = async (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  objectType.value = currentRowRef.value.objectType
  serialNo.value = currentRowRef.value.serialNo
  phaseNo.value = currentRowRef.value.phaseNo


  const data = await checkCommentExec(serialNo.value,objectType.value,phaseNo.value)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${currentRowRef.value.serialNo}签署意见未保存`)
    return
  }
  
  creditFlowApprovalVisible.value = true
}

const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}

// ====== 挑选相关 ======
const choosePopRef = ref()
const handleChoosePop = () => {
  choosePopRef.value.open()
}

const handleCancelChoose = async (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  btn.loading = true
  await aprrovalOptionCancel({
    serialNo: currentRowRef.value.ftSerialNo,
    approveType: 'ParamAdjustApproveGYL'
  }).finally(() => (btn.loading = false))
  ElMessage.success('已取消')
  reLoadAll()
}

// ====== 操作按钮 ======
const pageBtnKeyMap = {
  N: ['detail', 'signOpinion', 'submit', 'viewOpinion', 'choose', 'cancelChoose'],
  Y: ['detail']
}

const buttons = ref<ActionButton[]>([
  {
    key: 'detail',
    label: '申请详情',
    plain: true,
    onClick: handleDetail
  },
  {
    key: 'signOpinion',
    label: '签署意见',
    plain: true,
    onClick: openSignOpinion
  },
  {
    key: 'submit',
    label: '提交',
    plain: true,
    onClick: handleDoRisk
  },
  {
    key: 'viewOpinion',
    label: '查看意见',
    plain: true,
    onClick: viewPhaseOpinion
  },
  {
    key: 'choose',
    label: '挑选',
    plain: true,
    onClick: handleChoosePop
  },
  {
    key: 'cancelChoose',
    label: '取消挑选',
    plain: true,
    onClick: (btn) => handleCancelChoose(btn)
  }
])

const visibleButtons = computed(() => {
  const btnKeys = pageBtnKeyMap[props.params?.type || '']
  if (!btnKeys) return []
  return buttons.value.filter((btn) => btnKeys.includes(btn.key))
})

onActivated(() => {
  getList()
})
</script>

<style scoped></style>
