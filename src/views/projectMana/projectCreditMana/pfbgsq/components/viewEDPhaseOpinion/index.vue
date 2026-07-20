<template>
  <Dialog v-model="visible" title="查看意见" width="90%" top="2vh">
    <el-skeleton :loading="loading" animated>
      <checkViewOpinion :data="data" type="contract" />
    </el-skeleton>
  </Dialog>
</template>

<script setup>
import * as Api from './api.js'
import checkViewOpinion from '@/components/busiComp/checkViewOpinion/index.vue'

// 表单模块集合
const data = ref()
const route = useRoute() // 路由对象

const visible = ref()

const open = (row) => {
  visible.value = true

  getViewOpinions(row.serialNo)
}

const loading = ref()
// 获取审批意见
const getViewOpinions = (serialNo) => {
  loading.value = true
  return Api.getContractOpinion({
    serialNo
  }).then((res) => {
    data.value = res || []
  }).finally(_ => loading.value = false)
}

defineExpose({
  open
})
</script>
