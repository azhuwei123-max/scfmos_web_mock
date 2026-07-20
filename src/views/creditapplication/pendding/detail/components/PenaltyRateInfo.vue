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
    <el-form ref="formRef" :model="{ penaltyRateList }">
      <el-table
        :data="penaltyRateList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="利率组件名称" min-width="150" prop="componentName" />
        <el-table-column label="开始时间" min-width="180" prop="startDate" />
        <el-table-column label="结束时间" min-width="180" prop="endDate" />
        <el-table-column label="浮动基础" min-width="120" prop="floatBase" />
        <el-table-column label="浮动类型" min-width="120" prop="floatType" />
        <el-table-column label="浮动幅度" min-width="120" prop="floatRange" />
        <el-table-column label="罚息利率" min-width="120" prop="penaltyRate" />
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
            <el-form-item label="利率组件名称" prop="componentName">
              <el-input
                v-model="formData.componentName"
                placeholder="请输入利率组件名称"
                :disabled="dialogTitle === '罚息利率详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浮动基础" prop="floatBase">
              <el-input
                v-model="formData.floatBase"
                placeholder="请输入浮动基础"
                :disabled="dialogTitle === '罚息利率详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="开始时间" prop="startDate">
              <el-date-picker
                v-model="formData.startDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择开始时间"
                class="w-1/1"
                :disabled="dialogTitle === '罚息利率详情'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="endDate">
              <el-date-picker
                v-model="formData.endDate"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="选择结束时间"
                class="w-1/1"
                :disabled="dialogTitle === '罚息利率详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="浮动类型" prop="floatType">
              <el-select
                v-model="formData.floatType"
                placeholder="请选择浮动类型"
                class="w-1/1"
                :disabled="dialogTitle === '罚息利率详情'"
              >
                <el-option label="上浮" value="上浮" />
                <el-option label="下浮" value="下浮" />
                <el-option label="固定" value="固定" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="浮动幅度" prop="floatRange">
              <el-input
                v-model="formData.floatRange"
                placeholder="请输入浮动幅度"
                :disabled="dialogTitle === '罚息利率详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="罚息利率" prop="penaltyRate">
              <el-input
                v-model="formData.penaltyRate"
                placeholder="请输入罚息利率"
                :disabled="dialogTitle === '罚息利率详情'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">
          {{ dialogTitle === '罚息利率详情' ? '关闭' : '取消' }}
        </el-button>
        <el-button v-if="dialogTitle === '新增罚息利率'" tpye="" @click="handleSave">
          确定
        </el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'PenaltyRateInfo' })

const props = defineProps<{
  penaltyRateList: any[]
}>()

const emit = defineEmits<{
  'update:penaltyRateList': [value: any[]]
}>()

const message = useMessage()
const formRef = ref()
const formDialogRef = ref()
const selectedRows = ref<any[]>([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增罚息利率')
const formData = ref<any>({})

// 表单校验规则
const formRules = reactive({
  componentName: [{ required: true, message: '利率组件名称不能为空', trigger: 'blur' }],
  startDate: [{ required: true, message: '开始时间不能为空', trigger: 'change' }],
  endDate: [{ required: true, message: '结束时间不能为空', trigger: 'change' }],
  floatBase: [{ required: true, message: '浮动基础不能为空', trigger: 'blur' }],
  floatType: [{ required: true, message: '浮动类型不能为空', trigger: 'change' }],
  floatRange: [{ required: true, message: '浮动幅度不能为空', trigger: 'blur' }],
  penaltyRate: [{ required: true, message: '罚息利率不能为空', trigger: 'blur' }]
})

// 表格选择变化
const handleSelectionChange = (selection: any[]) => {
  selectedRows.value = selection
}

// 新增
const handleAdd = () => {
  if (props.penaltyRateList.length > 0) {
    ElMessageBox.confirm('已经存在罚息利率，不能再增加，请确认！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch(() => {
      // 用户取消操作
    })
    return
  }
  
  openDialog()
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
  
  ElMessageBox.confirm('确定要删除选中的罚息利率信息吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const newList = [...props.penaltyRateList]
      selectedRows.value.forEach((row) => {
        const index = newList.findIndex((item) => item === row)
        if (index > -1) {
          newList.splice(index, 1)
        }
      })
      emit('update:penaltyRateList', newList)
      selectedRows.value = []
      message.success('删除成功')
    })
    .catch(() => {
      // 用户取消操作
    })
}

// 打开弹窗
const openDialog = (row?: any) => {
  if (row) {
    dialogTitle.value = '罚息利率详情'
    formData.value = { ...row }
  } else {
    dialogTitle.value = '新增罚息利率'
    formData.value = {
      componentName: '',
      startDate: '',
      endDate: '',
      floatBase: '',
      floatType: '',
      floatRange: '',
      penaltyRate: ''
    }
  }
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  if (!formDialogRef.value) return
  
  const valid = await formDialogRef.value.validate().catch(() => {})
  if (!valid) return
  
  if (dialogTitle.value === '新增罚息利率') {
    const newList = [...props.penaltyRateList, { ...formData.value }]
    emit('update:penaltyRateList', newList)
    message.success('新增成功')
  }
  
  dialogVisible.value = false
}
</script>

