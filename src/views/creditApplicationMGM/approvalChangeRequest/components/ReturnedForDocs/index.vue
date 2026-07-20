<template>
  <ApprovalChangeList :params="params" />
</template>

<script setup>
import ApprovalChangeList from '../ApprovalChangeList/index.vue'

defineOptions({
  name: 'ReturnedForDocs'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})
</script>