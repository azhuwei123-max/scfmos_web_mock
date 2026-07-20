<template>
  <Dialog v-model="visible" title="修改信息" width="700px" top="5vh">
    <el-skeleton :loading="formLoading" animated>
      <el-scrollbar height="calc(100vh - 288px)">
        <simpleForm
          ref="simpleFormRef"
          style="width: calc(100% - 10px)"
          :formTempList="formTempList"
          :formData="formData"
          @renderFinished="formRendering = false"
        />
      </el-scrollbar>
    </el-skeleton>
  </Dialog>
</template>
<script setup>
import simpleForm from '@/components/dynamicForm/simpleForm/index.vue'
import * as templateApi from '@/api/dynamicForm/index.js'

const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({})
const formRules = reactive({})
const simpleFormRef = ref() // 表单 Ref
const formRendering = ref(true)

/** 打开弹窗 */
const open = async (row) => {
  visible.value = true

  clearForm()

  getTemplateVO(row.serialno, 'CtPutOutInfo')
}

const clearForm = () => {
  Object.keys(formData).forEach((key) => delete formData[key])

  formTempList.value = []
}

// 获取模板
const formTempList = ref([])

// 获取表单字段配置
const getTemplateVO = (serialno, templateno) => {
  templateApi
    .getTemplateValue({ serialno, templateno })
    .then((res) => {
      formTempList.value = res?.templates || []

      simpleFormRef.value?.resetFields()
      Object.assign(formData, res?.data)
    })
}
defineExpose({ open })
</script>
