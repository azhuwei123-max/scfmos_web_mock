<template>
  <Dialog v-model="visible" title="选择" width="500px" top="5vh">
    <el-input class="mb-10px" v-model="filterText" placeholder="输入关键字过滤" @input="doFilter" />
    <el-scrollbar height="55vh">
      <el-tree
        v-loading="loading"
        ref="treeRef"
        :data="data"
        :props="treeProps"
        highlight-current
        node-key="id"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
      />
    </el-scrollbar>
    <template #footer>
      <el-button tpye="" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { businessTypeTreeList } from '../../api.js'

const visible = ref(false)

const filterText = ref()

const props = defineProps({
  apiFunc: {
    type: Function,
    default: businessTypeTreeList
  },

  qryParams: {
    type: Object,
  }
})

const treeProps = {
  children: 'children',
  label: 'title'
}

const treeRef = ref()
const doFilter = () => {
  treeRef.value.filter(filterText.value)
}

const filterNode = (value, data) => {
  if (!value) return true

  return data.title.indexOf(value) !== -1
}

const emit = defineEmits(['confirm'])

const data = shallowRef([])
const loading = ref(false)
const getData = (codeNo) => {
  loading.value = true
  props.apiFunc(props.qryParams || { codeNo })
    .then((res) => {
      data.value = res
    })
    .finally((_) => (loading.value = false))
}

const getTreeCode = (colactualname) => {
  if (!colactualname?.includes('getItemName')) return colactualname

  const index1 = colactualname.indexOf("('")
  const index2 = colactualname.indexOf("',")
  return colactualname.substring(index1 + 2, index2)
}

const open = (formInfo = {}) => {
  currentRow = null
  visible.value = true

  if (!data.value?.length) {
    getData(getTreeCode(formInfo.colactualname || formInfo.code))
  }
}

let currentRow
const nodeClick = (e) => {
  currentRow = e
}

const confirm = () => {
  if (!currentRow) return ElMessage.warning('请选择')

  if (!currentRow.isLeaf && !currentRow.leaf) return ElMessage.warning('页节点信息不能选择，请重新选择！')

  visible.value = false
  emit('confirm', currentRow)
}

defineExpose({
  open
})
</script>
