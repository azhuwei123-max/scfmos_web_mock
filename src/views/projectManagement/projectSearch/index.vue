<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'TeamworkUpdate'
})

const params = reactive({
  tpopentype: 'TeamworkQuery'
})
</script>
