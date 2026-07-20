<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-width="180px"
  >
    <el-row :gutter="20">
      <!-- 左列 -->
      <el-col :span="12">
        <el-form-item label="支付方式" prop="paymentMethod" required>
          <el-select
            v-model="formData.paymentMethod"
            placeholder="请选择支付方式"
            class="w-1/1"
          >
            <el-option label="自主支付" value="自主支付" />
            <el-option label="受托支付" value="受托支付" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电子渠道放还款控制" prop="electronicChannelControl" required>
          <el-select
            v-model="formData.electronicChannelControl"
            placeholder="请选择电子渠道放还款控制"
            class="w-1/1"
          >
            <el-option label="随借随还" value="随借随还" />
            <el-option label="按期还款" value="按期还款" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="分次自主支付提款" prop="stagedSelfPaymentWithdrawal">
          <el-select
            v-model="formData.stagedSelfPaymentWithdrawal"
            placeholder="请选择分次自主支付提款"
            class="w-1/1"
          >
            <el-option label="是" value="是" />
            <el-option label="否" value="否" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="电子渠道提款 (1年以上) 还款方式" prop="electronicChannelWithdrawalRepaymentMethod">
          <el-select
            v-model="formData.electronicChannelWithdrawalRepaymentMethod"
            placeholder="请选择电子渠道提款还款方式"
            class="w-1/1"
          >
            <el-option label="等额本息" value="等额本息" />
            <el-option label="等额本金" value="等额本金" />
            <el-option label="按月付息到期还本" value="按月付息到期还本" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="电子渠道提款模式" prop="electronicChannelWithdrawalMode" required>
          <el-select
            v-model="formData.electronicChannelWithdrawalMode"
            placeholder="请选择电子渠道提款模式"
            class="w-1/1"
          >
            <el-option label="非落地审核" value="非落地审核" />
            <el-option label="落地审核" value="落地审核" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="利率调整方式" prop="interestRateAdjustmentMethod" required>
          <el-select
            v-model="formData.interestRateAdjustmentMethod"
            placeholder="请选择利率调整方式"
            class="w-1/1"
          >
            <el-option label="不调整" value="不调整" />
            <el-option label="按季调整" value="按季调整" />
            <el-option label="按月调整" value="按月调整" />
            <el-option label="按年调整" value="按年调整" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="额度内单笔最长期限" prop="maxSingleTransactionTerm" required>
          <el-select
            v-model="formData.maxSingleTransactionTerm"
            placeholder="请选择额度内单笔最长期限"
            class="w-1/1"
          >
            <el-option label="3个月" value="3个月" />
            <el-option label="6个月" value="6个月" />
            <el-option label="12个月" value="12个月" />
            <el-option label="24个月" value="24个月" />
            <el-option label="36个月" value="36个月" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="利率调整周期" prop="interestRateAdjustmentCycle">
          <el-input
            v-model="formData.interestRateAdjustmentCycle"
            placeholder="请输入利率调整周期"
          />
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="首次调整日期" prop="firstAdjustmentDate">
          <el-date-picker
            v-model="formData.firstAdjustmentDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="选择首次调整日期"
            class="w-1/1"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="主要担保方式" prop="mainGuaranteeMethod" required>
          <el-select
            v-model="formData.mainGuaranteeMethod"
            placeholder="请选择主要担保方式"
            class="w-1/1"
          >
            <el-option label="信用" value="信用" />
            <el-option label="保证" value="保证" />
            <el-option label="抵押" value="抵押" />
            <el-option label="质押" value="质押" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="利率调整周期单位" prop="interestRateAdjustmentCycleUnit">
          <el-select
            v-model="formData.interestRateAdjustmentCycleUnit"
            placeholder="请选择利率调整周期单位"
            class="w-1/1"
            filterable
            allow-create
          >
            <el-option label="月" value="月" />
            <el-option label="季" value="季" />
            <el-option label="年" value="年" />
            <el-option label="日" value="日" />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
defineOptions({ name: 'BusinessRequirement' })

const props = defineProps<{
  detailData: any
}>()

const formRef = ref()
const formData = ref<any>({
  paymentMethod: '', // 支付方式
  stagedSelfPaymentWithdrawal: '', // 分次自主支付提款
  electronicChannelWithdrawalMode: '', // 电子渠道提款模式
  maxSingleTransactionTerm: '', // 额度内单笔最长期限
  firstAdjustmentDate: '', // 首次调整日期
  interestRateAdjustmentCycleUnit: '', // 利率调整周期单位
  mainGuaranteeMethod: '', // 主要担保方式
  electronicChannelControl: '', // 电子渠道放还款控制
  electronicChannelWithdrawalRepaymentMethod: '', // 电子渠道提款 (1年以上) 还款方式
  interestRateAdjustmentMethod: '', // 利率调整方式
  interestRateAdjustmentCycle: '' // 利率调整周期
})

// 表单校验规则
const formRules = reactive({
  paymentMethod: [{ required: true, message: '支付方式不能为空', trigger: 'change' }],
  electronicChannelControl: [{ required: true, message: '电子渠道放还款控制不能为空', trigger: 'change' }],
  electronicChannelWithdrawalMode: [{ required: true, message: '电子渠道提款模式不能为空', trigger: 'change' }],
  maxSingleTransactionTerm: [{ required: true, message: '额度内单笔最长期限不能为空', trigger: 'change' }],
  interestRateAdjustmentMethod: [{ required: true, message: '利率调整方式不能为空', trigger: 'change' }],
  mainGuaranteeMethod: [{ required: true, message: '主要担保方式不能为空', trigger: 'change' }]
})

// 初始化表单数据
onMounted(() => {
  if (props.detailData) {
    formData.value = {
      paymentMethod: props.detailData.paymentMethod || '',
      stagedSelfPaymentWithdrawal: props.detailData.stagedSelfPaymentWithdrawal || '',
      electronicChannelWithdrawalMode: props.detailData.electronicChannelWithdrawalMode || '',
      maxSingleTransactionTerm: props.detailData.maxSingleTransactionTerm || '',
      firstAdjustmentDate: props.detailData.firstAdjustmentDate || '',
      interestRateAdjustmentCycleUnit: props.detailData.interestRateAdjustmentCycleUnit || '',
      mainGuaranteeMethod: props.detailData.mainGuaranteeMethod || props.detailData.guaranteeType || '',
      electronicChannelControl: props.detailData.electronicChannelControl || '',
      electronicChannelWithdrawalRepaymentMethod: props.detailData.electronicChannelWithdrawalRepaymentMethod || '',
      interestRateAdjustmentMethod: props.detailData.interestRateAdjustmentMethod || '',
      interestRateAdjustmentCycle: props.detailData.interestRateAdjustmentCycle || ''
    }
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

