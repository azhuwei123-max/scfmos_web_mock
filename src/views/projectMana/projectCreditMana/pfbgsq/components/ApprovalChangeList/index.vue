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
      highlight-current-row
      :onRowClick="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
      @row-dblclick="handleDetail"
    />

    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="visible"
      width="880"
      :columns="columns"
      @confirm="okPick"
      :data="datalist"
    />

    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      @submit="submit"
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
      :object-type="tableObject?.currentRow?.objectType"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />

      <!-- 查看意见 -->
    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />

    <apprCustTypePop ref="apprCustTypePopRef" @confirm="handleQuery" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import { addApproveChangeApply, getApproveChangeApplyList, checkComment } from '../../api'
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import ApprovalOpinion from '@/views/creditapplication/creditApplyJob/components/approvalOpinion.vue'
import { useDutReport, useSignOpinion, useRiskDetection, useBizMethods } from '../../hooks'
import { addDialog } from '@/components/Dialog/index'
import AddForm from '../AddForm/index.vue'
import dayjs from 'dayjs'
import { useUserStoreWithOut } from '@/store/modules/user'
import { formatValue, FormatterType } from '@/utils/formatter'
import viewPhaseOpinionPop from '../viewEDPhaseOpinion/index.vue'
import apprCustTypePop from './components/apprCustTypePop.vue'


defineOptions({
  name: 'ApprovalChangeList'
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
    field: 'objectNo',
    isSearch: true,
    fixed: 'left',
    minWidth: 220,
    search: {
      componentProps: {
        placeholder: '请输入申请编号'
      }
    }
  },
  {
    width: 200,
    label: '关联批复流水号',
    field: 'relativeSerialNo'
  },
  {
    minWidth: 320,
    label: '客户名称',
    field: 'customerName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入申请客户名称'
      }
    }
  },
  {
    width: 180,
    label: '业务品种',
    field: 'businessTypeName',
    isSearch: true,
    search: {
      componentProps: {
        placeholder: '请输入业务品种'
      }
    }
  },
  {
    label: '发生类型',
    field: 'occurTypeName'
  },
  {
    label: '币种',
    field: 'currencyName'
  },
  {
    width: 150,
    label: '申请金额',
    field: 'businessSum',
    formatter: ({ businessSum }) => {
      return formatValue(businessSum, FormatterType.CURRENCY, { currencySymbol: ' ' })
    }
  },
  {
    label: '申请人',
    field: 'operateUserName'
  },
  {
    width: 180,
    label: '申请机构',
    field: 'operateOrgName'
  },
  {
    width: 180,
    label: '当前阶段',
    field: 'flowName'
  },
  {
    width: 180,
    label: '供应链标识',
    field: 'phaseName'
  },
  {
    width: 180,
    label: '业务流程标识',
    field: 'applyModelTypeName'
  },
  {
    minWidth: 320,
    label: '合作项目名称',
    field: 'projectName'
  }
])

const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getApproveChangeApplyList,
  defaultParams: { dealtype: props.params.dealtype ,creditSourceFlag:'01'}
})

const currentRowRef = toRef(tableObject, 'currentRow')

const { setSearchParams, getList } = tableMethods

onMounted(() => {
  getList()
})

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}


const viewPhaseOpinionRef = ref()
const handleViewPhaseOpinion = () => {

   if (!currentRowRef.value) return ElMessage.warning('请选择 1 条')
  //  console.log('currentRowRef.value',currentRowRef.value);
   
  viewPhaseOpinionRef.value.open({...currentRowRef.value,serialNo:currentRowRef.value.objectNo})

}

// 签署意见
const { signOpinionVisible, currentProcessInstanceForOpinion, handleSignOpinion } =
  useSignOpinion(currentRowRef)

// 尽职调查报告
const { writeDutReport, datalist, visible, columns, okPick, checkDutReport } =
  useDutReport(currentRowRef)

//====== 自动风险探测 ======
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
  handleRiskMonitorCancel
} = useRiskDetection(currentRowRef)
const submit2 = async ()=> {
  const res = await checkCommentExec(currentRowRef.value.objectNo,currentRowRef.value.objectType,currentRowRef.value.phaseNo)
  if (!res?.phaseOpinion) {
     ElMessage.warning(`${currentRowRef.value.objectNo}签署意见未保存`)
    return
  }
  submit()
}

const checkCommentExec = async(serialNo,objectType,phaseNo) => {
  const resp = await checkComment({serialNo,objectType,phaseNo}).then(res => res)
  return resp;
}

// 审批客户分类
const apprCustTypePopRef = ref()
const apprCustType = async () => {
  if (!currentRowRef.value) return ElMessage.warning('请选择 1 条')

  apprCustTypePopRef.value.open(currentRowRef.value)
}


/** 搜索按钮操作 */
const handleQuery = () => {
  // setSearchParams({ ...queryParams, phaseType:currentPhaseType.value })
  getList()
}

//====== 新增申请 ======
let addFormContentRef: any = null
const { user, dept } = useUserStoreWithOut()

const handleAdd = async () => {
  const result = await addDialog({
    title: '新增申请',
    width: '600px',
    contentRenderer: () => (
      <AddForm
        ref={(el: any) => {
          addFormContentRef = el
          const row = {
            operateOrgName: dept?.name ?? '',
            operateUserName: user.nickname ?? '',
            operateDate: dayjs().format('YYYY-MM-DD')
          }
          nextTick(() => el?.setValues(row))
        }}
      />
    ),
    beforeSure: async (done, { button }) => {
      const formData = await addFormContentRef?.validate()
      if (formData?.serialNo) {
        button!.btn!.loading = true
        await addApproveChangeApply({ serialNo: formData?.serialNo,creditSourceFlag:'01' }).finally(() => {
          button!.btn!.loading = false
        })
        ElMessage.success('新增成功')
        getList()
        done()
      }
    }
  })
}

// ====== 按钮相关 ======
const { viewPhaseOpinion, toRecord, takeBack, viewEdpfReport, handleDetail, handleCancel } = useBizMethods(
  currentRowRef,
  router,
  {flag:1},
  getList
)

// ====== 操作按钮 ======
const pageBtnKeyMap = {
  '1010': [
    'add',
    'cancel',
    'detail',
    'signOpinion',
    'fillReport',
    'viewReport',
    'automatic',
    'submit',
    'apprCustType'
  ],
  '1020': ['detail', 'viewReport', 'viewOpinion', 'viewRecord', 'takeBack'],
  '1025': ['cancel', 'detail', 'viewOpinion', 'signOpinion', 'automatic', 'submit'],
  '1030': [
    'cancel',
    'detail',
    'viewOpinion',
    'signOpinion',
    'fillReport',
    'viewReport',
    'automatic',
    'submit'
  ],
  '1040': ['detail', 'viewOpinion', 'viewReport', 'viewRecord', 'viewEdpfReport'],
  '1050': ['detail', 'viewOpinion', 'viewReport']
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
    onClick: handleCancel
  },
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
    onClick: handleSignOpinion
  },
  {
    key: 'viewOpinion',
    label: '查看意见',
    plain: true,
    onClick: handleViewPhaseOpinion
  },
  {
    key: 'fillReport',
    label: '填写尽职调查报告',
    plain: true,
    onClick: writeDutReport
  },
  {
    key: 'viewReport',
    label: '查看尽职调查报告',
    plain: true,
    onClick: checkDutReport
  },
  {
    key: 'viewRecord',
    label: '查看流转记录',
    plain: true,
    onClick: toRecord
  },
  {
    key: 'viewEdpfReport',
    label: '查看批复通知书',
    loading: false,
    plain: true,
    onClick: viewEdpfReport
  },
  {
    key: 'takeBack',
    label: '收回',
    plain: true,
    onClick: takeBack
  },
  {
    key: 'automatic',
    label: '自动风险探测',
    plain: true,
    onClick: () => doRiskDetection()
  },
  {
    key: 'submit',
    label: '提交',
    plain: true,
    onClick: () => submit2()
  },
  {
    key: 'apprCustType',
    label: '审批客户分类',
    plain: true,
    onClick: apprCustType
  }
])

const visibleButtons = computed(() => {
  const btnKeys = pageBtnKeyMap[props.params?.dealtype || '']
  if (!btnKeys) return []
  return buttons.value.filter((btn) => btnKeys.includes(btn.key))
})



onActivated(() => {
  getList()
})

</script>
