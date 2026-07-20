<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
    </ContentWrap>

    <ContentWrap :body-style="{ padding: '0px 15px' }">
      <el-skeleton :loading="loading" animated>
        <el-scrollbar height="calc(100vh - 188px)">
          <dynamicForm
            ref="dynamicFormRef"
            style="width: calc(100% - 10px)"
            :formData="formData"
            :dockList="dockList"
            :formTempList="formTempList"
            :customVisible="customVisible"
            @pop-confirm="popConfirm"
            @select-input-click="formSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="formRendering = false"
          />
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import { dockList1, tempList } from './common'

defineOptions({
  name: 'assistApprDetail'
})

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象

formTempList.value = tempList
dockList.push(...dockList1)

const dynamicFormRef = ref()

// 获取详情数据
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetailInfo = () => {
  return Api.getDetailInfo({ objectType: 'BusinessContract', serialNo: route.query.serialNo }).then(
    (res) => {
      dynamicFormRef.value?.resetFields()

      Object.keys(formData).forEach((key) => delete formData[key])
      Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换
    }
  )
}

// loading会重绘内部动态组件，按需求执行
const getDetail = () => {
  loading.value = true
  getDetailInfo().finally(() => (loading.value = false))
}

const loading = ref(false)
const initGetData = () => {
  if (!route.query.serialNo) {
    return ElMessage.error('无serialNo')
  }

  loading.value = true
  Promise.all([getCreditTempFiled(), getDetailInfo()]).finally(() => (loading.value = false))
}

initGetData()

/**
 * 保存
 */
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return

  saving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
  Api.save(params)
    .then((res) => {
      ElMessage.success('保存成功')
      getDetail()
    })
    .finally(() => (saving.value = false))
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)
</script>
