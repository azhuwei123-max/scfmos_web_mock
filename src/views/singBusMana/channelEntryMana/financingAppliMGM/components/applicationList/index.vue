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
      <el-form-item label="统一社会信用代码" prop="certid">
        <el-input
          v-model="queryParams.certid"
          class="!w-240px"
          clearable
          placeholder="请输入统一社会信用代码"
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
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="display: flex; margin-bottom: 17px">
      <!-- <el-button
        v-if="appliSubPassVIf"
        @click="appliSubPass(1, 'ApplyPass')"
        :loading="btnLoading.loading1"
      >
        进件通过
      </el-button>
      <el-button
        v-if="appliSubRefuseVIf"
        @click="appliSubRefuse"
      >
        进件拒绝
      </el-button>
      <el-button
        v-if="appliChangeWYVIf"
        @click="selectUser"
        :loading="btnLoading.loading3"
      >
        进件移交
      </el-button>
      <el-button
        v-if="backToApprVIf"
        @click="appliSubPass(4, 'StepBack')"
        :loading="btnLoading.loading4"
      >
        退回待审核
      </el-button> -->
      <!-- <el-button v-if="goDetailVIf"> 详情 </el-button> -->
      <el-button
        v-if="appliChangeWYVIf"
        @click="selectUser"
        :loading="btnLoading.loading3"
      >
        进件移交
      </el-button>
      <!-- <el-button v-if="aaaVIf" @click="checkImage"> 查看影像 </el-button> -->
      
      <el-button v-if="goDetailVIf" @click="goDetail"> 详情 </el-button>
      <el-button v-if="appliSubPassVIf" @click="appliSubPass(1, 'ApplyPass')"> 发起申请 </el-button>
      <el-button v-if="backToApprVIf" @click="appliSubPass(4, 'StepBack')"> 退回待进件 </el-button>
      <el-button v-if="cccVIf" @click="queryAcctInfoPage" :loading="loading3">
        修改收款账号
      </el-button>
      <el-button v-if="appliSubRefuseVIf" @click="appliSubRefuse"> 置为失效 </el-button>
      <el-button v-if="downloadHandleVIf" @click="downloadHandle" :loading="loading2">
        <Icon icon="ep:download" class="mr-5px" /> 导出
      </el-button>
      <!-- <el-button v-if="hhhVIf"> 重新生成待进件 </el-button> -->
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

    <!-- 进件移交 -->
    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="dialogVisible"
      width="1000px"
      :columns="dialogColumns"
      :searchFields="searchFields"
      @confirm="(row) => appliSubPass(3, 'ChangeWYApply', row)"
      :api-method="Api.selectAllUser"
      :extra-params="{}"
    />

    <!-- 修改收款账号 -->
    <MiniPageSelectDialog
      ref="dialogRef2"
      v-model="dialogVisible2"
      width="1200px"
      :columns="dialogColumns2"
      @confirm="modifyAcctNoInfo"
      :api-method="Api.getAcctInfoPage"
      :extra-params="extraParams2"
    />

    <refusePop ref="refusePopRef" @confirm="getList" />

    <!-- 查看影像 -->
    <checkImagePop ref="checkImageRef" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import tempTable from '@/components/dynamicForm/components/tempTable.vue'
import refusePop from './components/refusePop.vue'
import { getColumns } from './common'
import checkImagePop from './components/checkImagePop.vue'
import download from '@/utils/download'
import {checkRoleIds } from '@/utils/permission'

const tempTableRef = ref()

defineOptions({
  name: 'scmltsPushInfoMGMApplicationList'
})

const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

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
  tableCurrentChange,
  fetchCback
} = useTableList(Api.getList, {
  phaseType: props.params.key,
  applyType: 'CTCreditApply',
  codeNo: props.params.codeNo
})
const router = useRouter() // 路由

const columns = getColumns(props.params.key)
// 查询条件展示
const searchVIF = computed(() => {
  return props.params.key?.startsWith('1')
})
// 详情
const goDetailVIf = computed(() => {
  return ['1010', '2010','1020','1030','2020','2030'].includes(props.params.key)
})

// 移交进件
const appliChangeWYVIf = computed(() => {
  return ['1010'].includes(props.params.key) && checkRoleIds(['299','099','0GG','2GG'])
})

// 查看影像
const aaaVIf = computed(() => {
  return ['1010', '1020', '1030', '2010', '2020', '2030'].includes(props.params.key)
})

// 退回待进件
const backToApprVIf = computed(() => {
  return ['1020', '2020'].includes(props.params.key) && checkRoleIds(['480'])
})

// 发起申请
const appliSubPassVIf = computed(() => {
  return ['1010', '2010'].includes(props.params.key) && checkRoleIds(['480'])
})

// 修改收款账号
const cccVIf = computed(() => {
  return ['1010', '1020', '2010', '2020'].includes(props.params.key)  && checkRoleIds(['480'])
})

// 置为失效
const appliSubRefuseVIf = computed(() => {
  return ['1010', '2010'].includes(props.params.key)  && checkRoleIds(['480'])
})

// 导出
const downloadHandleVIf = computed(() => {
  return ['1010', '1020', '2010', '2020'].includes(props.params.key)
})

// 重新生成待进件
const hhhVIf = computed(() => {
  return ['1030', '2030'].includes(props.params.key)
})

fetchCback((list) => {
  list.forEach((v) => {
    v.subbillamt = formatValue(v.subbillamt, 'currency')
  })
})

const goDetail = () => {
  if(!goDetailVIf.value) return;
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/singBusMana/channelEntryMana/financingAppliMGM/detail',
    query: {
      customerID: currentRow.value.customerid,
      serialno: currentRow.value.serialno,
      templateno: props.params.key?.startsWith('10') ? 'TSELCreditApplyInfo' : 'CTCreditApplyInfo',
      t: Date.now()
    }
  })
}

const refusePopRef = ref()
const appliSubRefuse = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  refusePopRef.value.open(currentRow.value)
}

const btnLoading = reactive({
  loading1: false,
  loading2: false,
  loading3: false,
  loading4: false
})
// 进件通过
const appliSubPass = (index, objectType, row) => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  btnLoading[`loading${index}`] = true
  Api.applyProcess({
    objectType,
    customerid: currentRow.value.customerid,
    userid: row?.userid,
    serialno: currentRow.value.serialno
  })
    .then((res) => {
      ElMessage.success('操作成功')

      getList()
    })
    .finally(() => (btnLoading[`loading${index}`] = false))
}

const dialogColumns = [
  { label: '用户ID', prop: 'userid' },
  { label: '用户姓名', prop: 'username' },
  { label: '用户所属机构ID', prop: 'belongorg' },
  { label: '用户所属机构名称', prop: 'belongorgname' }
]

const searchFields = [
  { label: '用户ID', prop: 'userid' },
  { label: '用户姓名', prop: 'username' }
]

const dialogVisible = ref()
const selectUser = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  dialogVisible.value = true
}

// 查看影像
const checkImageRef = ref()
const checkImage = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  checkImageRef.value.open(currentRow.value)
}

// 导出
const loading2 = ref()
const downloadHandle = () => {
  loading2.value = true

  Api.exportExcle({...queryParams,exportFlag:props.params.key})
    .then((res) => {
      download.excel(res, '多级融资进件信息.xls')
    })
    .finally((_) => (loading2.value = false))
}

// 修改收款账号
const dialogRef2 = ref()
const dialogVisible2 = ref()
const dialogColumns2 = [
  { label: '核心机构', prop: 'accountorgname' },
  { label: '账号', prop: 'accountNo' },
  { label: '币种', prop: 'accountcurrencyname' },
  { label: '账户属性', prop: 'depositterm' },
  { label: '账户状态', prop: 'accountstatus' },
  { label: '开户日期', prop: 'startdate' }
]

const extraParams2 = reactive({})
const loading3 = ref()
const queryAcctInfoPage = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  loading3.value = true
  await Api.queryAcctInfoPage({ customerId: currentRow.value.customerid }).finally(
    (_) => (loading3.value = false)
  )

  extraParams2.customerid = currentRow.value.customerid

  dialogVisible2.value = true
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

onActivated(() => {
  getList()
})
</script>
