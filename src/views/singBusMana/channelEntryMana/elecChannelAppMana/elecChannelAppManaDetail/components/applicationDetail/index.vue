<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '0px' }">
      <el-skeleton :loading="loading" animated>
        <el-scrollbar height="calc(100vh - 188px)">
          <simpleForm2
            ref="dynamicFormRef"
            style="width: calc(100% - 10px); padding: 20px"
            :formData="formData"
            :formTempList="formTempList"
            :customVisible="customVisible"
            :customRequired="customRequired"
            :customReadonly="customReadonly"
            @selectInputClick="formSelectInputClick"
            @selectChange="formSelectChange"
            @renderFinished="formRendering = false"
          />
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>
  </div>
</template>

<script setup>
import simpleForm2 from '@/components/dynamicForm/simpleForm2/index.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import { getTempList } from './common.js'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

const route = useRoute() // 路由对象

// 表单模板配置集合
const formTempList = ref(getTempList(route.query.menuKey))

const formData = reactive({})

// 获取表单字段配置
const getDetail = () => {
  Api.getDetail({ serialNo: route.query.serialno })
    .then((res) => {
      // formTempList.value = res?.templates || []

      dynamicFormRef.value?.resetFields()
      Object.keys(res).map((key) => (formData[key.toLocaleLowerCase()] = res[key]))
      // 向父级页面送详情数据，供其他component组件使用
      emit('sendInfo', formData)
    })
    .finally((_) => {
      loading.value = false
    })
}

// 获取详情数据
const emit = defineEmits(['sendInfo'])

const loading = ref(false)
const initGetData = () => {
  loading.value = true
  Promise.all([getDetail()]).then((res) => {})
}

initGetData()

/**
 * 保存
 */
const dynamicFormRef = ref()
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return

  saving.value = true
  Api.saveCustomer({ ...formData, objectType: 'Save' })
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally((_) => (saving.value = false))
}

const tempSaving = ref(false)
const tempSave = () => {
  tempSaving.value = true
  Api.saveCustomer({ ...formData, objectType: 'TempSave' })
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally((_) => (tempSaving.value = false))
}
// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const {
  formSelectChange,
  formSelectInputClick,
  popConfirm,
  customVisible,
  customRequired,
  customReadonly
} = useFormChange({ formData }, { dynamicFormRef, mapRefs })
</script>
