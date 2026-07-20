<template>
  <el-input
    v-model="displayValue"
    :placeholder="placeholder"
    :clearable="clearable"
    :disabled="disabled"
    readonly
    class="w-1/1"
    v-bind="$attrs"
  >
    <template #append>
      <el-button @click="handleOpenDialog">...</el-button>
    </template>
  </el-input>

  <!-- 选择对话框 -->
  <Dialog
    :model-value="dialogVisible"
    @update:model-value="handleDialogVisibleChange"
    title="请选择:"
    :fullscreen="false"
    :append-to-body="true"
    width="500px"
  >
    <el-tree
      ref="treeRef"
      :data="treeData"
      :props="treeProps"
      node-key="id"
      highlight-current
      default-expand-all
      :default-checked-keys="selectedNodeId ? [selectedNodeId] : []"
      @node-click="handleNodeClick"
    />
    <template #footer>
      <el-button @click="handleClear">清空</el-button>
      <el-button @click="handleConfirm">确认</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue'
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'
// TODO: 接口对接时取消注释
// import { HoldingTypeApi } from '@/api/system/holdingType'

defineOptions({ name: 'HoldingTypeSelect' })

interface Props {
  // 绑定值（控股类型的 title）
  modelValue?: string
  placeholder?: string
  clearable?: boolean
  disabled?: boolean
  // 是否使用接口数据，false 时使用 mock 数据
  useApi?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请选择控股类型',
  clearable: true,
  disabled: false,
  useApi: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
}>()

const message = useMessage()

const dialogVisible = ref(false)
const treeRef = ref()
const treeData = ref<any[]>([])
const selectedNodeId = ref<string | null>(null)
const selectedNode = ref<any>(null)

// 显示值（绑定到 input）
const displayValue = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
    emit('change', val)
  }
})

// 树形组件配置
const treeProps = {
  children: 'children',
  label: 'title',
  disabled: (data: any) => {
    // 只有叶子节点可以选择，非叶子节点禁用
    return !data.isLeaf
  }
}

/**
 * 获取控股类型树形数据
 */
const getTreeData = async () => {
  if (!props.useApi) {
    // 使用 mock 数据
    treeData.value = getMockTreeData()
    return
  }

  try {
    // TODO: 接口对接后，取消注释下面的代码，并删除 mock 数据逻辑
    // const res = await HoldingTypeApi.getHoldingTypeTree()
    // treeData.value = res.data || []
    // return

    // 接口失败时使用 mock 数据作为 fallback
    treeData.value = getMockTreeData()
  } catch (error) {
    console.error('获取控股类型数据失败:', error)
    // 接口失败时使用 mock 数据作为 fallback
    treeData.value = getMockTreeData()
  }
}

/**
 * Mock 控股类型树形数据
 */
const getMockTreeData = (): any[] => {
  return [
    {
      key: '100',
      value: '100',
      title: '内资企业',
      isLeaf: false,
      id: '100',
      parentId: null,
      disabled: true,
      children: [
        {
          key: '100110',
          value: '100110',
          title: '国有企业',
          isLeaf: false,
          id: '100110',
          parentId: '100',
          disabled: true,
          children: [
            {
              key: '10011010',
              value: '10011010',
              title: '国有相对控股',
              isLeaf: true,
              id: '10011010',
              parentId: '100110',
              disabled: false,
              children: null
            },
            {
              key: '10011020',
              value: '10011020',
              title: '国有绝对控股',
              isLeaf: true,
              id: '10011020',
              parentId: '100110',
              disabled: false,
              children: null
            }
          ]
        },
        {
          key: '100120',
          value: '100120',
          title: '集体企业',
          isLeaf: false,
          id: '100120',
          parentId: '100',
          disabled: true,
          children: [
            {
              key: '10012010',
              value: '10012010',
              title: '集体相对控股',
              isLeaf: true,
              id: '10012010',
              parentId: '100120',
              disabled: false,
              children: null
            },
            {
              key: '10012020',
              value: '10012020',
              title: '集体绝对控股',
              isLeaf: true,
              id: '10012020',
              parentId: '100120',
              disabled: false,
              children: null
            }
          ]
        },
        {
          key: '100130',
          value: '100130',
          title: '私人控股',
          isLeaf: true,
          id: '100130',
          parentId: '100',
          disabled: false,
          children: null
        }
      ]
    },
    {
      key: '200',
      value: '200',
      title: '港、澳、台控股',
      isLeaf: false,
      id: '200',
      parentId: null,
      disabled: true,
      children: [
        {
          key: '20010',
          value: '20010',
          title: '港、澳、台相对控股',
          isLeaf: true,
          id: '20010',
          parentId: '200',
          disabled: false,
          children: null
        },
        {
          key: '20020',
          value: '20020',
          title: '港、澳、台绝对控股',
          isLeaf: true,
          id: '20020',
          parentId: '200',
          disabled: false,
          children: null
        }
      ]
    },
    {
      key: '300',
      value: '300',
      title: '外商控股',
      isLeaf: false,
      id: '300',
      parentId: null,
      disabled: true,
      children: [
        {
          key: '30010',
          value: '30010',
          title: '外商相对控股',
          isLeaf: true,
          id: '30010',
          parentId: '300',
          disabled: false,
          children: null
        },
        {
          key: '30020',
          value: '30020',
          title: '外商绝对控股',
          isLeaf: true,
          id: '30020',
          parentId: '300',
          disabled: false,
          children: null
        }
      ]
    },
    {
      key: '400',
      value: '400',
      title: '个体经营',
      isLeaf: false,
      id: '400',
      parentId: null,
      disabled: true,
      children: [
        {
          key: '40010',
          value: '40010',
          title: '个体经营户',
          isLeaf: true,
          id: '40010',
          parentId: '400',
          disabled: false,
          children: null
        },
        {
          key: '40020',
          value: '40020',
          title: '个人合伙',
          isLeaf: true,
          id: '40020',
          parentId: '400',
          disabled: false,
          children: null
        }
      ]
    }
  ]
}

/**
 * 根据值查找节点ID
 */
const findNodeId = (nodes: any[], targetValue: string): string | null => {
  for (const node of nodes) {
    // 匹配 title 或 id
    if ((node.title === targetValue || node.id === targetValue || node.value === targetValue) && node.isLeaf) {
      return node.id
    }
    if (node.children) {
      const found = findNodeId(node.children, targetValue)
      if (found) return found
    }
  }
  return null
}

/**
 * 节点点击事件
 */
const handleNodeClick = (data: any) => {
  // 只能选择叶子节点
  if (data.isLeaf) {
    selectedNodeId.value = data.id
    selectedNode.value = data
    // 高亮当前节点
    treeRef.value?.setCurrentKey(data.id)
  } else {
    message.warning('请选择具体的控股类型')
  }
}

/**
 * 打开对话框
 */
const handleOpenDialog = () => {
  dialogVisible.value = true
  // 如果已有值，尝试定位到对应节点
  if (props.modelValue) {
    const nodeId = findNodeId(treeData.value, props.modelValue)
    if (nodeId) {
      selectedNodeId.value = nodeId
      nextTick(() => {
        treeRef.value?.setCurrentKey(nodeId)
        // 查找并设置选中的节点对象
        const findNode = (nodes: any[], targetId: string): any => {
          for (const node of nodes) {
            if (node.id === targetId) {
              return node
            }
            if (node.children) {
              const found = findNode(node.children, targetId)
              if (found) return found
            }
          }
          return null
        }
        selectedNode.value = findNode(treeData.value, nodeId)
      })
    }
  }
}

/**
 * 确认选择
 */
const handleConfirm = () => {
  if (!selectedNode.value) {
    message.warning('请选择控股类型')
    return
  }
  displayValue.value = selectedNode.value.title
  dialogVisible.value = false
  message.success(`已选择：${selectedNode.value.title}`)
}

/**
 * 清空选择
 */
const handleClear = () => {
  selectedNodeId.value = null
  selectedNode.value = null
  displayValue.value = ''
  treeRef.value?.setCurrentKey(null)
  message.info('已清空选择')
}

/**
 * 取消
 */
const handleCancel = () => {
  dialogVisible.value = false
}

/**
 * 对话框显示状态变化
 */
const handleDialogVisibleChange = (val: boolean) => {
  dialogVisible.value = val
  if (!val) {
    // 对话框关闭时重置选择状态（但保留 selectedNode 以便确认时使用）
    // 如果用户点击取消，不更新值
  }
}

// 初始化
onMounted(() => {
  getTreeData()
})
</script>

<style scoped lang="scss">
// 树形组件样式调整
:deep(.el-tree) {
  .el-tree-node {
    .el-tree-node__content {
      height: 32px;
      line-height: 32px;
      
      &:hover {
        background-color: var(--el-tree-node-hover-bg-color);
      }
    }
    
    &.is-current {
      > .el-tree-node__content {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }
  }
  
  .el-tree-node__disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
}
</style>

