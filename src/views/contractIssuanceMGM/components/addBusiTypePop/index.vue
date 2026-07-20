<template>
  <Dialog v-model="visible" title="登记额度项下合同" width="1000px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="150px"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="发生类型" prop="occurType">
            <el-radio-group v-model="formData.occurType">
              <el-radio :label="v.itemNo" v-for="v in occurTypeSource" :key="v.itemNo">{{
                v.itemName
              }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发生日期" prop="today">
            <el-date-picker
              class="!w-1/1"
              disabled
              v-model="formData.today"
              type="date"
              placeholder="请选择"
              value-format="YYYY/MM/DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记机构" prop="orgname">
            <el-input v-model="formData.orgname" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记人" prop="nickname">
            <el-input v-model="formData.nickname" disabled placeholder="登记人" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登记日期" prop="today">
            <el-input v-model="formData.today" disabled placeholder="登记日期" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户类型" prop="customerType">
            <el-select
              :disabled="isInSide"
              v-model="formData['customerType']"
              clearable
              class="!w-1/1"
              @change="customerTypeChange"
            >
              <el-option label="公司客户" value="01" />
              <el-option label="同业客户" value="04" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户编号" prop="customerID">
            <el-input
              v-model="formData['customerID']"
              readonly
              :disabled="isInSide"
              @click="selectInputClick1"
              placeholder="请选择"
            >
              <template #append>
                <el-button @click="selectInputClick1">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="formData.customerName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务品种" prop="businessTypeName">
            <el-input
              v-model="formData['businessTypeName']"
              readonly
              @click="selectInputClick2"
              placeholder="请选择"
            >
              <template #append>
                <el-button @click="selectInputClick2">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否低风险" prop="isRisk">
            <el-select v-model="formData['isRisk']" clearable class="!w-1/1">
              <el-option label="是" value="1" />
              <el-option label="否" value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="综合授信额度编号" prop="creditAggrement">
            <el-input
              v-model="formData['creditAggrement']"
              readonly
              :disabled="isInSide"
              @click="selectInputClick3"
              placeholder="请选择"
            >
              <template #append>
                <el-button @click="selectInputClick3">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <template #footer>
      <el-button @click="confirm" tpye="" :loading="saving">确 定</el-button>
      <el-button @click="visible = false">关 闭</el-button>
    </template>

    <!-- 客户编号 -->
    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="visible1"
      width="1000px"
      :columns="columns1"
      :searchFields="searchFields1"
      @confirm="(item) => popConfirm('customerID', item)"
      :api-method="Api.getCustomersByType"
      :extra-params="extraParams1"
    />

    <!-- 业务品种 -->
    <treeListPop
      ref="treeListPopRef1"
      :api-func="Api.getBusinessType"
      :qry-params="getBusinessTypeParam"
      @confirm="(item) => popConfirm('businessTypeName', item)"
    />

    <!-- 综合授信 -->
    <MiniPageSelectDialog
      ref="dialogRef"
      v-model="visible2"
      width="1000px"
      :columns="columns2"
      :searchFields="searchFields2"
      :dataTransform="dataTransform3"
      @confirm="(item) => popConfirm('creditAggrement', item)"
      :api-method="Api.getCpmpreCreditLineNo"
      :extra-params="extraParams2"
    />
  </Dialog>
</template>
<script setup>
import * as Api from './api.js'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import dayjs from 'dayjs'
import { associatedCreditApi } from '@/api/creditapplication/associatedCredit'
import { columns1, searchFields1, columns2, searchFields2 } from './common'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import useFormHelper from '@/hooks/web/useFormHelper'
import { formatValue } from '@/utils/formatter'

const message = useMessage() // 消息弹窗

const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const { wsCache } = useCache()
const user = wsCache.get(CACHE_KEY.USER).user
const dept = wsCache.get(CACHE_KEY.USER).dept

const props = defineProps({
  objectType: String
})

// inside标识需要控制部分字段的禁用
const isInSide = computed(() => props.objectType === 'Inside')

const orgFormData = {
  nickname: user.nickname,
  today: dayjs().format('YYYY/MM/DD'),
  orgname: dept.name,
  occurType: '010',
  customerType: '01',
  objectType: props.objectType
}
const formData = ref({ ...orgFormData })
const formRules = reactive({
  occurType: [{ required: true, message: '发生类型 必录', trigger: 'change' }],
  customerType: [{ required: true, message: '客户类型 必录', trigger: 'change' }],
  customerID: [{ required: true, message: '客户编号 必录', trigger: 'change' }],
  customerName: [{ required: true, message: '客户名称 必录', trigger: 'change' }],
  businessTypeName: [{ required: true, message: '业务品种 必录', trigger: 'change' }],
  isRisk: [{ required: true, message: '是否低风险 必录', trigger: 'change' }],
  creditAggrement: [{ required: true, message: '综合授信额度编号 必录', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const occurTypeSource = ref([])

// 发生类型取数
const getOccurType = () => {
  if (occurTypeSource.value.length) return

  formLoading.value = true
  Api.getOccurTypeCode()
    .then((res) => {
      occurTypeSource.value = res.filter(e =>{
        return e.itemName === '新增';
      })
    })
    .finally(() => (formLoading.value = false))
}

// 客户类型change
const customerTypeChange = () => {
  formData.value.customerID = ''
  formData.value.customerName = ''
  formData.value.businessType = ''
  formData.value.businessTypeName = ''
  formData.value.creditAggrement = ''
}
const parentMenuKey = ref()
/** 打开弹窗 */
const open = async (detailInfo) => {
  visible.value = true
  formData.value = { ...orgFormData }
  formData.value.today = dayjs().format('YYYY/MM/DD')
  formData.value.creditSourceFlag = detailInfo.creditSourceFlag
  formData.value.customerID = detailInfo.customerid
  formData.value.customerName = detailInfo.customername
  formData.value.creditAggrement = detailInfo.serialno
  parentMenuKey.value = detailInfo.parentMenuKey
  getOccurType()
}

const { validateField } = useFormHelper(formRef)

// 客户编号
const extraParams1 = reactive({
  customerType: computed(() => formData.value.customerType),
  creditSourceFlag: computed(() => formData.value.creditSourceFlag)
})
const visible1 = ref(false)
const selectInputClick1 = async () => {
  if (isInSide.value) return

  if (!(await validateField('customerType'))) return

  visible1.value = true
}

// 业务品种
const getBusinessTypeParam = reactive({
  customerType: computed(() => formData.value.customerType)
})
const treeListPopRef1 = ref()
const selectInputClick2 = async () => {
  if (!(await validateField(['customerType', 'customerID']))) return

  treeListPopRef1.value.open()
}

// 综合
const extraParams2 = reactive({
  customerId: computed(() => formData.value.customerID),
  businessType: '3005', // 写死，by wym by dxw
  putOutDate: computed(() => formData.value.today),
  maturity: computed(() => formData.value.today),
  creditSourceFlag: computed(() => formData.value.creditSourceFlag)
})
const visible2 = ref(false)
const selectInputClick3 = async () => {
  if (isInSide.value) return

  if (!(await validateField('customerID'))) return

  visible2.value = true
}
const dataTransform3 = (list) => {
  list?.list?.forEach((v) => {
    v.businesssum1 = formatValue(v.businesssum, 'currency')
    v.exposuresum1 = formatValue(v.exposuresum, 'currency')
  })

  return list
}

// 弹窗选择
const popConfirm = (colname, item) => {
  switch (colname) {
    case 'customerID':
      formData.value.customerID = item.customerID
      formData.value.customerName = item.customerName
      formData.value.businessType = ''
      formData.value.businessTypeName = ''
      formData.value.creditAggrement = ''
      selectInputClick2()
      break
    case 'businessTypeName':
      formData.value.businessType = item.id
      formData.value.businessTypeName = item.title
      if (!isInSide.value) {
        selectInputClick3()
      }
      break
    case 'creditAggrement':
      formData.value.creditAggrement = item.serialno
      break
    default:
      break
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const saving = ref(false)
const emit = defineEmits(['confirm'])
const confirm = async () => {
  const validResult = await formRef.value.validate()
  if (!validResult) return

  saving.value = true
  Api.dependentBusiness(formData.value)
    .then((res) => {
      jump(res)
      ElMessage.success('登记成功')
      visible.value = false
      emit('confirm')
    })
    .finally(() => (saving.value = false))
}

const router = useRouter()
const jump = (id) => {
  formLoading.value = true
  Api.bookInContract2({ id }).then((res) => {
    if (res.businesstype?.startsWith('3')) {
      router.push({
        path: '/contractIssuanceMGM/creditLineDetail',
        query: {
          businessType: res.businesstype,
          customerID: res.customerid,
          serialNo: id,
          isEdit: true,
          parentMenuKey: parentMenuKey.value,
          creditSourceFlag: formData.value.creditSourceFlag,
          t: Date.now()
        }
      })
    } else {
      router.push({
        path: '/contractIssuanceMGM/contractDetail',
        query: {
          businessType: res.businesstype,
          customerID: res.customerid,
          serialNo: id,
          isEdit: true,
          parentMenuKey: parentMenuKey.value,
          creditSourceFlag: formData.value.creditSourceFlag,
          t: Date.now()
        }
      })
    }
  }).finally(() => formLoading.value = false)
}
</script>
