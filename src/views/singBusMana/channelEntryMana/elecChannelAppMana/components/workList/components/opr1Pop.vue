<template>
  <Dialog v-model="visible" title="发起申请" width="1200px">
    <ContentWrap>
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="发生类型" prop="occurType">
              <el-radio-group v-model="formData.occurType" @change="occurTypeChange" disabled>
                <el-radio-button label="010">新增</el-radio-button>
                <el-radio-button label="084">续作</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户类型" prop="customerTypeName">
              <el-input v-model="formData.customerTypeName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户编号" prop="customerID">
              <el-input v-model="formData.customerID" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称" prop="customerName">
              <el-input v-model="formData.customerName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="续作业务" prop="contractNo">
              <el-input v-model="formData.contractNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务品种" prop="businessTypeName">
              <el-input v-model="formData.businessTypeName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="formData.occurType != '084'">
            <el-form-item label="关联群授信" prop="relContractNo">
              <selectInputComp v-model="formData.relContractNo" @open-click="openDialog1" @clear="dialog1Confirm()" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-show="formData.occurType != '084'">
            <el-form-item label="核心企业名称" prop="mfCustomerName" >
              <el-input v-model="formData.mfCustomerName" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- </div> -->

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
      >
        <template #action="{ row }">
          <el-button link tpye="" @click.stop="handleDetail(row)">查看详情</el-button>
        </template>
      </Table>

      <MiniPageSelectDialog
        ref="dialogRef"
        v-model="visible1"
        width="1200px"
        :columns="columns1"
        :searchFields="searchFields1"
        @confirm="dialog1Confirm"
        :api-method="Api.qryRelatedGroupCreditGrantPage"
      />
    </ContentWrap>
    <template #footer>
      <el-button style="width: unset" @click="goList" tpye="" :loading="saving"
        >手工发起决策白名单申请</el-button
      >
      <el-button @click="confirm" tpye="" :loading="saving">确 认</el-button>
      <el-button @click="visible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import * as Api from '../api.js'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import dayjs from 'dayjs'
import useFormHelper from '@/hooks/web/useFormHelper'
import { formatValue } from '@/utils/formatter'
import useTableList from '@/compositions/useTableList'
import selectInputComp from '@/components/selectInput/index.vue'

const message = useMessage() // 消息弹窗

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
  fetchCback,
  setDefaultParams
} = useTableList(Api.applyPage, {}, false)

const columns = [
  { label: '申请流水号', field: 'serialNo', minWidth: 120 },
  { label: '进件渠道', field: 'systemPush', minWidth: 120 },
  { label: '客户名称', field: 'borrowerName', minWidth: 120 },
  { label: '证件号码', field: 'certID', minWidth: 120 },
  { label: '核心客户号', field: 'mfCustomerId', minWidth: 120 },
  { label: '供应链项目名称', field: 'projectName', minWidth: 120 },
  { label: '生成时间', field: 'inputDate', minWidth: 120 },
  { label: '详情', field: 'action', minWidth: 120 }
]

const columns1 = [
  { label: '申请流水号', prop: 'serialNo', minWidth: 120 },
  { label: '业务品种', prop: 'businessTypeName', minWidth: 120 },
  { label: '客户名称', prop: 'customerName', minWidth: 120 },
  { label: '合作方类型', prop: 'typeName', minWidth: 120 },
  { label: '合作项目名称', prop: 'projectName', minWidth: 120 },
  { label: '合同金额', prop: 'businessSum', minWidth: 120 },
  { label: '敞口金额', prop: 'exposureSum', minWidth: 120 },
  { label: '币种', prop: 'currencyName', minWidth: 120 },
  { label: '起始日', prop: 'putOutDate', minWidth: 120 },
  { label: '到期日', prop: 'maturity', minWidth: 120 }
]

const searchFields1 = [
  { label: '合同流水号', prop: 'serialNo', minWidth: 130 },
  { label: '客户名称', prop: 'customerName', minWidth: 130 }
]

const visible1 = ref()
const openDialog1 = () => {
  visible1.value = true
}

const dialog1Confirm = (item = { projectId: '99999999999999' }) => {
  formData.relContractNo = item.serialNo
  formData.mfCustomerName = item.customerName

  setDefaultParams({ customerID: formData.customerID, projectId: item.projectId })
  getList()
}

const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const { wsCache } = useCache()
const user = wsCache.get(CACHE_KEY.USER).user
const dept = wsCache.get(CACHE_KEY.USER).dept

const props = defineProps({
  objectType: String
})

const formData = reactive({ type: 'newRecord' })
const formRules = reactive({
  occurType: [{ required: true, message: '发生类型 必录', trigger: 'change' }],
  customerType: [{ required: true, message: '客户类型 必录', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const occurTypeSource = ref([])

const getDetail = (serialNo) => {
  formLoading.value = true
  Api.detail({ serialNo })
    .then((res) => {
      Object.keys(formData).forEach((key) => (formData[key] = ''))

      Object.assign(formData, res)
      formData.customerTypeName = '个人客户'
      formData.businessTypeName = '一般经营性贷款'

      setDefaultParams({ customerID: formData.customerID, projectId: formData.projectId })

      getList()
    })
    .finally((_) => (formLoading.value = false))
}

/** 打开弹窗 */
const open = (item) => {
  visible.value = true

  currentRow.value = null

  formData.serialNo = item.serialNo
  formData.occurType = ''
  formData.isRelWhiteList = item.isRelWhiteList

  getDetail(item.serialNo)

}

const router = useRouter() // 路由
const handleDetail = (row) => {
  router.push({
    path: '/supplyChainDataApproval/supplyChainDataApplication/detail',
    query: {
      projectId: formData.projectId,
      serialNo: row.serialNo,
      borrowerType: row.borrowerType,
      systemPushFlagCode: row.systemPushFlagCode,
      dealTypeKey: '1030',
      borrowerId: row.borrowerId
    }
  })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 发生类型改变事件
const occurTypeChange = () => {
  if (formData.occurType == '010') {
    formData.relContractNo = ''
    formData.mfCustomerName = ''
  }
}

const goList = () => {
  router.push({
    path: '/singBusMana/supplyChainDataApproval/supplyChainDataApplication'
  })
}

/** 提交表单 */
const saving = ref(false)
const emit = defineEmits(['confirm'])
const confirm = async () => {
  const validResult = await formRef.value.validate()
  if (!validResult) return

  if (formData.isRelWhiteList == '1' && !currentRow.value) {
    ElMessage.warning(
      '本项目配置的参数：是否需要关联决策白名单为“是”，需关联有效决策白名单数据后才能完成预审。'
    )
    return
  }

  saving.value = true
  Api.opr({
    type: 'newRecord',
    serialNo: formData.serialNo,
    occurType: formData.occurType,
    connSerialNo: currentRow.value?.serialNo,
    origContractNo: formData.contractNo,
    relContractNo: formData.relContractNo
  })
    .then((res) => {
      ElMessage.success('登记成功')
      visible.value = false

      // toDetail({
      //   serialNo: formData.serialNo, // ????
      //   businessType: formData.businessType,
      //   objectNo: formData.objectNo,
      //   objectType: formData.objectType,
      //   customerID: formData.customerID,
      // })

      emit('confirm')
    })
    .finally(() => (saving.value = false))
}

const toDetail = (row) => {
  const detailPath = `/creditapplication/pendding/peddingDetail`
  router.push({
    path: detailPath,
    query: {
      serialNo : row.serialNo,
      businessType:row.businessType,
      objectNo:row.objectNo,
      objectType:row.objectType,
      customerID:row.customerID,
      t: Date.now() // 解决重复打开相同详情，详情页面不加载的问题
    }
  })
}
</script>
