<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'remBusOpen'
})

const params = reactive({
  tpopentype: 'YDQYKHOpenAccountApply'
})
</script>