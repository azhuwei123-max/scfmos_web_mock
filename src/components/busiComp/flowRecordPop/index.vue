<template>
  <Dialog v-model="visible" title="流转记录" width="1200px" top="5vh">
    <Content-Wrap>
      <Table
        :columns="columns"
        :data="list"
        :loading="loading"
        :pagination="{
          total: total
        }"
        highlight-current-row
        v-model:pageSize="queryParams.pageSize"
        v-model:currentPage="queryParams.pageNo"
        @current-change="tableCurrentChange"
        @page-change="getList"
      />
    </Content-Wrap>
  </Dialog>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from './api.js'

const props = defineProps({
  params: Object
})

const {
  queryParams,
  getList,
  loading,
  total,
  list,
  search,
  reSearch,
  currentRow,
  tableCurrentChange,
  fetchCback,
  setDefaultParams
} = useTableList(Api.getFlowRecordPage, {}, false)

const columns = [
  { label: '流水号', field: 'serialNo', minWidth: 120 },
  { label: '对象编号', field: 'objectNo', minWidth: 220 },
  // { label: '对象类型', field: 'objectType', minWidth: 120 },
  { label: '阶段编号', field: 'phaseNo', minWidth: 220 },
  { label: '阶段名称', field: 'phaseName', minWidth: 120 },
  { label: '承办人编号', field: 'userId', minWidth: 220 },
  { label: '承办人', field: 'userName', minWidth: 120 },
  { label: '承办机构', field: 'orgId', minWidth: 120 },
  { label: '承办机构', field: 'orgName', minWidth: 120 },
  { label: '选择动作', field: 'phaseAction', minWidth: 120 },
  { label: '提交意见', field: 'phaseOpinion1', minWidth: 120 },
  { label: '开始时间', field: 'beginTime', minWidth: 120 },
  { label: '结束时间', field: 'endTime', minWidth: 120 }
]

const visible = ref()
const open = (params = {}) => {
  visible.value = true

  setDefaultParams(params)
  getList()
}

defineExpose({
  open
})
</script>
