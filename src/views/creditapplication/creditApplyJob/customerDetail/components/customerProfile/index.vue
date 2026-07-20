<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving" v-if ="(route.query.phaseNo=='0010' || route.query.phaseNo=='3000') && route.query.type != 'Y' && props.params.isEdit">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button v-if="tempSaveShow && (route.query.phaseNo=='0010'|| route.query.phaseNo=='3000') && route.query.type != 'Y'" :loading="tempSaving" @click="tempSave">暂存</el-button>
      <el-button @click="viewEdpfReport" :loading="loading3" v-if="route.query.applyType=='ApproveChangeApply'"> 查看批复通知书 </el-button>
      <!--<el-button tpye="" @click="onCustomerChange"
        ><Icon class="mr-5px" icon="ep:edit" />客户信息变更</el-button
      >-->
      <el-button v-if="ecifShow" :loading="ecifImporting" @click="ecifImport"
        ><Icon class="mr-5px" icon="ep:download" />导入ECIF数据</el-button
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
            :customRequired="customRequired"
            :customReadonly="customReadonly"
            @pop-confirm="popConfirm"
            @select-input-click="formSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="formRendering = false"
          >
            <template #CreditAllot>
              <creditAllot :serialNo="serialNo" :phaseNo="route.query.phaseNo" :type="route.query.type"/>
            </template>
            <template #BusinessAllot>
              <businessAllot :serialNo="serialNo" :phaseNo="route.query.phaseNo" :type="route.query.type"/>
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

    <!-- 客户信息变更 -->
    <customerChange ref="customerChangeRef" />

    <!-- 控股类型 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `orgtypename`)"
      @confirm="(item) => popConfirm('orgtypename', item)"
    />

    <!-- 是否两高一剩行业 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `surplusindustryname`)"
      @confirm="(item) => popConfirm('surplusindustryname', item)"
    />

    <!-- 上级公司名称 -->
    <selectSuperCorpPop
      :ref="(el) => setMapRef(el, `supercorpname`)"
      @confirm="(item) => popConfirm('supercorpname', item)"
    />

    <!-- 所在国家 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `countrycodename`)"
      @confirm="(item) => popConfirm('countrycodename', item)"
    />

    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `regioncodename`)"
      @confirm="(item) => popConfirm('regioncodename', item)"
    />

    <!-- 办公省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `officeaddcodename`)"
      @confirm="(item) => popConfirm('officeaddcodename', item)"
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

      <!-- 主要担保方式 -->
     <treeListPop
      :ref="(el) => setMapRef(el, `vouchtypename`)"
      @confirm="(item) => popConfirm('vouchtypename', item)"
    />
  <iframeDialog ref="iframeDialogRef" title="信贷" />
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import customerChange from './components/customerChange/index.vue'
import orgTypeNamePop from './components/orgTypeNamePop.vue'
import selectSurplusIndustryPop from './components/selectSurplusIndustryPop.vue'
import selectSuperCorpPop from './components/selectSuperCorpPop.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import selectRegionCodePop from '@/components/dynamicForm/components/selectRegionCodePop.vue'
import creditAllot from './components/creditAllot.vue'
import businessAllot from './components/businessAllot.vue'
import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import { object } from 'vue-types'
import { getCheckBeforeSave } from '@/api/common/index'

const props = defineProps({
  params: {
    type: Object,
    default: ()=>({})
  }
})

const emits = defineEmits(['sendInfo'])
const formRendering = ref(true)

// 表单模块集合
const dockList = ref([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象
const serialNo = computed(()=> props.params.serialNoByProps || route.query.relativeserialno || route.query.serialNo || route.query.serialno)
console.log('[ props ] >', props.params)
// 获取表单字段配置
const getTemplateVO = (customerType) => {
  Api.getTemplateVO({  codeNo: 'CreditLineView1', objectType: 'CreditApply', serialNo:serialNo.value })
    .then((res) => {
      console.log('resresresres',res);
      formTempList.value = res?.templates || []
      dockList.value = res?.docks || []
    })
    .finally((_) => {
      loading.value = false
    })
}

// 获取表单模板号
const getCustomerTemplateNo = () => {
  return Api.getCustomerTemplateNo({ codeNo: 'CreditLineView1', objectType: 'CreditApply',serialNo:serialNo.value })
}

// 获取详情数据
const formData = reactive({})
const getDetail = () => {
  return Api.getChangeCustomerInfo({ objectType: 'CreditApply',serialNo:serialNo.value }).then((res) => {
    dynamicFormRef.value?.resetFields()
    Object.keys(formData).forEach((key) => delete formData[key])
    Object.assign(formData, dynamicFormRef.value?.formDataFixToShow(res) ?? res) // 这里重新取数后，要作数据转换
    tempSaveShow.value = res.tempsaveflag === '1'
    //  entTempSaveFlag()
    // entImportFlag()
    emits('sendInfo', formData)
  })
}

const loading = ref(false)
const initGetData = () => {
  // if (!route.query.orgNature) {
  //   return ElMessage.error('无机构类型')
  // }

  loading.value = true
  Promise.all([getDetail()]).then((res) => {
    getTemplateVO()
  })
}

// initGetData()


const arrTostr = (arr,sep=',') => {
  if(!Array.isArray(arr) || arr.length ===0) {
    return ""
  }
  return arr.join(sep)
}

const router = useRouter()

/**
 * 保存
 */
const dynamicFormRef = ref()
const saving = ref(false)
const save = () => {

  dynamicFormRef.value.validate().then(async (valid) => {
    // console.log(1111111, valid)
    console.log('formData',formData);
    if(!formData?.exposuresum>0 ) {
      ElMessage.warning('敞口金额必须大于0')
      return
    }
    if(!formData?.businesssum>0 ) {
      ElMessage.warning('额度金额必须大于0')
      return
    }
    // if()
    if (!valid) return
    const res = await getCheckBeforeSave({ objectNo: serialNo.value,objectType: 'CreditApply' })
    if(!res) return
    saving.value = true
    // const params  =  {
    //   ...formData ,
    //   objectType: 'Save',
    //   gylloanproductcategory: formData.gylloanproductcategory,
    //   // loanproductcategory:arrTostr(formData.loanproductcategory),
    //   vouchflag:arrTostr(formData.vouchflag),
    //   tempsaveflag:'2'
    // }

    const params = dynamicFormRef.value.formDataFixToSave()
    params.objectType = 'Save'
    params.tempsaveflag = '2'

    Api.saveCustomer(params)
      .then((res) => {
        ElMessage.success('保存成功')

        // 重新进页面，确保是已经保存过的状态
        getDetail()
      })
      .finally((_) => (saving.value = false))
  })
}

const tempSaving = ref(false)
const tempSave = () => {
  tempSaving.value = true
  // const params  =  {...formData ,objectType: 'TempSave',gylloanproductcategory: formData.gylloanproductcategory,loanproductcategory:arrTostr(formData.loanproductcategory),vouchflag:arrTostr(formData.vouchflag)}
  const params = dynamicFormRef.value.formDataFixToSave()
  params.objectType = 'TempSave'
  Api.saveCustomer(params)
    .then((res) => {
      ElMessage.success('暂存成功')
    })
    .finally((_) => (tempSaving.value = false))
}

// 暂存按钮显隐控制
const tempSaveShow = ref(false)
const entTempSaveFlag = () => {
  Api.entTempSaveFlag({
    customerType: formData.customertype,
    customerId: formData.customerid
  }).then((res) => {
    if (res !== '2') {
      tempSaveShow.value = true
    }
  })
}

// 导入ecif按钮权限
const ecifShow = ref(false)
const entImportFlag = () => {
  Api.entImportFlag({
    customerType: formData.customertype,
    customerId: formData.customerid
  }).then((res) => {
    if (res !== '2') {
      ecifShow.value = true
    }
  })
}

// ecif导入
const ecifImporting = ref(false)
const ecifImport = () => {
  ecifImporting.value = true
  Api.getEcifIndInfo({ customerId: formData.customerid })
    .then((res) => {
      ElMessage.success('导入成功')
      getDetail()
    })
    .finally((_) => (ecifImporting.value = false))
}

// 客户变更
const customerChangeRef = ref()
const onCustomerChange = () => {
  customerChangeRef.value.open(route.query.customerID)
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

const greenTypes = ref()
const getgreenTypes = () => {
    Api.getGreenTypes({})
    .then((res) => {
     greenTypes.value = res[0].itemDescribe
    })
}
getgreenTypes()

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customRequired, customReadonly } = useFormChange(
  { formData, params: {
    greenTypes
  } },
  { dynamicFormRef, mapRefs }
)
// 查看批复通知书
const loading3 = ref()
const viewEdpfReport = () => {
  loading3.value = true
  Api.viewEdpfReport({
    objectNo: formData.bapSerialNo
  }).then(res => {
    if (res.checkflag !== 'true') {
      ElMessage.warning(res.msg)
      return
    }

    window.open(res.url)
  }).finally(() => loading3.value = false)
}

// const activeComp = () => {
//   initGetData()
// }

onActivated(() => {
  initGetData()
})

const iframeDialogRef = ref()
const toCRMS = (formInfo) => {
  const params = {
    dockId: formInfo.dockid,
    objectType: 'CreditApply',
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

</script>
