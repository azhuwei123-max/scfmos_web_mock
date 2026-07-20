<template>
  <SupplyChainDecisionApprovalList :params="params" />
</template>

<script setup lang="ts">
import SupplyChainDecisionApprovalList from '../../components/SupplyChainDecisionApprovalList/index.vue'

defineOptions({
  name: 'Approved'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})
</script>