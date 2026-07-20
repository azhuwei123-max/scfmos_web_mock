<template>
  <ContentWrap>
    <!-- 页面头部 -->
    <div class="mb-20px">
      <el-button @click="goBack" class="mr-10px">
        <Icon icon="ep:arrow-left" class="mr-5px" /> 返回
      </el-button>
      <span class="text-18px font-bold">工单审批详情</span>
    </div>

    <!-- 基本信息 -->
    <el-card class="mb-20px" shadow="never">
      <template #header>
        <div class="flex items-center">
          <Icon icon="ep:document" class="mr-8px" />
          <span class="text-16px font-medium">基本信息</span>
        </div>
      </template>
      <el-descriptions :column="2" border v-loading="loading">
        <el-descriptions-item label="工单编号">
          {{ detailData.no || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="工作流编号">
          {{ detailData.processInstanceId || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="审核状态">
          <el-tag :type="getStatusTagType(detailData.auditStatus || 0)">
            {{ getStatusText(detailData.auditStatus || 0) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后审核时间">
          {{ detailData.lastAuditTime ? formatTime(detailData.lastAuditTime) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ detailData.createTime ? formatTime(detailData.createTime) : '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ detailData.updateTime ? formatTime(detailData.updateTime) : '-' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 审批记录 -->
    <el-card shadow="never">
      <template #header>
        <div class="flex items-center">
          <Icon icon="ep:list" class="mr-8px" />
          <span class="text-16px font-medium">审批记录</span>
        </div>
      </template>
      <el-table :data="auditRecords" border v-loading="loading">
        <el-table-column label="审核人" prop="auditor" align="center" />
        <el-table-column
          label="审核时间"
          prop="auditTime"
          align="center"
          :formatter="dateFormatter"
        />
        <el-table-column label="审核结果" prop="result" align="center">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.result)">
              {{ getStatusText(scope.row.result) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" prop="comment" align="center" show-overflow-tooltip />
      </el-table>
    </el-card>
  </ContentWrap>
</template>

<script setup lang="ts">
import { AuditWorkApi, AuditWorkVO } from '@/api/work/audit'
import { dateFormatter } from '@/utils/formatTime'
import { propTypes } from '@/utils/propTypes'

/** 工单审核详情页面 */
defineOptions({ name: 'AuditWorkDetail' })

const { currentRoute, push } = useRouter()
const loading = ref(false) // 加载状态
const detailData = ref<AuditWorkVO>({} as AuditWorkVO) // 详情数据
const auditRecords = ref([]) // 审批记录

const props = defineProps({
  id: propTypes.number.def(undefined)
})

/** 获取工单ID */
const workId = computed(() => {
  return props.id || (currentRoute.value.query.id as string)
})

/** 获取详情数据 */
const getDetailData = async () => {
  if (!workId.value) return

  loading.value = true
  try {
    // 获取详情数据
    detailData.value = await AuditWorkApi.getAuditWork(Number(workId.value))
    // 这里可以添加获取审批记录的API调用
    // auditRecords.value = await AuditWorkApi.getAuditRecords(Number(workId.value))
  } finally {
    loading.value = false
  }
}

defineExpose({ open: getDetailData }) // 提供 open 方法，用于打开弹窗

/** 返回上一页 */
const goBack = () => {
  push({ name: 'AuditWork' })
}

/** 获取状态标签类型 */
const getStatusTagType = (status: string | number) => {
  const statusMap = {
    '0': 'info', // 待审核
    '1': 'success', // 已通过
    '2': 'danger', // 已拒绝
    '3': 'warning' // 审核中
  }
  return statusMap[status] || 'info'
}

/** 获取状态文本 */
const getStatusText = (status: string | number) => {
  const statusMap = {
    '0': '待审核',
    '1': '已通过',
    '2': '已拒绝',
    '3': '审核中'
  }
  return statusMap[status] || '未知状态'
}

/** 格式化时间 */
const formatTime = (time: string | number | Date) => {
  if (!time) return '-'
  return new Date(time).toLocaleString()
}

/** 页面初始化 */
onMounted(() => {
  getDetailData()
})
</script>
