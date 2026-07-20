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
          placeholder="请输入模型名称"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="display: flex; margin-bottom: 17px">
      <el-button v-if="addVIf" @click="AddDetail">
        <Icon class="mr-5px" icon="ep:circle-plus" />
        新增
      </el-button>
      <el-button @click="goDetail">
        <Icon class="mr-5px" icon="ep:edit" />
        详情
      </el-button>
      <el-button v-if="delVIf" @click="del">
        <Icon class="mr-5px" icon="ep:delete" />
        删除
      </el-button>
      <!-- <el-button @click="handleSignOpinion">
        签署意见
      </el-button>
      <el-button @click="submit"> 提交 </el-button>
      <el-button v-if="viewPhaseOpinionVif" @click="viewPhaseOpinion"> 查看意见 </el-button> -->
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

    <!-- 新增 -->
    <!-- <addPop ref="addPopRef" @confirm="addConfirm" /> -->
    <!-- 签署意见 -->
    <ApprovalOpinion
      v-model="signOpinionVisible"
      :processInstance="currentProcessInstanceForOpinion"
      hideTip
      @confirm="handleSignOpinionConfirm"
      @cancel="handleSignOpinionCancel"
      @submit="submit"
    />

    <CreditFlowApproval
      v-model="creditFlowApprovalVisible"
      :serial-no="serialNo"
      :phase-no="phaseNo"
      :objectType="objectType"
      @refresh="getList"
      @cancel="handleCreditFlowApprovalCancel"
    />
    <RiskMonitor
      v-model="riskMonitorVisible"
      :risk-data="riskData"
      @confirm="handleRiskMonitorConfirm"
      @cancel="handleRiskMonitorCancel"
    />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import addPop from './components/addPop.vue'
import ApprovalOpinion from '@/components/approvalOpinion/index.vue'
import { useOldDictStore } from '@/store/modules/oldDict'
import { useUserStoreWithOut } from '@/store/modules/user'
import { addDialog, closeDialog } from '@/components/Dialog'
import useFormChange from '@/views/assistApprProject/assistApprDetail/hooks/useFormChange'
import { FormSchema } from '@/types/form'
import dayjs from 'dayjs'

const userStore = useUserStoreWithOut()

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

// 新增权限
const addVIf = computed(() => ['010'].includes(props.params.key))

// 删除权限
const delVIf = computed(() => ['010', '040'].includes(props.params.key))

// 查看意见
const viewPhaseOpinionVif = computed(() => ['040'].includes(props.params.key))



console.log('props.params.dealtype111',props.params.dealtype);
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
} = useTableList(Api.getProjectCoreviewPage, { phaseType: props.params.dealtype, modelApplyType: '01' }, false)




const { getDictFetch, getDictLabels } = useOldDictStore()

fetchCback((list) => {
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.exposureSum1 = formatValue(v.exposureSum, 'currency')
    v.loanProductCategory1 = getDictLabels('GYLLoanProductCategory', v.loanProductCategory)
    if (v.modelcategory) {
      v.modelcategory = v.modelcategory === '01'?'贷前决策审批模型':'业务合同-放款决策审批模型'
    }
  })
})

const initFetch = () => {
  Promise.all([getDictFetch('GYLLoanProductCategory')]).then(res => {
    getList()
  })
}
onActivated(() => {
  initFetch()
})


const router = useRouter() // 路由

const columns = [
  { label: '申请编号', field: 'serialno', minWidth: 220 },
  { label: '模型名称', field: 'projectName', minWidth: 320 },
  { label: '模型分类', field: 'modelcategory' },
  { label: '申请时间', field: 'inputtime', minWidth: 130 },
  { label: '申请人', field: 'inputusername' },
  { label: '申请机构', field: 'inputorgname' }
]

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  console.log('modelApplyType',currentRow.value.serialno);

  router.push({
    path: 'modelConstructionDetail',
    query: {
      serialno: currentRow.value.serialno,
      type: 'edit',
      t: Date.now()
    }
  })
}

const addPopRef = ref()
const dynamicFormRef = ref()

const mapRefs = ref({})
let addPartenterPartFormRef: any = null
const validateOnRuleChange = ref(false)
const partenterPartFormData = reactive<Recordable>({})

const partenterPartFormTempList = ref([])

// 表单动态事件处理
const { customVisible: partenterPartCustomVisible, customRequired: partenterPartCustomRequired } =
  useFormChange({ partenterPartFormData }, { dynamicFormRef, mapRefs })



const add =async () => {

  const {serialNo} =await Api.getModelAddReq()
  
  const res = await Api.getTemplateInfo({templateNo: "ModelApplyInfo"})

 partenterPartFormTempList.value =  res.templates.map((item) => ({
    ...item
  }))

  for (let key in partenterPartFormData) {
    partenterPartFormData[key] = ''
  }

  ;((partenterPartFormData.inputusername = userStore.user.nickname),
    (partenterPartFormData.inputtime = dayjs().format('YYYY/MM/DD HH:MM:ss')))
  partenterPartFormData.inputorgname = userStore.dept.name

  addDialog({
    title: '模型申请新增',
    width: '780px',
     hideFooter: true,
    contentRenderer: ({options,index}) => (
      <div>
        <div>
          <el-button onClick={()=> addConfirm('01',options, index)}>保存</el-button>
          <el-button onClick={()=> addConfirm('02')}>暂存</el-button>
        </div>
        <simpleForm
          ref={(el) => {
            addPartenterPartFormRef = el
          }}
          validateOnRuleChange={validateOnRuleChange.value}
          formData={partenterPartFormData}
          formTempList={partenterPartFormTempList.value}
          customVisible={partenterPartCustomVisible}
          customRequired={partenterPartCustomRequired}
          label-width="auto"
        />
      </div>
    ),
    close() {
       addPartenterPartFormRef?.resetFields()
       validateOnRuleChange.value = false
    },

    async beforeSure(done, { button }) {
      const valid = await addPartenterPartFormRef?.formRef?.validate()
      console.log('[ valid ] >', valid)
      if (valid) {
        button.btn!.loading = true
        const params = {
          ...partenterPartFormData,
          objectType: 'newPartent',
          serialNo: serialNo
        }
        
        done()
        validateOnRuleChange.value = false
      } else {
        validateOnRuleChange.value = true
      }
      addPartenterPartFormRef?.resetFields()
    }
  })

}


const AddDetail = async () => {
  const {serialNo} =await Api.getModelAddReq()
  router.push({
    path: 'modelConstructionDetail',
    query: {
      serialno:serialNo,
      t: Date.now(),
      type: 'ADD'
    }
  })
}



const addConfirm = async (item,options,index) => {


// closeDialog(options, index, {command: 'cancel'})

  // 保存
  const valid = await addPartenterPartFormRef?.formRef?.validate()
  console.log('[ valid ] >', valid)
  if (valid) {
        // button.btn!.loading = true
        const params = {
          ...partenterPartFormData,
          objectType: 'newPartent',
          serialNo: serialNo
        }
        await Api.addSave(params).finally(() => {})
         ElMessage.success('新增成功')
        // partenterPartTempTableRef.value?.getList()
      
        validateOnRuleChange.value = false
      } else {
        validateOnRuleChange.value = true
      }
      addPartenterPartFormRef?.resetFields()

}

const { confirmFetch } = useMessage()
// 删除
const del = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '确认删除',
    fetchFunc: () => Api.deleteApply(currentRow.value.serialno)
  }).then((_) => {
    ElMessage.success('已删除')

    getList()
  })
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
    phaseNo: selectedRows.phaseNo,
    objectType: 'ProjectCoreview'
  }
  signOpinionVisible.value = true
}

const riskMonitorVisible = ref(false)
const riskData = ref()
const submitFlag = ref(false)
const serialNo = ref('')
const phaseNo = ref('')
const objectType = ref('')
const creditFlowApprovalVisible = ref(false)

const doRiskDetection = async (rskTp = 1) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  serialNo.value = currentRow.value.objectNo
  phaseNo.value = currentRow.value.phaseNo
  riskData.value = {
    scenarioId: '015',
    rskTp: rskTp?.target ? 1 : rskTp,
    params: {
      EDObjectNo: serialNo.value,
      EDObjectType: 'ProjectCoreview',
      EDPhaseNo: phaseNo.value,
      EDCustomerID: currentRow.value.customerID
    }
  }
  riskMonitorVisible.value = true
  submitFlag.value = false
}

const submit = async () => {
  // await doRiskDetection()
  // submitFlag.value = true

  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  
  if (currentRow.value['tempSaveFlag'] != 2) {
    return ElMessage.warning('请保存协审信息后提交')
  }

  serialNo.value = currentRow.value.serialNo
  phaseNo.value = currentRow.value.phaseNo
  objectType.value = 'ProjectCoreviewGYL'

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

// 查看意见
const viewPhaseOpinion = () => {
  console.log('router',router);
    if (!currentRow.value) return ElMessage.warning('请选择 1 条')
    router.push({
    path: '/projectMana/projectCollReviMana/viewEDPhaseOpinion',
    query: {
      serialNo: currentRow.value.serialNo,
      t: new Date().getTime()
    }
  })

}
</script>
