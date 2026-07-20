<template>
  <ContentWrap>
    <!-- <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      @search="setSearchParams"
      @reset="setSearchParams"
    /> -->
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
      @row-dblclick="handleDblClick"
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
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  useSignOpinion
} from '@/views/creditApplicationMGM/approvalChangeRequest/hooks'
import { addDialog } from '@/components/Dialog'
import AddForm from '../AddForm/index.vue'
import dayjs from 'dayjs'
import { getParamAdjustApplyList, paramAdjustAddApply, paramAdjustCancelApply, paramAdjustCheckDetail,checkComment } from '../../api'
import ApprovalOpinion from '../../../approvalreview/components/ApprovalOpinion/index.vue'
import * as CreditFlowApi from "@/api/creditflow"
import { useEmitt } from '@/hooks/web/useEmitt'
import ViewOpinion from '../../components/ViewOpinion/index.vue'
import FlowRecord from '../FlowRecord/index.vue'

defineOptions({
  name: 'ParamAdJustApplyList'
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
    minWidth: 220,
  },
  {
    label: '核心企业名称',
    field: 'customerName',
    minWidth: 220
  },
  {
    label: '项目名称',
    field: 'projectName',
    minWidth: 320,
  },
  {
    label: '项目类型',
    field: 'projectTypeNm',
    minWidth: 150
  },
  {
    label: '当前流程',
    field: 'flowName',
    minWidth: 150
  },
  {
    label: '当前阶段',
    field: 'phaseName',
    minWidth: 150
  },
  {
    label: '申请人',
    field: 'inputUserId',
    minWidth: 150
  },
  {
    label: '申请机构',
    field: 'inputOrgId',
    minWidth: 150
  },
  {
    label: '申请日期',
    field: 'inputDate',
    minWidth: 150
  }
])
const objectType = ref('')
const { allSchemas } = useCrudSchemas(crudSchemas)
console.log('[ props.params ] >', props.params)
const { register, tableObject, tableMethods } = useTable({
  getListApi: getParamAdjustApplyList,
  defaultParams: { phaseType: props.params.key, objectType: 'ParamAdjustGYL' }
})

const currentRowRef = computed(() => {
  return tableObject.currentRow ? tableObject.currentRow : null
})

const { setSearchParams, getList } = tableMethods

onMounted(() => {
  getList()
})

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}

useEmitt({
  name: 'refresh-ParamAdJustApplyList',
  callback: ()=> {
    getList()
  }
})

//====== 新增申请 ======
let addFormContentRef: any = null

const handleAdd = async () => {
  await addDialog({
    title: '新增申请',
    width: '600px',
    contentRenderer: () => (
      <AddForm
        ref={(el: any) => {
          addFormContentRef = el
          const row = {
            operateDate: dayjs().format('YYYY-MM-DD')
          }
          nextTick(() => el?.setValues(row))
        }}
      />
    ),
    beforeSure: async (done, { button }) => {
      const formData = await addFormContentRef?.validate()
      if (formData) {
        button!.btn!.loading = true
        const params = {
          coreEntName: formData.coreEntName,
          projectName: formData.projectName,
          applyTm: formData.applyTm,
          customerId: formData.customerId,
          projectId: formData.projectId
        }
        await paramAdjustAddApply(params).finally(() => (button!.btn!.loading = false))
        ElMessage.success('新增成功')
        getList()
        done()
      }
    }
  })
}

// 取消申请
const handleCancel = async (btn) => {
  if (!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  await ElMessageBox.confirm('确定要取消该申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  btn.loading = true
  await paramAdjustCancelApply({ serialNo: currentRowRef.value.serialNo || currentRowRef.value.serialno }).finally(() => (btn.loading = false))
  ElMessage.success('取消成功')
  getList()
}
//  ====== 签署意见 ======
const { signOpinionVisible, currentProcessInstanceForOpinion, handleSignOpinion } =
  useSignOpinion(currentRowRef)
const openSignOpinion = async ()=> {
  if (!currentRowRef.value) {
    ElMessage.warning('请选择一条数据')
    return
  }
  // const res = await paramAdjustCheckDetail({serialno: currentRowRef.value.serialNo || currentRowRef.value.serialno})
  // if(!res) return
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
    contentRenderer: ()=> (
      <ViewOpinion serialNo={currentRowRef.value.serialNo || currentRowRef.value.serialno} />
    )
  })
}

// ====== 申请详情 =====
const handleDetail = () => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  const row = currentRowRef.value
  try{
    router.push({
      name: 'ParamAdjustApplyDetail',
      query: {
        serialno: row.serialNo || row.serialno,
        type: props.params?.key === '1010' ? 'edit' : 'detail',
        t: Date.now()
      }
    })
  }catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
}

const handleDblClick = (row) => {
  try{
    router.push({
      name: 'ParamAdjustApplyDetail',
      query: {
        serialno: row.serialNo || row.serialno,
        type: props.params?.key === '1010' ? 'edit' : 'detail',
        t: Date.now()
      }
    })
  }catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }
}

// ====== 提交相关 ======
const creditFlowApprovalVisible = ref(false)
const serialNo = ref('')
const phaseNo = ref('')

const checkCommentExec = async(serialNo,objectType,phaseType) => {
  const resp = await checkComment({serialNo,objectType,phaseType}).then(res => res)
  return resp;
}

const handleDoRisk = async (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  const res = await paramAdjustCheckDetail({serialno: currentRowRef.value.serialNo || currentRowRef.value.serialno})

  const data = await checkCommentExec(currentRowRef.value.serialNo,"ParamAdjustGYL",props.params.key)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${currentRowRef.value.serialNo}签署意见未保存`)
    return
  }

  if(res) {
    objectType.value = currentRowRef.value.objectType
    serialNo.value = currentRowRef.value.serialNo || currentRowRef.value.serialno
    phaseNo.value = currentRowRef.value.phaseNo
    creditFlowApprovalVisible.value = true
  }
}

const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}
const { confirmFetch } = useMessage()
// ====== 收回 ======
const handleBack = async (btn: ActionButton) => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  await confirmFetch({
    title: '确认收回该笔业务吗?',
    fetchFunc: ()=> CreditFlowApi.withdraw({
      serialNo: currentRowRef.value.serialNo || currentRowRef.value.serialno,
      phaseNo: currentRowRef.value.phaseNo,
      objectType: 'ParamAdjustGYL',
      nextUserRole: "收回",
      nextUserInfo: '',
      flag:1//申请
    })
  })
  ElMessage.success('收回成功')
  getList()
}

// ====== 查看流转记录 ======
const toRecord = () => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  addDialog({
    title: '流转记录',
    width:"1200px",
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={currentRowRef.value.serialNo || currentRowRef.value.serialno} />
    )
  })
}

// ====== 操作按钮 ======
const pageBtnKeyMap = {
  '1010': [
    'add',
    'cancel',
    'detail',
    'signOpinion',
    'submit',
  ],
  '1020': ['detail', 'toRecord', 'viewOpinion'],
  // '1030': ['detail', 'cancel', 'viewOpinion', 'signOpinion', 'submit'],
  '1040': ['detail', 'viewOpinion', 'toRecord'],
  // '1050': ['detail'],
}

const buttons = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增申请',
    plain: true,
    onClick: handleAdd
  },
  {
    key: 'detail',
    label: '申请详情',
    plain: true,
    onClick: handleDetail
  },
  {
    key: 'handleBack',
    label: '收回',
    loading: false,
    plain: true,
    onClick: handleBack
  },
  {
    key: 'cancel',
    label: '取消申请',
    plain: true,
    loading: false,
    onClick: (btn) => handleCancel(btn)
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
    key: 'toRecord',
    label: '查看流转记录',
    plain: true,
    onClick: toRecord
  }
])

const visibleButtons = computed(() => {
  const btnKeys = pageBtnKeyMap[props.params?.key || '']
  if (!btnKeys) return []
  return buttons.value.filter((btn) => btnKeys.includes(btn.key))
})


onActivated(() => {
  getList()
})
</script>

<style scoped></style>
