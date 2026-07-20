<template>
  <ContentWrap v-loading="pageLoading">
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
      @keyup.enter="search1"
    >
      <el-form-item label="客户名称" prop="customerID">
        <el-input
          v-model="queryParams.customername"
          class="!w-240px"
          clearable
          placeholder="请输入客户名称"
        />
      </el-form-item>
      <el-form-item label="业务品种" prop="code">
        <el-input
          v-model="queryParams.businesstype"
          class="!w-240px"
          clearable
          placeholder="请输入业务品种"
        />
      </el-form-item>
      <el-form-item label="批复金额" prop="status">
        <el-input-number
          v-model="queryParams.businesssumstart"
          class="!w-140px mr-10px"
          clearable
          placeholder="请输入批复金额"
          :controls="false"
        />
        到
        <el-input-number
          v-model="queryParams.businesssumend"
          class="!w-140px ml-10px"
          clearable
          placeholder="请输入批复金额"
          :controls="false"
        />
      </el-form-item>
      <el-form-item label="完成时间" prop="endtime1">
        <el-date-picker
          class="!w-1/1"
          v-model="queryParams.endtime1"
          type="daterange"
          value-format="YYYY/MM/DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="search1" tpye=""
          ><Icon class="mr-5px" icon="ep:search" /> 查询
        </el-button>
        <el-button @click="reSearch"> <Icon class="mr-5px" icon="ep:refresh" />重置 </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div style="display: flex; justify-content: space-between; margin-bottom: 17px">
      <div style="font-size: 18px; font-weight: 700"> 查询结果</div>
      <div>
        <!-- <el-button @click="button1"  plain tpye=""> 获取客户主办权 </el-button>
        <el-button @click="button1" plain tpye=""> 移交主办权 </el-button>
        <el-button @click="button1" plain tpye=""> 接收主办权 </el-button> -->
        <el-button v-if="cancelContractVIf" @click="cancelContract" plain tpye="">
          业务取消
        </el-button>
        <el-button v-if="bookInContractVIf" @click="bookInContract" plain tpye="">
          登记合同
        </el-button>
        <el-button @click="goDetail" plain type="">
          <Icon class="mr-5px" icon="ep:edit" />
          业务详情
        </el-button>
      </div>
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
  </ContentWrap>
</template>

<script setup>
import * as Api from './api.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import useTableList from '@/compositions/useTableList'
import { formatValue } from '@/utils/formatter'
import { startsWith } from 'lodash-es'

defineOptions({
  name: 'ConTractToRegistered'
})

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
} = useTableList(Api.getCustomerInfoEntPage, { dealtype: props.params.dealtype })

fetchCback((list) => {
  list.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
  })
})

const search1 = () => {
  if (queryParams.endtime1?.length) {
    queryParams.endtimestart = queryParams.endtime1[0]
    queryParams.endtimeend = queryParams.endtime1[1]
  } else {
    queryParams.endtimestart = ''
    queryParams.endtimeend = ''
  }
  search()
}

const router = useRouter() // 路由

const columns = [
  { label: '批复编号', field: 'relativeserialno', minWidth: 220 },
  { label: '申请流水号', field: 'serialno', minWidth: 130 },
  { label: '客户名称', field: 'customername' },
  { label: '业务品种', field: 'businesstype' },
  { label: '发生类型', field: 'occurtype' },
  { label: '币种', field: 'businesscurrency' },
  { label: '批复金额', field: 'businesssum1' },
  { label: '主要担保方式', field: 'vouchtypename' },
  { label: '登记人', field: 'inputusername' },
  { label: '登记机构', field: 'inputorgname', minWidth: 100 },
  { label: '完成时间', field: 'endtime', minWidth: 120 }
]

// 登记合同显影，只有待登记合同显示
const bookInContractVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

// 业务取消，只有待登记合同显示
const cancelContractVIf = computed(() => {
  return ['010'].includes(props.params.key)
})

const goDetail = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  router.push({
    path: '/contractIssuanceMGM/approvalDetail',
    query: {
      serialno: currentRow.value.serialno,
      occurtype: currentRow.value.occurtype,
      businesstype: currentRow.value.businesstype,
      customerType: currentRow.value.customertype,
      relativeserialno: currentRow.value.relativeserialno,
      t: Date.now()
    }
  })
}

const pageLoading = ref(false)
const bookInContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  let id
  ElMessageBox.confirm('你确定要根据选中的电子最终审批意见登记合同吗？确定后生成合同', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消',
    beforeClose: (action, instance, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      Api.bookInContract({
        relativeserialno: currentRow.value.relativeserialno,
        serialno: currentRow.value.serialno,
        creditSourceFlag:'02'
      })
        .then((res) => {
          id = res
          done()
        })
        .catch((e) => {
          instance.confirmButtonText = '确 认'
        })
        .finally((_) => (instance.confirmButtonLoading = false))
    }
  }).then((res) => {
    ElMessage.success('登记成功')

    pageLoading.value = true
    Api.bookInContract2({ id })
      .then((res) => {
        if (res.businesstype?.startsWith('3')) {
          router.push({
            path: '/contractIssuanceMGM/creditLineDetail',
            query: {
              businessType: currentRow.value.businesstype,
              customerID: currentRow.value.customerid,
              serialNo: id,
              t: Date.now()
            }
          })
        } else {
          router.push({
            path: '/contractIssuanceMGM/contractDetail',
            query: {
              businessType: currentRow.value.businesstype,
              customerID: currentRow.value.customerid,
              serialNo: id,
              t: Date.now()
            }
          })
        }
      })
      .finally(() => (pageLoading.value = false))
     getList()
  })
}

const cancelContract = () => {
  if (!currentRow.value) return ElMessage.warning('请选择 1 条')

  ElMessageBox.confirm('取消后该笔业务将失效不能恢复!', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消',
    beforeClose: (action, instance, done) => {
      if (action !== 'confirm') {
        done()
        return
      }
      instance.confirmButtonLoading = true
      Api.cancelContract({
        objectType: 'BusinessApprove',
        serialNo: currentRow.value.relativeserialno
      })
        .then((res) => {
          done()
        })
        .catch((e) => {
          instance.confirmButtonText = '确 认'
        })
        .finally((_) => (instance.confirmButtonLoading = false))
    }
  }).then((res) => {
    ElMessage.success('已取消')

    getList()
  })
}

const button1 = () => {
  ElMessage.info('功能待实现')
}
</script>
