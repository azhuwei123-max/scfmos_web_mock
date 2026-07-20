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
      <el-form-item label="流水号" prop="serialNo">
        <el-input
          v-model="queryParams.serialNo"
          class="!w-240px"
          clearable
          placeholder="请输入流水号"
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
      <el-form-item label="客户编号" prop="customerId">
        <el-input
          v-model="queryParams.customerId"
          class="!w-240px"
          clearable
          placeholder="请输入客户编号"
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
      <el-form-item label="未通过原因" prop="unPassResult">
        <el-input
          v-model="queryParams.unPassResult"
          class="!w-240px"
          clearable
          placeholder="请输入未通过原因"
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
      <el-button v-if="addVIf" @click="add" :loading="btnLoading1">
        <Icon class="mr-5px" icon="ep:circle-plus" />
        新增
      </el-button>
      <el-button v-if="noticeVIf" @click="notice"> 发送未通过结果通知 </el-button>
      <el-button v-if="delVIf" @click="del">
        <Icon class="mr-5px" icon="ep:delete" />
        删除
      </el-button>
      <el-button v-if="reasonVIf" @click="editReasonHandle"> 填写未通过原因 </el-button>
      <el-button v-if="exportVIf" @click="exportExcel" :loading="exportLoading"> 导出excel </el-button>
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

    <!-- 进件移交 -->
    <MiniPageSelectDialog
      v-model="dialogVisible"
      width="1200px"
      :columns="dialogColumns"
      :searchFields="searchFields"
      @confirm="(row) => addSave('CreditApply', row)"
      :api-method="Api.getCanAddCredit"
      :extra-params="{}"
    />

    <!-- 进件移交 -->
    <MiniPageSelectDialog
      v-model="dialogVisible2"
      width="1200px"
      :columns="dialogColumns"
      :searchFields="searchFields"
      @confirm="(row) => addSave('PutOutApply', row)"
      :api-method="Api.getCanAddBp"
      :extra-params="{}"
    />

    <editReason ref="editReasonRef" @confirm="getList" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'
import { useMessage } from '@/hooks/web/useMessage'
import editReason from './components/editReason.vue'
import download from '@/utils/download'
import { checkRoleIds } from '@/utils/permission'
import { getColumns } from './common.js'

// defineOptions({
//   name: 'ConTractToRegistered'
// })

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

const addVIf = computed(() => ['0101', '0103'].includes(props.params.key) && checkRoleIds(['480']))
const noticeVIf = computed(() => ['0101', '0103'].includes(props.params.key) && checkRoleIds(['480']))
const delVIf = computed(() => ['0101', '0103'].includes(props.params.key) && checkRoleIds(['480']))
const reasonVIf = computed(() => ['0101', '0103'].includes(props.params.key) && checkRoleIds(['480']))
const exportVIf = computed(() => ['0102', '0104'].includes(props.params.key))

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
} = useTableList(Api.getPending, {
  objectType: props.params.objectType,
  status: props.params.status
})

fetchCback((list) => {
  list.forEach((v) => {
    v.businessSum1 = formatValue(v.businessSum, 'currency')
  })
})

const router = useRouter() // 路由

const columns = getColumns(props.params.key)

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/assistApprProject/assistApprDetail',
    query: {
      serialno: currentRow.value.serialno,
      occurtype: currentRow.value.occurtype,
      businesstype: currentRow.value.businesstype,
      t: Date.now()
    }
  })
}

const dialogColumns = [
  { label: '流水号', prop: 'serialNo' },
  { label: '客户名称', prop: 'customerName' },
  { label: '客户编号', prop: 'customerId' },
  { label: '申请金额', prop: 'businessSum' }
]

const searchFields = [
  { label: '流水号', prop: 'serialNo' },
  { label: '客户名称', prop: 'customerName' },
  { label: '客户编号', prop: 'customerId' }
]

const dialogVisible = ref()
const dialogVisible2 = ref()
const add = () => {
  // if (!currentRow.value) return ElMessage.warning('请选择 1 条')
  if (props.params.objectType === 'CreditApply') {
    dialogVisible.value = true
  } else {
    dialogVisible2.value = true
  }
}

const btnLoading1 = ref()
const addSave = (objectType, row) => {
  btnLoading1.value = true
  Api.addSave({ objectType, serialNo: row.serialNo }).then(res => {
    ElMessage.success('保存成功')

    search()
  }).finally(_ => btnLoading1.value = false)
}

const editReasonRef = ref()
const editReasonHandle = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  editReasonRef.value.open(currentRow.value)
}

const exportLoading = ref()
const message = useMessage() // 消息弹窗
const exportExcel = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await Api.exportExcel(queryParams)
    download.excel(data, '已通知数据.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

const { confirmFetch } = useMessage()
const del = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '是否确认删除',
    fetchFunc: () =>
      Api.delete1({
        objectNo: currentRow.value.serialNo
      })
  }).then((_) => {
    ElMessage.success('已删除')

    getList()
  })
}

// 发送通知
const notice = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: currentRow.value.unPassResult ? '确认发送' : '未填写未通过原因，确定发送该笔通知吗？',
    fetchFunc: () =>
      Api.notice(currentRow.value.serialNo)
  }).then((_) => {
    ElMessage.success('已发送')

    getList()
  })
}

onActivated(() => {
  getList()
})
</script>
