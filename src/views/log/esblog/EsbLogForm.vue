<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="服务编码" prop="serviceId">
        <el-input v-model="formData.serviceId" placeholder="请输入服务编码" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="业务流水号" prop="consumerSeqNo">
        <el-input v-model="formData.consumerSeqNo" placeholder="请输入业务流水号" :readonly="readonly"  />
      </el-form-item>
      <el-form-item label="原交易流水号" prop="orgConsumerSeqNo">
        <el-input v-model="formData.orgConsumerSeqNo" placeholder="请输入原交易流水号" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="请求参数" prop="reqParam">
        <!-- <el-input v-model="formData.reqParam" placeholder="请输入请求参数" :readonly="readonly" /> -->
        <el-input type="textarea"  :rows="10"  v-model="reqParam" />
      </el-form-item>
      <el-form-item label="响应结果" prop="respResult">
        <!-- <el-input v-model="formData.respResult" placeholder="请输入响应结果" :readonly="readonly" /> -->
        <el-input type="textarea"  :rows="10"  v-model="respResult" />
      </el-form-item>
      <el-form-item label="响应结果" prop="returnCode">
        <el-input v-model="formData.returnCode" placeholder="请输入响应结果" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="执行信息" prop="returnMsg">
        <el-input v-model="formData.returnMsg" placeholder="请输入执行信息" :readonly="readonly" />
      </el-form-item>
      <el-form-item label="请求时间" prop="reqTime">
        <el-date-picker
          v-model="formData.reqTime"
          type="date"
          value-format="x"
          placeholder="选择请求时间"
        />
      </el-form-item>
      <el-form-item label="响应时间" prop="respTime">
        <el-date-picker
          v-model="formData.respTime"
          type="date"
          value-format="x"
          placeholder="选择响应时间"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="备用字段" prop="remark1">
        <el-input v-model="formData.remark1" placeholder="请输入备用字段" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" tpye="" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { EsbLogApi, EsbLogVO } from '@/api/log/esblog'
import vkbeautify from 'vkbeautify'


/** esb日志 表单 */
defineOptions({ name: 'EsbLogForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  serviceId: undefined,
  consumerSeqNo: undefined,
  orgConsumerSeqNo: undefined,
  reqParam: undefined,
  respResult: undefined,
  returnCode: undefined,
  returnMsg: undefined,
  reqTime: undefined,
  respTime: undefined,
  remark: undefined,
  remark1: undefined,
})
const formRules = reactive({
})
const formRef = ref() // 表单 Ref

const reqParam = ref('')
const respResult =ref('')

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await EsbLogApi.getEsbLog(id)
      reqParam.value = vkbeautify.xml(formData.value?.reqParam)
      respResult.value = vkbeautify.xml(formData.value?.respResult)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const readonly = computed(()=> formType.value === 'view' )


/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as EsbLogVO
    if (formType.value === 'create') {
      await EsbLogApi.createEsbLog(data)
      message.success(t('common.createSuccess'))
    } else {
      await EsbLogApi.updateEsbLog(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    serviceId: undefined,
    consumerSeqNo: undefined,
    orgConsumerSeqNo: undefined,
    reqParam: undefined,
    respResult: undefined,
    returnCode: undefined,
    returnMsg: undefined,
    reqTime: undefined,
    respTime: undefined,
    remark: undefined,
    remark1: undefined,
  }
  formRef.value?.resetFields()
}
</script>