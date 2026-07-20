<template>
    <ContentWrap v-loading="loading">
      <div class="mb-2">
        <el-button
          v-if="!readonly"
          @click="save"
          :disabled="formRendering"
          :loading="saving"
        >
          <Icon class="mr-5px" icon="ep:document" />保存</el-button
        >
        <el-button
          v-if="!readonly && !isSaved"
          @click="tempSave"
          :disabled="formRendering"
          :loading="saving2"
        >
          暂存</el-button
        >
      </div>
      <el-scrollbar max-height="calc(100vh - 218px)">
        <dynamicForm
          ref="dynamicFormRef"
          style="width: calc(100% - 10px)"
          :formData="formData"
          :dockList="dockList"
          :formTempList="formTempList"
          :customVisible="customVisible"
          :customReadonly="customReadonly"
          @input-change="formInputChange"
          @pop-confirm="popConfirm"
          @select-input-click="formSelectInputClick"
          @select-change="formSelectChange"
          @render-finished="formRendering = false"
        />
      </el-scrollbar>
    </ContentWrap>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import { dockList1, tempList } from './common'
import { useRouter } from 'vue-router'
import { useTagsView } from '@/hooks/web/useTagsView'
import { getCheckBeforeSave } from '@/api/common/index'

defineOptions({
  name: 'projectCollReviManaDetail'
})

const props = defineProps({
  params: {
    type: Object,
    default: ()=>({})
  }
})

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象
const isSaved = ref(true)

formTempList.value = tempList
console.log('[ tempList ] >', tempList)
dockList.push(...dockList1)

const dynamicFormRef = ref()

const readonly = computed(() => (route.query.readonly || props.params.readonly) === '1')

// 获取详情数据
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetailInfo = () => {
  return Api.getDetail({ serialNo: (route.query.serialNo || props.params.serialNo) }).then((res) => {
    dynamicFormRef.value?.resetFields()

    Object.keys(formData).forEach((key) => delete formData[key])
    Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换
    
    isSaved.value = formData.tempsaveflag == '2'
    // 买方信贷跟经销商数据贷不能同时选择
    formSelectChange({ colname: 'loanproductcategory' })
  })
}

// loading会重绘内部动态组件，按需求执行
const getDetail = () => {
  loading.value = true
  getDetailInfo().finally(() => (loading.value = false))
}

const loading = ref(false)
const initGetData = () => {
  if (!(route.query.serialNo || props.params.serialNo)) {
    return ElMessage.error('无serialNo')
  }

  loading.value = true
  Promise.all([getDetailInfo()]).finally(() => (loading.value = false))
}

initGetData()
const router = useRouter()

const saving2 = ref()
const tempSave = () => {
  saving2.value = true

  const params = dynamicFormRef.value.formDataFixToSave()
  Api.tempSaveRecord(params)
    .then((res) => {
      ElMessage.success('暂存成功')

      getDetail()
    })
    .finally((_) => (saving2.value = false))
}

/**
 * 保存
 */
const { closeCurrent } = useTagsView()
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  const res = await getCheckBeforeSave({ objectNo: route.query.serialNo, objectType: 'ProjectCoreviewGYL' })
  if(!res) return
  saving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
  Api.saveRecord(params)
    .then((res) => {
      ElMessage.success('保存成功')

      initGetData()
      // router.push('/projectMana/projectCollReviMana/projectCollReviApply')
      // closeCurrent()
    })
    .finally(() => (saving.value = false))
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formInputChange, formSelectChange, formSelectInputClick, popConfirm, customVisible, customReadonly } =
  useFormChange({ formData, dockList }, { dynamicFormRef, mapRefs })
</script>
