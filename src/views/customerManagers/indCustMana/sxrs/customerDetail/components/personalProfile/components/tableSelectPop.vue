<template>
  <Dialog v-model="visible" title="控股类型选择" width="800px">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background: '#F7F8FA' }"
      highlight-current-row
      @current-change="tableCurrentChange"
    >
      
      <el-table-column align="center" label="客户编号" prop="certType" />
      <el-table-column align="center" label="客户名称" prop="customerName" />
      <el-table-column align="center" label="证件号" prop="certID" />
      <el-table-column align="center" label="证件类型" prop="orgNatureName" />
    </el-table>
    <!-- 分页 -->
    <!-- <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    /> -->
    <template #footer>
      <el-button tpye="" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage } from 'element-plus'
const visible = ref(false)
const loading = ref(false)

const queryParams = reactive({})

const total = ref(1)

const list = ref([])
const getList = () => {
  loading.value = true

  setTimeout(() => {
    loading.value = false
    list.value = [
      {
        certType: '2014070500000001',
        customerName: '杭州广富实业有限公司',
        certID: '11330212907333831W',
        orgNatureName: '统一社会信用代码(营业执照)'
      }
    ]
  }, 1000)
}

const open = () => {
  visible.value = true
  getList()
}

const currentRow = ref()

const tableCurrentChange = (val) => {
  currentRow.value = val
}

const emit = defineEmits(['confirm'])

const confirm = () => {
  if (!currentRow.value?.customerName) return ElMessage.warning('请选择')

  emit('confirm', currentRow.value)
  visible.value = false
}

defineExpose({
  open
})
</script>