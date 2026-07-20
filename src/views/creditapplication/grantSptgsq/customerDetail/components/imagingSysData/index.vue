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
      treeId: 'customerGSKH',
      bizReferenceId: route.query.mfcustomerID
    }
  ],
  canDelete: true,
  canUpload: true
})
</script>
