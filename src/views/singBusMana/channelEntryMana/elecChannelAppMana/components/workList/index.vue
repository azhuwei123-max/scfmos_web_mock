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
      <el-form-item label="电子渠道进件申请编号" prop="customerID">
        <el-input
          v-model="queryParams.serialNo"
          class="!w-240px"
          clearable
          placeholder="请输入电子渠道进件申请编号"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="code">
        <el-input
          v-model="queryParams.customerName"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="核心客户号" prop="code">
        <el-input
          v-model="queryParams.mfCustomerID"
          class="!w-240px"
          clearable
          placeholder="请输入核心客户号"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
    <div style="display: flex; margin-bottom: 17px" v-if = "showBtns">
      <el-button @click="goDetail"> 详情 </el-button>
      <el-button v-if="opr1VIf" @click="opr1" :loading="loading1"> 发起申请 </el-button>
      <el-button v-if="opr2VIf" @click="invalidRecord"> 置为失效 </el-button>
      <el-button v-if="opr3VIf" @click="backStep"> 重新生成待进件 </el-button>
      <el-button  v-if="opr4VIf" @click="downloadHandle" :loading="loading2">
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
    <!-- <checkImagePop ref="checkImageRef" /> -->

    <!-- 发起申请 -->
    <opr1Pop ref="opr1Ref" @confirm="getList" />
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { useMessage } from '@/hooks/web/useMessage'
// import checkImagePop from './components/checkImagePop.vue'
import download from '@/utils/download'
import opr1Pop from './components/opr1Pop.vue'
import { getColumns } from './common.js'
import { checkRoleIds } from '@/utils/permission'
import { getDictOptions } from '@/utils/dict'

const props = defineProps({
  params: {
    type: Object,
    default: () => {}
  }
})
const showBtns = computed(()=> !checkRoleIds(['0GG'])) //管理员不需要展示按钮


const isExpand = ref(false)
const handleExpand = () => {
  isExpand.value = !isExpand.value
}

// 是否电子渠道进件管理员， 是则只能详情
// const isElectronChlAdminRole = checkRoleIds(getDictOptions('electronChlAdminRole').map((v) => v.value))
const isElectronChlAdminRole = false

// 发起申请
const opr1VIf = computed(() => ['0101'].includes(props.params.key) && !isElectronChlAdminRole)

// 置为失效
const opr2VIf = computed(() => ['0101'].includes(props.params.key) && !isElectronChlAdminRole)

// 重新生成待进件
const opr3VIf = computed(() => ['0103'].includes(props.params.key) && !isElectronChlAdminRole)

const opr4VIf = computed(() => ['0101','0102'].includes(props.params.key) && !isElectronChlAdminRole)

// 删除权限
const delVIf = computed(() => ['01'].includes(props.params.key))

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
} = useTableList(Api.getPage, { status: props.params.dealtype })

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
})

const router = useRouter() // 路由

const columns = getColumns(props.params.key)

// 发起申请
const opr1Ref = ref()
const opr1 = async () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  opr1Ref.value.open(currentRow.value)
}

const { confirmFetch } = useMessage()

// 置为失效
const invalidRecord = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '确认置为失效',
    fetchFunc: () => Api.opr({ type: 'invalidRecord', serialNo: currentRow.value.serialNo })
  }).then((_) => {
    ElMessage.success('操作成功')

    getList()
  })
}

// 重新生成待进件
const backStep = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  confirmFetch({
    title: '确认重新生成待进件',
    fetchFunc: () => Api.opr({ type: 'resetStatus', serialNo: currentRow.value.serialNo })
  }).then((_) => {
    ElMessage.success('操作成功')

    getList()
  })
}

// 查看影像
const checkImageRef = ref()
const checkImage = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  checkImageRef.value.open(currentRow.value)
}

const goDetail = () => {
  if(!showBtns.value) return;
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/singBusMana/channelEntryMana/elecChannelAppMana/detail',
    query: {
      customerId: currentRow.value.customerID,
      serialno: currentRow.value.serialNo,
      projectId: currentRow.value.projectId,
      customerName: currentRow.value.customerName,
      customerType: currentRow.value.customerType,
      menuKey: props.params.key,
      t: Date.now()
    }
  })
}

// 导出
const loading2 = ref()
const downloadHandle = () => {
  loading2.value = true

  Api.download(queryParams).then(res => {
    download.excel(res, '手机渠道进件数据.xls')
  }).finally(_ => loading2.value = false)
}

onActivated(() => {
  search()
})
</script>
