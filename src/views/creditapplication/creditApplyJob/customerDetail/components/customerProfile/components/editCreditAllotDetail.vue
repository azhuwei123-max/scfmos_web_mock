<template>
  <Dialog v-model="visible" title="详情" width="1000px" top="5vh">
    <el-skeleton :loading="formLoading" animated>
      <el-scrollbar>
        <simpleForm2
          ref="simpleFormRef"
          style="width: calc(100% - 10px)"
          :formTempList="formTempList"
          :formData="formData"
          @renderFinished="formRendering = false"
        />
      </el-scrollbar>
    </el-skeleton>
    <!-- 底部对话框操作按钮 -->
    <template #footer>
      <el-button tpye="" @click="submitForm" :loading="saving" v-if="(formDataTemp.phaseNo=='0010' || formDataTemp.phaseNo=='3000') && formDataTemp.type !='Y'">
        <Icon class="mr-5px" icon="ep:document" />保 存
      </el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import simpleForm2 from '@/components/dynamicForm/simpleForm2/index.vue'
import * as Api from '../api.js'

const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({})
const formRules = reactive({})
const simpleFormRef = ref() // 表单 Ref
const formRendering = ref(true)
const formDataTemp = reactive({})
/** 打开弹窗 */
const open = async (serialNo,baCreditNo,phaseNo,type ) => {
  visible.value = true
  formDataTemp.baCreditNo = baCreditNo
  formDataTemp.phaseNo = phaseNo 
  formDataTemp.type = type 
  clearForm()
  initAllotDetail(serialNo)
}

const clearForm = () => {
  Object.keys(formData).forEach((key) => delete formData[key])
  formTempList.value = []
}

// 获取模板
const formTempList = ref([])

const creditAllotField = (serialNo) => {
  Api.creditAllotField({serialNo})
    .then((res) => {
      formTempList.value = res.templates
    })
    .finally(() => (formLoading.value = false))
}

const initAllotDetail = (serialNo) => {
  formLoading.value = true
  Api.creditAllotDetail({ serialNo }).then((res) => {
    Object.assign(formData, res)
    creditAllotField(serialNo);
  })
}

/** 提交表单 */
const saving = ref(false)
const emit = defineEmits(['confirm']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  const valid = await simpleFormRef.value.validate()
  if (!valid) return
  // 发送操作成功的事件

  const params = simpleFormRef.value.formDataFixToSave()
  params.baCreditNo = formDataTemp.baCreditNo
  saving.value = true
  Api.editCreditAllot(params)
    .then((res) => {
      visible.value = false

      ElMessage.success('保存成功')
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}



defineExpose({ open })
</script>
