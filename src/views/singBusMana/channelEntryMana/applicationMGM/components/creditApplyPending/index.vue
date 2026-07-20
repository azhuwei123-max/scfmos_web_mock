<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <search-comp-1 v-if="params.type == 1" :queryParams="queryParams" :search="search" :reSearch="reSearch" />
    <search-comp-2 v-if="params.type == 2" :queryParams="queryParams" :search="search" :reSearch="reSearch" />
    <search-comp-3 v-if="params.type == 3" :queryParams="queryParams" :search="search" :reSearch="reSearch" />
    <search-comp-4 v-if="params.type == 4" :queryParams="queryParams" :search="search" :reSearch="reSearch" />
    <search-comp-5 v-if="params.type == 5" :queryParams="queryParams" :search="search" :reSearch="reSearch" />
    <search-comp-6 v-if="params.type == 6" :queryParams="queryParams" :search="search" :reSearch="reSearch" />

    <div style="display: flex; margin-bottom: 17px">
      <el-button v-if="goDetailVIf" @click="goDetail">
        <Icon class="mr-5px" icon="ep:edit" />
        详情
      </el-button>
      <el-button v-if="checkImageVIf" @click="checkImage"> 查看影像 </el-button>
      <el-button v-if="newPutoutVIf" @click="newPutout" :loading="loading3"> 重新生成放贷 </el-button>
      <el-button v-if="exportVIf" @click="downloadHandle" :loading="loading2">
        <Icon icon="ep:download" /> 导出
      </el-button>
    </div>
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
      @row-dblclick="goDetail"
    />

    <!-- 查看影像 -->
    <checkImagePop ref="checkImageRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from '../api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import { getColumns } from '../common.js'
import download from '@/utils/download'
import { checkRoleIds } from '@/utils/permission'

import checkImagePop from './components/checkImagePop.vue'
import searchComp1 from './components/searchComp1.vue'
import searchComp2 from './components/searchComp2.vue'
import searchComp3 from './components/searchComp3.vue'
import searchComp4 from './components/searchComp4.vue'
import searchComp5 from './components/searchComp5.vue'
import searchComp6 from './components/searchComp6.vue'

// defineOptions({
//   name: 'ConTractToRegistered'
// })

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

// 详情
const goDetailVIf = computed(() => ['1', '2', '3'].includes(props.params.type))

// 查看影像
const checkImageVIf = computed(() => ['3'].includes(props.params.type))

// 重新生成放贷
const newPutoutVIf = computed(() => ['4'].includes(props.params.type) && checkRoleIds(['480']))

// 导出
const exportVIf = computed(() => !['3', '5'].includes(props.params.type))

// 删除权限
const delVIf = computed(() => ['01'].includes(props.params.key))

const columns = getColumns(props.params.dealtype, props.params.type)

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
  fetchCback
} = useTableList(Api.getApi(props.params.type), { channel: props.params.dealtype }, false)

fetchCback((list) => {
  list.forEach((v) => {
    v.haidaTransSumOfYear1 = formatValue(v.haidaTransSumOfYear, 'currency')
    v.haidaRecommendSum1 = formatValue(v.haidaRecommendSum, 'currency')

    // 双胞胎
    v.sbtCaiGouSum1 = formatValue(v.sbtCaiGouSum, 'currency')
    v.sbtRecommendSum1 = formatValue(v.sbtRecommendSum, 'currency')

    // 通威
    v.twRecommendSum1 = formatValue(v.twRecommendSum, 'currency')

    // 天马
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.tmRecommendSum1 = formatValue(v.tmRecommendSum, 'currency')

    // 美团
    v.mtCaiGouSum1 = formatValue(v.mtCaiGouSum, 'currency')
    v.mtRecommendSum1 = formatValue(v.mtRecommendSum, 'currency')

    // v.status1 = v.status == '1' ? '取消成功' : v.status == 0 ? '取消失败' : '' 
  })
})

const router = useRouter() // 路由

const goDetail = () => {
  if (!goDetailVIf.value) return

  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/singBusMana/channelEntryMana/applicationMGMDetail',
    query: {
      projectId: currentRow.value.projectId,
      serialNo: currentRow.value.serialNo,
      borrowerType: currentRow.value.borrowerTypeCode,
      systemPushFlagCode: currentRow.value.systemPushFlagCode,
      dealTypeKey: props.params.key,
      borrowerId: currentRow.value.customerID,

      customerId: currentRow.value.customerID,
      
      // 自雇详情参数
      customerType: currentRow.value.customerType,
      mfCustomerID: currentRow.value.mfCustomerID,
      

      // 进入详情来源，01、02...06
      fromPage: props.params.key
    }
  })
}

// 查看影像
const checkImageRef = ref()
const checkImage = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  checkImageRef.value.open(currentRow.value)
}

// 重新生成放贷
const loading3 = ref()
const newPutout = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  Api.newPutout({ serialNo: currentRow.value.serialNo }).then(res => {
    ElMessage.success('操作成功')

    getList()
  }).finally(_ => loading3.value = false)
}

// 导出
const loading2 = ref()
const downloadHandle = () => {
  loading2.value = true

  Api.getExportApi(props.params.type)(queryParams).then(res => {
    download.excel(res, '大供数据.xls')
  }).finally(_ => loading2.value = false)
}

onActivated(()=> {
  getList()
})
</script>
