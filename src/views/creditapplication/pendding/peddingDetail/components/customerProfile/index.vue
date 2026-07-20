<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving" v-if="(route.query.phaseNo=='0010' || route.query.phaseNo=='3000') && route.query.type != 'Y'">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button v-if="tempSaveShow && (route.query.phaseNo=='0010' || route.query.phaseNo=='3000') && route.query.type != 'Y'" :loading="tempSaving" @click="tempSave">暂存</el-button>
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
            @pop-confirm="popConfirm"
            @select-input-click="formSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="formRendering = false"
          >
            <template #CreditAllot>
              <!-- 222 -->
              <creditAllot :serialNo="route.query.serialNo" :phaseNo="route.query.phaseNo"/>
            </template>
            <template #BusinessAllot>
              <!-- 333 -->
              <businessAllot :serialNo="route.query.serialNo" :phaseNo="route.query.phaseNo" />
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


     <!-- 支农分类 -->
     <treeListPop
      :ref="(el) => setMapRef(el, `farmingtypename`)"
      @confirm="(item) => popConfirm('farmingtypename', item)"
    />

    
    <!-- 贷款投向 -->
    <!-- <treeListPop
      :ref="(el) => setMapRef(el, `directionname`)"
      @confirm="(item) => popConfirm('directionname', item)"
    /> -->

     <!-- 贷款投向 -->
     <industrytypePop
      :ref="(el) => setMapRef(el, `directionname`)"
      @confirm="(item) => popConfirm('directionname', item)"
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
import industrytypePop from './components/industrytypePop.vue'
import creditAllot from '@/views/creditapplication/creditApplyJob/customerDetail/components/customerProfile/components/creditAllot.vue'
import businessAllot from '@/views/creditapplication/creditApplyJob/customerDetail/components/customerProfile/components/businessAllot.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import { object } from 'vue-types'
import useDynamicHelper from '@/components/dynamicForm/hooks/useDynamicHelper.js'
import { getCheckBeforeSave } from '@/api/common/index'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象

const dynamicFormRef = ref()
const { dictListComputed } = useDynamicHelper(dynamicFormRef)

dictListComputed((dictList, setDictByName) => {
  const tartgetDict = dictList['GYLFlag']?.filter(v => v.itemNo != '02')
  setDictByName('GYLFlag', tartgetDict)
})

// 获取表单字段配置
const getTemplateVO = (customerType) => {
  Api.getTemplateVO({  codeNo: 'CreditLineView1', objectType: 'CreditApply', serialNo:route.query.serialNo })
    .then(async (res) => {
      console.log('resresresres',res);
      const templates = res?.templates.map(item => {
        if(item.colheader ==='利率类型' || item.colheader ==='还款方式') {
          return {
            ...item,
            colrequired:'0'
          }
        } 
        return item
      })
      console.log('templates',templates);
      formTempList.value = templates || []
      dockList.push(...(res?.docks || []))
      await getProductTermPara()
    })
    .finally((_) => {
      loading.value = false
    })
}

// 获取表单模板号
const getCustomerTemplateNo = () => {
  return Api.getCustomerTemplateNo({ codeNo: 'CreditLineView1', objectType: 'CreditApply',serialNo:route.query.serialNo })
}

// 获取详情数据
const emits = defineEmits(['sendInfo'])
const formData = reactive({})
const getDetail = () => {
  return Api.getChangeCustomerInfo({ objectType: 'CreditApply',serialNo:route.query.serialNo }).then(async (res) => {
    dynamicFormRef.value?.resetFields()
    Object.assign(formData, res)
    tempSaveShow.value = res.tempsaveflag === '1'
    await getProjectInfoByBS()
    //  entTempSaveFlag()
    // entImportFlag()
    emits('sendInfo', formData)
  })
}

const getProjectInfoByBS = () => {
  return new Promise((resolve, rej) => {
    Api.getProjectInfoByBS({ objectType: 'CreditApply',objectNo:route.query.serialNo })
      .then((res) => {
        ////每笔出账业务不超过XX月
        const sSinglePayMonth = formData.singlepaymonth
        //// 01非供应链  02混合供应链 03纯供应链
        const sGYLFlag = formData.gylflag
        const sIsSinglePayControl = formData.issinglepaycontrol
        const businessType = formData.businesstype
        if(!sSinglePayMonth&&sIsSinglePayControl==="1"&&sGYLFlag==="03"&&businessType==="1110170") {
          formData.singlepaymonth = res.singlepaymonth
        }
        const sLendBack = formData.lendback
        if(!sLendBack) {
          formData.lendback = res.lendback
        }
        const sEntrustFlag = formData.entrustflag
        if(!sEntrustFlag) {
          formData.entrustflag = res.entrustflag
        }
        resolve(true)
      }).
      catch(e => {
        resolve(false)
      })
  })
}

const getProductTermPara = () => {
  return new Promise((resolve, rej) => {
    Api.getProductTermPara({ typeNo: formData.businesstype })
      .then((res) => {
        console.log("formTempList.value", formTempList.value)
        let targetObj = formTempList.value.filter(obj => obj.colname === "PostponePaymentFlag")
        const graceDays = formData.gracedays
        if(res !== "1") {
          formData.postponepaymentflag = "1"
          targetObj[0].colreadonly = "1"
        }
        if(!graceDays && formData.businesstype === "1110170") {
          formData.gracedays = "0"
        }

        resolve(true)
      }).
      catch(e => {
        resolve(false)
      })
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

initGetData()

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

const arrTostr = (arr,sep=',') => {
  if(!Array.isArray(arr) || arr.length ===0) {
    return ""
  }
  return arr.join(sep)
}

/**
 * 保存
 */
const saving = ref(false)
const save = async () => {
  dynamicFormRef.value.validate().then(async (valid) => {
    console.log(1111111, valid,formData)
    if (!valid) return
    const res = await getCheckBeforeSave({ objectNo: route.query.serialNo,objectType: 'CreditApply' })
    if(!res) return
    saving.value = true
    const params  =  {...formData ,objectType: 'Save',vouchtype1: arrTostr(formData.vnvouchtype1),vouchflag:arrTostr(formData.vouchflag),tempsaveflag:'2'}
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
  const params  =  {...formData ,objectType: 'Save',vouchtype1: arrTostr(formData.vouchtype1),vouchflag:arrTostr(formData.vouchflag)}
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
const { formSelectChange, formSelectInputClick, popConfirm, customVisible , customRequired } = useFormChange(
  { formData, params: {
    greenTypes
  } },
  { dynamicFormRef, mapRefs }
)



</script>
