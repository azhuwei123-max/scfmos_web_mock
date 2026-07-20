<template>
  <ParamAdjustApplyDetailComponents :params="params" />
</template>

<script setup lang="tsx">
import ParamAdjustApplyDetailComponents from './detail.vue'
import { ParamsType, TempType } from './type'

defineOptions({
  name: 'ParamAdjustApplyDetail'
})

const route = useRoute()
const params = computed(() => {
  return {
    serialno: (route.query?.serialno || '') as string,
    title: (route.query?.title || '') as string,
    type: (route.query?.type || '') as ParamsType,
    tempType: (route.query?.tempType ?? 'ParamAdjustApplyDetail') as TempType,
    serialNoByList: (route.query?.serialNoByList ?? '') as string,
    customerId: (route.query?.customerId ?? '') as string,
    activeTabName: (route.query?.activeTabName ?? '') as string,
    isHistory: (route.query?.isHistory ?? '') as string
  }
})
</script>
