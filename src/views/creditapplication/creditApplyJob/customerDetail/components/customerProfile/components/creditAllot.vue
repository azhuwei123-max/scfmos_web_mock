<template>
  <ContentWrap>
    <div class="mb-15px">
      <el-button @click="add" v-if ="(props.phaseNo=='0010' || props.phaseNo=='3000') && props.type !='Y'">新增</el-button>
      <el-button @click="detail">详情</el-button>
      <el-button @click="delete1" v-if ="(props.phaseNo=='0010' || props.phaseNo=='3000') && props.type !='Y'">删除</el-button>
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
      @row-dblclick="detail"
    />
    <creditAllotDetailPop ref="creditAllotDetailPopRef"        @confirm="creditAllotDetailConfirm"/>
    <editCreditAllotDetailPop ref="editCreditAllotDetailPopRef"        @confirm="creditAllotDetailConfirm"/>
  </ContentWrap>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from '../api.js'
import { useMessage } from '@/hooks/web/useMessage'
import creditAllotDetailPop from '../components/creditAllotDetail.vue'
import editCreditAllotDetailPop from '../components/editCreditAllotDetail.vue'
const props = defineProps({
  serialNo: String,
  flag:String,
  phaseNo:String
})
const { confirmFetch } = useMessage()
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
} = useTableList(Api.creditAllotInfo, {objectNo:props.serialNo}, true)

const columns = [
  { label: '分项额度品种', field: 'businessTypeName' },
  { label: '客户名称', field: 'customerName' },
  { label: '业务币种', field: 'businessCurrencyName' },
  { label: '额度金额', field: 'businessSum' },
  { label: '敞口金额', field: 'exposureSum' },
  { label: '是否循环', field: 'cycleFlagName' },
  { label: '登记日期', field: 'inputDate' }
]

const creditAllotDetailPopRef = ref()
const add = async () => {
    const params = {
      serialNo: props.serialNo,
    }
    const res = await Api.getTempSaveFlag(params)
    if(res!='2'){
       ElMessage.warning('请先保存额度信息后，再录入额度分配信息！')
       return false
    }
  creditAllotDetailPopRef.value.open(props.serialNo)
}




const editCreditAllotDetailPopRef = ref()
const detail = async () => {
   if (!currentRow.value) return ElMessage.warning('请选择 1 条数据')
  editCreditAllotDetailPopRef.value.open(currentRow.value.serialNo,props.serialNo,props.phaseNo,props.type)
}

const delete1 =  () => {
   if (!currentRow.value) return ElMessage.warning('请选择 1 条数据')
   const serialNo = currentRow.value.serialNo
   confirmFetch({
       title: '确定要删除选中的数据吗',
       fetchFunc: () => Api.deleteCreditAllot({ serialNo: serialNo})
     }).then((_) => {
       ElMessage.success('删除成功')
   
       getList()
     })
}

const creditAllotDetailConfirm =  () => {
    getList()
}


</script>
