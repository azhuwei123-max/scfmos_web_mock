<template>
  <ContentWrap :body-style="{ padding: '0px' }">
    <div class="m-10px">
      <el-button tpye="">详情</el-button>
    </div>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background: '#F7F8FA' }"
      highlight-current-row
      show-overflow-tooltip
      @current-change="tableCurrentChange"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        align="center"
        :label="col.label"
        :prop="col.prop"
      />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as templateApi from '@/api/dynamicForm/index.js'
import * as Api from './api.js'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
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
  tableCurrentChange
} = useTableList(Api.qryQuotaAllocationInfoPage, props.params, false)

const columns = ref([])
const getTemplateVO = () => {
  templateApi.getTemplateVO({ templateNo: 'CreditAllotList' }).then((res) => {
    columns.value = res.templates?.filter(v => v['colvisible'] === '1').map((v) => ({
      label: v['colheader'],
      prop: v['colname']?.toLocaleLowerCase() ?? ''
    }))
  })
}

const initFetch = () => {
  loading.value = true
  Promise.all([getList(), getTemplateVO()]).then((res) => {})
}

initFetch()
</script>