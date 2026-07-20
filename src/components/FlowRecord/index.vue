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
console.log('zzz',props)
const params = reactive({
  tpopentype: 'FlowChangeList',
  tpserialno: props.serialNo,
  argument: 'ObjectType=' + props.objectType
})
</script> 
