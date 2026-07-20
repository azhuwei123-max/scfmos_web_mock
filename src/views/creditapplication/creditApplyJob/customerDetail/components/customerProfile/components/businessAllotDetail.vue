<template>
  <Dialog v-model="visible" title="新增" width="1000px" top="5vh">
    <el-skeleton :loading="formLoading" animated>
      <el-scrollbar height="calc(100vh - 288px)">
        <simpleForm2
          ref="simpleFormRef"
          style="width: calc(100% - 10px)"
          :formTempList="formTempList"
          :formData="formData"
          @renderFinished="formRendering = false"
          @selectInputClick="formSelectInputClick"
          @selectChange="formSelectChange"
        />
      </el-scrollbar>
    </el-skeleton>
    <!-- 底部对话框操作按钮 -->
    <template #footer>
      <el-button tpye="" @click="submitForm" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保 存
      </el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>
     <!-- 填写业务树 -->
     <businessTypeTreeListPop
       :ref="(el) => setMapRef(el, `businesstypename`)"
       :qry-params="getParams"
        @confirm="(item) => popConfirm('businesstypename', item)"
     />
  </Dialog>
</template>
<script setup>
import simpleForm2 from '@/components/dynamicForm/simpleForm2/index.vue'
import * as Api from '../api.js'

import businessTypeTreeListPop from '../components/businessTypeTreeListPop/index.vue'
import useFormChange from '../components/businessTypeTreeListPop/hooks/useFormChange'
const visible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({})
const formDataTemp = reactive({})
const formRules = reactive({})
const simpleFormRef = ref() // 表单 Ref
const formRendering = ref(true)
// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}
/** 打开弹窗 */
const open = async (serialNo) => {
  visible.value = true
  formDataTemp.baCreditNo= serialNo
  clearForm()

  initAllotDetail(serialNo)
}

const clearForm = () => {
  Object.keys(formData).forEach((key) => delete formData[key])
  formTempList.value = []
}

// 获取模板
const formTempList = ref([])

const businessAllotField = (serialNo) => {
  Api.businessAllotField({serialNo})
    .then((res) => {
      formTempList.value = res.templates
    })
    .finally(() => (formLoading.value = false))
}

const initAllotDetail = (serialNo) => {
  formLoading.value = true
  Api.initAllotDetail({ serialNo }).then((res) => {
    Object.assign(formData, res)
    businessAllotField(serialNo);
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
  Api.saveBusinessAllot(params)
    .then((res) => {
      visible.value = false
      ElMessage.success('保存成功')
      emit('confirm')
    })
    .finally((_) => (saving.value = false))
}

//业务类型树
const treeListPopRef1 = ref()

// 入参信息
const getParams =  reactive({
     baCreditNo: computed(() => formDataTemp.baCreditNo),
     customerId: computed(() =>simpleFormRef.value.formDataFixToSave().customerid),
     code:''
  })
defineExpose({ open })

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customRequired } = useFormChange(
  { formData },
  { simpleFormRef, mapRefs }
)

</script>
