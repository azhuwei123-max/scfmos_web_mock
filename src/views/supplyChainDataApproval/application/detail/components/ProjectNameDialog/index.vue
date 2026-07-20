<template>
  <Dialog v-model="visible" title="请选择" width="500px">
    1111
  </Dialog>
</template>

<script setup lang="tsx">

const visible = ref(false)

const emit = defineEmits(['confirm'])

const data = ref([])
let currentRow = ref<Recordable>({})
const loading = ref(false)

const getData = (codeNo) => {
  loading.value = true
}

const open = (formInfo = {}) => {
  currentRow.value = {}
  visible.value = true

}



const confirm = () => {
  if (!currentRow) return ElMessage.warning('请选择')

  visible.value = false
  emit('confirm', currentRow)
}

defineExpose({
  open
})
</script>