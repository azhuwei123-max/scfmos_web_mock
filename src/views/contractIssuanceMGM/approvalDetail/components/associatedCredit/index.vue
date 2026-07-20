<template>
  <associatedCredit :pageParams="pageParams" />
</template>

<script setup>
import associatedCredit from '@/views/creditapplication/creditApplyJob/customerDetail/components/associatedCredit/index.vue'

const route = useRoute()

const props = defineProps({
  params: Object
})

const pageParams = {
  serialNo: props.params?.serialNo,
  objectNo: props.params?.serialNo,
  customerID: props.params.detailInfo?.customerid,
  objectType: props.params.objectType,
  businessType: route.query.businesstype,
  applyType: 'ApproveApply'
}
</script>