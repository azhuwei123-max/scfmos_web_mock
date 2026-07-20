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
      treeId: 'customerGRKH',
      bizReferenceId: route.params.id
    }
  ],
  canDelete: true,
  canUpload: true
})
</script>
