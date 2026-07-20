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
      <el-table-column align="center" label="供应链项目名称" prop="projectName" />
      <el-table-column align="center" label="供应链项目流水号" prop="projectID" />
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
 <!-- IFrame Dialog（覆盖显示） -->
    <Dialog
      v-model="iframeDialogVisible"
      :title="iframeTitle"
      width="90%"
      :fullscreen="true"
      :scroll="false"
    >
      <IFrame
        v-if="iframeDialogVisible && iframeUrl"
        :src="iframeUrl"
        :auto-height="true"
        :min-height="'600px'"
        :height-offset="94.5"
      />
    </Dialog>
    <detail ref="detailRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import detail from './components/detail.vue'

defineOptions({
  name: 'creditLineDetail'
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
} = useTableList(Api.getRelativeTeamWorkList, { serialNo: serialNo.value })

/** 添加/修改操作 */
const addCustomerRef = ref()
const add = (type, id) => {
  addCustomerRef.value.open(type, id)
}

/** 打开 IFrame Dialog */
const iframeDialogVisible = ref(false)
const iframeUrl = ref('')
const iframeTitle = ref('')

const detailRef = ref()
const goDetail = async() => {  
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')
  // const tpopentype = 'TeamworkProjectInfo01&TPSERIALNO='+currentRow.value?.projectID
  //   const url = await Api.getIframeUrl({tpopentype:tpopentype})
  //   iframeUrl.value = url
  //   iframeTitle.value = '合作项目情况'
  //   iframeDialogVisible.value = true

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

const router = useRouter()
const goCreditLineDetail = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')
  if (!currentRow.value?.serialNo) return ElMessage.warning('当前项目没有有效的授信额度，请确定！')
  router.push({
    path: '/contractIssuanceMGM/creditLineDetail',
    query: {
      businessType: currentRow.value.businessType,
      customerID: currentRow.value.customerID,
      serialNo: currentRow.value.serialNo,
      t: Date.now()
    }
  })
}


const selectTeamWorkPopRef = ref()
const addTeam = () => {
  if (!currentRow.value?.customerID) return ElMessage.warning('请选择')

  selectTeamWorkPopRef.value.open(currentRow.value)
}





// 监听 Dialog 关闭，延迟清空 URL（避免关闭动画闪烁）
watch(iframeDialogVisible, (visible) => {
  if (!visible) {
    // Dialog 关闭后延迟清空 URL
    setTimeout(() => {
      iframeUrl.value = ''
    }, 300)
  }
})
</script>
