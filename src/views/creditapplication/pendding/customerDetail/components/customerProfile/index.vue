<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button v-if="tempSaveShow" :loading="tempSaving" @click="tempSave">暂存</el-button>
      <el-button tpye="" @click="onCustomerChange"
        ><Icon class="mr-5px" icon="ep:edit" />客户信息变更</el-button
      >
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
            @pop-confirm="popConfirm"
            @select-input-click="formSelectInputClick"
            @select-change="formSelectChange"
            @render-finished="formRendering = false"
          />
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
    <treeListPop
      :ref="(el) => setMapRef(el, `directionname`)"
      @confirm="(item) => popConfirm('directionname', item)"
    />


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

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'
import { object } from 'vue-types'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象


// 获取表单字段配置
const getTemplateVO = (customerType) => {
  Api.getTemplateVO({  codeNo: 'CreditLineView1', objectType: 'CreditApply', serialNo:route.query.serialNo })
    .then((res) => {
      // console.log('resresresres',res);
      formTempList.value = res?.templates || []
      dockList.push(...(res?.docks || []))
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
const formData = reactive({})
const getDetail = () => {
  return Api.getChangeCustomerInfo({ objectType: 'CreditApply',serialNo:route.query.serialNo }).then((res) => {
    dynamicFormRef.value?.resetFields()
    Object.assign(formData, res)
    tempSaveShow.value = res.tempsaveflag === '1'
    //  entTempSaveFlag()
    // entImportFlag()
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


const arrTostr = (arr,sep=',') => {
  if(!Array.isArray(arr) || arr.length ===0) {
    return ""
  }
  return arr.join(sep)
}

/**
 * 保存
 */
const dynamicFormRef = ref()
const saving = ref(false)
const save = () => {

  dynamicFormRef.value.validate().then((valid) => {
    if (!valid) return
    
    saving.value = true
    const params  =  {...formData ,objectType: 'Save',gylloanproductcategory: arrTostr(formData.gylloanproductcategory),loanproductcategory:arrTostr(formData.loanproductcategory),vouchflag:arrTostr(formData.vouchflag)}
    Api.saveCustomer(params)
      .then((res) => {
        ElMessage.success('保存成功')
      })
      .finally((_) => (saving.value = false))
  })
}

const tempSaving = ref(false)
const tempSave = () => {
  tempSaving.value = true
  const params  =  {...formData ,objectType: 'Save',gylloanproductcategory: arrTostr(formData.gylloanproductcategory),loanproductcategory:arrTostr(formData.loanproductcategory),vouchflag:arrTostr(formData.vouchflag)}
  Api.saveCustomer({ ...formData, objectType: 'TempSave' })
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

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)



</script>