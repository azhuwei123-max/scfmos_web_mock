<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
    :default-component="customerProfile"
    :get-component="getComponent"
    :menu-select="menuSelect"
  />
</template>

<script setup>
import * as Api from './api.js'
import customerProfile from './components/customerProfile/index.vue'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'customerDetail'
})

// 默认展示客户概况
const activeMenu = ref('010')
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({
    serialNo: route.query.serialNo,
    objectType: 'CreditApply',
    codeNo: 'CreditView'
  })
    .then((res) => {
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()

const getComponent = (menu) => {
  if (menu.value === './components/customerProfile/index.vue') {
    return customerProfile
  }
}
const menuSelect = (menu) => {
  return {
    tpserialno: route.query.serialNo
  }
}
</script>