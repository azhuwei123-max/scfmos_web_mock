<template>
  <div>
    <!-- 操作按钮 -->
    <div class="flex justify-start gap-10px mb-15px">
      <el-button tpye="" @click="handleAdd">
        <Icon icon="ep:plus" class="mr-5px" />
        新增
      </el-button>
      <el-button @click="handleDetail">
        <Icon icon="ep:view" class="mr-5px" />
        详情
      </el-button>
      <el-button type="" @click="handleDelete">
        <Icon icon="ep:delete" class="mr-5px" />
        删除
      </el-button>
    </div>
    <el-form ref="formRef" :model="{ feeList }">
      <el-table
        :data="feeList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="费用类型" min-width="150" prop="feeType" />
        <el-table-column label="费用率" min-width="120" prop="feeRate" />
        <el-table-column label="费用金额" min-width="150" prop="feeAmount">
          <template #default="{ row }">
            <span v-if="row.feeAmount">{{ formatAmount(row.feeAmount) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="费用说明" min-width="200" prop="feeDescription" show-overflow-tooltip />
        <el-table-column label="开始时间" min-width="180" prop="startDate" />
        <el-table-column label="结束时间" min-width="180" prop="endDate" />
      </el-table>
    </el-form>

    <!-- 费用类型选择弹窗 -->
    <Dialog 
      :model-value="feeTypeDialogVisible" 
      @update:model-value="feeTypeDialogVisible = $event"
      title="选择费用类型" 
      :fullscreen="false"
      :append-to-body="true"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="费用类型">
          <el-select
            v-model="selectedFeeType"
            placeholder="请选择费用类型"
            class="w-1/1"
          >
            <el-option label="手续费" value="手续费" />
            <el-option label="管理费" value="管理费" />
            <el-option label="其他费用" value="其他费用" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button tpye="" @click="handleConfirmFeeType">确定</el-button>
        <el-button @click="feeTypeDialogVisible = false">取消</el-button>
      </template>
    </Dialog>

    <!-- 弹窗 -->
    <Dialog 
      :model-value="dialogVisible" 
      @update:model-value="dialogVisible = $event"
      :title="dialogTitle" 
      :fullscreen="false"
      :append-to-body="true"
      width="900px"
    >
      <el-form
        ref="formDialogRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="费用类型" prop="feeType">
              <el-select
                v-model="formData.feeType"
                placeholder="请选择费用类型"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              >
                <el-option label="手续费" value="手续费" />
                <el-option label="管理费" value="管理费" />
                <el-option label="其他费用" value="其他费用" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="费用率" prop="feeRate">
              <el-input
                v-model="formData.feeRate"
                placeholder="请输入费用率"
                :disabled="dialogTitle === '费用详情'"
              >
                <template #append>%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="费用金额" prop="feeAmount">
              <el-input-number
                v-model="formData.feeAmount"
                placeholder="请输入费用金额"
                :precision="2"
                :min="0"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择开始时间"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择结束时间"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="费用说明" prop="feeDescription">
              <el-input
                v-model="formData.feeDescription"
                type="textarea"
                :rows="2"
                placeholder="请输入费用说明"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <!-- 支付信息模块 -->
        <el-divider content-position="left">支付信息</el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select
                v-model="formData.paymentMethod"
                placeholder="请选择支付方式"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              >
                <el-option label="银行转账" value="银行转账" />
                <el-option label="现金" value="现金" />
                <el-option label="支票" value="支票" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付状态" prop="paymentStatus">
              <el-select
                v-model="formData.paymentStatus"
                placeholder="请选择支付状态"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              >
                <el-option label="未支付" value="未支付" />
                <el-option label="已支付" value="已支付" />
                <el-option label="部分支付" value="部分支付" />
                <el-option label="已退款" value="已退款" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付时间" prop="paymentTime">
              <el-date-picker
                v-model="formData.paymentTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择支付时间"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input-number
                v-model="formData.paymentAmount"
                placeholder="请输入支付金额"
                :precision="2"
                :min="0"
                class="w-1/1"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="支付账户" prop="paymentAccount">
              <el-input
                v-model="formData.paymentAccount"
                placeholder="请输入支付账户"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="支付凭证号" prop="paymentVoucherNo">
              <el-input
                v-model="formData.paymentVoucherNo"
                placeholder="请输入支付凭证号"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="支付备注" prop="paymentRemark">
              <el-input
                v-model="formData.paymentRemark"
                type="textarea"
                :rows="2"
                placeholder="请输入支付备注"
                :disabled="dialogTitle === '费用详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ dialogTitle === '费用详情' ? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="dialogTitle === '新增费用'" tpye="" @click="handleSave">
          确定
        </el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'FeeInfo' })

const props = defineProps<{
  feeList: any[]
}>()

const emit = defineEmits<{
  'update:feeList': [value: any[]]
}>()

const message = useMessage()
const formRef = ref()
const formDialogRef = ref()
const selectedRows = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增费用')
const formData = ref<any>({})
const feeTypeDialogVisible = ref(false)
const selectedFeeType = ref('')

// 表单校验规则
const formRules = reactive({
  feeType: [{ required: true, message: '费用类型不能为空', trigger: 'change' }],
  feeRate: [{ required: true, message: '费用率不能为空', trigger: 'blur' }],
  feeAmount: [{ required: true, message: '费用金额不能为空', trigger: 'blur' }],
  feeDescription: [{ required: false, message: '费用说明不能为空', trigger: 'blur' }],
  startDate: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
  endDate: [{ required: true, message: '结束时间不能为空', trigger: 'change' }],
  paymentMethod: [{ required: false, message: '支付方式不能为空', trigger: 'change' }],
  paymentStatus: [{ required: false, message: '支付状态不能为空', trigger: 'change' }],
  paymentTime: [{ required: false, message: '支付时间不能为空', trigger: 'change' }],
  paymentAmount: [{ required: false, message: '支付金额不能为空', trigger: 'blur' }],
  paymentAccount: [{ required: false, message: '支付账户不能为空', trigger: 'blur' }],
  paymentVoucherNo: [{ required: false, message: '支付凭证号不能为空', trigger: 'blur' }],
  paymentRemark: [{ required: false, message: '支付备注不能为空', trigger: 'blur' }]
})

// 格式化金额
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  // 先打开费用类型选择弹窗
  selectedFeeType.value = ''
  feeTypeDialogVisible.value = true
}

// 确认费用类型
const handleConfirmFeeType = () => {
  if (!selectedFeeType.value) {
    message.warning('请选择费用类型')
    return
  }
  
  // 检查是否已存在该类型的费用
  const exists = props.feeList.some(item => item.feeType === selectedFeeType.value)
  if (exists) {
    message.warning(`费用类型"${selectedFeeType.value}"已存在，不能重复添加`)
    feeTypeDialogVisible.value = false
    return
  }
  
  // 关闭类型选择弹窗，打开新增表单
  feeTypeDialogVisible.value = false
  openDialog(undefined, selectedFeeType.value)
}

// 详情
const handleDetail = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择一条信息')
    return
  }
  
  if (selectedRows.value.length > 1) {
    message.warning('只能选择一条信息')
    return
  }
  
  openDialog(selectedRows.value[0])
}

// 删除
const handleDelete = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择一条信息')
    return
  }
  
  ElMessageBox.confirm('确定要删除选中的费用信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const newList = [...props.feeList]
      selectedRows.value.forEach((row) => {
        const index = newList.findIndex((item) => item === row)
        if (index > -1) {
          newList.splice(index, 1)
        }
      })
      emit('update:feeList', newList)
      selectedRows.value = []
      message.success('删除成功')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 打开弹窗
const openDialog = (row?: any, feeType?: string) => {
  if (row) {
    dialogTitle.value = '费用详情'
    formData.value = { ...row }
  } else {
    dialogTitle.value = '新增费用'
    formData.value = {
      feeType: feeType || '',
      feeRate: '',
      feeAmount: undefined,
      feeDescription: '',
      startDate: '',
      endDate: '',
      // 支付信息
      paymentMethod: '',
      paymentStatus: '',
      paymentTime: '',
      paymentAmount: undefined,
      paymentAccount: '',
      paymentVoucherNo: '',
      paymentRemark: ''
    }
  }
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  if (!formDialogRef.value) return
  
  const valid = await formDialogRef.value.validate().catch(() => {})
  if (!valid) return
  
  if (dialogTitle.value === '新增费用') {
    const newList = [...props.feeList, { ...formData.value }]
    emit('update:feeList', newList)
    message.success('新增成功')
  }
  
  dialogVisible.value = false
}
</script>


