<template>
  <div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <!-- 利率类型 - 单选项 -->
      <el-form-item label="利率类型" prop="interestRateType" class="mb-20px">
        <el-radio-group v-model="formData.interestRateType" @change="handleInterestRateTypeChange">
          <el-radio label="固定LPR利率">固定LPR利率</el-radio>
          <el-radio label="贷款固定利率">贷款固定利率</el-radio>
          <el-radio label="贷款浮动利率">
            贷款浮动利率
            <span class="text-gray-400 ml-10px text-12px">
              (循环类业务执行利率以实际放款为准)
            </span>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row :gutter="20">
        <!-- 左列 -->
        <el-col :span="12">
          <el-form-item label="基准利率适用日期" prop="baseRateEffectiveDate">
            <el-date-picker
              v-model="formData.baseRateEffectiveDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="选择基准利率适用日期"
              class="w-1/1"
              :disabled-date="disabledFutureDate"
              @change="handleDateChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="利率模式" prop="interestRateMode">
            <el-select
              v-model="formData.interestRateMode"
              placeholder="请选择利率模式"
              class="w-1/1"
            >
              <el-option label="固定" value="固定" />
              <el-option label="浮动" value="浮动" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="利率类型" prop="rateType">
            <el-select
              v-model="formData.rateType"
              placeholder="请选择利率类型"
              class="w-1/1"
            >
              <el-option label="贷款利率" value="贷款利率" />
              <el-option label="存款利率" value="存款利率" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基准利率类型" prop="baseRateType">
            <el-select
              v-model="formData.baseRateType"
              placeholder="请选择基准利率类型"
              class="w-1/1"
            >
              <el-option label="LPR基准利率" value="LPR基准利率" />
              <el-option label="央行基准利率" value="央行基准利率" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="利率单位" prop="rateUnit">
            <el-select
              v-model="formData.rateUnit"
              placeholder="请选择利率单位"
              class="w-1/1"
            >
              <el-option label="年利率(百分比)" value="年利率(百分比)" />
              <el-option label="月利率(百分比)" value="月利率(百分比)" />
              <el-option label="日利率(百分比)" value="日利率(百分比)" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基准利率档次" prop="baseRateLevel">
            <el-select
              v-model="formData.baseRateLevel"
              placeholder="请选择基准利率档次"
              class="w-1/1"
            >
              <el-option label="1月" value="1月" />
              <el-option label="3月" value="3月" />
              <el-option label="6月" value="6月" />
              <el-option label="12月" value="12月" />
              <el-option label="999月" value="999月" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="基准利率" prop="baseRate">
            <el-input-number
              v-model="formData.baseRate"
              placeholder="请输入基准利率"
              :precision="6"
              :min="0"
              :max="100"
              class="w-1/1"
              @change="calculateExecuteRate"
            >
              <template #append>%</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="浮动利率类型" prop="floatRateType">
            <el-select
              v-model="formData.floatRateType"
              placeholder="请选择浮动利率类型"
              class="w-1/1"
            >
              <el-option label="浮动点" value="浮动点" />
              <el-option label="浮动比例" value="浮动比例" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="浮动幅度" prop="floatRange">
            <el-input-number
              v-model="formData.floatRange"
              placeholder="请输入浮动幅度"
              :precision="6"
              class="w-1/1"
              @change="calculateExecuteRate"
            >
              <template #append>
                <span class="text-12px text-gray-400">(保留小数点后六位)</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="执行利率" prop="executeRate">
            <el-input-number
              v-model="formData.executeRate"
              placeholder="执行利率"
              :precision="6"
              :min="0"
              :max="100"
              class="w-1/1"
            >
              <template #append>%</template>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'InterestRateInfo' })

const props = defineProps<{
  detailData: any
}>()

const formRef = ref()
const formData = ref<any>({
  interestRateType: '固定LPR利率', // 利率类型：固定LPR利率、贷款固定利率、贷款浮动利率
  baseRateEffectiveDate: '', // 基准利率适用日期
  interestRateMode: '固定', // 利率模式：固定、浮动
  rateType: '贷款利率', // 利率类型：贷款利率、存款利率
  baseRateType: 'LPR基准利率', // 基准利率类型：LPR基准利率、央行基准利率、其他
  rateUnit: '年利率(百分比)', // 利率单位：年利率(百分比)、月利率(百分比)、日利率(百分比)
  baseRateLevel: '999月', // 基准利率档次：1月、3月、6月、12月、999月
  baseRate: undefined, // 基准利率
  floatRateType: '浮动点', // 浮动利率类型：浮动点、浮动比例
  floatRange: undefined, // 浮动幅度
  executeRate: undefined // 执行利率
})

const message = useMessage()

// 禁用未来日期
const disabledFutureDate = (time: Date) => {
  const today = new Date()
  today.setHours(23, 59, 59, 999) // 设置为今天的最后一刻
  return time.getTime() > today.getTime()
}

// 日期变化时的校验
const handleDateChange = (value: string) => {
  if (value) {
    const selectedDate = new Date(value)
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    
    if (selectedDate.getTime() > today.getTime()) {
      message.warning('利率使用日期不能大于当前日期')
      formData.value.baseRateEffectiveDate = ''
      // 触发表单验证
      nextTick(() => {
        formRef.value?.validateField('baseRateEffectiveDate')
      })
    }
  }
}

// 自定义日期校验规则
const validateDate = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('基准利率适用日期不能为空'))
    return
  }
  
  const selectedDate = new Date(value)
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  
  if (selectedDate.getTime() > today.getTime()) {
    callback(new Error('利率使用日期不能大于当前日期'))
    return
  }
  
  callback()
}

// 表单校验规则
const formRules = reactive({
  interestRateType: [{ required: true, message: '利率类型不能为空', trigger: 'change' }],
  baseRateEffectiveDate: [
    { required: true, validator: validateDate, trigger: 'change' }
  ],
  baseRateLevel: [{ required: true, message: '基准利率档次不能为空', trigger: 'change' }],
  baseRate: [{ required: false, message: '基准利率不能为空', trigger: 'blur' }],
  floatRange: [{ required: false, message: '浮动幅度不能为空', trigger: 'blur' }],
  executeRate: [{ required: false, message: '执行利率不能为空', trigger: 'blur' }]
})

// 利率类型变化时的处理
const handleInterestRateTypeChange = (value: string) => {
  // 根据利率类型设置默认值或禁用某些字段
  if (value === '固定LPR利率') {
    formData.value.interestRateMode = '固定'
    formData.value.baseRateType = 'LPR基准利率'
  } else if (value === '贷款固定利率') {
    formData.value.interestRateMode = '固定'
  } else if (value === '贷款浮动利率') {
    formData.value.interestRateMode = '浮动'
  }
}

// 计算执行利率
const calculateExecuteRate = () => {
  if (formData.value.baseRate != null && formData.value.floatRange != null) {
    // 根据浮动利率类型计算执行利率
    if (formData.value.floatRateType === '浮动点') {
      // 浮动点：基准利率 + 浮动幅度
      formData.value.executeRate = Number((formData.value.baseRate + formData.value.floatRange).toFixed(6))
    } else if (formData.value.floatRateType === '浮动比例') {
      // 浮动比例：基准利率 * (1 + 浮动幅度/100)
      formData.value.executeRate = Number((formData.value.baseRate * (1 + formData.value.floatRange / 100)).toFixed(6))
    }
  }
}

// 初始化表单数据
onMounted(() => {
  if (props.detailData) {
    // 如果 detailData 中有数据，填充到表单
    formData.value = {
      interestRateType: props.detailData.interestRateType || '固定LPR利率',
      baseRateEffectiveDate: props.detailData.baseRateEffectiveDate || '',
      interestRateMode: props.detailData.interestRateMode || '固定',
      rateType: props.detailData.rateType || '贷款利率',
      baseRateType: props.detailData.baseRateType || 'LPR基准利率',
      rateUnit: props.detailData.rateUnit || '年利率(百分比)',
      baseRateLevel: props.detailData.baseRateLevel || '999月',
      baseRate: props.detailData.baseRate ? parseFloat(props.detailData.baseRate) : undefined,
      floatRateType: props.detailData.floatRateType || '浮动点',
      floatRange: props.detailData.floatRange ? parseFloat(props.detailData.floatRange) : undefined,
      executeRate: props.detailData.executeRate ? parseFloat(props.detailData.executeRate) : undefined
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

