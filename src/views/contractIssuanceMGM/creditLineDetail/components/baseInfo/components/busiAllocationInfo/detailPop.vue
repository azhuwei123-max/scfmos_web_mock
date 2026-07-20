<template>
  <Dialog v-model="visible" title="业务分配信息详情" width="1000px" top="5vh" v-loading="loading">
    <el-scrollbar>
      <simpleForm2
        ref="dynamicFormRef"
        style="width: calc(100% - 10px)"
        :formTempList="formTempList"
        :formData="formData"
        :customVisible="customVisible"
        @renderFinished="formRendering = false"
      />
    </el-scrollbar>
    <template #footer>
      <el-button tpye="" @click="confirm" :disabled="formRendering" v-if="formDataTemp.isEdit" >确 定</el-button> 
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup>
import simpleForm2 from '@/components/dynamicForm/simpleForm2/index.vue'
import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
const formDataTemp = reactive({})
const formRendering = ref(true)

const loading = ref(false)

const emit = defineEmits(['confirm'])

const visible = ref(false)
const open = (row,isEdit,serialNo) => {
  formDataTemp.isEdit = isEdit === "true"
  formDataTemp.serialNo = serialNo
  visible.value = true

  if (formTempList.value.length) {
    loading.value = true
    qryBusinessAllocationInfoItem(row).finally(() => (loading.value = false))
  } else {
    initFetch(row)
  }
}

const formData = reactive({})
const qryBusinessAllocationInfoItem = (row) => {
  Object.keys(formData).forEach((key) => delete formData[key])
  return Api.qryBusinessAllocationInfoItem({ serialNo: row.serialno }).then((res) => {
    Object.assign(formData, res)
  })
}

// 获取模板
const formTempList = ref([])

const getTemplateVO = (templateNo) => {
  return templateApi.getTemplateVO({ templateNo }).then((res) => {
    formTempList.value = res.templates
  })
}

const initFetch = (row) => {
  loading.value = true
  Promise.all([qryBusinessAllocationInfoItem(row), getTemplateVO('BusinessAllotInfo')]).finally(
    () => (loading.value = false)
  )
}

const confirm = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  // 发送操作成功的事件
  const params = dynamicFormRef.value.formDataFixToSave()
  params.businessNo = formDataTemp.serialNo
  Api.saveBusinessAllot(params)
    .then((res) => {
      visible.value = false
      ElMessage.success('保存成功')
      emit('confirm')
    })
    .finally((_) => (visible.value = false))
}
const dynamicFormRef = ref()
// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible } = useFormChange(
  { formData },
  { dynamicFormRef }
)

defineExpose({
  open
})
</script>
