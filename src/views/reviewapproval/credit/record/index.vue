<template>
  <crmsIframe :params="params" />
</template>

<script setup >
import crmsIframe from '@/components/busiComp/crmsIframe/index.vue'


const props = defineProps({
  serialNo: {
    type: String
  },
  objectType:{
    type: String
  }
})

defineOptions({
  name: 'CreditReviewApprovalRecord'
})

const router = useRoute()

const params = reactive({
  tpopentype: 'FlowChangeList',
  tpserialno: router.query?.serialNo ?? props.serialNo,
  argument: 'ObjectType=' + router.query.objectType ?? props.objectType
})
</script>
