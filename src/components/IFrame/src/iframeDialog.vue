<template>
  <Dialog
    v-model="visible"
    :title="title"
    width="90%"
    :fullscreen="true"
    :scroll="false"
  >
    <IFrame
      v-if="visible && iframeUrl"
      :src="iframeUrl"
      :auto-height="true"
      :min-height="'600px'"
      :height-offset="94.5"
    />
  </Dialog>
</template>

<script setup>
const props = defineProps({
  title: String
})

const visible = ref()
const iframeUrl = ref()
const open = (url) => {
  visible.value = true
  iframeUrl.value = url
}

defineExpose({
  open
})
</script>