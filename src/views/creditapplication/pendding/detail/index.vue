<template>
  <ContentWrap v-loading="loading">
    <!-- 操作按钮 - 头部 -->
    <div class="flex justify-end gap-10px mb-20px">
      <el-button @click="handleBack">返 回</el-button>
      <el-button tpye="" :loading="saving" @click="handleSave">
        <Icon icon="ep:check" class="mr-5px" />
        保 存
      </el-button>
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
import BasicInfo from './components/BasicInfo.vue'
import BusinessRequirement from './components/BusinessRequirement.vue'
import InterestRateInfo from './components/InterestRateInfo.vue'
import RepaymentInfo from './components/RepaymentInfo.vue'
import PenaltyRateInfo from './components/PenaltyRateInfo.vue'
import FeeInfo from './components/FeeInfo.vue'
import AccountInfo from './components/AccountInfo.vue'
import OperationInfo from './components/OperationInfo.vue'
import { applicationPenddingApi } from '@/api/creditapplication'

defineOptions({ name: 'CreditApplicationPenddingDetail' })

const message = useMessage()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsViewStoreWithOut()

// 设置页签标题
const updateTitle = (applicationNo?: string) => {
  if (applicationNo) {
    const title = `待处理(${applicationNo})-详情`
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
const saving = ref(false)
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
     const data = await applicationPenddingApi.getApplicationPenddingDetail({serialNo:id})
     console.log('dadada',data);
     
     detailData.value = data
    
    // 模拟数据 - 根据ID从模拟数据中查找
    // const mockData: Record<string, any> = {
    //   '1': {
    //     id: 1,
    //     applicationNo: 'APP202401001',
    //     applicantName: '北京科技有限公司',
    //     customerType: '公司客户',
    //     customerNo: 'C001',
    //     merchantId: 'M001',
    //     businessType: '短期流动资金贷款',
    //     occurrenceType: '新增',
    //     processType: '标准流程',
    //     currency: 'CNY',
    //     amount: 5000000.00,
    //     applyOrg: '北京分行',
    //     registerOrg: '北京分行',
    //     registerUser: '张三',
    //     registerDate: '2024-01-10',
    //     occurrenceDate: '2024-01-10',
    //     currentProcess: '初审',
    //     currentStage: '资料审核',
    //     completeTime: '2024-01-15 10:30:00',
    //     projectName: '企业流动资金支持项目',
    //     // 业务要求和条件
    //     businessPurpose: '补充流动资金',
    //     businessTerm: '12个月',
    //     guaranteeType: '保证担保',
    //     repaymentMethod: '等额本息',
    //     loanCondition: '提供担保函',
    //     otherRequirement: '无',
    //     // 利率信息
    //     interestRateType: '浮动利率',
    //     baseRate: '4.35%',
    //     floatRatio: '+0.5%',
    //     executeRate: '4.85%',
    //     rateAdjustMethod: '按季调整',
    //     rateAdjustPeriod: '3个月',
    //     rateEffectiveDate: '2024-01-15',
    //     rateExpireDate: '2025-01-15',
    //     // 还款信息
    //     repaymentPeriod: '按月',
    //     repaymentDay: '15日',
    //     firstRepaymentDate: '2024-02-15',
    //     lastRepaymentDate: '2025-01-15',
    //     repaymentPeriods: '12期',
    //     periodRepaymentAmount: 437500.00,
    //     repaymentAccount: '6222021234567890123',
    //     repaymentAccountName: '北京科技有限公司',
    //     repaymentAccountBank: '中国工商银行北京分行',
    //     // 罚息利率信息
    //     penaltyRateList: [
    //       {
    //         componentName: '逾期罚息利率',
    //         startDate: '2024-01-15',
    //         endDate: '2025-01-15',
    //         floatBase: '基准利率',
    //         floatType: '上浮',
    //         floatRange: '50%',
    //         penaltyRate: '6.525%'
    //       },
    //       {
    //         componentName: '挪用罚息利率',
    //         startDate: '2024-01-15',
    //         endDate: '2025-01-15',
    //         floatBase: '基准利率',
    //         floatType: '上浮',
    //         floatRange: '100%',
    //         penaltyRate: '7.275%'
    //       }
    //     ],
    //     // 费用信息
    //     feeList: [
    //       {
    //         feeType: '手续费',
    //         feeRate: '0.5',
    //         feeAmount: 25000.00,
    //         feeDescription: '手续费一次性收取',
    //         startDate: '2024-01-15',
    //         endDate: '2025-01-15',
    //         paymentMethod: '银行转账',
    //         paymentStatus: '已支付',
    //         paymentTime: '2024-01-15 14:30:00',
    //         paymentAmount: 25000.00,
    //         paymentAccount: '6222021234567890456',
    //         paymentVoucherNo: 'V20240115001',
    //         paymentRemark: '手续费已全额支付'
    //       },
    //       {
    //         feeType: '管理费',
    //         feeRate: '0.2',
    //         feeAmount: 10000.00,
    //         feeDescription: '管理费一次性收取',
    //         startDate: '2024-01-15',
    //         endDate: '2025-01-15',
    //         paymentMethod: '银行转账',
    //         paymentStatus: '已支付',
    //         paymentTime: '2024-01-15 14:35:00',
    //         paymentAmount: 10000.00,
    //         paymentAccount: '6222021234567890456',
    //         paymentVoucherNo: 'V20240115002',
    //         paymentRemark: '管理费已全额支付'
    //       },
    //       {
    //         feeType: '其他费用',
    //         feeRate: '0',
    //         feeAmount: 5000.00,
    //         feeDescription: '其他费用',
    //         startDate: '2024-01-15',
    //         endDate: '2025-01-15',
    //         paymentMethod: '现金',
    //         paymentStatus: '未支付',
    //         paymentTime: '',
    //         paymentAmount: 0,
    //         paymentAccount: '',
    //         paymentVoucherNo: '',
    //         paymentRemark: ''
    //       }
    //     ],
    //     // 账户信息
    //     accountList: [
    //       {
    //         accountPurpose: '放款账号',
    //         accountIdentifier: 'LOAN001',
    //         accountType: '基本账户',
    //         accountCurrency: 'CNY',
    //         availableBalance: 10000000.00,
    //         accountNo: '6222021234567890456',
    //         accountOrg: '中国工商银行北京分行',
    //         accountName: '北京科技有限公司'
    //       },
    //       {
    //         accountPurpose: '还款账号',
    //         accountIdentifier: 'REPAY001',
    //         accountType: '一般账户',
    //         accountCurrency: 'CNY',
    //         availableBalance: 5000000.00,
    //         accountNo: '6222021234567890123',
    //         accountOrg: '中国工商银行北京分行',
    //         accountName: '北京科技有限公司'
    //       },
    //       {
    //         accountPurpose: '其他账号',
    //         accountIdentifier: 'OTHER001',
    //         accountType: '专用账户',
    //         accountCurrency: 'CNY',
    //         availableBalance: 2000000.00,
    //         accountNo: '6222021234567890789',
    //         accountOrg: '中国工商银行北京分行',
    //         accountName: '北京科技有限公司'
    //       }
    //     ],
    //     // 操作信息
    //     createUser: '张三',
    //     createTime: '2024-01-10 09:00:00',
    //     updateUser: '李四',
    //     updateTime: '2024-01-12 14:30:00',
    //     approver: '王五',
    //     approveTime: '2024-01-15 10:30:00',
    //     remark: '审批通过'
    //   },
    //   '2': {
    //     id: 2,
    //     applicationNo: 'APP202401002',
    //     applicantName: '上海贸易有限公司',
    //     customerType: '公司客户',
    //     customerNo: 'C002',
    //     merchantId: 'M002',
    //     businessType: '基本建设贷款',
    //     occurrenceType: '借新还旧',
    //     processType: '快速流程',
    //     currency: 'CNY',
    //     amount: 8000000.00,
    //     applyOrg: '上海分行',
    //     registerOrg: '上海分行',
    //     registerUser: '李四',
    //     registerDate: '2024-01-11',
    //     occurrenceDate: '2024-01-11',
    //     currentProcess: '复审',
    //     currentStage: '风险评估',
    //     completeTime: '2024-01-16 14:20:00',
    //     projectName: '新厂房建设融资项目',
    //     // 业务要求和条件
    //     businessPurpose: '新厂房建设',
    //     businessTerm: '24个月',
    //     guaranteeType: '抵押担保',
    //     repaymentMethod: '等额本金',
    //     loanCondition: '提供抵押物',
    //     otherRequirement: '需要提供建设进度报告',
    //     // 利率信息
    //     interestRateType: '固定利率',
    //     baseRate: '4.75%',
    //     floatRatio: '0%',
    //     executeRate: '4.75%',
    //     rateAdjustMethod: '不调整',
    //     rateAdjustPeriod: '-',
    //     rateEffectiveDate: '2024-01-16',
    //     rateExpireDate: '2026-01-16',
    //     // 还款信息
    //     repaymentPeriod: '按月',
    //     repaymentDay: '20日',
    //     firstRepaymentDate: '2024-02-20',
    //     lastRepaymentDate: '2026-01-20',
    //     repaymentPeriods: '24期',
    //     periodRepaymentAmount: 366666.67,
    //     repaymentAccount: '6222021234567890234',
    //     repaymentAccountName: '上海贸易有限公司',
    //     repaymentAccountBank: '中国建设银行上海分行',
    //     // 罚息利率信息
    //     penaltyRateList: [
    //       {
    //         componentName: '逾期罚息利率',
    //         startDate: '2024-01-16',
    //         endDate: '2026-01-16',
    //         floatBase: '基准利率',
    //         floatType: '上浮',
    //         floatRange: '50%',
    //         penaltyRate: '7.125%'
    //       },
    //       {
    //         componentName: '挪用罚息利率',
    //         startDate: '2024-01-16',
    //         endDate: '2026-01-16',
    //         floatBase: '基准利率',
    //         floatType: '上浮',
    //         floatRange: '80%',
    //         penaltyRate: '8.55%'
    //       }
    //     ],
    //     // 费用信息
    //     feeList: [
    //       {
    //         feeType: '手续费',
    //         feeRate: '0.6',
    //         feeAmount: 48000.00,
    //         feeDescription: '手续费一次性收取',
    //         startDate: '2024-01-16',
    //         endDate: '2026-01-16',
    //         paymentMethod: '银行转账',
    //         paymentStatus: '已支付',
    //         paymentTime: '2024-01-16 10:20:00',
    //         paymentAmount: 48000.00,
    //         paymentAccount: '6222021234567890567',
    //         paymentVoucherNo: 'V20240116001',
    //         paymentRemark: '手续费已全额支付'
    //       },
    //       {
    //         feeType: '管理费',
    //         feeRate: '0.3',
    //         feeAmount: 24000.00,
    //         feeDescription: '管理费一次性收取',
    //         startDate: '2024-01-16',
    //         endDate: '2026-01-16',
    //         paymentMethod: '支票',
    //         paymentStatus: '部分支付',
    //         paymentTime: '2024-01-16 11:00:00',
    //         paymentAmount: 12000.00,
    //         paymentAccount: '6222021234567890567',
    //         paymentVoucherNo: 'V20240116002',
    //         paymentRemark: '管理费部分支付，剩余12000元待支付'
    //       },
    //       {
    //         feeType: '其他费用',
    //         feeRate: '0',
    //         feeAmount: 10000.00,
    //         feeDescription: '其他费用',
    //         startDate: '2024-01-16',
    //         endDate: '2026-01-16',
    //         paymentMethod: '',
    //         paymentStatus: '未支付',
    //         paymentTime: '',
    //         paymentAmount: 0,
    //         paymentAccount: '',
    //         paymentVoucherNo: '',
    //         paymentRemark: ''
    //       }
    //     ],
    //     // 账户信息
    //     accountList: [
    //       {
    //         accountPurpose: '放款账号',
    //         accountIdentifier: 'LOAN002',
    //         accountType: '基本账户',
    //         accountCurrency: 'CNY',
    //         availableBalance: 15000000.00,
    //         accountNo: '6222021234567890567',
    //         accountOrg: '中国建设银行上海分行',
    //         accountName: '上海贸易有限公司'
    //       },
    //       {
    //         accountPurpose: '还款账号',
    //         accountIdentifier: 'REPAY002',
    //         accountType: '一般账户',
    //         accountCurrency: 'CNY',
    //         availableBalance: 8000000.00,
    //         accountNo: '6222021234567890234',
    //         accountOrg: '中国建设银行上海分行',
    //         accountName: '上海贸易有限公司'
    //       }
    //     ],
    //     // 操作信息
    //     createUser: '李四',
    //     createTime: '2024-01-11 10:00:00',
    //     updateUser: '王五',
    //     updateTime: '2024-01-14 16:00:00',
    //     approver: '赵六',
    //     approveTime: '2024-01-16 14:20:00',
    //     remark: '风险评估通过'
    //   },
    //   '3': {
    //     id: 3,
    //     applicationNo: 'APP202401003',
    //     applicantName: '深圳创新科技有限公司',
    //     merchantId: 'M003',
    //     businessType: '信用证',
    //     occurrenceType: '续作',
    //     processType: '标准流程',
    //     currency: 'USD',
    //     amount: 2000000.00,
    //     applyOrg: '深圳分行',
    //     currentProcess: '审批',
    //     currentStage: '额度审批',
    //     completeTime: '2024-01-17 09:15:00',
    //     projectName: '国际贸易融资项目'
    //   },
    //   '4': {
    //     id: 4,
    //     applicationNo: 'APP202401004',
    //     applicantName: '广州制造有限公司',
    //     merchantId: 'M004',
    //     businessType: '银行承兑汇票',
    //     occurrenceType: '展期',
    //     processType: '标准流程',
    //     currency: 'CNY',
    //     amount: 3000000.00,
    //     applyOrg: '广州分行',
    //     currentProcess: '放款',
    //     currentStage: '合同签署',
    //     completeTime: '2024-01-18 16:45:00',
    //     projectName: '设备采购融资项目'
    //   },
    //   '5': {
    //     id: 5,
    //     applicationNo: 'APP202401005',
    //     applicantName: '杭州电子商务有限公司',
    //     merchantId: 'M005',
    //     businessType: '保证担保',
    //     occurrenceType: '提额',
    //     processType: '快速流程',
    //     currency: 'CNY',
    //     amount: 6000000.00,
    //     applyOrg: '杭州分行',
    //     currentProcess: '初审',
    //     currentStage: '资料审核',
    //     completeTime: '2024-01-19 11:30:00',
    //     projectName: '电商平台运营资金项目'
    //   },
    //   '6': {
    //     id: 6,
    //     applicationNo: 'APP202401006',
    //     applicantName: '张三',
    //     merchantId: 'M006',
    //     businessType: '中期流动资金贷款',
    //     occurrenceType: '新增',
    //     processType: '标准流程',
    //     currency: 'CNY',
    //     amount: 500000.00,
    //     applyOrg: '北京分行',
    //     currentProcess: '复审',
    //     currentStage: '信用评估',
    //     completeTime: '2024-01-20 13:20:00',
    //     projectName: '个人创业资金支持项目'
    //   },
    //   '7': {
    //     id: 7,
    //     applicationNo: 'APP202401007',
    //     applicantName: '李四',
    //     merchantId: 'M007',
    //     businessType: '保理',
    //     occurrenceType: '复议',
    //     processType: '标准流程',
    //     currency: 'CNY',
    //     amount: 1200000.00,
    //     applyOrg: '上海分行',
    //     currentProcess: '审批',
    //     currentStage: '额度审批',
    //     completeTime: '2024-01-21 10:10:00',
    //     projectName: '应收账款融资项目'
    //   },
    //   '8': {
    //     id: 8,
    //     applicationNo: 'APP202401008',
    //     applicantName: '王五',
    //     merchantId: 'M008',
    //     businessType: '抵押担保',
    //     occurrenceType: '还旧借新-风险化解',
    //     processType: '快速流程',
    //     currency: 'CNY',
    //     amount: 2500000.00,
    //     applyOrg: '深圳分行',
    //     currentProcess: '放款',
    //     currentStage: '抵押登记',
    //     completeTime: '2024-01-22 15:30:00',
    //     projectName: '风险化解重组项目'
    //   }
    // }
    
    // detailData.value = mockData[id] || {}
    
    // if (!detailData.value.id) {
    //   message.warning('未找到该申请信息！')
    //   handleBack()
    //   return
    // }
    
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

/** 保存操作 */
const handleSave = async () => {
  try {
    // 验证基本信息表单
    if (basicInfoRef.value) {
      const basicValid = await basicInfoRef.value.validate().catch(() => false)
      if (!basicValid) {
        message.warning('请先完善基本信息表单')
        return
      }
    }

    // 验证业务要求和条件表单
    if (businessRequirementRef.value) {
      const businessValid = await businessRequirementRef.value.validate().catch(() => false)
      if (!businessValid) {
        message.warning('请先完善业务要求和条件表单')
        return
      }
    }

    // 验证利率信息表单
    if (interestRateInfoRef.value) {
      const interestValid = await interestRateInfoRef.value.validate().catch(() => false)
      if (!interestValid) {
        message.warning('请先完善利率信息表单')
        return
      }
    }

    // 收集所有模块的数据
    const saveData = {
      // 基本信息（来自表单）
      basicInfo: basicInfoRef.value?.formData || {},
      // 业务要求和条件（来自表单）
      businessRequirement: businessRequirementRef.value?.formData || {},
      // 利率信息（来自表单）
      interestRateInfo: interestRateInfoRef.value?.formData || {},
      // 还款信息
      repaymentInfo: {
        repaymentMethod: detailData.value.repaymentMethod,
        repaymentPeriod: detailData.value.repaymentPeriod,
        repaymentDay: detailData.value.repaymentDay,
        firstRepaymentDate: detailData.value.firstRepaymentDate,
        lastRepaymentDate: detailData.value.lastRepaymentDate,
        repaymentPeriods: detailData.value.repaymentPeriods,
        periodRepaymentAmount: detailData.value.periodRepaymentAmount,
        repaymentAccount: detailData.value.repaymentAccount,
        repaymentAccountName: detailData.value.repaymentAccountName,
        repaymentAccountBank: detailData.value.repaymentAccountBank
      },
      // 罚息利率信息（表格数据）
      penaltyRateList: penaltyRateList.value,
      // 费用信息（表格数据）
      feeList: feeList.value,
      // 账户信息（表格数据）
      accountList: accountList.value,
      // 操作信息
      operationInfo: {
        createUser: detailData.value.createUser,
        createTime: detailData.value.createTime,
        updateUser: detailData.value.updateUser,
        updateTime: detailData.value.updateTime,
        approver: detailData.value.approver,
        approveTime: detailData.value.approveTime,
        remark: detailData.value.remark
      },
      // 申请ID
      id: detailData.value.id
    }

    saving.value = true
    
    // TODO: 调用保存接口
    // await ApplicationPenddingApi.updateApplicationDetail(saveData)
    
    // 模拟接口调用
    console.log('保存数据：', saveData)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('保存成功')
    
    // 保存成功后，可以刷新数据或返回列表
    // await getDetailData()
  } catch (error) {
    console.error('保存失败：', error)
    message.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}
</script>

