<template>
  <ContentWrap>
    <!-- 查询条件 -->
    <div class="mb-15px">
      <div class="text-16px font-bold mb-15px">查询条件</div>
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="申请编号" prop="applicationNo">
          <div class="flex items-center gap-10px">
            <el-select
              v-model="queryParams.applicationNoOperator"
              style="width: 120px"
            >
              <el-option label="以...开始" value="startsWith" />
              <el-option label="包含" value="contains" />
              <el-option label="等于" value="equals" />
            </el-select>
            <el-input
              v-model="queryParams.applicationNo"
              placeholder="请输入申请编号"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="客户名称" prop="applicantName">
          <div class="flex items-center gap-10px">
            <el-select
              v-model="queryParams.applicantNameOperator"
              style="width: 120px"
            >
              <el-option label="以...开始" value="startsWith" />
              <el-option label="包含" value="contains" />
              <el-option label="等于" value="equals" />
            </el-select>
            <el-input
              v-model="queryParams.applicantName"
              placeholder="请输入客户名称"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="商户标识" prop="merchantId">
          <div class="flex items-center gap-10px">
            <el-select
              v-model="queryParams.merchantIdOperator"
              style="width: 120px"
            >
              <el-option label="以...开始" value="startsWith" />
              <el-option label="包含" value="contains" />
              <el-option label="等于" value="equals" />
            </el-select>
            <el-input
              v-model="queryParams.merchantId"
              placeholder="请输入商户标识"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="业务品种" prop="businessType">
          <div class="flex items-center gap-10px">
            <el-select
              v-model="queryParams.businessTypeOperator"
              style="width: 120px"
            >
              <el-option label="以...开始" value="startsWith" />
              <el-option label="包含" value="contains" />
              <el-option label="等于" value="equals" />
            </el-select>
            <el-input
              v-model="queryParams.businessType"
              placeholder="请输入业务品种"
              clearable
              class="!w-200px"
            />
          </div>
        </el-form-item>
        <el-form-item label="发生类型" prop="occurrenceType">
          <div class="flex items-center gap-10px">
            <el-select
              v-model="queryParams.occurrenceTypeOperator"
              style="width: 120px"
            >
              <el-option label="等于" value="equals" />
              <el-option label="包含" value="contains" />
            </el-select>
            <el-select
              v-model="queryParams.occurrenceType"
              placeholder="请选择发生类型"
              clearable
              class="!w-200px"
            >
              <el-option
                v-for="item in occurrenceTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button tpye="" @click="handleQuery">确定</el-button>
          <el-button @click="handleCancel">取消</el-button>
          <el-button @click="handleClear">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
  </ContentWrap>

  <!-- 操作按钮 -->
  <ContentWrap>
    <div class="mb-15px flex gap-10px">
      <el-button @click="handleExport">
        <Icon icon="ep:download" class="mr-5px" />
        导出EXCEL
      </el-button>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @current-change="handleSelectionChange"
      @row-dblclick="handleApplicationDetail"
    >
      <template #applicationNo="{ row }">
        <el-button link tpye="" @click="handleApplicationDetail(row)">
          {{ row.applicationNo }}
        </el-button>
      </template>
      <template #action="{ row }">
        <el-button link tpye="" @click="handleApplicationDetail(row)">
          申请详情
        </el-button>
        <el-button link tpye="" @click="handleViewComments(row)">
          查看意见
        </el-button>
        <el-button link tpye="" @click="handleViewDueDiligence(row)">
          查看尽职调查报告
        </el-button>
        <el-button link tpye="" @click="handleViewFlowRecord(row)">
          查看流转记录
        </el-button>
        <el-button link tpye="" @click="handleViewEvaluationForm(row)">
          查看调查报告评价表
        </el-button>
        <el-button link tpye="" @click="handleViewApprovalNotice(row)">
          查看批复通知书
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- 查看尽职调查报告对话框 -->
  <Dialog 
    :model-value="dueDiligenceDialogVisible" 
    @update:model-value="dueDiligenceDialogVisible = $event"
    title="查看尽职调查报告" 
    :fullscreen="false"
    :append-to-body="true"
    width="1200px"
  >
    <el-table
      v-loading="dueDiligenceLoading"
      :data="dueDiligenceList"
      border
      style="width: 100%"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="报告编号" prop="reportNo" min-width="150" />
      <el-table-column label="报告名称" prop="reportName" min-width="200" show-overflow-tooltip />
      <el-table-column label="报告类型" prop="reportType" min-width="120" />
      <el-table-column label="调查人" prop="investigator" min-width="120" />
      <el-table-column label="调查日期" prop="investigateDate" min-width="120" />
      <el-table-column label="报告状态" prop="status" min-width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="报告摘要" prop="summary" min-width="300" show-overflow-tooltip />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button link tpye="" @click="handleViewReportDetail(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="dueDiligenceDialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { occurrenceTypeOptions } from '../const/pendding'
import type { TableColumn } from '@/types/table'
// @ts-ignore
import Dialog from '@/components/Dialog/src/Dialog.vue'

defineOptions({ name: 'ApprovedApplication' })

const message = useMessage()
const router = useRouter()

// 查询参数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  applicationNo: undefined,
  applicationNoOperator: 'startsWith',
  applicantName: undefined,
  applicantNameOperator: 'contains',
  merchantId: undefined,
  merchantIdOperator: 'startsWith',
  businessType: undefined,
  businessTypeOperator: 'startsWith',
  occurrenceType: undefined,
  occurrenceTypeOperator: 'equals'
})

const queryFormRef = ref()
const selectedRows = ref<any[]>([])

// 尽职调查报告相关
const dueDiligenceDialogVisible = ref(false)
const dueDiligenceLoading = ref(false)
const dueDiligenceList = ref<any[]>([])

// 金额格式化函数
const amountFormatter = (_: any, __: any, cellValue: any) => {
  if (cellValue == null || cellValue === '') return ''
  return new Intl.NumberFormat('zh-CN', {
    style: 'decimal',
    // currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cellValue)
}

// 日期格式化函数
const dateFormatter = (_: any, __: any, cellValue: any) => {
  if (cellValue == null || cellValue === '') return ''
  return cellValue
}

// 表格列配置
const tableColumns: TableColumn[] = [
  { label: '申请编号', field: 'applicationNo', minWidth: 220, fixed: 'left' as const },
  { label: '客户名称', field: 'applicantName', minWidth: 320 },
  { label: '商户标识', field: 'merchantId', minWidth: 120 },
  { label: '业务品种', field: 'businessType', minWidth: 150 },
  { label: '发生类型', field: 'occurrenceType', minWidth: 120 },
  { label: '业务流程类型', field: 'processType', minWidth: 120 },
  { label: '币种', field: 'currency', minWidth: 80 },
  { label: '申请金额', field: 'amount', minWidth: 150, formatter: amountFormatter },
  { label: '业务来源', field: 'businessSource', minWidth: 120 },
  { label: '申请人', field: 'applicant', minWidth: 120 },
  { label: '申请机构', field: 'applyOrg', minWidth: 150 },
  { label: '当前流程', field: 'currentProcess', minWidth: 120 },
  { label: '当前阶段', field: 'currentStage', minWidth: 120 },
  { label: '完成时间', field: 'completeTime', minWidth: 180, formatter: dateFormatter },
  { label: '合作项目名称', field: 'projectName', minWidth: 320 },
  { label: '操作', field: 'action', width: 480, fixed: 'right' as const }
]

// 模拟数据
const mockDataList = [
  {
    id: 1,
    applicationNo: 'BA2025102900000040',
    applicantName: '槎猫',
    merchantId: '',
    businessType: '一般经营性贷款',
    occurrenceType: '新增',
    processType: '供应链',
    currency: '人民币',
    amount: 20000.00,
    businessSource: '项備痔',
    applicant: '项備痔',
    applyOrg: '总营公司业务二部',
    currentProcess: '审批通过',
    currentStage: '已完成',
    completeTime: '2024-01-20 10:30:00',
    projectName: '一般经营性贷款项目'
  },
  {
    id: 2,
    applicationNo: 'BA2025082600000031',
    applicantName: '张起灵',
    merchantId: '',
    businessType: '一般经营性贷款',
    occurrenceType: '新增',
    processType: '供应链',
    currency: '人民币',
    amount: 50000.00,
    businessSource: '项图库',
    applicant: '项图库',
    applyOrg: '总营公司业务二部',
    currentProcess: '审批通过',
    currentStage: '已完成',
    completeTime: '2024-01-21 14:20:00',
    projectName: '一般经营性贷款项目'
  },
  {
    id: 3,
    applicationNo: 'BA2025081400000021',
    applicantName: '广东海大集团股份有限公司',
    merchantId: '',
    businessType: '短期流动资金贷款',
    occurrenceType: '新增',
    processType: '供应链',
    currency: '人民币',
    amount: 20000.00,
    businessSource: '项提',
    applicant: '项提',
    applyOrg: '总营公司业务二部',
    currentProcess: '审批通过',
    currentStage: '已完成',
    completeTime: '2024-01-22 09:15:00',
    projectName: '短期流动资金贷款项目'
  },
  {
    id: 4,
    applicationNo: 'BA2025071500000015',
    applicantName: '股苑',
    merchantId: '',
    businessType: '消费贷款',
    occurrenceType: '新增',
    processType: '消费',
    currency: '人民币',
    amount: 1000.00,
    businessSource: '项备',
    applicant: '项备',
    applyOrg: '总营公司业务二部',
    currentProcess: '审批通过',
    currentStage: '已完成',
    completeTime: '2024-01-23 16:45:00',
    projectName: '消费贷款项目'
  },
  {
    id: 5,
    applicationNo: 'BA2025062000000010',
    applicantName: '朱绝反',
    merchantId: '',
    businessType: '短期流动资金贷款',
    occurrenceType: '新增',
    processType: '小微',
    currency: '人民币',
    amount: 50000.00,
    businessSource: '项图',
    applicant: '项图',
    applyOrg: '总营公司业务二部',
    currentProcess: '审批通过',
    currentStage: '已完成',
    completeTime: '2024-01-24 11:30:00',
    projectName: '短期流动资金贷款项目'
  }
]

// 使用 useTable hook
const { tableObject, tableMethods } = useTable({
  getListApi: async (params: any) => {
    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 根据查询条件和操作符过滤数据
    let filteredList = [...mockDataList]
    
    // 申请编号过滤
    if (params.applicationNo) {
      const operator = params.applicationNoOperator || 'startsWith'
      filteredList = filteredList.filter(item => {
        if (operator === 'startsWith') {
          return item.applicationNo.startsWith(params.applicationNo)
        } else if (operator === 'contains') {
          return item.applicationNo.includes(params.applicationNo)
        } else if (operator === 'equals') {
          return item.applicationNo === params.applicationNo
        }
        return true
      })
    }
    
    // 客户名称过滤
    if (params.applicantName) {
      const operator = params.applicantNameOperator || 'contains'
      filteredList = filteredList.filter(item => {
        if (operator === 'startsWith') {
          return item.applicantName.startsWith(params.applicantName)
        } else if (operator === 'contains') {
          return item.applicantName.includes(params.applicantName)
        } else if (operator === 'equals') {
          return item.applicantName === params.applicantName
        }
        return true
      })
    }
    
    // 商户标识过滤
    if (params.merchantId) {
      const operator = params.merchantIdOperator || 'startsWith'
      filteredList = filteredList.filter(item => {
        if (operator === 'startsWith') {
          return (item.merchantId || '').startsWith(params.merchantId)
        } else if (operator === 'contains') {
          return (item.merchantId || '').includes(params.merchantId)
        } else if (operator === 'equals') {
          return item.merchantId === params.merchantId
        }
        return true
      })
    }
    
    // 业务品种过滤
    if (params.businessType) {
      const operator = params.businessTypeOperator || 'startsWith'
      filteredList = filteredList.filter(item => {
        if (operator === 'startsWith') {
          return item.businessType.startsWith(params.businessType)
        } else if (operator === 'contains') {
          return item.businessType.includes(params.businessType)
        } else if (operator === 'equals') {
          return item.businessType === params.businessType
        }
        return true
      })
    }
    
    // 发生类型过滤
    if (params.occurrenceType) {
      const operator = params.occurrenceTypeOperator || 'equals'
      filteredList = filteredList.filter(item => {
        if (operator === 'equals') {
          return item.occurrenceType === params.occurrenceType
        } else if (operator === 'contains') {
          return item.occurrenceType.includes(params.occurrenceType)
        }
        return true
      })
    }
    
    // 分页
    const pageNo = params.pageNo || 1
    const pageSize = params.pageSize || 10
    const start = (pageNo - 1) * pageSize
    const end = start + pageSize
    const pageList = filteredList.slice(start, end)
    
    return {
      list: pageList,
      total: filteredList.length
    }
  },
  defaultParams: { ...queryParams }
})

const { getList, setSearchParams } = tableMethods

// 表格选择变化
const handleSelectionChange = (val) => {
  val ? selectedRows.value = [val] : selectedRows.value = []
}

/** 搜索按钮操作 */
const handleQuery = () => {
  setSearchParams(queryParams)
  getList()
}

/** 取消按钮操作 */
const handleCancel = () => {
  handleQuery()
}

/** 清空按钮操作 */
const handleClear = () => {
  Object.assign(queryParams, {
    pageNo: 1,
    pageSize: 10,
    applicationNo: undefined,
    applicationNoOperator: 'startsWith',
    applicantName: undefined,
    applicantNameOperator: 'contains',
    merchantId: undefined,
    merchantIdOperator: 'startsWith',
    businessType: undefined,
    businessTypeOperator: 'startsWith',
    occurrenceType: undefined,
    occurrenceTypeOperator: 'equals'
  })
  handleQuery()
}

/** 申请详情操作 */
const handleApplicationDetail = async (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  // 跳转到审批通过申请的详情页面
  const detailPath = `/creditapplication/approved/detail/${row.id}`
  await router.push({
    path: detailPath,
    query: {
      applicationNo: row.applicationNo
    }
  })
}

/** 查看意见 */
const handleViewComments = (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  message.info(`查看意见功能待实现 - 申请编号: ${row.applicationNo}`)
  // TODO: 实现查看意见功能
}

/** 查看尽职调查报告 */
const handleViewDueDiligence = async (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  
  dueDiligenceDialogVisible.value = true
  
  // 加载尽职调查报告数据
  await getDueDiligenceList(row.id)
}

/** 获取尽职调查报告列表 */
const getDueDiligenceList = async (_applicationId: number) => {
  try {
    dueDiligenceLoading.value = true
    
    // TODO: 调用实际接口
    // const data = await ApprovedApplicationApi.getDueDiligenceReports(applicationId)
    // dueDiligenceList.value = data
    
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 300))
    dueDiligenceList.value = [
      {
        id: 1,
        reportNo: 'DD202401001',
        reportName: '客户信用调查报告',
        reportType: '信用调查',
        investigator: '张三',
        investigateDate: '2024-01-15',
        status: '已完成',
        summary: '客户信用状况良好，无不良记录，经营稳定，具备还款能力。'
      },
      {
        id: 2,
        reportNo: 'DD202401002',
        reportName: '企业经营状况调查报告',
        reportType: '经营调查',
        investigator: '李四',
        investigateDate: '2024-01-16',
        status: '已完成',
        summary: '企业经营状况良好，财务状况健康，现金流充足，具备良好的还款能力。'
      }
    ]
  } catch (error) {
    console.error('获取尽职调查报告失败：', error)
    message.error('获取尽职调查报告失败')
  } finally {
    dueDiligenceLoading.value = false
  }
}

/** 查看报告详情 */
const handleViewReportDetail = (row: any) => {
  message.info(`查看报告详情功能待实现 - 报告编号: ${row.reportNo}`)
  // TODO: 实现查看报告详情功能
}

/** 查看流转记录 */
const handleViewFlowRecord = (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  message.info(`查看流转记录功能待实现 - 申请编号: ${row.applicationNo}`)
  // TODO: 实现查看流转记录功能
}

/** 查看调查报告评价表 */
const handleViewEvaluationForm = (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  message.info(`查看调查报告评价表功能待实现 - 申请编号: ${row.applicationNo}`)
  // TODO: 实现查看调查报告评价表功能
}

/** 查看批复通知书 */
const handleViewApprovalNotice = (row: any) => {
  if (!row) {
    message.warning('参数错误')
    return
  }
  message.info(`查看批复通知书功能待实现 - 申请编号: ${row.applicationNo}`)
  // TODO: 实现查看批复通知书功能
}

/** 导出EXCEL */
const handleExport = () => {
  message.info('导出EXCEL功能待实现')
  // TODO: 实现导出EXCEL功能
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>

