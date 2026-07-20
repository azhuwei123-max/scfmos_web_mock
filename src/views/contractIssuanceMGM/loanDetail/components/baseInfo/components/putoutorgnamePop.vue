<template>
  <MiniPageSelectDialog
    v-model="visible"
    width="1000"
    :columns="columns"
    :searchFields="searchFields"
    @confirm="confirm"
    :api-method="Api.getAcctInst"
    :extra-params="extraParams"
  />
</template>

<script setup>
import * as Api from './api.js'

const visible = ref(false)

const columns = [
  { label: '核心机构号', prop: 'itemNo' },
  { label: '核心机构名称', prop: 'itemName' }
]

const searchFields = [
  { label: '核心机构号', prop: 'itemNo' },
  { label: '核心机构名称', prop: 'itemName' }
]

const extraParams = reactive({})

const open = (row) => {
  visible.value = true

  extraParams.a
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = (item) => {
  emit('confirm', item)
  visible.value = false
}

defineExpose({
  open
})
</script>