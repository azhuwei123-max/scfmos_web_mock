<template>
  <Dialog
    :model-value="visible"
    @update:model-value="handleDialogVisibleChange"
    title="进件拒绝"
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="流水号" props="serialno">
        <el-input v-model="formData.serialno" disabled />
      </el-form-item>
      <el-form-item label="拒绝原因" prop="refusereason">
        <el-input v-model="formData.refusereason" type="textarea" :maxlength="100" />
      </el-form-item>
    </el-form>

    <!-- 底部对话框操作按钮 -->
    <template #footer>
      <el-button tpye="" @click="confirm" :loading="btnLoading">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import * as Api from '../api.js'

const visible = ref()

const formData = reactive({})

const formRules = {
  serialno: [{ required: true, message: '流水号 必录', trigger: 'change' }],
  refusereason: [{ required: true, message: '拒绝原因 必录', trigger: 'change' }],
}

const open = (row) => {
  formData.serialno = row.serialno
  formData.refusereason = ''

  visible.value = true
}

const btnLoading = ref()
const formRef = ref()
const confirm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  btnLoading.value = true
  Api.applyProcess({
    objectType: 'ApplyRefuse',
    serialno: formData.serialno,
    refusereason: formData.refusereason
  })
    .then((res) => {
      ElMessage.success('操作成功')

      emit('confirm')
      visible.value = false
    })
    .finally(() => (btnLoading.value = false))
}

defineExpose({
  open
})
</script>