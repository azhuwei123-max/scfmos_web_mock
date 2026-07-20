<template>
  <ApprovalChangeRequest :flag="flag" />
</template>

<script setup lang="ts">
import ApprovalChangeRequest from '@/views/creditApplicationMGM/approvalChangeRequest/index.vue'

defineOptions({
  name: 'LinkedApprovalChangeRequest'
})

// 特殊标志通过props 传输
const flag = 'LinkedApprovalChangeRequest'

</script>