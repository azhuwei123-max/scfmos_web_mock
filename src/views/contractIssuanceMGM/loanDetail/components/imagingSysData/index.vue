<template>
  <ContentWrap>
    <Image :data="data" />
  </ContentWrap>
</template>

<script setup>
import Image from '@/components/Image/src/Image.vue'

const route = useRoute()
const data = reactive({
  treeNodes: [
    {
      treeId: route.query.customertype.startsWith('01')?'iouGSDK':'iouGRDK',
      bizReferenceId: route.query.serialno
    }
  ],
  canDelete: true,
  canUpload: true
})
</script>
