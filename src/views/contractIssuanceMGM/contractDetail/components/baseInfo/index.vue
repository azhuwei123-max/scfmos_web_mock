<template>
  <div class="cusomer-profile">
    <ContentWrap v-show="isEdit" :body-style="{ padding: '10px 15px 0px' }">
      <el-button v-if="props.params.isEdit"  tpye="" @click="save" :disabled="formRendering"  :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保存 </el-button
      >
      <el-button  tpye="" @click="tempSave" :disabled="formRendering" v-if="tempSaveShow && props.params.isEdit" :loading="tempSaving">
        暂 存</el-button
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

    <!-- 贷款投向 -->
    <directionnamePop
      :ref="(el) => setMapRef(el, `directionname`)"
      @confirm="(item) => popConfirm('directionname', item)"
    />

    <!-- 支农分类 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `farmingtypename`)"
      @confirm="(item) => popConfirm('farmingtypename', item)"
    />

    <!-- 金监局绿色贷款 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `ybjgreenfinancename`)"
      @confirm="(item) => popConfirm('ybjgreenfinancename', item)"
    />

    <!-- 人行绿色贷款 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `greenloansname`)"
      @confirm="(item) => popConfirm('greenloansname', item)"
    />

    <!-- 主要担保 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `vouchtypename`)"
      @confirm="(item) => popConfirm('vouchtypename', item)"
    />

    <iframeDialog ref="iframeDialogRef" title="信贷" />
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import putoutorgnamePop from './components/putoutorgnamePop.vue'
import directionnamePop from './components/directionnamePop.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import useDynamicHelper from '@/components/dynamicForm/hooks/useDynamicHelper.js'
import { getCheckBeforeSave } from '@/api/common/index'
import { isAfterTodya } from '@/utils/formatTime'

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})


const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const isEdit  = computed(() => route.query.isEdit === 'true')



const route = useRoute() // 路由对象
const serialNo = computed(()=> props.params.serialNoByProps || route.query.serialNo || route.query.serialno)
// 获取表单模板号
const getCreditTempFiled = () => {
  return Api.getCreditTempFiled({
    codeNo: 'CreditView',
    objectType: 'BusinessContract',
    serialNo: serialNo.value
  }).then((res) => {
    formTempList.value = res?.templates || []
    dockList.push(...(res?.docks || []))
  })
}

const dynamicFormRef = ref()
const { isColVisibleComputed, setColReadonly } = useDynamicHelper(dynamicFormRef)

// 设置供应链只读属性
const checkgylFlagOnlyRead = () => {
  Api.gylFlagOnlyRead({ serialno: serialNo.value }).then(res => {
    setColReadonly('gylflag', res)
  })
}
// checkgylFlagOnlyRead()

// 暂存按钮显隐控制
const tempSaveShow = ref(false)

// 获取详情数据
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetailInfo = () => {
  return Api.getDetailInfo({ objectType: 'BusinessContract', serialNo: serialNo.value }).then(
    (res) => {
      dynamicFormRef.value?.resetFields()
      tempSaveShow.value = res.tempsaveflag != '2' && res.tempsaveflag != '3'
      Object.keys(formData).forEach((key) => delete formData[key])
      Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换

      // 获取文本编号
      checkArtificialno()

      // 向父级页面送详情数据，供其他component组件使用
      emit('sendInfo', formData)
    }
  )
}

// 获取文本合同编号
const checkArtificialno = () => {
  // 判断字段是否可见
  isColVisibleComputed('artificialno').then((res) => {
    if (!res) return // 不可见则不取数

    artificialNo(formData)
  })
}

// 文本合同编辑字段额外赋值
const artificialNo = ({ cycleflag,businesstype }) => {
  Api.artificialNo({ serialno: serialNo.value, cycleflag,businesstype }).then((res) => {
    formData.artificialno = res || ''
  })
}

// loading会重绘内部动态组件，按需求执行
const getDetail = () => {
  loading.value = true
  getDetailInfo().finally(() => (loading.value = false))
}

const loading = ref(false)
const initGetData = () => {
  if (!serialNo.value) {
    return ElMessage.error('无serialNo')
  }

  loading.value = true
  Promise.all([getCreditTempFiled(), getDetailInfo()]).finally(() => (loading.value = false))
  checkgylFlagOnlyRead()
}

// initGetData()

/**
 * 保存
 */
const saving = ref(false)
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  const res = await getCheckBeforeSave({ objectNo: serialNo.value, objectType: 'BusinessContract' })
  if(!res) return
  saving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
   if(isAfterTodya(params.putoutdate)) {
     await ElMessageBox.alert('合同生效晚于当天，请关注','提示',{
        confirmButtonText:'确定',
        type:'warning'
     })
   }
  Api.save(params)
    .then((res) => {
      ElMessage.success('保存成功')
      getDetail()
    })
    .finally(() => (saving.value = false))
}

const tempSaving = ref()
const tempSave = () => {
  tempSaving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
  Api.tempSave(params)
    .then((res) => {
      ElMessage.success('暂存成功')
      getDetailInfo()
    })
    .finally(() => (tempSaving.value = false))
}

const iframeDialogRef = ref()
const toCRMS = (formInfo) => {
  const params = {
    dockId: formInfo.dockid,
    objectType: 'BusinessContract',
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
