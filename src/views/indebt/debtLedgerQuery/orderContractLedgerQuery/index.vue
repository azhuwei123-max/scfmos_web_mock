<template>
  <OrderContractLedgerWorkList :params="{ productPlan }" />
</template>

<script setup lang="ts">
import OrderContractLedgerWorkList from './components/workList/index.vue'

defineOptions({ name: 'OrderContractLedgerQuery' })

const route = useRoute()
const productPlan = computed(() => {
  const path = String(route.path || '')
  return path.includes('/pledge') ? '货押融资' : '先票/款后货'
})
</script>
