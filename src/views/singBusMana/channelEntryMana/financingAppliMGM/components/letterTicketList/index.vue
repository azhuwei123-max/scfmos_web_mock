<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <div class="flex items-center mb-2 w-[110px]" @click="handleExpand">
      <Icon v-show="!isExpand" class="mr-4px" icon="ep:plus" />
      <Icon v-show="isExpand" class="mr-4px" icon="ep:minus" />
      <el-button link> 查询条件 </el-button>
    </div>
    <el-form
      ref="queryFormRef"
      v-show="isExpand"
      :model="queryParams"
      class="search-form"
      label-width="auto"
      @keyup.enter="search"
    >
      <el-form-item label="客户名称" prop="customername">
        <el-input
          v-model="queryParams.customername"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="子票票号" prop="subbillnum">
        <el-input
          v-model="queryParams.subbillnum"
          class="!w-240px"
          clearable
          placeholder="请输入子票票号"
        />
      </el-form-item>
      <el-form-item label="母票票号" prop="rootbillnum">
        <el-input
          v-model="queryParams.rootbillnum"
          class="!w-240px"
          clearable
          placeholder="请输入母票票号"
        />
      </el-form-item>
      <el-form-item v-if="searchVIF" label="母票签发人" prop="coreentpayacctcustnm">
        <el-input
          v-model="queryParams.coreentpayacctcustnm"
          class="!w-240px"
          clearable
          placeholder="请输入母票签发人"
        />
      </el-form-item>
      <el-form-item v-if="searchVIF" label="母票签发人统一社会信用代码" prop="coreentcreditcode">
        <el-input
          v-model="queryParams.coreentcreditcode"
          class="!w-240px"
          clearable
          placeholder="请输入母票签发人统一社会信用代码"
        />
      </el-form-item>
      <el-form-item label="购买流水号" prop="serialno">
        <el-input
          v-model="queryParams.serialno"
          class="!w-240px"
          clearable
          placeholder="请输入购买流水号"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
    <div style="display: flex; margin-bottom: 17px">
      <el-button v-if="payConfirmVIf" @click="payConfirm" :loading="btnLoading1">
        确认购买
      </el-button>
      <el-button v-if="editPayAccountVIf" @click="queryAcctInfoPage" :loading="loading3">
        修改收款账号
      </el-button>
      <el-button v-if="checkEditInfoVIf" @click="checkEditInfo">
        查看修改信息
      </el-button>
      <el-button v-if="passVIf" @click="confirmBuy(2, 'Pass')" :loading="btnLoading.loading2"> 通过 </el-button>
      <el-button v-if="backVIf" @click="confirmBuy(3, 'Refuse')" :loading="btnLoading.loading3"> 退回 </el-button>
      <el-button v-if="pass2VIf" @click="modifyAcctNoInfo2(4, 'Pass')" :loading="btnLoading.loading4"> 通过 </el-button>
      <el-button v-if="back2VIf" @click="modifyAcctNoInfo2(5, 'Refuse')" :loading="btnLoading.loading5"> 退回 </el-button>
      <el-button v-if="editStatusVIf" @click="editStatus"> 修改状态 </el-button>
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

    <!-- 修改收款账号 -->
    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="dialogVisible"
      width="1200px"
      :columns="dialogColumns"
      @confirm="modifyAcctNoInfo"
      :api-method="Api.getAcctInfoPage"
      :extra-params="extraParams2"
    />

    <editStatusPop ref="editStatusRef" @confirm="getList" />

    <!-- 查看修改信息 -->
    <checkEditInfoPop ref="checkEditInfoPopRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import tempTable from '@/components/dynamicForm/components/tempTable.vue'
import { getColumns } from './common'
import editStatusPop from './components/editStatusPop.vue'
import { useOldDictStore } from '@/store/modules/oldDict'
import {checkRoleIds } from '@/utils/permission'
import checkEditInfoPop from './components/checkEditInfoPop.vue'

defineOptions({
  name: 'letterTicketList'
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

const tableListAttr = useTableList(Api.pagePutOutList, {
  phaseType: props.params.key,
  applyType: 'CTCreditApply',
  codeNo: props.params.codeNo
}, false)
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
} = tableListAttr

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum1, 'currency')
    v.subbillamt = formatValue(v.subbillamt, 'currency')
    v.buystatus1 = getDictLabels('BuyStatus', v.buystatus)
  })
})

const { getDictFetch, getDictLabels } = useOldDictStore()

const initFetch = () => {
  getDictFetch('BuyStatus').then((res) => {
    getList()
  })
}
initFetch()

const router = useRouter() // 路由

const columns = getColumns(props.params.key)

const tempTableRef = ref()

const customVisible = {
  UpdateDate: ['1070'].includes(props.params.key)
}

const dialogColumns = [
  { label: '核心机构', prop: 'accountorgname' },
  { label: '账号', prop: 'accountNo' },
  { label: '币种', prop: 'accountcurrencyname' },
  { label: '账户属性', prop: 'depositterm' },
  { label: '账户状态', prop: 'accountstatus' },
  { label: '开户日期', prop: 'startdate' }
]

// 查询条件展示
const searchVIF = computed(() => {
  return props.params.key?.startsWith('1')
})

// 进件通过显隐
const payConfirmVIf = computed(() => {
  return ['1040', '2040'].includes(props.params.key) && checkRoleIds(['480'])
})

// 收款账号显隐
const editPayAccountVIf = computed(() => {
  return ['1040', '2040'].includes(props.params.key) && checkRoleIds(['480'])
})

// 查看修改信息
const checkEditInfoVIf = computed(() => {
  return ['1060', '2060'].includes(props.params.key) && checkRoleIds(['428'])
})

// 通过
const passVIf = computed(() => {
  return ['1050', '2050'].includes(props.params.key)&& checkRoleIds(['428'])
})

// 退回
const backVIf = computed(() => {
  return ['1050', '2050'].includes(props.params.key)&& checkRoleIds(['428'])
})

// 通过
const pass2VIf = computed(() => {
  return ['1060', '2060'].includes(props.params.key)&& checkRoleIds(['428'])
})

// 退回
const back2VIf = computed(() => {
  return ['1060', '2060'].includes(props.params.key)&& checkRoleIds(['428'])
})

// 退回
const editStatusVIf = computed(() => {
  return ['1090', '2090'].includes(props.params.key)
})

// 确认购买
const btnLoading1 = ref(false)
const payConfirm = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  btnLoading1.value = true
  Api.confirmBuy({ objectType: 'Submit', serialno: currentRow.value.serialno })
    .then((res) => {
      ElMessage.success('操作成功')

      getList()
    })
    .finally(() => (btnLoading1.value = false))
}

// 修改收款账号
const dialogVisible = ref()
const editPayAccount = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  dialogVisible.value = true
}

// 进件通过
const btnLoading = reactive({
  loading1: false,
  loading2: false,
  loading3: false,
  loading4: false,
  loading5: false,
})

const confirmBuy = (index, objectType, row) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  btnLoading[`loading${index}`] = true
  Api.confirmBuy({
    objectType,
    customerid: currentRow.value.customerid,
    serialno: currentRow.value.serialno
  })
    .then((res) => {
      ElMessage.success('操作成功')

      getList()
    })
    .finally(() => (btnLoading[`loading${index}`] = false))
}

const extraParams2 = reactive({})
const loading3 = ref()
const queryAcctInfoPage = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  await Api.queryAcctInfoPage({ customerId: currentRow.value.customerid }).finally(
    (_) => (loading3.value = false)
  )

  extraParams2.customerid = currentRow.value.customerid

  dialogVisible.value = true
}

const modifyAcctNoInfo = (row) => {
  loading3.value = true
  Api.modifyAcctNoInfo({
    serialno: currentRow.value.serialno,
    accountno: row.accountNo,
    accountname: currentRow.value.customername,
    objectType: 'Submit'
  })
    .then((res) => {
      ElMessage.success('操作成功')

      getList()
    })
    .finally((_) => (loading3.value = false))
}

const modifyAcctNoInfo2 = (index, type) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  btnLoading[`loading${index}`] = true
  Api.modifyAcctNoInfo({
    serialno: currentRow.value.serialno,
    accountname: currentRow.value.customername,
    objectType: type
  })
    .then((res) => {
      ElMessage.success('操作成功')

      getList()
    })
    .finally((_) => (btnLoading[`loading${index}`] = false))
}

// 修改状态
const editStatusRef = ref()
const editStatus = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  editStatusRef.value.open(currentRow.value)
}

// 查看修改信息
const checkEditInfoPopRef = ref(0)
const checkEditInfo = () => {
  // if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  checkEditInfoPopRef.value.open(currentRow.value)
}
onActivated(() => {
  getList()
})
</script>
