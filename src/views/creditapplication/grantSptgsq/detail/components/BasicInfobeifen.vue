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
            <el-option label="精英通" value="精英通" />
            <el-option label="短期流动资金贷款" value="短期流动资金贷款" />
            <el-option label="中期流动资金贷款" value="中期流动资金贷款" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="业务币种" prop="businessCurrency">
          <el-select
            v-model="formData.businessCurrency"
            placeholder="请选择业务币种"
            class="w-1/1"
          >
            <el-option label="人民币" value="人民币" />
            <el-option label="USD" value="USD" />
            <el-option label="EUR" value="EUR" />
          </el-select>
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
        <el-form-item label="申请敞口" prop="exposureSum">
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
        <el-form-item label="供应链标识" prop="gylFlag" required>
          <el-select
            v-model="formData.gylFlag"
            placeholder="请选择供应链标识"
            class="w-1/1"
          >
            <el-option label="非供应链" value="非供应链" />
            <el-option label="供应链" value="供应链" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="期限" prop="termMonth" required>
          <el-select
            v-model="formData.termMonth"
            placeholder="请选择期限"
            class="w-1/1"
          >
            <el-option label="12月" value="12月" />
            <el-option label="24月" value="24月" />
            <el-option label="36月" value="36月" />
            <el-option label="48月" value="48月" />
            <el-option label="60月" value="60月" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="信贷产品方案" prop="loanProductCategory">
          <el-select
            v-model="formData.loanProductCategory"
            placeholder="请选择信贷产品方案"
            class="w-1/1"
          >
            <el-option label="精英通" value="精英通" />
            <el-option label="其他" value="其他" />
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
        <el-form-item label="是否额度循环" prop="cycleFlag">
          <el-select
            v-model="formData.cycleFlag"
            placeholder="请选择是否额度循环"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="数字经济产业贷款" prop="digitalEconomyIndustryLoan">
          <el-select
            v-model="formData.digitalEconomyIndustryLoan"
            placeholder="请选择数字经济产业贷款"
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
        <el-form-item label="用途" prop="purpose1" required>
          <el-select
            v-model="formData.purpose1"
            placeholder="请选择用途"
            class="w-1/1"
          >
            <el-option label="消费" value="消费" />
            <el-option label="经营" value="经营" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="商户标识" prop="merchantId">
          <el-input
            v-model="formData.merchantId"
            placeholder="请输入商户标识"
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
        <el-form-item label="精英通客户小类" prop="jingyintongCustomerSubCategory">
          <el-select
            v-model="formData.jingyintongCustomerSubCategory"
            placeholder="请选择精英通客户小类"
            class="w-1/1"
          >
            <el-option label="A类" value="A类" />
            <el-option label="B类" value="B类" />
            <el-option label="C类" value="C类" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="是否绿色金融" prop="isGreenFinance" required>
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
      <el-col :span="12">
        <el-form-item label="营销经理所属部门" prop="marketingManagerDepartment">
          <el-input
            v-model="formData.marketingManagerDepartment"
            placeholder="请输入营销经理所属部门"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="养老产业贷款" prop="elderlyCareIndustryLoan" required>
          <el-select
            v-model="formData.elderlyCareIndustryLoan"
            placeholder="请选择养老产业贷款"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="线上精英通标识" prop="onlineJingyintongIdentifier">
          <el-select
            v-model="formData.onlineJingyintongIdentifier"
            placeholder="请选择线上精英通标识"
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
        <el-form-item label="业务来源" prop="businessSource">
          <el-input
            v-model="formData.businessSource"
            placeholder="请输入业务来源"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="精英通客户分类" prop="jingyintongCustomerClassification">
          <el-select
            v-model="formData.jingyintongCustomerClassification"
            placeholder="请选择精英通客户分类"
            class="w-1/1"
          >
            <el-option label="A类" value="A类" />
            <el-option label="B类" value="B类" />
            <el-option label="C类" value="C类" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="商户进件类型" prop="merchantEntryType">
          <el-select
            v-model="formData.merchantEntryType"
            placeholder="请选择商户进件类型"
            class="w-1/1"
          >
            <el-option label="P-人工跟进" value="P-人工跟进" />
            <el-option label="A-自动审批" value="A-自动审批" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="营销经理姓名" prop="marketingManagerName">
          <el-input
            v-model="formData.marketingManagerName"
            placeholder="请输入营销经理姓名"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="收入类型" prop="incomeType" required>
          <el-select
            v-model="formData.incomeType"
            placeholder="请选择收入类型"
            class="w-1/1"
          >
            <el-option label="工资收入" value="工资收入" />
            <el-option label="经营收入" value="经营收入" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="专案代码" prop="tlCode">
          <el-input
            v-model="formData.tlCode"
            placeholder="请输入专案代码"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="4"
            placeholder="请输入备注(限1000汉字)"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
defineOptions({ name: 'BasicInfo' })

const props = defineProps<{
  detailData: any
}>()

const formRef = ref()
const formData = ref<any>({
  customerName: '',
  customerNo: '',
  occurrenceDate: '',
  occurrenceType: '',
  businessType: '',
  currency: '人民币',
  businessSum: undefined,
  exposureSum: undefined,
  gylFlag: '',
  termMonth: '',
  loanProductCategory: '',
  clientMode: '',
  cycleFlag: '',
  digitalEconomyIndustryLoan: '',
  purpose1: '',
  merchantId: '',
  farmingTypeName: '',
  jingyintongCustomerSubCategory: '',
  isGreenFinance: '',
  marketingManagerDepartment: '',
  elderlyCareIndustryLoan: '',
  onlineJingyintongIdentifier: '',
  businessSource: '',
  jingyintongCustomerClassification: '',
  merchantEntryType: '',
  marketingManagerName: '',
  incomeType: '',
  tlCode: '',
  remark: ''
})

// 表单校验规则
const formRules = reactive({
  businessSum: [{ required: true, message: '申请金额不能为空', trigger: 'blur' }],
  gylFlag: [{ required: true, message: '供应链标识不能为空', trigger: 'change' }],
  termMonth: [{ required: true, message: '期限不能为空', trigger: 'change' }],
  clientMode: [{ required: true, message: '获客方式不能为空', trigger: 'change' }],
  purpose1: [{ required: true, message: '用途不能为空', trigger: 'change' }],
  isGreenFinance: [{ required: true, message: '是否绿色金融不能为空', trigger: 'change' }],
  elderlyCareIndustryLoan: [{ required: true, message: '养老产业贷款不能为空', trigger: 'change' }],
  incomeType: [{ required: true, message: '收入类型不能为空', trigger: 'change' }]
})




const updataFormData = (data) => {
  formData.value = {
      customerName: props.detailData.customerName || data.customerName || '',
      customerNo: props.detailData.customerNo || '',
      occurrenceDate: props.detailData.occurrenceDate || '',
      occurrenceType: props.detailData.occurrenceType || '',
      businessType: props.detailData.businessType || '',
      currency: props.detailData.currency || '人民币',
      businessSum: props.detailData.businessSum || undefined,
      exposureSum: props.detailData.exposureSum || undefined,
      gylFlag: props.detailData.gylFlag || '',
      termMonth: props.detailData.termMonth || '',
      loanProductCategory: props.detailData.loanProductCategory || '',
      clientMode: props.detailData.clientMode || '',
      cycleFlag: props.detailData.cycleFlag || '',
      digitalEconomyIndustryLoan: props.detailData.digitalEconomyIndustryLoan || '',
      purpose1: props.detailData.purpose1 || '',
      merchantId: props.detailData.merchantId || '',
      farmingTypeName: props.detailData.farmingTypeName || '',
      jingyintongCustomerSubCategory: props.detailData.jingyintongCustomerSubCategory || '',
      isGreenFinance: props.detailData.isGreenFinance || '',
      marketingManagerDepartment: props.detailData.marketingManagerDepartment || '',
      elderlyCareIndustryLoan: props.detailData.elderlyCareIndustryLoan || '',
      onlineJingyintongIdentifier: props.detailData.onlineJingyintongIdentifier || '',
      businessSource: props.detailData.businessSource || '',
      jingyintongCustomerClassification: props.detailData.jingyintongCustomerClassification || '',
      merchantEntryType: props.detailData.merchantEntryType || '',
      marketingManagerName: props.detailData.marketingManagerName || '',
      incomeType: props.detailData.incomeType || '',
      tlCode: props.detailData.tlCode || '',
      remark: props.detailData.remark || ''
    }
}

watch(
  ()=> props.detailData,
  (newData)=> {
    if(newData && Object.keys(newData).length> 0) {
      updataFormData(newData)
    }
  },
  {
    immediate:true,deep:true
  }
)

// 初始化表单数据
onMounted(() => {
  console.log('proasdas',props,props.detailData.value );
  
  if (props.detailData && Object.keys(props.detailData).length> 0) {
     console.log('proasdas222',props,props.detailData.value );
  
    updataFormData(props.detailData)
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

