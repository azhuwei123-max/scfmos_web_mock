<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'assistApprAppr'
})

const params = reactive({
  tpopentype: 'ProjectCoreviewApprove'
})
</script>