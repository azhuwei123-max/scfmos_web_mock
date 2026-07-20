<template>
  <Dialog v-model="visible" title="影像资料" :append-to-body="true" top="0" width="100%">
    <IFrame :src="data" />
  </Dialog>
</template>

<script setup>
import Image from '@/components/Image/src/Image.vue'
import { getImageGalleryInfo } from '@/api/common'

const route = useRoute()
const data = ref()

const visible = ref()
const open = (row) => {
  visible.value = true
  data.value = ''
  const params = {
    objectNo: row.serialNo,
    objectType: '2' == row.borrowerTypeCode ? 'BuildWhiteApply' : 'DealWhiteApply',
    customerID: row.customerID
  }
  getImageGalleryInfo(params)
    .then((res) => {
      data.value = res
    })
    .catch((err) => {
      visible.value = false
    })
}

defineExpose({
  open
})
</script>
