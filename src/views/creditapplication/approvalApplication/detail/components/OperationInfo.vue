<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="创建人">{{ detailData.createUser || '-' }}</el-descriptions-item>
    <el-descriptions-item label="创建时间">
      <span v-if="detailData.createTime">{{ formatDateString(detailData.createTime) }}</span>
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label="更新人">{{ detailData.updateUser || '-' }}</el-descriptions-item>
    <el-descriptions-item label="更新时间">
      <span v-if="detailData.updateTime">{{ formatDateString(detailData.updateTime) }}</span>
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label="审批人">{{ detailData.approver || '-' }}</el-descriptions-item>
    <el-descriptions-item label="审批时间">
      <span v-if="detailData.approveTime">{{ formatDateString(detailData.approveTime) }}</span>
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label="备注" :span="2">{{ detailData.remark || '-' }}</el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'OperationInfo' })

defineProps<{
  detailData: any
}>()

// 格式化日期字符串
const formatDateString = (dateStr: string) => {
  if (!dateStr) return '-'
  try {
    return formatDate(new Date(dateStr), 'YYYY-MM-DD HH:mm:ss')
  } catch {
    return dateStr
  }
}
</script>

