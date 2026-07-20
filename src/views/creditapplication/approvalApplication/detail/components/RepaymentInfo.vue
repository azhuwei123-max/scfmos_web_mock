<template>
  <el-descriptions :column="2" border>
    <el-descriptions-item label="还款方式">{{ detailData.repaymentMethod || '-' }}</el-descriptions-item>
    <el-descriptions-item label="还款周期">{{ detailData.repaymentPeriod || '-' }}</el-descriptions-item>
    <el-descriptions-item label="还款日">{{ detailData.repaymentDay || '-' }}</el-descriptions-item>
    <el-descriptions-item label="首次还款日期">
      <span v-if="detailData.firstRepaymentDate">{{ formatDateString(detailData.firstRepaymentDate) }}</span>
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label="最后还款日期">
      <span v-if="detailData.lastRepaymentDate">{{ formatDateString(detailData.lastRepaymentDate) }}</span>
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label="还款期数">{{ detailData.repaymentPeriods || '-' }}</el-descriptions-item>
    <el-descriptions-item label="每期还款金额">
      <span v-if="detailData.periodRepaymentAmount">
        {{ formatAmount(detailData.periodRepaymentAmount) }}
      </span>
      <span v-else>-</span>
    </el-descriptions-item>
    <el-descriptions-item label="还款账户">{{ detailData.repaymentAccount || '-' }}</el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'RepaymentInfo' })

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

// 格式化金额
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}
</script>

