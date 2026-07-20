<template>
  <Dialog v-model="visible" title="选择" width="1200px" top="5vh" appendToBody>
    <ContentWrap v-loading="loading">
      <el-form inline>
        <el-form-item label="客户名称">
          <el-input
            class="!w-240px"
            v-model="queryParams.customername"
            :placeholder="`搜索客户名称`"
            clearable
          />
        </el-form-item>
        <el-form-item label="客户号">
          <el-input
            class="!w-240px"
            v-model="queryParams.mfcustomerid"
            :placeholder="`搜索客户号`"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="search" tpye=""
            ><Icon class="mr-5px" icon="ep:search" /> 查询
          </el-button>
          <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
        </el-form-item>
      </el-form>
      <Table
        :columns="columns"
        :data="list"
        :loading="loading"
        :pagination="{ total }"
        highlight-current-row
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @current-change="tableCurrentChange"
        @page-change="getList"
      />
    </ContentWrap>
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const {
  queryParams,
  loading,
  getList,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback,
  setDefaultParams
} = useTableList(Api.getCompAndSelfList, {}, false)

const columns = [
  { label: '客户号', field: 'mfcustomerid', minWidth: 120 },
  { label: '客户类型', field: 'customertype', minWidth: 120 },
  { label: '客户名称', field: 'customername', minWidth: 120 },
  { label: '客户证件类型', field: 'certtype', minWidth: 120 },
  { label: '客户证件号码', field: 'certid', minWidth: 120 },
]

const visible = ref(false)

let rowItem = {}
const open = (row) => {
  rowItem = row
  visible.value = true
  getList()
}

const emit = defineEmits(['confirm'])

const saving = ref(false)
const confirm = () => {
  if (!!currentRow.value) {
    ElMessage.warning('请选择')
    return
  }

  visible.value = false
  emit('confirm', currentRow.value)
}

defineExpose({
  open
})
</script>
