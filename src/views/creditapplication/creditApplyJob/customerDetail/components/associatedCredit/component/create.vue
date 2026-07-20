<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增"
    width="720px"
    :close-on-click-modal="false"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="额度类型" prop="businesstype">
            <el-select
              v-model="formData.businesstype"
              placeholder="---请选择---"
              class="w-100%"
              :loading="quotaTypeLoading"
            >
              <el-option
                v-for="dict in quotaTypeOptions"
                :key="dict.businesstype"
                :label="dict.businesstypename"
                :value="dict.businesstype"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="额度编号" prop="quotaNo">
            <el-input v-model="formData.quotaNo" placeholder="请输入额度编号">
              <template #append>
                <el-button @click="openEduDialog">
                  <Icon icon="ep:search" />
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="formData.customerName"  placeholder="请输入客户名称" readonly />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="额度金额" prop="amount">
            <el-input v-model="formData.amount" :min="0" :precision="2" class="w-100%"  />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="敞口金额" prop="exposureAmount">
            <el-input
              v-model="formData.exposureAmount"
              :min="0"
              :precision="2"
              class="w-100%"
              
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="额度起始日" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="请选择起始日"
              value-format="YYYY-MM-DD"
              class="w-100%"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="额度到期日" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              placeholder="请选择到期日"
              value-format="YYYY-MM-DD"
              readonly
              class="w-100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button tpye="" :loading="loading" @click="handleSubmit">保存</el-button>
      <el-button @click="handleCancel">返回</el-button>
    </template>
  </el-dialog>
  
   <MiniPageSelectDialog
   ref="dialogRef" 
    v-model="visible"
    width="880"
    :columns="columns"
    :search-fields="searchFields"
    @confirm="okPick"
    :api-method="associatedCreditApi.openSelecter"
    :data-transform="dataTransform"
    :extra-params="extraParams"
   />
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { associatedCreditApi } from '@/api/creditapplication/associatedCredit' 
import { darken } from '@/utils/color'


defineOptions({ name: 'CreditLimitFormDialog' })

const message = useMessage()
const route = useRoute() // 路由对象

interface Props {
  modelValue?: boolean,
  pageParams?: object,
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,

  // 其他父级组件传来的页面参数，用来替代route中的参数
  pageParams: () => ({})
})

// 页面参数，凡是组件外的参数，都用这个！！。
// 该组件还会在其他地方被嵌套，所以在route拿不到的参数从props里面拿
const _pageParams = Object.assign({}, route.query, props.pageParams)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: FormData]
  cancel: []
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const formRef = ref()
const quotaTypeLoading = ref(false)
const quotaTypeOptions = ref<Array<{ label: string; value: string }>>([])

const visible = ref(false)

interface FormData {
  businesstype: string
  quotaNo: string
  customerName: string
  amount: number | undefined
  exposureAmount: number | undefined
  startDate: string
  endDate: string
}

const formData = reactive<FormData>({
  businesstype: '',
  quotaNo: '',
  customerName: '',
  amount: undefined,
  exposureAmount: undefined,
  startDate: '',
  endDate: ''
})

const formRules = {
  businesstype: [{ required: true, message: '请选择额度类型', trigger: 'change' }],
  quotaNo: [{ required: true, message: '请输入额度编号', trigger: 'blur' }],
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  amount: [{ required: true, message: '请输入额度金额', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择额度起始日', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择额度到期日', trigger: 'change' }]
}


const dataTransform = (data:any) => {
  const selfieldname = data?.selfieldname.split(',')
  const selreturnvalue = data?.selreturnvalue.split('@')
  const columns = selreturnvalue.map((prop,i)=> ({
    prop:prop.toUpperCase().trim(),
    label:selfieldname[i].trim()
  }))
  
     return {
        list:data.resultList?.list,
        total:data.resultList?.total,
        columns
      }
}


const columns = [
{prop:'SERIALNO',label:"合同流水号111",minWidth:120},
{prop:'BUSINESSTYPENAME',label:"业务品种",minWidth:120},
  {prop:'CUSTOMERNAME',label:"客户名称",minWidth:120},
 
{prop:'PROJECTNAME',label:"合作项目名称",minWidth:120},
  {prop:'BUSINESSSUM',label:"合同金额",minWidth:120},
  {prop:'EXPOSURESUM',label:"敞口金额",minWidth:120},
  {prop:'CURRENCYNAME',label:"币种",minWidth:120},
{prop:'PUTOUTDATE',label:"起始日",minWidth:120},
  {prop:'MATURITY',label:"到期日",minWidth:120},
]


// const columnsmo = ref

const searchFields = [
  {
    prop:'CUSTOMERNAME',
    label:"客户名称",
    queryProp:'CustomerName'
  },
  {
    prop:'SerialNo',
    label:"合同流水号",
    queryProp:'SerialNo'
  }
]



/** 重置表单 */
const resetForm = () => {
  formData.businesstype = ''
  formData.quotaNo = ''
  formData.customerName = ''
  formData.amount = undefined
  formData.exposureAmount = undefined
  formData.startDate = ''
  formData.endDate = ''
  formRef.value?.clearValidate?.()
}

/** 取消 */
const handleCancel = () => {
  dialogVisible.value = false
  resetForm()
  emit('cancel')
}

/** 提交 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 触发提交事件，传递表单数据
    emit('submit', { ...formData })

    // 注意：这里不直接关闭对话框，由父组件处理成功后关闭
    //  dialogVisible.value = false
    // resetForm()
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

/** 获取额度类型字典列表 */
const getQuotaTypeList = async () => {
  try {
    console.log('route.params',_pageParams);
    
      const data = await associatedCreditApi.getTypeList({
         businesstype:_pageParams.businessType || route.query?.businessType || props.pageParams?.businessType,
         applytype: applyType ||_pageParams.applyType || route.query?.applyType || props.pageParams?.applyType,
         creditSourceFlag:_pageParams?.creditSourceFlag == '01' ? '01' :'02'
      })

    
      
      quotaTypeOptions.value  = data.list
    // 如果字典中没有数据，可以使用默认数据或调用API
    
      // 可以在这里调用API获取，或者使用默认数据
      // quotaTypeOptions.value = await getQuotaTypeListApi()

      // 临时使用默认数据（实际使用时应该删除）
      // quotaTypeOptions.value = [
      //   { label: '类型A', value: 'A' },
      //   { label: '类型B', value: 'B' },
      //   { label: '类型C', value: 'C' }
      // ]
    
  } catch (error) {
    console.error('获取额度类型字典失败:', error)
    // 出错时使用默认数据
    quotaTypeOptions.value = [
      { label: '类型A', value: 'A' },
      { label: '类型B', value: 'B' },
      { label: '类型C', value: 'C' }
    ]
  } finally {
    quotaTypeLoading.value = false
  }
}


const dialogRef = ref()
const extraParams = ref({})

const openEduDialog = async () => {
   // 打开额度编号的选择框
   if(!formData.businesstype) {
    message.warning('请先选择额度类型')
    return
   }

   const pre = await associatedCreditApi.selectCreditlineBclist({
    businesstype:formData.businesstype,
    objecttype:_pageParams.objectType,
    objectno:_pageParams.objectNo,
    customerid:_pageParams.customerID
   })

   console.log('pre',pre);
  
    extraParams.value = {
    selargs:pre.selargs,
    selname:pre.selname,
    selargslike:''
   }

   visible.value = true
   
   
   

}

/** 打开对话框 */
const open = () => {
  dialogVisible.value = true
  resetForm()
  // 打开时重新获取字典数据（可选，如果数据不经常变化可以只在组件挂载时获取一次）
  // getQuotaTypeList()
}


const okPick = (rowData)=> {
   formData.quotaNo = rowData.SERIALNO
   formData.customerName = rowData.CUSTOMERNAME
   formData.amount = rowData.BUSINESSSUM
   formData.exposureAmount = rowData.EXPOSURESUM
   formData.startDate = rowData.PUTOUTDATE
   formData.endDate = rowData.MATURITY
}

// 监听对话框关闭，重置表单
watch(
  () => props.modelValue,
  (newVal) => {
    if (!newVal) {
      resetForm()
    }
  }
)

// 获取类型
let applyType = ''
const getApplyType = () => {
  associatedCreditApi.getContractInfo({ serialNo: route.query.serialNo || route.query.serialno }).then(res => {
    applyType = res?.applytype
    getQuotaTypeList()
  })
}
getApplyType()

// 组件挂载时获取额度类型字典
onMounted(() => {
  //  getQuotaTypeList()
})

defineExpose({
  open,
  resetForm
})
</script>

<style scoped lang="scss"></style>
