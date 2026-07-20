<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :get-component="getComponent"
    :menu-select="menuSelect"
  />
</template>

<script setup lang="tsx">
import { getMenuParamAdjust } from '../api'
// import customerProfile from './components/customerProfile/index.vue'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import CoreList from './components/CoreList/index.vue'
import ProjectCoAuditList from './components/ProjectCoAuditList/index.vue'
import ParamAdjustApplyDetailComponents from '../../paramadjustapply/detail/detail.vue'
import { ParamAdjustApplyDetailPropsParams } from '../../paramadjustapply/detail/type'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'ProjectInfoQueryProjectDetails'
})

// 默认展示客户概况
const activeMenu = ref('010010')
const route = useRoute()

const menuList = ref([])

const customerID = route.query?.customerId || route.query?.customerID

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  getMenuParamAdjust({
    customerId: customerID,
    objectType: route.query?.objectType,
    type: route.query?.type
  })
    .then((res) => {
      menuList.value = res || []
    })
    .finally(() => (loading.value = false))
}
getCustomerView()

/**
 * 获取左侧菜单对应组件
 * 客户详情需要特殊处理，因为默认就展示客户详情，在取菜单接口时候直接import节省白屏时间
 */
const getComponent = (menu) => {
  if (menu.key === '010060') {
    // 项目协审详情
    return ProjectCoAuditList
  } else if (menu.key === '010070') {
    // 核心客户详情
    return CoreList
  } else if (menu.key === '010020') {
    // 项目参数
    return ParamAdjustApplyDetailComponents
  }
}
// 用项目编号的菜单
const projectIds = ['010010', '010030010', '010030020', '010050010', '010050020','010040040','010040050']
const menuSelect = (menu) => {
   // 项目参数
  if(menu.key === '010020') {
    const params: ParamAdjustApplyDetailPropsParams = {
      serialno: (route.query?.projectId ?? '') as string,
      type: 'detail',
      tempType: 'ProjectDetails',
      customerId: customerID as string,
      businessType: route.query?.businessType as string,
      serialNoByList: route.query?.serialNoByList as string,
      isHiddenBtn: true,
      isMaintainProjectInfo: route.query?.isMaintainProjectInfo === '1'
    }
    return params
  }
  return {
    tpserialno: projectIds.includes(menu.key) ? route.query?.projectId : customerID,
    projectId: route.query?.projectId,
    customerId: customerID
  }
}
</script>
