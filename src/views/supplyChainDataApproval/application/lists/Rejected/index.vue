<template>
  <SupplyChainDecisionApprovalList :params="params" />
</template>

<script setup lang="ts">
import SupplyChainDecisionApprovalList from '../../components/SupplyChainDecisionApprovalList/index.vue'

defineOptions({
  name: 'Pending'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})
</script>