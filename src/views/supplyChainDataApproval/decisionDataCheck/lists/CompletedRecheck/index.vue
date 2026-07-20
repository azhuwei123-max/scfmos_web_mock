<template>
  <SupplyChainDecisionApprovalList :params="params" />
</template>

<script setup lang="ts">
import SupplyChainDecisionApprovalList from '@/views/supplyChainDataApproval/application/components/SupplyChainDecisionApprovalList/index.vue'

defineOptions({
  name: 'CompletedRecheck'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})
</script>