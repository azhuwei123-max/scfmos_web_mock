<template>
  <div class="cusomer-profile">
    <ContentWrap :body-style="{ padding: '10px 15px 0px' }">
      <el-button tpye="" @click="save" :disabled="formRendering" :loading="saving">
        <Icon class="mr-5px" icon="ep:document" />保存</el-button
      >
      <el-button tpye="" @click="onCustomerChange"
        ><Icon class="mr-5px" icon="ep:edit" />客户信息变更</el-button
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
          />
        </el-scrollbar>
      </el-skeleton>
    </ContentWrap>

    <!-- 客户信息变更 -->
    <customerChange ref="customerChangeRef" />

    <!-- 控股类型 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `entorgtypename`)"
      @confirm="(item) => popConfirm('entorgtypename', item)"
    />

    <!-- 所在国家 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `countryname`)"
      @confirm="(item) => popConfirm('countryname', item)"
    />

    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `nativeplace`)"
      @confirm="(item) => popConfirm('nativeplace', item)"
    />

    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `familyadd`)"
      @confirm="(item) => popConfirm('familyadd', item)"
    />
    
    <!-- 注册省市区 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `ctcdstccdname`)"
      @confirm="(item) => popConfirm('ctcdstccdname', item)"
    />
     
    <!-- 控股类型 -->
    <treeListPop
      :ref="(el) => setMapRef(el, `creditbelongname`)"
      @confirm="(item) => popConfirm('creditbelongname', item)"
    />
    <!-- 单位地址 -->
    <selectRegionCodePop
      :ref="(el) => setMapRef(el, `workadd`)"
      @confirm="(item) => popConfirm('workadd', item)"
    />
  </div>
</template>

<script setup>
import dynamicForm from '@/components/dynamicForm/index.vue'
import customerChange from './components/customerChange/index.vue'
import orgTypeNamePop from './components/orgTypeNamePop.vue'
import treeListPop from '@/components/dynamicForm/components/treeListPop.vue'
import selectRegionCodePop from '@/components/dynamicForm/components/selectRegionCodePop.vue'

import * as Api from './api.js'
import * as templateApi from '@/api/dynamicForm/index.js'
import useFormChange from './hooks/useFormChange'

const formRendering = ref(true)

// 表单模块集合
const dockList = reactive([])

// 表单模板配置集合
const formTempList = ref([])

const route = useRoute() // 路由对象

// 获取表单字段配置
const getTemplateVO = (templateNo, customerType) => {
  Api.getTemplateVO({ templateNo, customerType, customerId: route.query.customerId })
    .then((res) => {
      formTempList.value = res?.templates || []
      dockList.push(...(res?.docks || []))
    })
    .finally((_) => {
      loading.value = false
    })
}

// 获取表单模板号
const getCustomerTemplateNo = () => {
  Api.getCustomerTemplateNo({ codeNo: 'CustomerType', itemNo: route.query.customerType }).then(
    (res) => {
      getTemplateVO(res, route.query.customerType)
    }
  )
}

// 获取详情数据
const formData = reactive({})
const getDetail = () => {
  Api.getCustomerInfo({ customerid: route.query.customerId }).then((res) => {
    dynamicFormRef.value?.resetFields()
    Object.assign(formData, res)
  })
}

const loading = ref(false)
const initGetData = () => {
  if (!route.query.customerType) {
    return ElMessage.error('无客户类型')
  }

  loading.value = true
  Promise.all([getCustomerTemplateNo(), getDetail()]).then((res) => {})
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

// 客户变更
const customerChangeRef = ref()
const onCustomerChange = () => {
  customerChangeRef.value.open(route.query.customerId)
}

// 所有弹窗选择ref
const mapRefs = ref({})
const setMapRef = (el, key) => {
  mapRefs.value[`select${key}InputRef`] = el
}

// 表单动态事件处理
const { formSelectChange, formSelectInputClick, popConfirm, customVisible, customRequired,customReadonly } = useFormChange(
  { formData },
  { dynamicFormRef, mapRefs }
)
</script>
