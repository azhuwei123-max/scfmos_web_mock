<template>
  <el-tabs v-model="activeTabName" @tab-change="handleTabChange">
    <el-tab-pane
      v-for="tab in tabs"
      :key="tab.value"
      :name="tab.value"
      :label="tab.label"
    />
  </el-tabs>
  <Content-Wrap>
    <Table
      :columns="allSchemas.tableColumns"
      :data="tableObject.tableList"
      :loading="tableObject.loading"
      :pagination="{
        total: tableObject.total
      }"
      highlight-current-row
      :onRowClick="handleSelectionChange"
      v-model:pageSize="tableObject.pageSize"
      v-model:currentPage="tableObject.currentPage"
      @register="register"
    />
  </Content-Wrap>
</template>

<script setup lang="tsx">
import { CrudSchema } from '@/hooks/web/useCrudSchemas'
import { getDictOptions } from '@/utils/dict'
import { getFlowRecordPage } from '../../api'

const props = withDefaults(defineProps<{
  serialNo: string
}>(),
{})

// tabs 值
const activeTabName = ref('ParamAdjustGYL1')
const tabs = getDictOptions('paramAdjustSwitchPages')

const columns = reactive<CrudSchema[]>([
  { label: '流水号', field: 'serialNo', minWidth: 120 },
  { label: '对象编号', field: 'objectNo', minWidth: 220 },
  { label: '对象类型', field: 'objectType', minWidth: 120 },
  { label: '阶段编号', field: 'phaseNo', minWidth: 220 },
  { label: '阶段名称', field: 'phaseName', minWidth: 120 },
  { label: '承办人编号', field: 'userId', minWidth: 220 },
  { label: '承办人', field: 'userName', minWidth: 120 },
  { label: '承办机构', field: 'orgName', minWidth: 120 },
  { label: '选择动作', field: 'phaseAction', minWidth: 120 },
  { label: '提交意见', field: 'phaseOpinion1', minWidth: 120 },
  { label: '开始时间', field: 'beginTime', minWidth: 120 },
  { label: '结束时间', field: 'endTime', minWidth: 120 }
])

const { allSchemas } = useCrudSchemas(columns)

const { register, tableObject, tableMethods } = useTable({
  getListApi: getFlowRecordPage,
  defaultParams: { serialNo: props.serialNo, objectType: activeTabName.value }
})

const { getList, setSearchParams } = tableMethods
getList()

const handleSelectionChange = (row) => {
  tableObject.currentRow = row
}

const handleTabChange = (tabName)=> {
  setSearchParams({objectType: tabName})
}

</script>
