<template>
  <ContentWrap title="审批流程">
    <div class="process-timeline-wrapper">
      <ProcessInstanceTimeline
        ref="timelineRef"
        :activity-nodes="activityNodes"
        :show-status-icon="false"
        :enable-approve-user-select="true"
        :simple-model="simpleModel"
        @select-user-confirm="handleSelectUserConfirm"
      />
    </div>
  </ContentWrap>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import ProcessInstanceTimeline from '@/views/work/audit/ProcessInstanceTimeLine.vue'
import * as DefinitionApi from '@/api/bpm/definition'
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import {
  CandidateStrategy,
  NodeId,
  NodeType
} from '@/components/SimpleProcessDesignerV2/src/consts'
import { ApprovalNodeInfo } from '@/api/bpm/processInstance'
import { TaskStatusEnum } from '@/api/bpm/task'

defineOptions({ name: 'ApprovalProcessSelect' })

interface Props {
  /** 流程定义 Key */
  processDefineKey?: string
  /** 流程变量（JSON 字符串） */
  processVariablesStr?: string
  /** 是否使用 Mock 数据 */
  useMockData?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  processDefineKey: '',
  processVariablesStr: '{}',
  useMockData: false
})

const emit = defineEmits<{
  /** 审批人选择确认事件 */
  selectUserConfirm: [assignees: Record<string, number[]>]
  /** 审批节点加载完成事件 */
  loaded: [nodes: ApprovalNodeInfo[], selectTasks: ApprovalNodeInfo[]]
}>()

const timelineRef = ref() // 审批流程组件引用
const activityNodes = ref<ProcessInstanceApi.ApprovalNodeInfo[]>([]) // 审批节点信息
const startUserSelectTasks = ref<ApprovalNodeInfo[]>([]) // 需要选择审批人的用户任务列表
const startUserSelectAssignees = ref<Record<string, number[]>>({}) // 选择审批人的数据
const processDefinitionId = ref('') // 流程定义 ID
const simpleModel = ref({})

/** 生成 Mock 审批节点数据（用于测试） */
const generateMockActivityNodes = (): ProcessInstanceApi.ApprovalNodeInfo[] => {
  return [
    {
      id: 1,
      name: '发起人',
      nodeType: NodeType.START_USER_NODE,
      status: TaskStatusEnum.NOT_START,
      candidateStrategy: undefined,
      candidateUsers: [],
      tasks: []
    },
    {
      id: 2,
      name: '部门经理审批',
      nodeType: NodeType.USER_TASK_NODE,
      status: TaskStatusEnum.NOT_START,
      candidateStrategy: CandidateStrategy.START_USER_SELECT,
      candidateUsers: [],
      tasks: []
    },
    {
      id: 3,
      name: '财务审批',
      nodeType: NodeType.USER_TASK_NODE,
      status: TaskStatusEnum.NOT_START,
      candidateStrategy: CandidateStrategy.APPROVE_USER_SELECT,
      candidateUsers: [],
      tasks: []
    },
    {
      id: 4,
      name: '结束',
      nodeType: NodeType.END_EVENT_NODE,
      status: TaskStatusEnum.NOT_START,
      candidateStrategy: undefined,
      candidateUsers: [],
      tasks: []
    }
  ]
}

/** 获取审批详情 */
const getApprovalDetail = async () => {
  // 如果使用 Mock 数据或没有流程定义 ID，使用 mock 数据
  // if (props.useMockData || !processDefinitionId.value) {
  //     console.log('使用 Mock 审批节点数据')
   
  //   const data = await ProcessInstanceApi.getApprovalDetail({
  //     processDefinitionId: processDefinitionId.value,
  //     // TODO 小北：可以支持 processDefinitionKey 查询
  //     activityId: NodeId.START_USER_NODE_ID,
  //     processVariablesStr: JSON.stringify({ day: null }) // 解决 GET 无法传递对象的问题，后端 String 再转 JSON
  //   })

  //   activityNodes.value = data.activityNodes
  //   simpleModel.value = JSON.parse(data.processDefinition.simpleModel)
  //   console.log('1233321',simpleModel.value)

  //   // 获取发起人自选的任务
  //   // startUserSelectTasks.value = activityNodes.value.filter(
  //   //   (node: ApprovalNodeInfo) =>
  //   //     CandidateStrategy.START_USER_SELECT === node.candidateStrategy ||
  //   //     CandidateStrategy.APPROVE_USER_SELECT === node.candidateStrategy
  //   // )

  //   startUserSelectTasks.value = activityNodes.value.filter(
  //     (node: ApprovalNodeInfo) =>
  //       CandidateStrategy.START_USER_SELECT === node.candidateStrategy
       
  //   )

  //   // 初始化审批人选择数据
  //   if (startUserSelectTasks.value?.length > 0) {
  //     for (const node of startUserSelectTasks.value) {
  //       if (!startUserSelectAssignees.value[node.id]) {
  //         startUserSelectAssignees.value[node.id] = []
  //       }
  //     }
  //     // 更新 Timeline 组件的审批人数据
  //     await nextTick()
  //     if (timelineRef.value) {
  //       timelineRef.value.batchSetCustomApproveUsers(startUserSelectAssignees.value)
  //     }
  //   }
    
  //   emit('loaded', activityNodes.value, startUserSelectTasks.value)
  //   return
  // }

  try {
    const data = await ProcessInstanceApi.getApprovalDetail({
      processDefinitionId: processDefinitionId.value,
      activityId: NodeId.START_USER_NODE_ID,
      processVariablesStr: props.processVariablesStr
    })

    // if (!data) {
    //   // 如果接口返回空，使用 mock 数据
    //   activityNodes.value = generateMockActivityNodes()
    //   startUserSelectTasks.value = activityNodes.value.filter(
    //     (node: ApprovalNodeInfo) =>
    //       CandidateStrategy.START_USER_SELECT === node.candidateStrategy ||
    //       CandidateStrategy.APPROVE_USER_SELECT === node.candidateStrategy
    //   )
    //   emit('loaded', activityNodes.value, startUserSelectTasks.value)
    //   return
    // }
    
    // 获取审批节点，显示 Timeline 的数据
    activityNodes.value = data.activityNodes || []

    simpleModel.value = JSON.parse(data.processDefinition.simpleModel)

    // 获取发起人自选的任务
    startUserSelectTasks.value =
      data.activityNodes?.filter(
        (node: ApprovalNodeInfo) =>
          CandidateStrategy.START_USER_SELECT === node.candidateStrategy ||
          CandidateStrategy.APPROVE_USER_SELECT === node.candidateStrategy
      ) || []

    // 初始化审批人选择数据
    if (startUserSelectTasks.value?.length > 0) {
      for (const node of startUserSelectTasks.value) {
        if (!startUserSelectAssignees.value[node.id]) {
          startUserSelectAssignees.value[node.id] = []
        }
      }
      // 更新 Timeline 组件的审批人数据
      await nextTick()
      if (timelineRef.value) {
        timelineRef.value.batchSetCustomApproveUsers(startUserSelectAssignees.value)
      }
    }
    
    emit('loaded', activityNodes.value, startUserSelectTasks.value)
  } catch (error) {
    console.error('获取审批详情失败，使用 Mock 数据:', error)
    // // 接口失败时，使用 mock 数据
    // activityNodes.value = generateMockActivityNodes()

    // // 获取发起人自选的任务
    // startUserSelectTasks.value = activityNodes.value.filter(
    //   (node: ApprovalNodeInfo) =>
    //     CandidateStrategy.START_USER_SELECT === node.candidateStrategy ||
    //     CandidateStrategy.APPROVE_USER_SELECT === node.candidateStrategy
    // )
    
    // emit('loaded', activityNodes.value, startUserSelectTasks.value)
  }
}

/** 选择审批人 */
const handleSelectUserConfirm = (id: string, userList: any[]) => {
  startUserSelectAssignees.value[id] = userList?.map((item: any) => item.id)
  emit('selectUserConfirm', startUserSelectAssignees.value)
}

/** 加载审批流程 */
const load = async () => {
  // 如果设置了流程定义 Key，先获取流程定义
  if (props.processDefineKey) {
    try {
      const processDefinitionDetail = await DefinitionApi.getProcessDefinition(
        undefined,
        props.processDefineKey
      )
      if (processDefinitionDetail) {
        processDefinitionId.value = processDefinitionDetail.id
        // 加载最新的审批详情
        await getApprovalDetail()
      } else {
        // 如果没有找到流程定义，使用 mock 数据
        await getApprovalDetail()
      }
    } catch (error) {
      console.error('加载流程定义失败，使用 Mock 数据:', error)
      // 加载失败时，使用 mock 数据
      await getApprovalDetail()
    }
  } else {
    // 如果没有设置流程定义 Key，直接使用 mock 数据
    await getApprovalDetail()
  }
}

/** 验证是否选择了必需的审批人 */
const validate = (): { valid: boolean; message?: string } => {
  console.log('startUserSelectTasks',startUserSelectTasks.value)
  if (startUserSelectTasks.value?.length > 0) {
    for (const userTask of startUserSelectTasks.value) {
      if (
        Array.isArray(startUserSelectAssignees.value[userTask.id]) && CandidateStrategy.START_USER_SELECT === userTask.candidateStrategy &&
        startUserSelectAssignees.value[userTask.id].length === 0
      ) {
        return {
          valid: false,
          message: `请选择${userTask.name}的审批人`
        }
      }
    }
  }
  return { valid: true }
}

/** 获取选择的审批人数据 */
const getAssignees = (): Record<string, number[]> => {
  return { ...startUserSelectAssignees.value }
}

/** 重置审批人选择 */
const reset = () => {
  startUserSelectAssignees.value = {}
  if (startUserSelectTasks.value?.length > 0) {
    for (const node of startUserSelectTasks.value) {
      startUserSelectAssignees.value[node.id] = []
    }
  }
  // 更新 Timeline 组件的审批人数据
  nextTick(() => {
    if (timelineRef.value) {
      timelineRef.value.batchSetCustomApproveUsers(startUserSelectAssignees.value)
    }
  })
}

// 监听流程定义 Key 变化
watch(
  () => props.processDefineKey,
  () => {
    if (props.processDefineKey) {
      load()
    }
  },
  { immediate: false }
)

// 监听流程变量变化
watch(
  () => props.processVariablesStr,
  () => {
    if (processDefinitionId.value) {
      getApprovalDetail()
    }
  },
  { immediate: false }
)

defineExpose({
  load,
  validate,
  getAssignees,
  reset
})
</script>

<style lang="scss" scoped>
.process-timeline-wrapper {
  padding: 0 20px;
}
</style>

