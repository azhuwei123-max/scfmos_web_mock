<template>
  <CustomerMGM :flag="flag" />
</template>

<script setup lang="ts">
import CustomerMGM from '@/views/customerInfoMGM/companyCustomerMGM/customerMGM/index.vue'

defineOptions({
  name: 'LinkedCustomerMGM'
})

// 特殊标志通过props 传输
const flag = 'LinkedCustomerMGM'

</script>