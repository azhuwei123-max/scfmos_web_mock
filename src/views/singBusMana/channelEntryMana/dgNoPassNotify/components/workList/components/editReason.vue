<template>
  <Dialog v-model="visible" title="填写" width="850px" top="5vh">
    <!-- <ContentWrap> -->
    <el-form
      ref="formRef"
      inline
      :model="formData"
      :rules="formRules"
      label-width="100"
      :validate-on-rule-change="false"
    >
      <el-form-item label="未通过原因" prop="unPassResult">
        <el-input
          class="!w-400px"
          type="textarea"
          :rows="5"
          :maxlength="500"
          show-word-limit
          v-model="formData.unPassResult"
          placeholder="请输入未通过原因"
          clearable
        />
      </el-form-item>
    </el-form>
    <!-- </ContentWrap> -->
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">保 存</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from '../api.js'
import dayjs from 'dayjs'
import { getDictOptions } from '@/utils/dict'

const visible = ref(false)

const formData = reactive({})
const formRules = reactive({
  unPassResult: [{ required: true, message: '未通过原因 必录', trigger: 'change' }],
})

const open = (row = {}) => {
  formData.objectNo = row.serialNo
  formData.unPassResult = row.unPassResult || ''
  visible.value = true
}

const emit = defineEmits(['confirm'])

const formRef = ref()
const saving = ref(false)
const confirm = async () => {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  Api.reason(formData)
    .then((res) => {
      ElMessage.success('保存成功')
      visible.value = false
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

defineExpose({
  open
})
</script>
