<template>
  <pendPutOutApply ref="compRef" :params="params1" />
</template>

<script setup>
import pendPutOutApply from "@/views/contractIssuanceMGM/loanApplication/components/pendPutOutApplyList/index.vue";

const route = useRoute()

// 因为父组件传参跟孙组件有同名参数，vue3默认透传，这里直接拦截
const props = defineProps({
  params: Object
})

const serialNo = computed(()=> props.params?.serialNo || route.query.serialno || route.query.serialNo)

const params1 = reactive({
  dealtype: route.query.parentMenuKey || '1040',
  key: route.query.parentMenuKey || '1040',
  contractserialno: serialNo.value,
  tempSaveFlag:route.query.tempSaveFlag,
  creditSourceFlag:route.query.creditSourceFlag,
})

const compRef = ref()
onActivated(() => {
  compRef.value?.search1()
})
</script>
