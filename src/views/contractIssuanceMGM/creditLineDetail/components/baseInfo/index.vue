<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }" v-show="isEdit">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保 存</el-button
      >
      <el-button tpye="" @click="tempSave" :disabled="formRendering" :loading="tempSaving" v-if="tempSaveShow">
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
          </dynamicForm>
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>

    <!-- 主要担保 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `vouchtypename`)"
      @confirm="(item) => popConfirm('vouchtypename', item)"
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
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import creditAllot from './components/creditAllot/index.vue'
import busiAllocationInfo from './components/busiAllocationInfo/index.vue'
import useFormChange from './hooks/useFormChange'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import useDynamicHelper from '@/components/dynamicForm/hooks/useDynamicHelper.js'
import { getCheckBeforeSave } from '@/api/common/index'

import * as Api from './api.js'

const props = defineProps({
  params: {
    type: Object,
    default: () => ({})
  }
})

const dockList = reactive([])

const isEdit  = computed(() => route.query.isEdit === 'true')


const formTempList = ref([])
const formRendering = ref(true)

const route = useRoute() // 路由对象
const serialNo = computed(()=> props.params.serialNoByProps || route.query.serialNo || route.query.serialno)
console.log('[ props ] >', props.params)
const creditAllotParams = reactive({
  objectNo: serialNo.value,
  objectType: 'BusinessContract',
  isEdit:route.query.isEdit,
  serialNo:route.query.serialNo
})
const busiAllocationInfoParams = reactive({
  objectNo: serialNo.value,
  objectType: 'BusinessContract',
  isEdit:route.query.isEdit,
  serialNo:route.query.serialNo
})

// 获取表单字段配置
const creditLineTemplateFiled = () => {
  Api.creditLineTemplateFiled({ serialNo: serialNo.value, objectType: 'BusinessContract' })
    .then((res) => {
      formTempList.value = res?.templates || []
      // .filter((v) => v.dockid !== 'OperationPart')
      if (!isEdit) {
        // debugger
        formTempList.value = formTempList.value.map(item => ({
          ...item,
          colreadonly: '1'
        }))
      }



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

const dynamicFormRef = ref()
const { isColVisibleComputed, dictListComputed } = useDynamicHelper(dynamicFormRef)
// 暂存按钮显隐控制
const tempSaveShow = ref(false)
const emit = defineEmits(['sendInfo'])
const formData = reactive({})
// 获取详情数据
const getDetail = () => {
  Api.creditLineDetail({ serialNo: serialNo.value, objectType: 'BusinessContract' }).then(
    (res) => {
      dynamicFormRef.value?.resetFields()
      tempSaveShow.value = res.tempsaveflag != '2' && res.tempsaveflag != '3'
      Object.keys(formData).forEach(key => delete formData[key])      
      Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res)) // 这里重新取数后，要作数据转换
      
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

dictListComputed((dictList, setDictByName) => {
  const tartgetDict = dictList['GYLFlag']
  const findDict = tartgetDict.find(v => v.itemNo === '01')
  if (!findDict) tartgetDict.push({ itemNo: '01', itemName: '非供应链' })
  setDictByName('GYLFlag', tartgetDict)
})

// 文本合同编辑字段额外赋值
const artificialNo = ({ cycleflag ,businesstype}) => {
  Api.artificialNo({ serialno: serialNo.value, cycleflag,businesstype }).then(res => {
    formData.artificialno = res || ''
  })
}

const loading = ref(false)
const initFetch = () => {
  loading.value = true

  Promise.all([creditLineTemplateFiled(), getDetail()])
    .then((res) => {
      // dynamicForm.value.fixFormData()
    })
    .finally((_) => {
      loading.value = false
    })
}

initFetch()

const saving = ref()
const save = async () => {
  const valid = await dynamicFormRef.value.validate()
  if (!valid) return
  const res = await getCheckBeforeSave({ objectNo: serialNo.value, objectType: 'BusinessContract' })
  if(!res) return
  saving.value = true
  const params = dynamicFormRef.value.formDataFixToSave()
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
      getDetail()
    })
    .finally(() => (tempSaving.value = false))
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
</script>
