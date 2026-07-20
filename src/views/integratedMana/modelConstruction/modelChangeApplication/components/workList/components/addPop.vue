<template>
  <Dialog v-model="visible" title="新增" width="1000px" top="5vh">
    <!-- <ContentWrap> -->
    <!-- </ContentWrap> -->
    <template #footer>
      <el-button tpye="" :loading="saving" @click="confirm">保存</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </template>

    <el-skeleton :loading="loading" animated>
        <el-scrollbar height="calc(100vh - 188px)">
          <!-- <dynamicForm
            ref="dynamicFormRef"
            style="width: calc(100% - 10px)"
            :formData="formData"
            :dockList="dockList"
            :formTempList="formTempList"
            :customVisible="customVisible"
            :customReadonly="customReadonly"
            @selectInputClick="formSelectInputClick"
            @selectChange="formSelectChange"
            @renderFinished="formRendering = false"
          /> -->
        </el-scrollbar>
      </el-skeleton>
  
  </Dialog>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import dayjs from 'dayjs'
import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
// import useFormChange from './hooks/useFormChange'
// import { dockList1, tempList } from './common'
import { useRouter } from 'vue-router'
import { useTagsView } from '@/hooks/web/useTagsView'

const visible = ref(false)
const loading = ref(false)


const open = (row) => {
  Object.keys(formData).forEach((key) => (formData[key] = ''))
  visible.value = true
  formData.createTm = dayjs().format('YYYY/MM/DD')
}



const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象

formTempList.value = tempList
dockList.push(...dockList1)

const dynamicFormRef = ref()


const getSerailNo = async () => {
  if (!(await validateField(['coreviewMethod', 'coreviewType', 'customerId', 'customerName'])))
    return
  btnLoading.value = true
  Api.getLatestSerialNo({ coreviewType: formData.coreviewType, customerId: formData.customerId }).then(res => {
    formData.relativeSerialNo = res
  }).finally(_ => btnLoading.value = false)
}

// 获取详情数据
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetailInfo = () => {
  return Api.getDetail({ serialNo: route.query.serialNo }).then((res) => {
    dynamicFormRef.value?.resetFields()

    Object.keys(formData).forEach((key) => delete formData[key])
    Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换
  })
}


// loading会重绘内部动态组件，按需求执行
const getDetail = () => {
  loading.value = true
  getDetailInfo().finally(() => (loading.value = false))
}

const initGetData = () => {
  if (!route.query.serialNo) {
    return ElMessage.error('无serialNo')
  }

  loading.value = true
  Promise.all([getDetailInfo()]).finally(() => (loading.value = false))
}

initGetData()


// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
// const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customReadonly } =
//   useFormChange({ formData }, { dynamicFormRef, mapRefs })

defineExpose({
  open
})
</script>
