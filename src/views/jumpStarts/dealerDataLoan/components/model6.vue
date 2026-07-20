<template>
  <OcrRecognitionDialog v-bind="$attrs" ref="ocrRef" title="自雇人士新增" @confirm="handleOcrConfirm" @cancel="emit('toModel1')" />
</template>

<script setup>
import OcrRecognitionDialog from '@/components/OcrRecognitionDialog/index.vue'
import * as Api from './api.js'

const emit = defineEmits(['closeModel6', 'toModel6', 'toModel1'])
const ocrRef = ref()

const handleOcrConfirm = async (params) => {
  console.log(params)
  const data = {
    CustomerType: '0320',
    ...params
  }
  console.log('[ ocrRef.value ] >', ocrRef.value)
  try {
    ocrRef.value.saving = true
    const res = await Api.addCustomer(data).finally(()=> ocrRef.value.saving = false)
    if (res) {
      const info = res?.data

      ElMessageBox.confirm(info?.returnMsg || '新增成功', '提示', {
        confirmButtonText: '继续新增',
        cancelButtonText: '关闭',
        type: 'success'
      })
        .then((res) => {
          emit('toModel6')
        })
        .catch((e) => {
          emit('toModel1')
        })
    }
  } catch (error) {
    console.log('新增失败')
    //  ocrDialogVisible.value =false
    // message.error(error?.msg || '新增失败')
  }
}
</script>
