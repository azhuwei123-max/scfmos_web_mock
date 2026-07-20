<template>
  <ContentWrap :body-style="{ padding: '0px' }">
    <div class="m-10px">
      <el-button tpye="" @click="detail">详情</el-button>
    </div>
    <tempTable
      ref="tempTableRef"
      tempNo="BusinessAllotList"
      :api-func="Api.qryBusinessAllocationInfoPage"
      :params="params"
      :fetchCback="fetchCback"
      @dbl-click="detail"
    />

    <detailPop ref="detailPopRef" @confirm="handleDetailConfirm" />
  </ContentWrap>
</template>

<script setup>
import tempTable from '@/components/dynamicForm/components/tempTable.vue'
import * as Api from './api.js'
import detailPop from './detailPop.vue'
import { ElMessage } from 'element-plus'
import { formatValue } from '@/utils/formatter'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const fetchCback = (list) => {
  list.forEach((v) => {
    v.businesssum = formatValue(v.businesssum, 'currency')
    v.exposuresum = formatValue(v.exposuresum, 'currency')
  })
}

const tempTableRef = ref()
const detailPopRef = ref()
const detail = () => {
  if (!tempTableRef.value.currentRow) return ElMessage.warning('请选择 1 条')

  detailPopRef.value.open(tempTableRef.value.currentRow,props.params.isEdit,props.params.serialNo)
}
const handleDetailConfirm = () => {
  tempTableRef.value?.getList()
}
</script>
