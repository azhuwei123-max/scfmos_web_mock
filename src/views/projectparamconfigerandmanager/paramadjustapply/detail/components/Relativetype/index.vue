<template>
  <div v-loading="loading">
    <el-scrollbar max-height="400px">
      <ul v-for="item in list" :key="item.itemNo">
        <li
          class="p-2 border-b border-dashed flex items-center gap-2"
          :style="{
            background: activeItem === item.itemNo ? '#b4cbff' : 'none'
          }"
        >
          <div class="w-1.5 h-1.5 bg-black"></div>
          <span
            class="cursor-pointer hover:underline"
            @click="handleClick(item)"
            @dblclick="dblclick"
            >{{ item.itemName }}</span
          >
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script setup lang="tsx">
const props = defineProps<{
  onSuccess?: (done: Function) => void
  onClose: (args?: any) => void
  customerType: string
  apiFunc: Function
}>()

const loading = ref(false)
const list = ref<Recordable[]>([])
const activeItem = ref('')
async function getData() {
  loading.value = true
  const res = await props
    .apiFunc({ customertype: props.customerType })
    .finally(() => (loading.value = false))
  list.value = res
}
getData()

const handleClick = (item) => {
  activeItem.value = item.itemNo
}

const done = () => {
  props.onClose({ command: 'cancel' })
}

const dblclick = () => {
  props.onSuccess?.(done)
}

defineExpose({
  async validate() {
    const item = list.value.find((f) => f.itemNo === activeItem.value)
    if (item) {
      return item
    }
    ElMessage.warning('请选择一条数据')
    return null
  }
})
</script>
