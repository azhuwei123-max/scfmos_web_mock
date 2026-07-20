<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'entUKUlock'
})

const params = reactive({
  tpopentype: 'UnlockUkeyApply'
})
</script>