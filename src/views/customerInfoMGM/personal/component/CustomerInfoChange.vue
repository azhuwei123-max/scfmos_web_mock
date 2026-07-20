<template>
  <Dialog
    :model-value="dialogVisible"
    @update:model-value="handleDialogVisibleChange"
    title="个人概况"
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-form
      ref="formRef"
      :model="formData"
      label-width="120px"
    >
      <el-form-item label="客户代码">
        <el-input
          v-model="formData.customerCode"
          disabled
        />
      </el-form-item>
      <el-form-item label="客户名称">
        <el-input
          v-model="formData.customerName"
          disabled
        />
      </el-form-item>
      <el-form-item label="客户名称(新)">
        <el-input
          v-model="formData.customerNameNew"
          placeholder="请输入新客户名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="客户类型">
        <el-select
          v-model="formData.customerType"
          placeholder="请选择客户类型"
          style="width: 100%"
        >
          <el-option label="自雇人士" value="自雇人士" />
          <el-option label="公司客户" value="公司客户" />
          <el-option label="个人客户" value="个人客户" />
        </el-select>
      </el-form-item>
      <el-form-item label="证件类型">
        <el-select
          v-model="formData.idType"
          placeholder="请选择证件类型"
          disabled
          style="width: 100%"
        >
          <el-option
            v-for="item in idTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="证件类型(新)">
        <el-select
          v-model="formData.idTypeNew"
          placeholder="请选择新证件类型"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in idTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="证件号码">
        <el-input
          v-model="formData.idNumber"
          disabled
        />
      </el-form-item>
      <el-form-item label="证件号码(新)">
        <el-input
          v-model="formData.idNumberNew"
          placeholder="请输入新证件号码"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="handleSave">
        保存
      </el-button>
      <el-button @click="handleCancel">返回</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, reactive, watch } from 'vue'
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'
import { idTypeOptions } from '../const/detail'

defineOptions({ name: 'CustomerInfoChange' })

interface Props {
  modelValue: boolean
  customerId?: string
  customerName?: string
  idType?: string
  idNumber?: string
}

const props = withDefaults(defineProps<Props>(), {
  customerId: '',
  customerName: '',
  idType: '',
  idNumber: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'save': [data: any]
  'cancel': []
}>()

const message = useMessage()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const saving = ref(false)

const formData = reactive({
  customerCode: '',
  customerName: '',
  customerNameNew: '',
  customerType: '',
  idType: '',
  idTypeNew: '',
  idNumber: '',
  idNumberNew: ''
})

// 监听 props 变化，初始化表单数据
watch(() => props.modelValue, (val) => {
  if (val) {
    // 对话框打开时，初始化表单数据
    formData.customerCode = props.customerId || ''
    formData.customerName = props.customerName || ''
    formData.customerNameNew = ''
    formData.customerType = '自雇人士' // 默认值
    formData.idType = props.idType || ''
    formData.idTypeNew = ''
    formData.idNumber = props.idNumber || ''
    formData.idNumberNew = ''
  }
}, { immediate: true })

// 对话框显示状态变化
const handleDialogVisibleChange = (val: boolean) => {
  dialogVisible.value = val
  if (!val) {
    emit('cancel')
  }
}

// 保存
const handleSave = async () => {
  try {
    await formRef.value?.validate()
    
    saving.value = true
    
    // 触发保存事件，传递表单数据
    emit('save', { ...formData })
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    message.success('客户信息变更保存成功')
    dialogVisible.value = false
  } catch (error: any) {
    if (error !== false) {
      console.error('客户信息变更保存失败：', error)
      message.error('保存失败，请检查表单数据')
    }
  } finally {
    saving.value = false
  }
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
}
</script>

