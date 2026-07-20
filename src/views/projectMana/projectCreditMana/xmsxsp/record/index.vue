<template>
  <crmsIframe :params="params" />
</template>

<script setup>
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'

defineOptions({
  name: 'CreditReviewApprovalRecord'
})
const router = useRoute()

const params = reactive({
  tpopentype: 'FlowChangeList',
  tpserialno: router.query.serialNo,
  argument: 'ObjectType=' + router.query.objectType
})
</script>
