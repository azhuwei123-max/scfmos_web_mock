<template>
  <ContentWrap v-loading="pageLoading">
    <div style="display: flex; margin-bottom: 17px">
      <el-button @click="queryBalance" :loading="loading1"> 查询账户余额 </el-button>
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
    />

    <!-- 查看详情 -->
    <detail ref="detailRef" />

    <notic-to-ct-pop ref="noticToCTRef" @confirm="getList" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import detail from './components/detail.vue'
import noticToCtPop from './components/noticToCTPop.vue'

defineOptions({
  name: 'ConTractToRegistered'
})

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})

const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

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
} = useTableList(Api.getCoreAcctInfoPage, {
  channelid: 'SXCT001'
})

fetchCback((list) => {
  list.forEach((v) => {
    v.balance1 = formatValue(v.balance, 'currency')
    v.limitamount1 = formatValue(v.limitamount, 'currency')
  })
})

const router = useRouter() // 路由

const columns = [
  { label: '核心机构', field: 'mforgname', minWidth: 130 },
  { label: '账号', field: 'accountno', minWidth: 130 },
  { label: '币种', field: 'accountcurrencyname', minWidth: 150 },
  { label: '账户余额', field: 'balance1', minWidth: 150 },
  { label: '可用余额', field: 'limitamount1' },
  { label: '账户状态', field: 'accountstatus' }
]

const loading1 = ref()
const queryBalance = () => {
  loading1.value = true

  Api.queryBalance({
    channelid: 'SXCT001'
  })
    .then((res) => {
      ElMessage.success('查询成功')

      getList()
    })
    .finally((_) => (loading1.value = false))
}

onActivated(() => {
  getList()
})
</script>
