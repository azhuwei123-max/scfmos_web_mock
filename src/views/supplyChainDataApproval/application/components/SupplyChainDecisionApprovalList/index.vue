<template>
  <ContentWrap>
    <Search
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
      :selection="true"
      highlight-current-row
      @selection-change="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
      @row-dblclick="handleDblClick"
    />

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @submit="handleDoRisk"
    />

    <!-- 风险探测 -->
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :object-type="'WhiteListApply'"
      :is-batch-submit="isBatchSubmit"
      :selected-data="tableObject.currentRow"
      @confirm="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />

    <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import {
  useBizMethods,
  useRiskDetection,
  useSignOpinion
} from '@/views/creditApplicationMGM/approvalChangeRequest/hooks'
import { addDialog } from '@/components/Dialog'
import AddForm from '../AddForm/index.vue'
import dayjs from 'dayjs'
import { getProjectWhiteList, exportExcel, addProjectWhite, cancelProjectWhite, importExcel, beforeRisk,getIframeUrl,checkComment  } from '../../api'
import ApprovalOpinion from '../ApprovalOpinion/index.vue'
import download from '@/utils/download'
import ExportAndImport from '../ExportAndImport/index.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { submit as submitCreditflow } from '@/api/creditflow'
import viewPhaseOpinionPop from './viewApplyPhaseOpinion/index.vue'
import FlowRecord from '@/components/FlowRecord'

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
    label: '申请流水号',
    field: 'serialNo',
    fixed: 'left',
    width: 200
  },
  {
    minWidth: 320,
    label: '供应链项目名称',
    field: 'projectName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入供应链项目名称'
      }
    }
  },
  {
    width: 200,
    label: '债项/产品方案',
    field: 'loanProductName'
  },
  {
    width: 200,
    label: '借款客户号(ECIF)',
    field: 'borrowerId'
  },
  {
    width: 200,
    label: '借款人名称',
    field: 'borrowerName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入借款人名称'
      }
    }
  },
  {
    width: 200,
    label: '证件号码',
    field: 'certId'
  },
  {
    label: '登记人',
    field: 'inputUserName'
  },
  {
    width: 180,
    label: '更新日期',
    field: 'updatedate'
  },
  {
    width: 180,
    label: '更新机构',
    field: 'updateOrgName'
  },
  {
    width: 180,
    label: '是否有效',
    field: 'effeName'
  },
  {
    width: 180,
    label: '失效时间',
    field: 'unEffeDate'
  },
  {
    width: 180,
    label: '决策调用时间',
    field: 'selectDate'
  },
  {
    width: 180,
    label: '是否系统直连推送',
    field: 'systemPushFlag'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getProjectWhiteList,
  defaultParams: { dealtype: props.params.dealtype }
})

const currentRowRef = computed(() => {
  if(tableObject.currentRow && tableObject.currentRow[0]) {
    tableObject.currentRow[0].objectNo = tableObject.currentRow[0].serialNo
  }
  return tableObject.currentRow ? tableObject.currentRow[0] : null
})

const { setSearchParams, getList } = tableMethods

onMounted(() => {
  getList()
})

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}

useEmitt({
  name: 'refresh-supplyChainDataApplication',
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
        await addProjectWhite(formData).finally(()=> button!.btn!.loading = false)
        ElMessage.success('新增成功')
        getList()
        done()
      }
    }
  })
}

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
  await cancelProjectWhite(currentRowRef.value).finally(() => (btn.loading = false))
  ElMessage.success('取消成功')
}
//  ====== 签署意见 ======
const { signOpinionVisible, currentProcessInstanceForOpinion, handleSignOpinion } =
  useSignOpinion(currentRowRef)

// ====== 按钮相关 ======
//const {toRecord } = useBizMethods(currentRowRef, router, getList)

const handleDetail = () => {
  if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  const row = currentRowRef.value
  try {
    router.push({
      name: 'SupplyChainDataApplicationDetail',
      query: {
        projectId: row.projectId,
        serialNo: row.serialNo,
        borrowerType: row.borrowerType,
        systemPushFlagCode: row.systemPushFlagCode,
        dealtypeKey: props.params.key,
        borrowerId: row.borrowerId,
        phaseNo: row.phaseNo,
        t: Date.now()
      }
    })
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  } 
}

const handleDblClick = (row) => {
  try {
    router.push({
      name: 'SupplyChainDataApplicationDetail',
      query: {
        projectId: row.projectId,
        serialNo: row.serialNo,
        borrowerType: row.borrowerType,
        systemPushFlagCode: row.systemPushFlagCode,
        dealtypeKey: props.params.key,
        borrowerId: row.borrowerId,
        phaseNo: row.phaseNo,
        t: Date.now()
      }
    })
  } catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  } 
}

// ====== 自动风险探测 ======
const {
  riskData,
  phaseNo,
  serialNo,
  doRiskDetection,
  riskMonitorVisible,
  creditFlowApprovalVisible,
  submit,
  handleRiskMonitorConfirm,
  handleCreditFlowApprovalCancel,
  handleRiskMonitorCancel,
  openCreditFlowApproval
} = useRiskDetection(currentRowRef)

const doRiskDetectionAction = () => {
  riskData.value = {
    scenarioId: '130',
    rskTp: 2,
    params: {
      ObjectType: 'WhiteListApply',
      ObjectNo: currentRowRef.value.serialNo,
      CustomerID: currentRowRef.value.borrowerId,
      BorrowerType: currentRowRef.value.borrowerType,
      Count:1
    }
  }
}

const checkCommentExec = async(serialNo,objectType,phaseType) => {
  
  const resp = await checkComment({serialNo,objectType,phaseType}).then(res => res)
  return resp;

}

const isBatchSubmit = ref(false)

const handleDoRisk = async (btn: ActionButton)=> {
  isBatchSubmit.value = false
  const currentRow = tableObject.currentRow
  if (currentRow?.length != 1) return ElMessage.warning('请选择一条数据')
  //if (!currentRowRef.value) return ElMessage.warning('请选择一条数据')
  if (currentRowRef.value.tempSaveFlag === '1') {
    ElMessage.warning(`${currentRowRef.value.serialNo}业务未保存信息，请保存后再提交`)
    return
  }
  const dealArr = props.params?.dealtype.split("^")
  const phaseType =  dealArr[0];
  console.log(phaseType);
  const data = await checkCommentExec(currentRowRef.value.serialNo,"WhiteListApply",phaseType)
  console.log("data:",data)
  if (!data?.phaseOpinion) {
   ElMessage.warning(`${currentRowRef.value.serialNo}签署意见未保存`)
    return
  }
  try {
    btn && (btn.loading = true)
    const res = await beforeRisk({ projectId: currentRowRef.value.projectId})
    if(res > 0) {
      submit(doRiskDetectionAction)
    } else {
      openCreditFlowApproval()
    }
  } finally {
    btn && (btn.loading = false)
  }
}

const batchSubmit = async (btn: ActionButton) => {
  isBatchSubmit.value = true
  const currentRow = tableObject.currentRow

  if (!currentRow?.length) return ElMessage.warning('请选择一条数据')
  for (const row of currentRow) {
    if (row.tempSaveFlag === '1') {
      ElMessage.warning(`${currentRowRef.value.serialNo}业务未保存信息，请保存后再提交`)
      return
    }
        const dealArr = props.params?.dealtype.split("^")
        const phaseType =  dealArr[0];
        console.log(phaseType);
        const data = await checkCommentExec(currentRowRef.value.serialNo,"WhiteListApply",phaseType)
        if (!data?.phaseOpinion) {
        ElMessage.warning(`${currentRowRef.value.serialNo}签署意见未保存`)
          return
        }
  }
  btn.loading = true
  const res = await beforeRisk({ projectId: currentRow[currentRow.length - 1]?.projectId ?? ''}).finally(()=> btn.loading = false)
  if(res > 0) {

    const ObjectNo = currentRow.map(item => item.serialNo).join('@')
    const CustomerID = currentRow.map(item => item.borrowerId).join('@')
    const BorrowerType = currentRow.map(item => item.borrowerType).join('@')
    const func = ()=> {
       riskData.value = {
        scenarioId: '130',
        rskTp: 2,
        params: {
          ObjectType: 'WhiteListApply',
          ObjectNo,
          CustomerID,
          BorrowerType,
          Count: currentRow.length
        }
      }
    }
    submit(func)
  } else {
    openCreditFlowApproval()
  }
}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
    const currentRow = tableObject.currentRow
    if (currentRow?.length != 1 )  return ElMessage.warning('请选择一条数据')
    viewPhaseOpinionRef.value.open(currentRow[0])
  //   router.push({
  //   path: 'viewWhiteProjectApplyPhaseOpinion',
  //   query: {
  //     serialNo: currentRow[0].serialNo
  //   }
  // })
}

const toRecord = async(btn) => {
  const currentRow = tableObject.currentRow
  if (currentRow?.length != 1 )  return ElMessage.warning('请选择一条数据')
  addDialog({
    title: '流转记录',
    width:"1200px",
    top: '2vh',
    hideFooter: true,
    contentRenderer: ()=> (
      <FlowRecord serialNo={currentRow[0].serialNo} objectType={'WhiteListApply'} />
    )
  })
}

// ====== excel相关 ======
let importContentRef: any = null
const handleImportExcel = () => {
  addDialog({
    title: 'Excel模板下载及导入',
    width: '500px',
    contentRenderer: () => (
      <ExportAndImport
        ref={(el: any) => {
          importContentRef = el
        }}
      />
    ),
    beforeSure: async (done, { button }) => {
      const fileData = await importContentRef?.validate()
      if (fileData) {
        const file = fileData.file
        const formData = new FormData()
        formData.append('multipartFile', file)
        formData.append('modelNo', fileData.modelNo)
        button!.btn!.loading = true
        await importExcel(formData).finally(()=> button!.btn!.loading = false)
        ElMessage.success('导入成功')
        getList()
        done()
      }
    }
  })
}
const handleExportExcel = async (btn: ActionButton) => {
  btn.loading = true
  const data = {
    dealtype: props.params.dealtype,
    projectName: tableObject.params.projectName,
    borrowerName: tableObject.params.borrowerName
  }
  try {
    const res = await exportExcel(data)
    download.excel(res, '供应链决策数据申请列表.xls')
  } catch {
  } finally {
    btn.loading = false
  }
}

const handleBack = async (btn: ActionButton) => {
    const currentRow = tableObject.currentRow
    if (currentRow?.length != 1 )  return ElMessage.warning('请选择一条数据')
    await submitCreditflow({
      serialNo: currentRow[0].objectNo,
      phaseNo: currentRow[0].phaseNo,
      objectType: 'WhiteListApply',
      nextUserRole: '退回前一步',
      nextUserInfo: ''
    })
    ElMessage.success("退回成功")
    getList()
}

// ====== 操作按钮 ======
const pageBtnKeyMap = {
  '1010': [
    'add',
    'cancel',
    'detail',
    'signOpinion',
    'submit',
    'batchSubmit',
    'importExcel',
    'exportExcel'
  ],
  '1020': ['detail', 'viewOpinion', 'viewRecord', 'exportExcel'],
  '1030': ['detail', 'viewOpinion', 'viewRecord', 'exportExcel'],
  '1040': ['cancel', 'detail', 'viewOpinion', 'signOpinion', 'submit', 'batchSubmit', 'viewRecord'],
  '1050': ['detail', 'viewOpinion', 'viewRecord'],
  '010010': ['detail', 'back', 'signOpinion', 'viewOpinion', 'submit', 'batchSubmit'],
  '010020': ['detail', 'viewOpinion', 'viewRecord']
}

const buttons = ref<ActionButton[]>([
  {
    key: 'add',
    label: '新增申请',
    plain: true,
    onClick: handleAdd
  },
  {
    key: 'cancel',
    label: '取消申请',
    plain: true,
    loading: false,
    onClick: (btn) => handleCancel(btn)
  },
  {
    key: 'detail',
    label: '申请详情',
    plain: true,
    onClick: handleDetail
  },
  {
    key: 'back',
    label: '退回前一步',
    plain: true,
    onClick: (btn) => handleBack(btn)
  },
  {
    key: 'signOpinion',
    label: '签署意见',
    plain: true,
    onClick: handleSignOpinion
  },
  {
    key: 'viewOpinion',
    label: '查看意见',
    plain: true,
    onClick: viewPhaseOpinion
  },
  {
    key: 'viewRecord',
    label: '查看流转记录',
    plain: true,
    onClick: (btn) => toRecord(btn)
  },
  {
    key: 'submit',
    label: '提交',
    plain: true,
    onClick: handleDoRisk
  },
  {
    key: 'batchSubmit',
    label: '批量提交',
    plain: true,
    onClick: batchSubmit
  },
  {
    key: 'importExcel',
    label: 'Excel模板下载及导入',
    plain: true,
    onClick: handleImportExcel
  },
  {
    key: 'exportExcel',
    label: '导出Excel',
    plain: true,
    loading: false,
    onClick: (btn) => handleExportExcel(btn)
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
