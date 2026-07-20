<template>
  <Dialog
    v-model="visible"
    title="影像资料"
    :append-to-body="true"
    top="0"
    width="100%"
  >
    <Image :data="data" />
  </Dialog>
</template>

<script setup>
import Image from '@/components/Image/src/Image.vue'

const route = useRoute()
const data = ref()

const visible = ref()
const open = (row) => {
  data.value = {
    treeNodes: [
      {
        treeId: 'customerGSKH',
        bizReferenceId: row.mfcustomerid
      }
    ],
    canDelete: true,
    canUpload: true
  }
  visible.value = true
}

defineExpose({
  open
})
</script>
