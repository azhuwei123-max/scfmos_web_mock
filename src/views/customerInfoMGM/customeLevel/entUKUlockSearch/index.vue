<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'entUKUlockSearch'
})

const params = reactive({
  tpopentype: 'UnlockUkeyCustomerList'
})
</script>