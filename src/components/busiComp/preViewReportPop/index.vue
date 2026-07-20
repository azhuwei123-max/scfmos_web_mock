<template>
  <Dialog v-model="visible" title="查看额度批复通知书" width="1000px" top="5vh">
    <ContentWrap>
      <div>
        <el-button tpye="" @click="viewEdpfReport" :loading="btnLoading">查看额度批复通知书</el-button>
      </div>
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
      <!-- <el-button tpye="" :loading="saving" @click="confirm">确 定</el-button> -->
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import * as Api from './api.js'
import useTableList from '@/compositions/useTableList'
import { useMessage } from '@/hooks/web/useMessage'

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
  setDefaultParams
} = useTableList(Api.preViewReport, {}, false)

const visible = ref(false)

const columns = [
  { label: '合同流水号', field: 'BCSERIALNO' },
  { label: '客户名称', field: 'CUSTOMERNAME' },
]

const open = ({ objectNo }) => {
  setDefaultParams({ objectNo })
  visible.value = true
  getList()
}

const btnLoading = ref(false)
const viewEdpfReport = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  btnLoading.value = true
  Api.viewEdpfReport({ objectNo: currentRow.value.BCSERIALNO }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.error(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => btnLoading.value = false)
}

defineExpose({
  open
})
</script>