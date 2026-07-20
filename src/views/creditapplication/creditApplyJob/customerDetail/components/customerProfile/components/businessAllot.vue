<template>
  <ContentWrap>
    <div class="mb-15px">
      <el-button @click="add" v-if ="(props.phaseNo=='0010' || props.phaseNo=='3000') && props.type !='Y' ">新增</el-button>
       <el-button @click="detail">详情</el-button>
       <el-button @click="delete1" v-if ="(props.phaseNo=='0010' || props.phaseNo=='3000') && props.type !='Y' ">删除</el-button>
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
    <businessAllotDetailPop ref="businessAllotDetailPopRef"   @confirm="businessAllotDetailConfirm"/>
    <editBusinessAllotDetailPop ref="editBusinessAllotDetailPopRef"   @confirm="businessAllotDetailConfirm"/>
  </ContentWrap>
</template>

<script setup>
import useTableList from '@/compositions/useTableList'
import * as Api from '../api.js'
import businessAllotDetailPop from '../components/businessAllotDetail.vue'
import editBusinessAllotDetailPop from '../components/editBusinessAllotDetail.vue'
const props = defineProps({
  serialNo: String,
  phaseNo:String
})
const { confirmFetch } = useMessage()
// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}
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
} = useTableList(Api.businessAllotList, {objectNo:props.serialNo}, true)

const columns = [
  { label: '分项业务品种', field: 'businessTypeName' },
  { label: '客户名称', field: 'customerName' },
  { label: '业务币种', field: 'businessCurrencyName' },
  { label: '业务切分金额', field: 'businessSum' },
  { label: '业务切分敞口', field: 'exposureSum' },
  { label: '登记日期', field: 'inputDate' }
]

const businessAllotDetailPopRef = ref()
const add = async () => {
    const params = {
      serialNo: props.serialNo
    }
    const res = await Api.getTempSaveFlag(params)
    if(res!='2'){
       ElMessage.warning('请先保存额度信息后，再录入额度分配信息！')
       return false
    }
   businessAllotDetailPopRef.value.open(props.serialNo)
}



const editBusinessAllotDetailPopRef = ref()
const detail = async () => {
   if (!currentRow.value)return ElMessage.warning('请选择 1 条数据')
  editBusinessAllotDetailPopRef.value.open(currentRow.value.serialNo,props.serialNo,props.phaseNo,props.type)
}

const delete1 =  () => {
   if (!currentRow.value) return ElMessage.warning('请选择 1 条数据')
   const serialNo = currentRow.value.serialNo
   confirmFetch({
       title: '确定要删除选中的数据吗',
       fetchFunc: () => Api.deleteBusinessAllot({ serialNo: serialNo})
     }).then((_) => {
       ElMessage.success('删除成功')
   
       getList()
     })
}

const businessAllotDetailConfirm =  () => {
    getList()
}
</script>
