<template>
  <Dialog v-model="visible" title="详情" width="1200px" top="5vh">
    <ContentWrap>
      <tempTable
        ref="tempTableRef"
        tempNo="CTQFDFResultList"
        :api-func="Api.getQFDFDetailList"
        :params="params"
        :fetchCback="fetchCback"
      />
    </ContentWrap>
    <template #footer>
      <el-button @click="visible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import * as Api from '../api.js'
import { formatValue } from '@/utils/formatter'
import tempTable from '@/components/dynamicForm/components/tempTable.vue'

const visible = ref(false)

const params = reactive({})

const fetchCback = (list) => {
  list.forEach((v) => {
    v.txnamt = formatValue(v.txnamt, 'currency')
  })
}

const tempTableRef = ref()
const open = (row) => {
  Object.keys(params).forEach((key) => delete params[key])
  Object.assign(params, { serialno: row.serialno, rootbillnum: row.rootbillnum })

  visible.value = true
}

defineExpose({
  open
})
</script>
