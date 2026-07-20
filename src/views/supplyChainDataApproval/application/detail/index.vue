<template>
  <ContentWrap>
    <ActionBar class="w-[calc(100%-10px)]" :buttons="visibleBtns" />
    <dynamicForm
      ref="dynamicFormRef"
      style="width: calc(100% - 10px)"
      :dockList="dockList"
      :formData="formData"
      :formTempList="formTempList"
      :customVisible="customVisible"
      :customRequired="customRequired"
      label-width="auto"
      @pop-confirm="popConfirm"
      @select-input-click="formSelectInputClick"
      @select-change="formSelectChange"
      @render-finished="formRendering = false"
    >
      <template #GuaranteerPart>
        <GuaranteerPart />
      </template>
      <template #PartenterPart>
        <PartenterPart />
      </template>
    </dynamicForm>
  </ContentWrap>

  <!-- 供应链合作项目名称 -->
  <!-- <ProjectNameDialog
    :ref="(el) => setMapRef(el, `projectname`)"
    @confirm="(item) => popConfirm('projectname', item)"
  /> -->

 <!-- 香飘飘借款人 -->
  <BoNameDialog
    :ref="(el) => setMapRef(el, `bo_name`)"
    @confirm="(item) => popConfirm('bo_name', item)"
  />
  <!-- 企业名称 -->
  <BorrowerNameDialog
    :ref="(el) => setMapRef(el, `borrowername`)"
    @confirm="(item) => popConfirm('borrowername', item)"
  />
    <!-- 通威企业名称 -->
    <TWBorrowerNameDialog
      :ref="(el) => setMapRef(el, `relcustomername`)"
      @confirm="(item) => popConfirm('relcustomername', item)"
    />
 <!-- 香飘飘经营区域 -->
  <selectRegionCodePop
    :ref="(el) => setMapRef(el, `businessaddress`)"
    @confirm="(item) => popConfirm('businessaddress', item)"
  />
  <!-- 香飘飘用款企业 -->
    <EntnameDialog
      :ref="(el) => setMapRef(el, `entname`)"
      @confirm="(item) => popConfirm('entname', item)"
    />
   <!-- 香飘飘配偶名称 -->
   <BoNameDialog
     :ref="(el) => setMapRef(el, `spousename`)"
     @confirm="(item) => popConfirm('spousename', item)"
   />
  <!-- 经营区域 -->
  <selectRegionCodePop
    :ref="(el) => setMapRef(el, `belongarea`)"
    @confirm="(item) => popConfirm('belongarea', item)"
  />
  
   <!-- 受托支付开户行 -->
    <OpenbankDialog
      :ref="(el) => setMapRef(el, `openbank`)"
      @confirm="(item) => popConfirm('openbank', item)"
    />
    <!-- 受托支付对象 -->
     <ProjectPayDialog
       :ref="(el) => setMapRef(el, `payername`)"
       :projectId="route.query.projectId"
       @confirm="(item) => popConfirm('payername', item)"
     />
  <!-- 签署意见 -->
  <ApprovalOpinion
    v-model="signOpinionVisible"
    :processInstance="currentProcessInstanceForOpinion"
    @submit="creditFlowApprovalVisible = true"
  />
  <CreditFlowApproval
    v-model="creditFlowApprovalVisible"
    :serial-no="route.query.serialNo"
    :phase-no="route.query.phaseNo"
    :object-type="'WhiteListApply'"
    @cancel="handleCreditFlowApprovalCancel"
  />
</template>

<script setup lang="tsx">
import useFormChange from './hooks/useFormChange'
import {
  getProjectTemplateVO,
  getProjectTemplateValue,
  saveJcModelTemplateValue,
  searchInDebtInfo
} from '../api'
// import ProjectNameDialog from './components/ProjectNameDialog/index.vue'
import BorrowerNameDialog from './components/BorrowerNameDialog/index.vue'
import TWBorrowerNameDialog from './components/BorrowerNameDialog/index.vue'
import ProjectPayDialog from './components/ProjectPayDialog/index.vue'
import BoNameDialog from './components/BoNameDialog/index.vue'
import EntnameDialog from './components/EntnameDialog/index.vue'
import OpenbankDialog from './components/OpenbankDialog/index.vue'
import selectRegionCodePop from '@/components/dynamicForm/components/selectRegionCodePop.vue'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useSignOpinion } from '@/views/creditApplicationMGM/approvalChangeRequest/hooks'
import ApprovalOpinion from '../components/ApprovalOpinion/index.vue'
import { getImageGalleryInfo, ImageGallery } from '@/api/common'
import { IFrame } from '@/components/IFrame'
import { addDialog } from '@/components/Dialog'
import tempTable from '@/components/dynamicForm/components/tempTable.vue'
import GuaranteerPart from './components/GuaranteerPart/index.vue'
import PartenterPart from './components/PartenterPart/index.vue'
import { useEmitt } from '@/hooks/web/useEmitt'
import { bcByProjectId } from '@/views/singBusMana/channelEntryMana/applicationMGM/applicationMGMDetail/api.js'

defineOptions({
  name: 'SupplyChainDataApplicationDetail'
})

const route = useRoute()
const { push, currentRoute } = useRouter()
const loading = ref(false)
const formRendering = ref(true)
const { delView } = useTagsViewStore()
const dealtypeKey = computed(() => {
  return route.query?.dealtypeKey as string
})

// ====== 动态表单配置相关 ======
const dynamicFormRef = ref()
const dockList = reactive<any[]>([])
const formTempList = ref([])
const formData = reactive<Recordable>({})

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

console.log(111111,222222);

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, customVisible, customRequired } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)

const popConfirm = (colname: string, row: Recordable) => {
  switch (colname) {
    case 'borrowername':
      formData.borrowername = row.customerName
      formData.borrowerid = row.customerId
      formData.certid = row.certId
      break
    case 'belongarea':
      formData.belongarea = row.title
      // formData.belongareaid = row.key
      break
    case 'businessaddress':
       formData.businessaddress = row.title
       break
    case 'entname':
        formData.entname = row.customerName
        formData.entcardid = row.certId
        break
    case 'bo_name':
         formData.bo_name = row.customerName
         formData.bo_customerid = row.customerId
         formData.bo_cardid = row.certId
         break
    case 'openbank':
         formData.openbank = row.bankName
         break
    case 'spousename':
          formData.spousename = row.customerName
          formData.spouseid = row.customerId
          formData.spousecardid = row.certId
          break
    case 'payername':
          formData.payername = row.openCustomerName
          formData.payaccount = row.accountNo
          formData.payopenaccount = row.openBankName
          break
    case 'relcustomername':
           formData.relcustomername = row.customerName
           formData.relcustomerid = row.customerId
           formData.relcustomercertid = row.certId
           break
    default:
      break
  }
}

async function getTempValue() {
  const tempValue = await getProjectTemplateValue({
    projectId: route.query.projectId,
    serialNo: route.query.serialNo
  })
  Object.assign(formData, tempValue)
}

// ====== 获取模版数据 ======
async function getTempData() {
  try {
    loading.value = true
    const temp = await getProjectTemplateVO({
      projectId: route.query.projectId,
      systemPushFlagCode: route.query.systemPushFlagCode,
      borrowerType: route.query.borrowerType
    })
    
    dockList.push(
      ...(temp?.docks || []).map((item) => ({
        ...item,
        slotName: item.dockid
      }))
    )
    console.log('[ dockList ] >', dockList)
    formTempList.value = temp.templates
    await getTempValue()
  } finally {
    loading.value = false
  }
}
onBeforeMount(() => {
  getTempData()
})

// ====== 按钮事件 ======
const { emitter } = useEmitt()
const save = async (btn: ActionButton) => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  btn.loading = true
  await saveJcModelTemplateValue(formData).finally(() => (btn.loading = false))
  ElMessage.success('数据保存成功')
  emitter.emit('refresh-supplyChainDataApplication')
}

const back = (btn: ActionButton) => {
  delView(unref(currentRoute))
  push({ name: 'SupplyChainDataApplication' })
}

const router = useRouter()
const toProjectDetail = async (btn: ActionButton) => {
  try{
    btn.loading = true
    const serialNoByList = await bcByProjectId({ projectId: route.query.projectId })
    router.push({
      name: 'ParamAdjustApplyDetail',
      query: {
        serialno: route.query.projectId,
        customerId: formData.borrowerid,
        tempType: 'ProjectDetails',
        type: 'detail',
        title: '合作项目详情',
        serialNoByList,
        t: Date.now()
      }
    })
  }catch(error: any) {
    if(error && error?.message?.includes('No match for')) {
      router.push('/404')
    }
  }finally {
    btn.loading = false
  }
}

const syncDebt = async(btn: ActionButton) => {
     btn.loading = true
     await searchInDebtInfo({serialNo:formData.serialno}).finally(() => (btn.loading = false))
     loading.value = true
     await getTempValue().finally(()=> loading.value = false)
     ElMessage.success('同步成功')
}

const toImageInfo = async (btn: ActionButton) => {
  try {
    btn.loading = true
    const objectType = '2' == route.query.borrowerType ? 'BuildWhiteApply' : 'DealWhiteApply'
    // const objectType = 'WhiteListApply'
    const params: ImageGallery = {
      objectNo: route.query.serialNo as string,
      objectType,
      customerID: route.query.borrowerId as string
    }
    const res = await getImageGalleryInfo(params)
    console.log('[ res ] >', res)
    addDialog({
      title: '查看影像详情',
      width: '90%',
      top: '0',
      contentRenderer: () => <IFrame src={res} />,
      hideFooter: true
    })
  } finally {
    btn.loading = false
  }
}

//  ====== 签署意见 ======
const { signOpinionVisible, currentProcessInstanceForOpinion, handleSignOpinion } = useSignOpinion({
  serialNo: route.query.serialNo,
  phaseNo: route.query.phaseNo
})

// ====== 按钮 ======
const btnKeysMap = {
  '1010': ['save', 'back', 'projectDetail', 'imageInfo', 'sign','syncDebt'],
  '1020': ['back', 'projectDetail', 'imageInfo'],
  '1030': ['back', 'projectDetail', 'imageInfo'],
  '1040': ['save', 'back', 'projectDetail', 'imageInfo', 'sign'],
  '1050': ['save', 'back', 'projectDetail', 'imageInfo', 'sign'],
  '010010': ['back', 'projectDetail', 'imageInfo', 'sign'],
  '010020': ['back', 'projectDetail', 'imageInfo']
}
const btns = ref<ActionButton[]>([
  {
    key: 'save',
    label: '保存',
    loading: false,
    plain: true,
    icon: 'ep:document',
    onClick: (btn) => save(btn)
  },
  {
    key: 'back',
    label: '返回',
    loading: false,
    plain: true,
    onClick: (btn) => back(btn)
  },
  {
    key: 'projectDetail',
    label: '合作项目详情',
    loading: false,
    plain: true,
    onClick: (btn) => toProjectDetail(btn)
  },
  {
    key: 'imageInfo',
    label: '影像资料',
    loading: false,
    plain: true,
    onClick: (btn) => toImageInfo(btn)
  },
  {
    key: 'syncDebt',
    label: '查询债项信息',
    loading: false,
    plain: true,
    show: () =>{
      return dockList?.[0]?.dono == 'CfmotoAutoApplyInfo'
    },
    onClick: (btn) => syncDebt(btn)
  }
])
const visibleBtns = computed(() => {
  const btnKeys = btnKeysMap[dealtypeKey.value || '']
  if (!btnKeys) return []
  return btns.value.filter((btn) => btnKeys.includes(btn.key))
})


// ====== 签署意见相关 ======
const creditFlowApprovalVisible = ref(false)
const handleCreditFlowApprovalCancel = () => {
  creditFlowApprovalVisible.value = false
}
</script>
