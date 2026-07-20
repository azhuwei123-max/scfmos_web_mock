<template>
  <Dialog v-model="visible" title="选择" width="500px" top="5vh" :append-to-body="appendToBody">
    <el-input class="mb-10px" v-model="filterText" placeholder="输入关键字过滤" @input="doFilter" />
    <el-scrollbar maxHeight="55vh">
      <el-tree
        v-loading="loading"
        ref="treeRef"
        :data="data"
        :props="treeProps"
        highlight-current
        node-key="id"
        :filter-node-method="filterNode"
        :current-node-key="currentNodeKey"
        @node-click="nodeClick"
        @dblclick="confirm"
      />
    </el-scrollbar>
    <template #footer>
      <el-button tpye="" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { codeLibraryTreeList } from '@/api/dynamicForm/index.js'

const visible = ref(false)

const filterText = ref()

const props = defineProps({
  apiFunc: {
    type: Function,
    default: codeLibraryTreeList
  },

  qryParams: {
    type: Object
  },

  defaultKey: {
    type: Array,
    default: () => []
  },

  appendToBody: {
    type: Boolean,
    default: false
  },

  // 确定前校验
  beforeConfirm: {
    type: Function,
    default: () => true
  }
})

const currentNodeKey = ref()

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
  props
    .apiFunc(props.qryParams || { codeNo })
    .then((res) => {
      data.value = res

      nextTick(() => {
        setDefaultNode()
      })
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
  } else {
    nextTick(() => {
      setDefaultNode()
    })
  }
}

const setDefaultNode = () => {
  if (props.defaultKey) {
    treeRef.value.setCurrentKey(props.defaultKey)
    nodeClick({ ...(treeRef.value.getNode(props.defaultKey)?.data ?? {}), isLeaf: true })
  }
}

let currentRow
const nodeClick = (e) => {
  currentRow = e
}

const confirm = () => {
  if (!currentRow) return ElMessage.warning('请选择')

  if (!currentRow.isLeaf && !currentRow.leaf)
    return ElMessage.warning('页节点信息不能选择，请重新选择！')

  if (!(props.beforeConfirm?.(currentRow) ?? true)) return
  
  visible.value = false

  emit('confirm', currentRow)
}

defineExpose({
  open
})
</script>
