<template>
  <associatedCredit :pageParams="pageParams" />
</template>

<script setup>
import associatedCredit from './index.vue'

const route = useRoute()

const props = defineProps({
  params: Object,
  default: () => ({})
})

const pageParams = {
  serialNo: props.params?.serialNo,
  objectNo: props.params?.serialNo,
  customerID: props.params.detailInfo?.customerid,
  objectType: props.params.objectType || 'CreditApply',
  businessType: props.params.detailInfo?.businesstype,
  applyType: props.params.applyType,
}
</script>
