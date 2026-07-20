<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="140px"
  >
    <el-row :gutter="20">
      <!-- 左列 -->
      <el-col :span="12">
        <el-form-item label="客户名称" prop="customerName">
          <el-input
            v-model="formData.customerName"
            placeholder="请输入客户名称"
            :disabled="true"
          />
        </el-form-item>
      </el-col>
      <!-- 右列 -->
      <el-col :span="12">
        <el-form-item label="客户编号" prop="customerID">
          <el-input
            v-model="formData.customerID"
            placeholder="请输入客户编号"
            :disabled="true"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="发生日期" prop="occurDate">
          <el-date-picker
            v-model="formData.occurDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择发生日期"
            class="w-1/1"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="发生类型" prop="occurType">
          <el-select
            v-model="formData.occurType"
            placeholder="请选择发生类型"
            class="w-1/1"
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
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="业务品种" prop="businessTypeName">
          <el-select
            v-model="formData.businessTypeName"
            placeholder="请选择业务品种"
            class="w-1/1"
          >
            <el-option label="一般经营性贷款" value="一般经营性贷款" />
            <el-option label="短期流动资金贷款" value="短期流动资金贷款" />
            <el-option label="中期流动资金贷款" value="中期流动资金贷款" />
            <el-option label="精英通" value="精英通" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请敞口" prop="exposureSum" required>
          <el-input-number
            v-model="formData.exposureSum"
            placeholder="请输入申请敞口"
            :precision="2"
            :min="0"
            class="w-1/1"
          >
            <template #append>元</template>
          </el-input-number>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请金额" prop="businessSum" required>
          <el-input-number
            v-model="formData.businessSum"
            placeholder="请输入申请金额"
            :precision="2"
            :min="0"
            class="w-1/1"
          >
            <template #append>元</template>
          </el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="供应链标识" prop="gylFlag" required>
          <el-select
            v-model="formData.gylFlag"
            placeholder="请选择供应链标识"
            class="w-1/1"
          >
            <el-option label="非供应链" value="非供应链" />
            <el-option label="供应链" value="供应链" />
            <el-option label="纯供应链" value="纯供应链" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="供应链产品方案" prop="gylLoanProductCategory" required>
          <el-select
            v-model="formData.gylLoanProductCategory"
            placeholder="请选择供应链产品方案"
            class="w-1/1"
          >
            <el-option label="未来货权质押开证" value="未来货权质押开证" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="期限" prop="termMonth" required>
          <el-input
            v-model="formData.termMonth"
            placeholder="请输入期限，如：12月"
            class="w-1/1"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="业务币种" prop="businessCurrency">
          <el-select
            v-model="formData.businessCurrency"
            placeholder="请选择币种"
            class="w-1/1"
          >
            <el-option label="人民币" value="人民币" />
            <el-option label="USD" value="USD" />
            <el-option label="EUR" value="EUR" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="获客方式" prop="clientMode" required>
          <el-select
            v-model="formData.clientMode"
            placeholder="请选择获客方式"
            class="w-1/1"
          >
            <el-option label="自营" value="自营" />
            <el-option label="合作" value="合作" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="通路代码" prop="tlCode">
          <el-select
            v-model="formData.tlCode"
            placeholder="请选择通路代码"
            class="w-1/1"
          >
            <el-option label="DYT01-标准抵押" value="DYT01-标准抵押" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否绿色金融" prop="isGreenFinance">
          <el-select
            v-model="formData.isGreenFinance"
            placeholder="请选择是否绿色金融"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="人行绿色贷款" prop="rhGreenLoanName">
          <el-select
            v-model="formData.rhGreenLoanName"
            placeholder="请选择人行绿色贷款"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="利率类型" prop="loanRateTermID">
          <el-select
            v-model="formData.loanRateTermID"
            placeholder="请选择利率类型"
            class="w-1/1"
          >
            <el-option label="固定利率" value="固定利率" />
            <el-option label="浮动利率" value="浮动利率" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="还款方式" prop="rptTermID">
          <el-select
            v-model="formData.rptTermID"
            placeholder="请选择还款方式"
            class="w-1/1"
          >
            <el-option label="等额本息" value="等额本息" />
            <el-option label="等额本金" value="等额本金" />
            <el-option label="按月付息到期还本" value="按月付息到期还本" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="支付方式" prop="paymentMode">
          <el-select
            v-model="formData.paymentMode"
            placeholder="请选择支付方式"
            class="w-1/1"
          >
            <el-option label="自主支付" value="自主支付" />
            <el-option label="受托支付" value="受托支付" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="是否循环" prop="cycleFlag">
          <el-select
            v-model="formData.cycleFlag"
            placeholder="请选择是否循环"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="数字经济产业贷款" prop="digitalEconomyLoan">
          <el-select
            v-model="formData.digitalEconomyLoan"
            placeholder="请选择数字经济产业贷款"
            class="w-1/1"
          >
            <el-option label="数字经济产业贷款" value="数字经济产业贷款" />
            <el-option label="非数字经济产业贷款" value="非数字经济产业贷款" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="用途" prop="purpose1" required>
          <el-select
            v-model="formData.purpose1"
            placeholder="请选择用途"
            class="w-1/1"
          >
            <el-option label="消费" value="消费" />
            <el-option label="经营" value="经营" />
            <el-option label="经营资金周转" value="经营资金周转" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商户标识" prop="mrchFlg">
          <el-input
            v-model="formData.mrchFlg"
            placeholder="请输入商户标识"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="贷款投向" prop="directionName">
          <div class="flex items-center gap-10px">
            <el-input
              v-model="formData.directionName"
              placeholder="请输入贷款投向，如：A0111-稻谷种植"
              class="flex-1"
            />
            <el-button tpye="" link @click="handleDownloadIndustryClassification">
              行业分类说明下载
            </el-button>
          </div>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="备注(限100汉字)" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注(限100汉字)"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="支农分类" prop="farmingTypeName">
          <el-select
            v-model="formData.farmingTypeName"
            placeholder="请选择支农分类"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否进行无还本续贷" prop="isNonRepayment">
          <el-select
            v-model="formData.isNonRepayment"
            placeholder="请选择是否进行无还本续贷"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

  </el-form>
</template>

<script lang="ts" setup>
defineOptions({ name: 'BasicInfo' })

const message = useMessage()

const props = defineProps<{
  detailData: any
}>()

const formRef = ref()
const formData = ref<any>({
  customerName: '',
  customerID: '',
  occurDate: '',
  occurType: '',
  businessTypeName: '',
  businessCurrency: '人民币',
  businessSum: undefined,
  exposureSum: undefined,
  gylFlag: '',
  gylLoanProductCategory: '',
  termMonth: '',
  tlCode: '',
  cycleFlag: '',
  clientMode: '',
  isGreenFinance: '',
  rhGreenLoanName: '',
  digitalEconomyLoan: '',
  directionName: '',
  mrchFlg: '',
  farmingTypeName: '',
  strategicEmergingIndustryClassification: '',
  elderlyLoan: '',
  artificialNo: '',
  isNonRepayment: '',
  remark: '',
  loanRateTermID: '',
  rptTermID: '',
  paymentMode: '',
  graceDays: undefined,
  repriceFlag: '',
  postponePaymentFlag: '',
  graceflag: '',
  vouchTypeName: '',
  vouchFlag: '',
  firstInstalmentFlag: '',
  singlePayMonth: undefined,
  jytcustomerclassify: '',
  gjjPayMentBase: undefined,
  describel: '',
  pfopoliy: undefined,
  yearIncomeBeforeTax: undefined,
  equityRatio: undefined,
  monthlyFlow: undefined,
  sftitle: undefined,
  houseValue: undefined,
  licenseRegisterDate: '',
  carValueLevel: '',
  carEvaluatePrice: undefined,
  operateOrgName: '',
  operateUserName: '',
  inputOrgName: '',
  inputDate: '',
  updateDate: '',
  pigeonholeDate: ''
})

// 表单校验规则
const formRules = reactive({
  businessSum: [{ required: true, message: '申请金额不能为空', trigger: 'blur' }],
  exposureSum: [{ required: true, message: '申请敞口不能为空', trigger: 'blur' }],
  gylFlag: [{ required: true, message: '供应链标识不能为空', trigger: 'change' }],
  gylLoanProductCategory: [{ required: true, message: '供应链产品方案不能为空', trigger: 'change' }],
  termMonth: [{ required: true, message: '期限不能为空', trigger: 'blur' }],
  clientMode: [{ required: true, message: '获客方式不能为空', trigger: 'change' }],
  purpose1: [{ required: true, message: '用途不能为空', trigger: 'change' }]
})

// 下载行业分类说明
const handleDownloadIndustryClassification = () => {
  message.info('行业分类说明下载功能待实现')
  // TODO: 实现下载功能
  // window.open('/api/download/industry-classification', '_blank')
}

// 监听 props.detailData 的变化，当数据加载完成后更新表单
watch(
  () => props.detailData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      updateFormData(newData)
    }
  },
  { immediate: true, deep: true }
)

// 更新表单数据的函数
const updateFormData = (data: any) => {
  formData.value = {
    customerName: data.customerName || data.applicantName || '',
    customerID: data.customerID || data.customerNo || '',
    occurDate: data.occurDate || data.occurrenceDate || '',
    occurType: data.occurType || '',
    businessTypeName: data.businessTypeName || data.businessType || '',
    businessCurrency: data.businessCurrency || '人民币',
    businessSum: data.businessSum || data.amount || undefined,
    exposureSum: data.exposureSum || undefined,
    gylFlag: data.gylFlag || '',
    gylLoanProductCategory: data.gylLoanProductCategory || data.creditProductPlan || '',
    termMonth: data.termMonth || '',
    tlCode: data.tlCode || '',
    cycleFlag: data.cycleFlag || data.isCreditLineRevolving || '',
    clientMode: data.clientMode || '',
    isGreenFinance: data.isGreenFinance || '',
    rhGreenLoanName: data.rhGreenLoanName || '',
    digitalEconomyLoan: data.digitalEconomyLoan || '',
    purpose1: data.purpose1 || '',
    directionName: data.directionName || '',
    mrchFlg: data.mrchFlg || data.merchantId || '',
    farmingTypeName: data.farmingTypeName || '',
    strategicEmergingIndustryClassification: data.strategicEmergingIndustryClassification || '',
    elderlyLoan: data.elderlyLoan || data.elderlyCareIndustryLoan || '',
    artificialNo: data.artificialNo || data.textContractNumber || '',
    isNonRepayment: data.isNonRepayment || data.isPrincipalFreeRenewalLoan || '',
    remark: data.remark || '',
    loanRateTermID: data.loanRateTermID || '',
    rptTermID: data.rptTermID || '',
    paymentMode: data.paymentMode || '',
    graceDays: data.graceDays || undefined,
    repriceFlag: data.repriceFlag || '',
    postponePaymentFlag: data.postponePaymentFlag || '',
    graceflag: data.graceflag || '',
    vouchTypeName: data.vouchTypeName || '',
    vouchFlag: data.vouchFlag || '',
    firstInstalmentFlag: data.firstInstalmentFlag || '',
    singlePayMonth: data.singlePayMonth || undefined,
    jytcustomerclassify: data.jytcustomerclassify || '',
    gjjPayMentBase: data.gjjPayMentBase || undefined,
    describel: data.describel || '',
    pfopoliy: data.pfopoliy || undefined,
    yearIncomeBeforeTax: data.yearIncomeBeforeTax || undefined,
    equityRatio: data.equityRatio || undefined,
    monthlyFlow: data.monthlyFlow || undefined,
    sftitle: data.sftitle || undefined,
    houseValue: data.houseValue || undefined,
    licenseRegisterDate: data.licenseRegisterDate || '',
    carValueLevel: data.carValueLevel || '',
    carEvaluatePrice: data.carEvaluatePrice || undefined,
    operateOrgName: data.operateOrgName || '',
    operateUserName: data.operateUserName || '',
    inputOrgName: data.inputOrgName || data.registerOrg || '',
    inputDate: data.inputDate || data.registerDate || '',
    updateDate: data.updateDate || '',
    pigeonholeDate: data.pigeonholeDate || ''
  }
}

// 初始化表单数据（兼容旧代码）
onMounted(() => {
  if (props.detailData && Object.keys(props.detailData).length > 0) {
    updateFormData(props.detailData)
  }
})

// 暴露表单数据和验证方法给父组件
defineExpose({
  formData,
  formRef,
  validate: () => {
    return formRef.value?.validate()
  }
})
</script>

