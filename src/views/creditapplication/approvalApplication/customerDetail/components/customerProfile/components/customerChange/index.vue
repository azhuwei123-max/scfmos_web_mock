<template>
  <Dialog v-model="dialogVisible" title="客户信息变更" width="800px">
    <!-- <div style="width: 100%; display: flex; justify-content: center"> -->
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="客户代码" prop="customerID">
            <el-input v-model="formData.customerID" disabled placeholder="请输入客户代码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称" prop="customerName">
            <el-input v-model="formData.customerName" disabled placeholder="请输入客户名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户名称（新）" prop="newCustomerName">
            <el-input v-model="formData.newCustomerName" placeholder="请输入客户名称（新）" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户类型" prop="customerTypeName">
            <el-input v-model="formData.customerTypeName" disabled placeholder="请输入客户类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件类型" prop="certType">
            <el-input v-model="formData.certTypeName" disabled placeholder="请输入证件类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件类型（新）" prop="newCertType">
            <el-select v-model="formData.newCertType" clearable placeholder="请选择证件类型（新）">
              <el-option
                v-for="dict in formData.newCertTypeList"
                :key="dict.itemNo"
                :label="dict.itemName"
                :value="dict.itemNo"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码" prop="certID">
            <el-input v-model="formData.certID" disabled placeholder="请选择机构类型" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="证件号码（新）" prop="newCertID">
            <el-input v-model="formData.newCertID" placeholder="请选择机构类型" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- </div> -->
    <template #footer>
      <el-button :disabled="formLoading" tpye="" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { saveChangeCustomer, changeCustomerInfo } from './api.js'

defineOptions({ name: 'customerChange' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  newCustomerName: ''
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (id) => {
  dialogVisible.value = true
  formRef.value?.resetFields()
  // 修改时，设置数据
  formLoading.value = true
  formData.value = await changeCustomerInfo({ customerId: id }).finally(
    (_) => (formLoading.value = false)
  )

  nextTick(() => {
    setTimeout(() => {
      formRef.value?.clearValidate()
    }, 10);
  })
}

const customerNameValidate = (rule, value, callback) => {
  if (!checkChineseName(value, formData.customerType)) {
    callback(new Error('客户名称不能包含特殊字符'))
    return
  }
  callback()
}

const newCertIDValidate = (rule, value, callback) => {
  if (!checkChineseName(value, formData.customerType)) {
    callback(new Error('客户名称不能包含特殊字符'))
    return
  }
  callback()
}

const formRules = ref({
  newCustomerName: [
    { required: true, message: '请输入客户名称', trigger: 'change' },
    { max: 30, message: '客户名称长度不能超过30位！请重新输入', trigger: 'blur' },
    { validator: customerNameValidate, trigger: 'blur' }
  ],
  newCertType: [{ required: true, message: '请输入证件类型（新）', trigger: 'change' }],
  newCertID: [
    { required: true, message: '请输入证件号码（新）', trigger: 'change' },
    { validator: newCertIDValidate, trigger: 'blur' }
  ]
})

//公司客户：名称含有中文，且含有特殊字符，返回false；否则返回true;
//个人，同业:名称含有特殊字符，返回false；否则返回true;
const checkChineseName = (sCustomerName, sCustomerType = '') => {
  const filter1 = /[\u4e00-\u9fa5]{1,}/ // /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
  const filter2 = /[*~!！@#$%^\[\]{}><'‘’“”\\\/?？=+￥、【】|…]{1,}/
  if (sCustomerType.substring(0, 2) == '01') {
    return !(filter1.test(sCustomerName) && filter2.test(sCustomerName))
  } else if (sCustomerType.substring(0, 2) == '03' || sCustomerType.substring(0, 2) == '04') {
    return !filter2.test(sCustomerName)
  } else {
    return true
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: '',
    code: '',
    sort: undefined,
    status: CommonStatusEnum.ENABLE,
    remark: ''
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  const data = formData.value
  const savePromise = await saveChangeCustomer(data).finally((_) => (formLoading.value = false))
  if (!savePromise) return

  message.success('保存成功')
  dialogVisible.value = false
  // 发送操作成功的事件
  emit('success')
}
</script>
