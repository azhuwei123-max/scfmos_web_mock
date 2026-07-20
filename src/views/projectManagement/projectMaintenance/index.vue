<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'ProjectMaintenance'
})

const params = reactive({
  tpopentype: 'TeamworkUpdate'
})
</script>
