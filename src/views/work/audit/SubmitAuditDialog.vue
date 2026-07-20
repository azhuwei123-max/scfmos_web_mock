<template>
  <Dialog
    v-model="dialogVisible"
    title="提交审核"
    :fullscreen="false"
    :append-to-body="true"
    width="600px"
  >
    <div v-loading="loading">
      <ApprovalProcessSelect
        ref="approvalProcessSelectRef"
        :process-define-key="processDefineKey"
        :process-variables-str="processVariablesStr"
        @loaded="handleApprovalLoaded"
      />
    </div>
    <template #footer>
      <el-button tpye="" @click="handleConfirm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import ApprovalProcessSelect from '@/components/ApprovalProcessSelect/index.vue'
import { ApprovalNodeInfo } from '@/api/bpm/processInstance'

defineOptions({ name: 'SubmitAuditDialog' })

interface Props {
 
  processDefineKey?: string
  processVariablesStr?: string
}

const props = withDefaults(defineProps<Props>(), {
 
  processDefineKey: '',
  processVariablesStr: '{}'
})

const emit = defineEmits<{
  
  confirm: [assignees: Record<string, number[]>]
}>()

// const dialogVisible = computed({
//   get: () => props.modelValue,
//   set: (val) => emit('update:modelValue', val)
// })

const dialogVisible = ref(false)

const loading = ref(false)
const approvalProcessSelectRef = ref()
const startUserSelectTasks = ref<ApprovalNodeInfo[]>([])

/** 打开对话框 */
const open = async () => {
 
  dialogVisible.value = true
  loading.value = true
  
  try {
    // 重置审批流程数据
    await nextTick()
    if (approvalProcessSelectRef.value) {
      approvalProcessSelectRef.value.reset()
      await approvalProcessSelectRef.value.load()
    }
  } finally {
    loading.value = false
  }
}

/** 确认提交 */
const handleConfirm = async () => {
  if (!approvalProcessSelectRef.value) {
    return
  }
  
  // 校验指定审批人
  const validation = approvalProcessSelectRef.value.validate()
  if (!validation.valid) {
    const message = useMessage()
    message.warning(validation.message || '请选择审批人')
    return
  }
  
  // 获取选择的审批人数据
  const assignees = approvalProcessSelectRef.value.getAssignees()
  emit('confirm', assignees)
  dialogVisible.value = false
}

/** 审批节点加载完成事件处理 */
const handleApprovalLoaded = (_nodes: ApprovalNodeInfo[], selectTasks: ApprovalNodeInfo[]) => {
  startUserSelectTasks.value = selectTasks
}

defineExpose({
  open
})
</script>

