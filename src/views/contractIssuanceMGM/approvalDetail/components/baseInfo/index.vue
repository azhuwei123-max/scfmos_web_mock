<template>
  <div class="cusomer-profile">
    <!-- <el-affix target=".customer-detail" :offset="41"> -->
    <!-- <ContentWrap :body-style="{ padding: '10px 15px' }"> -->
      <!-- <div class="mb-10px header"> -->
      <!-- <el-button tpye="" @click="save">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      > -->
      <!-- </div> -->
    <!-- </ContentWrap> -->

    <ContentWrap :body-style="{ padding: '15px' }">
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
          >
            <template #CreditAllot>
              <creditAllot :params="creditAllotParams" />
            </template>
            <template #BusinessAllot>
              <busiAllocationInfo :params="busiAllocationInfoParams" />
            </template>
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
      :ref="(el) => setMapRef(el, `rhgreenloanname`)"
      @confirm="(item) => popConfirm('rhgreenloanname', item)"
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
import creditAllot from './components/creditAllot/index.vue'
import busiAllocationInfo from './components/busiAllocationInfo/index.vue'
import useFormChange from './hooks/useFormChange'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import directionnamePop from './components/directionnamePop.vue'

import * as Api from './api.js'

const props = defineProps({
  params: {
    type: Object,
    default: ()=>({})
  }
})

const dockList = reactive([])

const formTempList = ref([])

const route = useRoute() // 路由对象

const serialNo = computed(()=> props.params.serialNoByProps || route.query.relativeserialNoByCreditLine || route.query.serialno || route.query.serialNo)

const creditAllotParams = reactive({
  objectNo: serialNo.value,
  objectType: 'ApproveApply'
})
const busiAllocationInfoParams = reactive({
  objectNo: serialNo.value,
  objectType: 'ApproveApply'
})

// 获取表单字段配置
const getApproveTempFiled = () => {
  Api.getApproveTempFiled({ serialNo: serialNo.value, objectType: 'ApproveApply' })
    .then((res) => {
      formTempList.value = res?.templates || []
      // .filter((v) => v.dockid !== 'OperationPart')
      dockList.push(
        ...(res?.docks
          .map((v) => ({
            dockname: v.dockname,
            dockid: v.dockid,
            slotName: v.docktype === 'frame' ? v.dockid : null
          })) || [])
      )
    })
    .finally((_) => {
      loading.value = false
    })
}

const formData = reactive({})
const emit = defineEmits(['sendInfo'])
// 获取详情数据
const getDetail = () => {
  Api.getDetailInfo({ serialNo: serialNo.value, objectType: 'ApproveApply' }).then(
    (res) => {
      Object.keys(formData).forEach(key => delete formData[key])      
      Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换

      // 向父级页面送详情数据，供其他component组件使用
      emit('sendInfo', formData)
    }
  )
}

const loading = ref(false)
const initFetch = () => {
  loading.value = true

  Promise.all([getApproveTempFiled(), getDetail()])
    .then((res) => {
      
    })
    .finally((_) => {
      loading.value = false
    })
}

initFetch()

const dynamicFormRef = ref()
const save = () => {
  dynamicFormRef.value.validate((valid) => {
    console.log(1111111, valid)
  })
}

const selectInputColumn = {}

const customerChangeRef = ref()
const onCustomerChange = () => {
  customerChangeRef.value.open(route.query.customerID)
}

const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}


// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)
const iframeDialogRef = ref()
const toCRMS = (formInfo) => {
  const params = {
    dockId: formInfo.dockid,
    objectType: 'ApproveApply',
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

const activeComp = () => {
  initFetch()
}

defineExpose({
  activeComp
})
</script>
