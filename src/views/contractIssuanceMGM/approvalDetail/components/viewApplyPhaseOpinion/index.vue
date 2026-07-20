<template>
  <el-skeleton :loading="loading" animated>
    <checkViewOpinion v-if="data.length" :data="data" type="apply" />
    <el-empty v-else description="目前此业务还没有您可以查看的审批意见" />
  </el-skeleton>
</template>

<script setup lang="tsx">
import * as Api from '../../api'
import checkViewOpinion from '@/components/busiComp/checkViewOpinion/index.vue'
import { formatValue } from '@/utils/formatter'

// 表单模块集合
const data = ref()
const props = withDefaults(defineProps<{
  serialNo: string
}>(),
{

})

const loading = ref()
// 获取审批意见
const getViewOpinions = () => {
  loading.value = true
  return Api.getCreditOpinion({
    serialNo: props.serialNo
  }).then((res) => {
    data.value = res || []
    data.value?.forEach(e => {
     e.businessSum = formatValue(e.businessSum, 'currency')
     e.baBusinessSum = formatValue(e.baBusinessSum, 'currency')
     e.baExposureSum = formatValue(e.baExposureSum, 'currency')
     e.exposureSum = formatValue(e.exposureSum, 'currency')
    });
    console.log('data.value', data.value)
  }).finally(() => loading.value = false)
}
onBeforeMount(()=> {
  getViewOpinions()
})
</script>
