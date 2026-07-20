<template>
  <Dialog v-model="visible" title="审批客户分类" width="1000px" top="5vh">
    <el-skeleton :loading="formLoading" animated>
      <el-scrollbar>
        <simpleForm
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
      <el-button tpye="" @click="submitForm" :disabled="formRendering" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保 存
      </el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup>
import simpleForm from '@/components/dynamicForm/simpleForm/index.vue'
import * as Api from './api.js'

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

  // getApproveClassifyDetail(row.customerID, row.objectNo)
  getApproveClassifyInfo(row.customerID, row.objectNo)
}

const clearForm = () => {
  Object.keys(formData).forEach((key) => delete formData[key])

  formTempList.value = []
}

// 获取模板
const formTempList = ref([])

const getApproveClassifyDetail = (customerid, objectno) => {
  Api.getApproveClassifyDetail({ customerid, objectno })
    .then((res) => {
      formTempList.value = res
    })
    .finally(() => (formLoading.value = false))
}

const getApproveClassifyInfo = (customerid, objectno) => {
  formLoading.value = true
  Api.getApproveClassifyInfo({ customerid, objectno }).then((res) => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      formLoading.value = false
      visible.value = false
      return
    }

    Object.assign(formData, res)
    getApproveClassifyDetail(customerid, objectno)
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
  saving.value = true
  Api.submitApproveClassifyInfo(params)
    .then((res) => {
      visible.value = false

      ElMessage.success('保存成功')
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

/**
 * 弹窗打开前校验
 * 返回 true可以打开，false不可以
 */
const openCheck = (row) => {
  if (row.applyStatus === '1') {
    ElMessage.warning('已提交申请,不能再次提交！')
    return false
  }

  const cols = ['belongAttribute1', 'belongAttribute2', 'belongAttribute3']
  if (cols.every((v) => row[v] === '有')) {
    ElMessage.warning('你已拥有该用户所有权限')
    return false
  }

  return true
}
defineExpose({ open, openCheck })
</script>
