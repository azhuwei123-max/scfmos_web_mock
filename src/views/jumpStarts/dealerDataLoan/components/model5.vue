<template>
  <addCustomer
v-bind="$attrs" ref="addCustomerRef"
  @confirm="handleAddConfirm" @cancel="emit('toModel1')" />
</template>

<script setup>
import addCustomer from '@/components/CustomerIdDialog/index.vue'
import * as Api from './api.js'

const emit = defineEmits(['closeModel5', 'toModel5', 'toModel1'])
const addCustomerRef = ref()

const handleAddConfirm = (params) => {
  console.log('params', params)
  addCustomerRef.value.saving = true
  Api.addCustomer({ CustomerType: '0110', ...params })
    .then((res) => {
      if (!res.data) return

      const info = res?.data

      ElMessageBox.confirm(info?.returnMsg || '新增成功', '提示', {
        confirmButtonText: '继续新增',
        cancelButtonText: '关闭',
        type: 'success'
      }).then(res => {
        emit('toModel5')
      }).catch(e => {
        emit('toModel1')
      })
    }).finally(()=> {
      addCustomerRef.value.saving = false
    })
}



const open = (row) => {
  visible.value = true
  currentData.value = row
}

defineExpose({
  
})
</script>
