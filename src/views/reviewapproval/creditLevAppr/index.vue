<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'creditLevAppr'
})

const params = reactive({
  tpopentype: 'CreditCogApprove'
})
</script>