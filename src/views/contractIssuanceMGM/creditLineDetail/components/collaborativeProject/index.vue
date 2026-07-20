<template>
  <!-- 列表 -->
  <ContentWrap>
    <el-button @click="goDetail" plain type="">
      <Icon class="mr-5px" icon="ep:edit" />
      详情
    </el-button>
  </ContentWrap>
  <ContentWrap>
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="list"
      :header-cell-style="{ background: '#F7F8FA' }"
      highlight-current-row
      show-overflow-tooltip
      @current-change="tableCurrentChange"
      @row-dblclick="goDetail"
    >
      
      <el-table-column align="center" label="关联流水号" prop="serialNo" />
      <el-table-column align="center" label="合作项目编号" prop="projectID" />
      <el-table-column align="center" label="合作项目名称" prop="projectName" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />

    <detail ref="detailRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import detail from './components/detail.vue'

defineOptions({
  name: 'creditLineCollaborativeProject'
})

const props = defineProps({
  params: Object
})

const route = useRoute() // 路由

const serialNo = computed(()=> props.params?.serialNo || route.query.serialno || route.query.serialNo)

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
} = useTableList(Api.getRelativeTeamWorkList, { SerialNo: serialNo.value })

const router = useRouter()

const detailRef = ref()
const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择')

  // detailRef.value.open(currentRow.value)

  router.push({
    path: '/projectMana/projectInfoMana/projectDetails',
    query: {
      customerId: currentRow.value.customerID,
      objectType: 'projectSearch',
      projectId: currentRow.value.projectID,
      type: currentRow.value.type,
      businessType: route.query.businessType,
      serialNoByList: currentRow.value.serialNo,
    }
  })
}


const selectTeamWorkPopRef = ref()
const addTeam = () => {
  if (!currentRow.value) return ElMessage.warning('请选择')

  selectTeamWorkPopRef.value.open(currentRow.value)
}
</script>