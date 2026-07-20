<template>
  <ContentWrap v-loading="loading">
    <!-- 操作按钮 - 头部 -->
    <div class="flex justify-end gap-10px mb-20px">
      <el-button @click="handleBack">返 回</el-button>
    </div>

    <!-- 基本信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">基本信息</div>
      <BasicInfo ref="basicInfoRef" :detail-data="detailData" />
    </div>

    <el-divider />

    <!-- 业务要求和条件 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">业务要求和条件</div>
      <BusinessRequirement ref="businessRequirementRef" :detail-data="detailData" />
    </div>

    <el-divider />

    <!-- 利率信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">利率信息</div>
      <InterestRateInfo ref="interestRateInfoRef" :detail-data="detailData" />
    </div>

    <el-divider />

    <!-- 还款信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">还款信息</div>
      <RepaymentInfo :detail-data="detailData" />
    </div>

    <el-divider />

    <!-- 罚息利率信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">罚息利率信息</div>
      <PenaltyRateInfo
        v-model:penalty-rate-list="penaltyRateList"
      />
    </div>

    <el-divider />

    <!-- 费用信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">费用信息</div>
      <FeeInfo
        v-model:fee-list="feeList"
      />
    </div>

    <el-divider />

    <!-- 账户信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">账户信息</div>
      <AccountInfo
        v-model:account-list="accountList"
      />
    </div>

    <el-divider />

    <!-- 操作信息 -->
    <div class="mb-30px">
      <div class="text-18px font-bold mb-15px text-gray-700">操作信息</div>
      <OperationInfo :detail-data="detailData" />
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { useTagsViewStoreWithOut } from '@/store/modules/tagsView'
// @ts-ignore
import BasicInfo from '../../pendding/detail/components/BasicInfo.vue'
// @ts-ignore
import BusinessRequirement from '../../pendding/detail/components/BusinessRequirement.vue'
// @ts-ignore
import InterestRateInfo from '../../pendding/detail/components/InterestRateInfo.vue'
// @ts-ignore
import RepaymentInfo from '../../pendding/detail/components/RepaymentInfo.vue'
// @ts-ignore
import PenaltyRateInfo from '../../pendding/detail/components/PenaltyRateInfo.vue'
// @ts-ignore
import FeeInfo from '../../pendding/detail/components/FeeInfo.vue'
// @ts-ignore
import AccountInfo from '../../pendding/detail/components/AccountInfo.vue'
// @ts-ignore
import OperationInfo from '../../pendding/detail/components/OperationInfo.vue'

defineOptions({ name: 'CreditApplicationApprovedDetail' })

const message = useMessage()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStoreWithOut()

// 设置页签标题
const updateTitle = (applicationNo?: string) => {
  if (applicationNo) {
    const title = `审批通过(${applicationNo})-详情`
    nextTick(() => {
      tagsViewStore.updateVisitedView({
        ...route,
        meta: {
          ...route.meta,
          title: title
        },
        title: title
      } as any)
    })
  }
}

onMounted(() => {
  // 如果从 query 中获取到申请编号，先设置标题
  const applicationNo = route.query.applicationNo as string
  if (applicationNo) {
    updateTitle(applicationNo)
  }
  // 获取详情数据
  getDetailData()
})

const loading = ref(false)
const detailData = ref<any>({})
const penaltyRateList = ref<any[]>([])
const feeList = ref<any[]>([])
const accountList = ref<any[]>([])
const interestRateInfoRef = ref()
const basicInfoRef = ref()
const businessRequirementRef = ref()

/** 获取详情数据 */
const getDetailData = async () => {
  const id = route.params.id as string
  if (!id) {
    message.warning('参数错误，申请ID不能为空！')
    handleBack()
    return
  }

  try {
    loading.value = true
    // TODO: 替换为实际的 API 调用
    // const data = await ApprovedApplicationApi.getApprovedApplicationDetail(id)
    // detailData.value = data
    
    // 模拟数据 - 复用审批中申请的数据结构
    const mockData: Record<string, any> = {
      '1': {
        id: 1,
        applicationNo: 'BA2025102900000040',
        applicantName: '槎猫',
        customerType: '公司客户',
        customerNo: 'C001',
        merchantId: '',
        businessType: '一般经营性贷款',
        occurrenceType: '新增',
        processType: '供应链',
        currency: '人民币',
        amount: 20000.00,
        applyOrg: '总营公司业务二部',
        registerOrg: '总营公司业务二部',
        registerUser: '项備痔',
        registerDate: '2024-01-10',
        occurrenceDate: '2024-01-10',
        currentProcess: '审批通过',
        currentStage: '已完成',
        completeTime: '2024-01-20 10:30:00',
        projectName: '一般经营性贷款项目',
        businessSource: '项備痔',
        applicant: '项備痔',
        // 业务要求和条件
        businessPurpose: '补充流动资金',
        businessTerm: '12个月',
        guaranteeType: '保证担保',
        repaymentMethod: '等额本息',
        loanCondition: '提供担保函',
        otherRequirement: '无',
        paymentMethod: '自主支付',
        stagedSelfPaymentWithdrawal: '否',
        electronicChannelWithdrawalMode: '非落地审核',
        maxSingleTransactionTerm: '12个月',
        firstAdjustmentDate: '',
        interestRateAdjustmentCycleUnit: '',
        mainGuaranteeMethod: '信用',
        electronicChannelControl: '随借随还',
        electronicChannelWithdrawalRepaymentMethod: '',
        interestRateAdjustmentMethod: '不调整',
        interestRateAdjustmentCycle: '',
        // 利率信息
        interestRateType: '固定LPR利率',
        baseRateEffectiveDate: '2024-01-15',
        interestRateMode: '固定',
        rateType: '贷款利率',
        baseRateType: 'LPR基准利率',
        rateUnit: '年利率(百分比)',
        baseRateLevel: '12月',
        baseRate: 4.35,
        floatRateType: '浮动点',
        floatRange: 0.5,
        executeRate: 4.85,
        // 还款信息
        repaymentPeriod: '按月',
        repaymentDay: '15日',
        firstRepaymentDate: '2024-02-15',
        lastRepaymentDate: '2025-01-15',
        repaymentPeriods: '12期',
        periodRepaymentAmount: 1666.67,
        repaymentAccount: '6222021234567890001',
        repaymentAccountName: '槎猫',
        repaymentAccountBank: '中国工商银行',
        // 罚息利率信息
        penaltyRateList: [
          {
            componentName: '逾期罚息利率',
            startDate: '2024-01-20',
            endDate: '2025-01-20',
            floatBase: '基准利率',
            floatType: '上浮',
            floatRange: '50%',
            penaltyRate: '6.525%'
          }
        ],
        // 费用信息
        feeList: [
          {
            feeType: '手续费',
            feeRate: '0.5',
            feeAmount: 100.00,
            feeDescription: '手续费一次性收取',
            startDate: '2024-01-20',
            endDate: '2025-01-20',
            paymentMethod: '银行转账',
            paymentStatus: '已支付',
            paymentTime: '2024-01-20 14:30:00',
            paymentAmount: 100.00,
            paymentAccount: '6222021234567890456',
            paymentVoucherNo: 'V20240120001',
            paymentRemark: '手续费已全额支付'
          }
        ],
        // 账户信息
        accountList: [
          {
            accountPurpose: '放款账号',
            accountIdentifier: 'LOAN001',
            accountType: '基本账户',
            accountCurrency: 'CNY',
            availableBalance: 20000.00,
            accountNo: '6222021234567890456',
            accountOrg: '中国工商银行',
            accountName: '槎猫'
          }
        ],
        // 操作信息
        createUser: '项備痔',
        createTime: '2024-01-10 09:00:00',
        updateUser: '项備痔',
        updateTime: '2024-01-20 10:30:00',
        approver: '审批人',
        approveTime: '2024-01-20 10:30:00',
        remark: '审批通过',
        // 基本信息表单字段
        customerName: '槎猫',
        applicationExposure: 20000.00,
        supplyChainIdentifier: '非供应链',
        term: '12月',
        creditProductPlan: '精英通',
        customerAcquisitionMethod: '自营',
        isCreditLineRevolving: '是',
        digitalEconomyIndustryLoan: '否',
        purpose: '消费',
        supportAgricultureCategory: '否',
        jingyintongCustomerSubCategory: 'A类',
        isGreenFinance: '否',
        marketingManagerDepartment: '业务一部',
        elderlyCareIndustryLoan: '否',
        onlineJingyintongIdentifier: '否',
        jingyintongCustomerClassification: 'A类',
        merchantEntryType: 'P-人工跟进',
        marketingManagerName: '项備痔',
        incomeType: '经营收入',
        specialProjectCode: 'SP001'
      }
    }
    
    detailData.value = mockData[id] || {}
    
    if (!detailData.value.id) {
      message.warning('未找到该申请信息！')
      handleBack()
      return
    }
    
    // 初始化罚息利率列表
    penaltyRateList.value = detailData.value.penaltyRateList || []
    
    // 初始化费用列表
    feeList.value = detailData.value.feeList || []
    
    // 初始化账户列表
    accountList.value = detailData.value.accountList || []
    
    // 获取数据后，根据申请编号更新标题
    if (detailData.value.applicationNo) {
      updateTitle(detailData.value.applicationNo)
    }
  } catch (error) {
    console.error('获取详情失败：', error)
    message.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

/** 返回操作 */
const handleBack = () => {
  router.back()
}
</script>

