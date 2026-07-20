<template>
  <div class="cusomer-profile">
    <ContentWrap v-show="isEdit" :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button tpye="" @click="saveTemp" :disabled="formRendering" :loading="saving">
           <Icon class="mr-5px" icon="ep:document" />暂存</el-button
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
            :customReadonly="customReadonly"
            :customRequired="customRequired"
            @pop-confirm="popConfirm"
            @select-input-click="formSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="formRendering = false"
          >
            <template #button1="{ formInfo }">
              <el-button @click="toCRMS(formInfo)" :disabled="!formData.loanratetermid">{{ formInfo['colheader'] }}</el-button>
            </template>
            <template #button2="{ formInfo }">
              <el-button @click="toCRMS(formInfo)" :disabled="!formData.rpttermid">{{ formInfo['colheader'] }}</el-button>
            </template>
            <template #button3="{ formInfo }">
              <el-button @click="toCRMS(formInfo)">{{ formInfo['colheader'] }}</el-button>
            </template>
            <template #button4="{ formInfo }">
              <el-button @click="toCRMS(formInfo)">{{ formInfo['colheader'] }}</el-button>
            </template>
            <template #button5="{ formInfo }">
              <el-button @click="toCRMS(formInfo)">{{ formInfo['colheader'] }}</el-button>
            </template>
            <template #button6="{ formInfo }">
              <el-button @click="toCRMS(formInfo)">{{ formInfo['colheader'] }}</el-button>
            </template>
          </dynamicForm>
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>

    <!-- 入账机构 -->
    <putoutorgnamePop
      :ref="(el) => setMapRef(el, `putoutorgname`)"
      @confirm="(item) => popConfirm('putoutorgname', item)"
    />
    <iframeDialog ref="iframeDialogRef" title="信贷" />
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import putoutorgnamePop from './components/putoutorgnamePop.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import useDynamicHelper from '@/components/dynamicForm/hooks/useDynamicHelper.js'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import { getCheckBeforeSave } from '@/api/common/index'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

const isEdit  = computed(() => route.query.isEdit === 'true')


// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象

// 获取表单模板
const getPutOutTemplate = () => {
  return Api.getPutOutTemplate({
    serialNo: route.query.serialno,
    businessType: route.query.businesstype
  })
    .then((res) => {

      formTempList.value = res?.templates || []
      if (!isEdit.value) {
        // debugger
        formTempList.value = formTempList.value.map(item => ({
          ...item,
          colreadonly: '1'
        }))
      }


      dockList.push(...(res?.docks || []))
    })
    .finally((_) => {
      loading.value = false
    })
}
const iframeDialogRef = ref()
const toCRMS = (formInfo) => {
  const params = {
    dockId: formInfo.dockid,
    objectType: 'PutOutApply',
    objectNo: formData.serialno,
    tempsaveflag: formData.tempsaveflag
  }
  switch(formInfo.colname) {
    case 'button1':
      params.selectedValue = formData.loanratetermid
      break
    case 'button2':
      params.selectedValue = formData.rpttermid
      break
    default:
      break
  }
  Api.getDockUrl(params).then(res => {
    // window.open(res)
    iframeDialogRef.value.open(res)
  })
}
const emit = defineEmits(['sendInfo'])
// 获取详情数据
const formData = reactive({})
const getPutOutDetailValue = () => {
  return Api.getPutOutDetailValue({
    businessType: route.query.businesstype,
    serialNo: route.query.serialno
  }).then((res) => {
    dynamicFormRef.value?.resetFields()
    Object.assign(formData, res)
    emit('sendInfo', formData)
  })
}

const loading = ref(false)
const initGetData = () => {
  // if (!route.query.orgNature) {
  //   return ElMessage.error('无机构类型')
  // }

  loading.value = true
  Promise.all([getPutOutTemplate(), getPutOutDetailValue()]).then((res) => {})
}

initGetData()

/**
 * 保存
 */
const dynamicFormRef = ref()
const { isColVisibleComputed, setColReadonly } = useDynamicHelper(dynamicFormRef)
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  const res = await getCheckBeforeSave({ objectNo: route.query.serialno, objectType: 'PutOutApply' })
  if(!res) return
  saving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
  params.objecttype = 'Save'
  Api.save(params)
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally(() => (saving.value = false))
}

const saveTemp = async () => {
  saving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
  params.objecttype = 'TempSave'
  Api.save(params)
    .then((res) => {
      ElMessage.success('保存成功')
    })
    .finally(() => (saving.value = false))
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customReadonly, customRequired } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)

onActivated(() => {
  initGetData()
})
</script>
