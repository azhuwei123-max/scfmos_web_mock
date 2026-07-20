<template>
  <Dialog
    v-model="visible"
    title="修改状态"
    :fullscreen="false"
    :append-to-body="true"
    width="800px"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item label="选择处理状态" props="status">
        <el-select
          v-model="formData.status"
          placeholder="请选择处理状态"
          style="width: 100%"
        >
          <el-option
            v-for="item in buyStatusOptions"
            :key="item.itemNo"
            :label="item.itemName"
            :value="item.itemNo"
          />
        </el-select>
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
import { ElMessage } from 'element-plus'
import { useOldDictStore } from '@/store/modules/oldDict'

const visible = ref()

const formData = reactive({})

const formRules = {
  status: [{ required: true, message: '处理状态 必录', trigger: 'change' }]
}

const { getDictFetch } = useOldDictStore()

const initFetch = () => {
  getDictFetch('BuyStatus').then((res) => {
    buyStatusOptions.value = res['BuyStatus']
  })
}
initFetch()

const buyStatusOptions = ref([])

const open = (row) => {
  formData.serialno = row.serialno
  formData.status = row.buystatus

  visible.value = true
}

const emit = defineEmits(['confirm'])

const btnLoading = ref()
const formRef = ref()
const confirm = async () => {
  const valid = await formRef.value.validate()
  if (!valid) return

  btnLoading.value = true
  Api.modifyStatus({
    serialno: formData.serialno,
    status: formData.status
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
