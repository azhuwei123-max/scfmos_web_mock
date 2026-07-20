<template>
  <div>
    <!-- 操作按钮 -->
    <div class="flex justify-start gap-10px mb-15px">
      <el-button tpye="" @click="handleAdd('放款账号')">
        <Icon icon="ep:plus" class="mr-5px" />
        新增放款账号
      </el-button>
      <el-button tpye="" @click="handleAdd('还款账号')">
        <Icon icon="ep:plus" class="mr-5px" />
        新增还款账号
      </el-button>
      <el-button tpye="" @click="handleAdd('其他账号')">
        <Icon icon="ep:plus" class="mr-5px" />
        新增其他账号
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
    <el-form ref="formRef" :model="{ accountList }">
      <el-table
        :data="accountList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="账户用途" min-width="120" prop="accountPurpose" />
        <el-table-column label="账户标识" min-width="120" prop="accountIdentifier" />
        <el-table-column label="账户类型" min-width="120" prop="accountType" />
        <el-table-column label="账户币种" min-width="100" prop="accountCurrency" />
        <el-table-column label="可用余额" min-width="150" prop="availableBalance">
          <template #default="{ row }">
            <span v-if="row.availableBalance">{{ formatAmount(row.availableBalance) }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" min-width="180" prop="accountNo" />
        <el-table-column label="账户机构" min-width="150" prop="accountOrg" />
        <el-table-column label="账户名称" min-width="200" prop="accountName" show-overflow-tooltip />
      </el-table>
    </el-form>

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
            <el-form-item label="账户用途" prop="accountPurpose">
              <el-select
                v-model="formData.accountPurpose"
                placeholder="请选择账户用途"
                class="w-1/1"
                :disabled="dialogTitle === '账户详情' || isFixedPurpose"
              >
                <el-option label="放款账号" value="放款账号" />
                <el-option label="还款账号" value="还款账号" />
                <el-option label="其他账号" value="其他账号" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户标识" prop="accountIdentifier">
              <el-input
                v-model="formData.accountIdentifier"
                placeholder="请输入账户标识"
                :disabled="dialogTitle === '账户详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户类型" prop="accountType">
              <el-select
                v-model="formData.accountType"
                placeholder="请选择账户类型"
                class="w-1/1"
                :disabled="dialogTitle === '账户详情'"
              >
                <el-option label="基本账户" value="基本账户" />
                <el-option label="一般账户" value="一般账户" />
                <el-option label="专用账户" value="专用账户" />
                <el-option label="临时账户" value="临时账户" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户币种" prop="accountCurrency">
              <el-select
                v-model="formData.accountCurrency"
                placeholder="请选择账户币种"
                class="w-1/1"
                :disabled="dialogTitle === '账户详情'"
              >
                <el-option label="CNY" value="CNY" />
                <el-option label="USD" value="USD" />
                <el-option label="EUR" value="EUR" />
                <el-option label="HKD" value="HKD" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="可用余额" prop="availableBalance">
              <el-input-number
                v-model="formData.availableBalance"
                placeholder="请输入可用余额"
                :precision="2"
                :min="0"
                class="w-1/1"
                :disabled="dialogTitle === '账户详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="accountNo">
              <el-input
                v-model="formData.accountNo"
                placeholder="请输入账号"
                :disabled="dialogTitle === '账户详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账户机构" prop="accountOrg">
              <el-input
                v-model="formData.accountOrg"
                placeholder="请输入账户机构"
                :disabled="dialogTitle === '账户详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户名称" prop="accountName">
              <el-input
                v-model="formData.accountName"
                placeholder="请输入账户名称"
                :disabled="dialogTitle === '账户详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button v-if="dialogTitle !== '账户详情'" tpye="" @click="handleSave">
          确定
        </el-button>
        <el-button @click="dialogVisible = false">
          {{ dialogTitle === '账户详情' ? '关闭' : '取消' }}
        </el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'AccountInfo' })

const props = defineProps<{
  accountList: any[]
}>()

const emit = defineEmits<{
  'update:accountList': [value: any[]]
}>()

const message = useMessage()
const formRef = ref()
const formDialogRef = ref()
const selectedRows = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增账户')
const formData = ref<any>({})
const isFixedPurpose = ref(false)

// 表单校验规则
const formRules = reactive({
  accountPurpose: [{ required: true, message: '账户用途不能为空', trigger: 'change' }],
  accountIdentifier: [{ required: true, message: '账户标识不能为空', trigger: 'blur' }],
  accountType: [{ required: true, message: '账户类型不能为空', trigger: 'change' }],
  accountCurrency: [{ required: true, message: '账户币种不能为空', trigger: 'change' }],
  availableBalance: [{ required: false, message: '可用余额不能为空', trigger: 'blur' }],
  accountNo: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
  accountOrg: [{ required: true, message: '账户机构不能为空', trigger: 'blur' }],
  accountName: [{ required: true, message: '账户名称不能为空', trigger: 'blur' }]
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
const handleAdd = (purpose: string) => {
  // 设置固定的账户用途
  isFixedPurpose.value = purpose !== '其他账号'
  openDialog(undefined, purpose)
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
  
  isFixedPurpose.value = false
  openDialog(selectedRows.value[0])
}

// 删除
const handleDelete = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择一条信息')
    return
  }
  
  ElMessageBox.confirm('确定要删除选中的账户信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const newList = [...props.accountList]
      selectedRows.value.forEach((row) => {
        const index = newList.findIndex((item) => item === row)
        if (index > -1) {
          newList.splice(index, 1)
        }
      })
      emit('update:accountList', newList)
      selectedRows.value = []
      message.success('删除成功')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 打开弹窗
const openDialog = (row?: any, purpose?: string) => {
  if (row) {
    dialogTitle.value = '账户详情'
    formData.value = { ...row }
  } else {
    dialogTitle.value = purpose === '其他账号' ? '新增其他账号' : `新增${purpose}`
    formData.value = {
      accountPurpose: purpose || '',
      accountIdentifier: '',
      accountType: '',
      accountCurrency: '',
      availableBalance: undefined,
      accountNo: '',
      accountOrg: '',
      accountName: ''
    }
  }
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  if (!formDialogRef.value) return
  
  const valid = await formDialogRef.value.validate().catch(() => {})
  if (!valid) return
  
  const newList = [...props.accountList, { ...formData.value }]
  emit('update:accountList', newList)
  message.success('新增成功')
  dialogVisible.value = false
}
</script>


