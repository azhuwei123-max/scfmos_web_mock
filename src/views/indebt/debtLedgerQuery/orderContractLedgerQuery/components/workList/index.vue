<template>
  <ContentWrap class="order-contract-ledger-query">
    <el-alert
      v-if="!selectedProject"
      title="请选择一个线上供应链项目后查看项下订单/合同台账。"
      type="info"
      :closable="false"
      class="mb-12px"
    />

    <el-form label-width="96px" class="project-picker-form">
      <el-form-item label="项目选择">
        <div class="project-picker-row">
          <el-select
            v-model="selectedProjectId"
            filterable
            placeholder="请选择项目"
            class="project-select"
            @change="handleProjectChange"
          >
            <el-option
              v-for="project in projectOptions"
              :key="project.id"
              :label="`${project.projectNo} / ${project.projectName}`"
              :value="project.id"
            />
          </el-select>
          <el-button :loading="projectLoading" @click="loadProjects">
            <Icon icon="ep:refresh" class="mr-4px" />刷新项目
          </el-button>
        </div>
      </el-form-item>
    </el-form>

    <el-descriptions v-if="selectedProject" :column="4" border class="mb-12px">
      <el-descriptions-item label="项目编号">{{ selectedProject.projectNo }}</el-descriptions-item>
      <el-descriptions-item label="项目名称">{{ selectedProject.projectName }}</el-descriptions-item>
      <el-descriptions-item label="核心企业名称">{{ selectedProject.coreEnterpriseName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ selectedProject.coreCustomerNo }}</el-descriptions-item>
    </el-descriptions>

    <Search
      :schema="allSchemas.searchSchema"
      :model="tableObject.params"
      :default-expand="false"
      @search="handleSearch"
      @reset="handleSearch"
    />

    <ActionBar :buttons="visibleButtons" />

    <Table
      :columns="tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{ total: tableObject.total }"
      highlight-current-row
      :show-overflow-tooltip="true"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @cell-click="handleCellClick"
      @register="register"
    >
      <template #contractTotalAmount="{ row }">{{ formatAmount(row.contractTotalAmount) }}</template>
      <template #currentUsedAmount="{ row }">{{ formatAmount(row.currentUsedAmount) }}</template>
      <template #remainingAvailableAmount="{ row }">{{ formatAmount(row.remainingAvailableAmount) }}</template>
      <template #action="{ row }">
        <el-button link type="primary" @click.stop="openImage(row)">
          <Icon icon="ep:picture" class="mr-3px" />查看影像
        </el-button>
        <el-button link type="primary" @click.stop="openAssetItems(row)">
          查看项下资产明细
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <el-dialog v-model="detailVisible" title="订单/合同台账详情" width="980px" destroy-on-close>
    <el-descriptions v-if="detailRecord" :column="3" border>
      <el-descriptions-item label="订单/合同流水号">{{ detailRecord.orderContractFlowNo }}</el-descriptions-item>
      <el-descriptions-item label="订单/合同编号">{{ detailRecord.orderContractNo }}</el-descriptions-item>
      <el-descriptions-item label="客户名称">{{ detailRecord.customerName }}</el-descriptions-item>
      <el-descriptions-item label="核心客户编号">{{ detailRecord.coreCustomerNo }}</el-descriptions-item>
      <el-descriptions-item label="签约方1">{{ detailRecord.partyOne }}</el-descriptions-item>
      <el-descriptions-item label="签约方2">{{ detailRecord.partyTwo }}</el-descriptions-item>
      <el-descriptions-item label="签约方3">{{ detailRecord.partyThree }}</el-descriptions-item>
      <el-descriptions-item label="订单/合同总金额">
        {{ formatAmount(detailRecord.contractTotalAmount) }} {{ detailRecord.currency }}
      </el-descriptions-item>
      <el-descriptions-item label="本次使用金额">
        {{ formatAmount(detailRecord.currentUsedAmount) }} {{ detailRecord.currency }}
      </el-descriptions-item>
      <el-descriptions-item label="剩余可用金额">
        {{ formatAmount(detailRecord.remainingAvailableAmount) }} {{ detailRecord.currency }}
      </el-descriptions-item>
      <el-descriptions-item label="合同起始日">{{ detailRecord.contractStartDate }}</el-descriptions-item>
      <el-descriptions-item label="合同到期日">{{ detailRecord.contractEndDate }}</el-descriptions-item>
      <el-descriptions-item label="数据来源">{{ detailRecord.dataSource }}</el-descriptions-item>
      <el-descriptions-item label="申请日期">{{ detailRecord.applicationDate }}</el-descriptions-item>
      <el-descriptions-item label="生效日期">{{ detailRecord.effectiveDate }}</el-descriptions-item>
      <el-descriptions-item v-if="detailRecord.invalidDate" label="失效日期">
        {{ detailRecord.invalidDate }}
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>

  <el-dialog v-model="assetVisible" title="项下资产明细" width="920px" destroy-on-close>
    <el-table :data="assetItems" border size="small">
      <el-table-column prop="productCode" label="商品编码" min-width="145" />
      <el-table-column prop="productName" label="商品名称" min-width="145" />
      <el-table-column prop="largeCategory" label="商品大类" min-width="110" />
      <el-table-column prop="middleCategory" label="商品中类" min-width="110" />
      <el-table-column prop="smallCategory" label="商品小类" min-width="110" />
      <el-table-column prop="origin" label="产地" min-width="110" />
      <el-table-column prop="warehouseName" label="仓储地" min-width="150" />
      <el-table-column prop="quantityOrWeight" label="数量/重量" min-width="120" align="right" />
      <el-table-column label="最新单价" min-width="120" align="right">
        <template #default="{ row }">{{ formatAmount(row.latestUnitPrice) }}</template>
      </el-table-column>
      <el-table-column label="最新在库货值" min-width="135" align="right">
        <template #default="{ row }">{{ formatAmount(row.latestInventoryValue) }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>

  <el-dialog v-model="imageVisible" title="订单/合同影像" width="720px" destroy-on-close>
    <el-alert
      :title="`订单/合同编号：${imageRecord?.orderContractNo || ''}`"
      type="info"
      :closable="false"
      class="mb-16px"
    />
    <div class="image-file-list">
      <div class="image-file-card">
        <Icon icon="ep:document" class="image-file-icon" />
        <div>
          <strong>订单/合同签署影像.pdf</strong>
          <p>签约方及合同金额影像材料</p>
        </div>
      </div>
      <div class="image-file-card">
        <Icon icon="ep:files" class="image-file-icon" />
        <div>
          <strong>关联业务合同影像.pdf</strong>
          <p>{{ imageRecord?.relatedBusinessContractNo || '关联业务合同' }}</p>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, onActivated, reactive, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { ActionBar, type ActionButton } from '@/components/ActionBar'
import { useCrudSchemas, type CrudSchema } from '@/hooks/web/useCrudSchemas'
import * as OrderContractLedgerApi from '@/api/indebt/orderContractLedgerQuery'

defineOptions({ name: 'OrderContractLedgerWorkList' })

type LedgerStatus = OrderContractLedgerApi.OrderContractLedgerStatus
type LedgerRecord = OrderContractLedgerApi.OrderContractLedgerRecord
type LedgerProject = OrderContractLedgerApi.OrderContractLedgerProject
type LedgerAssetItem = OrderContractLedgerApi.OrderContractLedgerAssetItem

const props = defineProps<{ params?: { status?: LedgerStatus } }>()
const currentStatus = computed<LedgerStatus>(() => (props.params?.status === 'invalid' ? 'invalid' : 'valid'))

const projectOptions = ref<LedgerProject[]>([])
const selectedProjectId = ref<number>()
const projectLoading = ref(false)
const selectedProject = computed(() => projectOptions.value.find((item) => item.id === selectedProjectId.value))

const formatAmount = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return '-'
  return amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const crudSchemas = reactive<CrudSchema[]>([
  { label: '订单/合同流水号', field: 'orderContractFlowNo', minWidth: 170 },
  { label: '订单/合同编号', field: 'orderContractNo', minWidth: 155 },
  {
    label: '客户名称',
    field: 'customerName',
    minWidth: 170,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入客户名称' } }
  },
  {
    label: '核心客户编号',
    field: 'coreCustomerNo',
    minWidth: 155,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入核心客户编号' } }
  },
  { label: '签约方1', field: 'partyOne', minWidth: 170 },
  { label: '签约方2', field: 'partyTwo', minWidth: 170 },
  { label: '签约方3', field: 'partyThree', minWidth: 170 },
  { label: '订单/合同总金额', field: 'contractTotalAmount', minWidth: 145 },
  { label: '本次使用金额', field: 'currentUsedAmount', minWidth: 135 },
  { label: '剩余可用金额', field: 'remainingAvailableAmount', minWidth: 135 },
  { label: '币种', field: 'currency', minWidth: 95 },
  { label: '合同起始日', field: 'contractStartDate', minWidth: 125 },
  { label: '合同到期日', field: 'contractEndDate', minWidth: 125 },
  {
    label: '关联业务合同编号',
    field: 'relatedBusinessContractNo',
    minWidth: 175,
    isSearch: true,
    search: { componentProps: { placeholder: '请输入关联业务合同编号' } }
  },
  { label: '数据来源', field: 'dataSource', minWidth: 120 },
  { label: '申请日期', field: 'applicationDate', minWidth: 125 },
  { label: '生效日期', field: 'effectiveDate', minWidth: 125 },
  { label: '失效日期', field: 'invalidDate', minWidth: 125 },
  { label: '操作', field: 'action', fixed: 'right', width: 220 }
])

const { allSchemas } = useCrudSchemas(crudSchemas)
const tableColumns = computed(() =>
  allSchemas.tableColumns.filter((column) => currentStatus.value === 'invalid' || column.field !== 'invalidDate')
)

const getCurrentPage = (params: Recordable) =>
  OrderContractLedgerApi.getOrderContractLedgerPage({
    ...params,
    status: currentStatus.value,
    projectId: selectedProjectId.value
  })

const { register, tableObject, tableMethods } = useTable<LedgerRecord>({
  getListApi: getCurrentPage,
  defaultParams: { status: currentStatus.value }
})
const { getList, setSearchParams } = tableMethods

const detailVisible = ref(false)
const detailRecord = ref<LedgerRecord>()
const imageVisible = ref(false)
const imageRecord = ref<LedgerRecord>()
const assetVisible = ref(false)
const assetItems = ref<LedgerAssetItem[]>([])

const handleCellClick = (record: LedgerRecord) => {
  tableObject.currentRow = record
}

const handleSearch = (params: Recordable) => {
  tableObject.currentRow = null
  setSearchParams({ ...params, status: currentStatus.value, projectId: selectedProjectId.value })
}

const loadProjects = async () => {
  projectLoading.value = true
  try {
    projectOptions.value = await OrderContractLedgerApi.getOrderContractLedgerProjects()
    if (!selectedProjectId.value && projectOptions.value.length) {
      selectedProjectId.value = projectOptions.value[0].id
    }
    await getList()
  } finally {
    projectLoading.value = false
  }
}

const handleProjectChange = async () => {
  tableObject.currentRow = null
  tableObject.currentPage = 1
  await getList()
}

const requireCurrentRecord = (): LedgerRecord | undefined => {
  if (!tableObject.currentRow) {
    ElMessage.warning('请先点击选择一条订单/合同台账')
    return undefined
  }
  return tableObject.currentRow
}

const openDetail = async () => {
  const record = requireCurrentRecord()
  if (!record) return
  detailRecord.value = await OrderContractLedgerApi.getOrderContractLedgerDetail(record.id)
  detailVisible.value = true
}

const openImage = (record: LedgerRecord) => {
  tableObject.currentRow = record
  imageRecord.value = record
  imageVisible.value = true
}

const openAssetItems = async (record?: LedgerRecord) => {
  const current = record || requireCurrentRecord()
  if (!current) return
  tableObject.currentRow = current
  assetItems.value = await OrderContractLedgerApi.getOrderContractLedgerAssetItems(current.id)
  assetVisible.value = true
}

const handleExport = () => {
  ElMessage.success('Mock 已生成订单/合同台账导出任务')
}

const visibleButtons = computed<ActionButton[]>(() => [
  { key: 'detail', label: '详情', icon: 'ep:document', plain: true, onClick: openDetail },
  { key: 'export', label: '导出 Excel', icon: 'ep:download', plain: true, onClick: handleExport }
])

watch(
  currentStatus,
  (status) => {
    tableObject.currentRow = null
    tableObject.currentPage = 1
    setSearchParams({ ...tableObject.params, status, projectId: selectedProjectId.value })
  },
  { immediate: true }
)

onActivated(() => {
  loadProjects()
})
</script>

<style scoped lang="scss">
.order-contract-ledger-query {
  min-width: 0;
}

.project-picker-form {
  padding: 10px 12px 0;
  border: 1px solid #e6ebf2;
  border-radius: 6px;
  margin-bottom: 12px;
  background: #fbfdff;
}

.project-picker-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.project-select {
  flex: 1;
}

.image-file-list {
  display: grid;
  gap: 12px;
}

.image-file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 72px;
  padding: 12px 16px;
  border: 1px solid #e3e9f2;
  border-radius: 6px;
  background: #fafcff;

  .image-file-icon {
    color: #3d7ad6;
    font-size: 28px;
  }

  strong {
    display: block;
    color: #27364b;
  }

  p {
    margin: 5px 0 0;
    color: #8492a6;
    font-size: 13px;
  }
}
</style>
