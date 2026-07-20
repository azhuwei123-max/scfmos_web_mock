<template>
  <Dialog v-model="visible" title="详情" width="1200px" top="5vh">
    <ContentWrap>
      <div class="mb-10px">
        <el-button @click="updateResult" :loading="loading2">更新交易结果</el-button>
      </div>
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

const loading2 = ref()
const updateResult = async () => {
  loading2.value = true
  await Api.updateResult({ serialno: params.serialno }).then(res => {
    ElMessage.success('交易成功')

    tempTableRef.value.search()
  }).finally((_) => (loading2.value = false))
}

defineExpose({
  open
})
</script>
