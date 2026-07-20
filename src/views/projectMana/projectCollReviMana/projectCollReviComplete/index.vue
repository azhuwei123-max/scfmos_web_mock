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
      <el-form-item label="协审编号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          class="!w-240px"
          clearable
          placeholder="请输入协审编号"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          class="!w-240px"
          clearable
          placeholder="请输入项目名称"
        />
      </el-form-item>
      <el-form-item label="客户编号" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          class="!w-240px"
          clearable
          placeholder="请输入客户编号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="申请人" prop="userName">
        <el-input
          v-model="queryParams.userName"
          class="!w-240px"
          clearable
          placeholder="请输入申请人"
        />
      </el-form-item>
      <el-form-item label="申请分行" prop="branchName">
        <el-input
          v-model="queryParams.branchName"
          class="!w-240px"
          clearable
          placeholder="请输入申请分行"
        />
      </el-form-item>
      <el-form-item label="审批结果" prop="phaseNo">
        <el-select
          v-model="queryParams.phaseNo"
          placeholder="请选择处理状态"
          class="!w-240px"
        >
          <el-option
            v-for="item in phaseNoOptions"
            :key="item.itemNo"
            :label="item.itemName"
            :value="item.itemNo"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>

    <div style="display: flex; margin-bottom: 17px">
      <el-button @click="goDetail">
        <Icon class="mr-5px" icon="ep:edit" />
        详情
      </el-button>
      <el-button @click="viewPhaseOpinion">
        <Icon class="mr-5px" icon="ep:edit" />
        查看意见
      </el-button>
      <el-button @click="downloadHandle" :loading="loading2">
        <Icon class="mr-5px" icon="ep:download" />
        导出
      </el-button>
      <el-button @click="toRecord"> 查看流转记录 </el-button>
    </div>
    <Table
      :columns="columns"
      :data="list"
      :loading="loading"
      :pagination="{
        total: total
      }"
      v-model:pageSize="queryParams.pageSize"
      v-model:currentPage="queryParams.pageNo"
      @current-change="handleSelectChange"
      @page-change="getList"
      @row-dblclick="goDetail"
      highlight-current-row
    />

    <flowRecordPop ref="flowRecordRef" :params="flowParams" />

    <viewPhaseOpinionPop ref="viewPhaseOpinionRef" />
  </ContentWrap>
</template>

<script setup lang="tsx">
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
import { Dialog } from '@/components/Dialog'
import download from '@/utils/download'
import {useOldDictStore} from "@/store/modules/oldDict";
import {occurrenceTypeOptions} from "@/views/creditapplication/creditApplyJob/const";
import flowRecordPop from '@/components/busiComp/flowRecordPop/index.vue'
import viewPhaseOpinionPop from '../viewPutOutPhaseOpinion/index.vue'

defineOptions({
  name: 'projectCollReviComplete'
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
} = useTableList(Api.qryCompletedPage, {  })

const { getDictFetch, getDictLabels } = useOldDictStore()

fetchCback((list) => {
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
    v.exposureSum1 = formatValue(v.exposureSum, 'currency')
    v.loanProductCategory1 = getDictLabels('GYLLoanProductCategory', v.loanProductCategory)

  })
})


const phaseNoOptions = ref([])
const initFetch = () => {
  Promise.all([getDictFetch('GYLLoanProductCategory,CoreviewApproveResult')]).then(res => {
    const dicts = res[0]

    phaseNoOptions.value = dicts['CoreviewApproveResult']
    getList()
  })
}
initFetch()

const router = useRouter() // 路由

const columns = [
  { label: '协审编号', field: 'serialNo', minWidth: 220 },
  { label: '项目名称', field: 'projectName', minWidth: 320 },
  { label: '客户名称', field: 'customerName', minWidth: 320 },
  { label: '客户编号', field: 'customerId', minWidth: 220 },
  { label: '协审方式', field: 'coreviewMethodNm', minWidth: 120 },
  { label: '协审类型', field: 'coreviewTypeNm', minWidth: 120 },
  { label: '申请人', field: 'userName', minWidth: 150 },
  { label: '申请分行', field: 'branchName', minWidth: 180 },
  { label: '申请分行业务团队', field: 'teamName', minWidth: 150 },
  { label: '项目额度（万元）', field: 'businessSum1', minWidth: 150 },
  { label: '项目敞口（万元）', field: 'exposureSum1', minWidth: 130 },
  { label: '是否分行权限', field: 'branchAccess', minWidth: 120 },
  { label: '产品方案', field: 'loanProductCategory1', minWidth: 180 },
  { label: '所属行业', field: 'industryType', minWidth: 180 },
  { label: '审批结果', field: 'phaseNo', minWidth: 180 },
  { label: '申请日期', field: 'inputDate', minWidth: 180 },
  { label: '审批完成日期', field: 'endTime', minWidth: 180 },
]

const goDetail = () => {

  console.log("currentRow.value", currentRow.value)
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  if (currentRow.value.objectType && currentRow.value.objectType !== 'ProjectCoreviewGYL') {
    return ElMessage.warning('该笔协审由信贷系统发起，请转至信贷系统查看。')
  }

  router.push({
    path: '/projectMana/projectCollReviMana/projectCollReviManaDetail',
    query: {
      serialNo: currentRow.value.serialNo,
      fromPage: 'projectCollReviComplete',
      readonly: '1',
      t: Date.now(),
    }
  })
}

// 表格选择变化
const handleSelectChange = (val) => {
  val ? currentRow.value = val : ""
}

const viewPhaseOpinionRef = ref()
const viewPhaseOpinion = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  if (currentRow.value.objectType && currentRow.value.objectType !== 'ProjectCoreviewGYL') {
    return ElMessage.warning('该笔协审由信贷系统发起，请转至信贷系统查看。')
  }

  viewPhaseOpinionRef.value.open(currentRow.value)
  // router.push({
  //   path: 'viewEDPhaseOpinion',
  //   query: {
  //     serialNo: currentRow.value.serialNo
  //   }
  // })
}

// 查看流转记录
const flowParams = reactive({
  objectType: 'ProjectCoreviewGYL'
})
const flowRecordRef = ref()
const toRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  if (currentRow.value.objectType && currentRow.value.objectType !== 'ProjectCoreviewGYL') {
    return ElMessage.warning('该笔协审由信贷系统发起，请转至信贷系统查看。')
  }

  flowParams.serialNo = currentRow.value.serialNo
  flowRecordRef.value.open(flowParams)
}

const loading2 = ref()
const downloadHandle = () => {
  loading2.value = true

  Api.qryCompletedExportExcel(queryParams).then(res => {
    download.excel(res, '项目协审数据.xls')
  }).finally(_ => loading2.value = false)
}
</script>
