
<template>
  <dynamicContainer
    :comp-modules="modules"
    :menu-list="menuList"
    :loading="loading"
  />
</template>

<script setup>
import * as Api from './api.js'
import dynamicContainer from '@/components/dynamicContainer/index.vue'
const modules = import.meta.glob('./components/*/index.vue')

defineOptions({
  name: 'ecscfsPushInfoMGM'
})

// 默认展示客户概况
const route = useRoute()

const menuList = ref([])

// 获取菜单列表
const loading = ref(false)
const getCustomerView = () => {
  loading.value = true
  Api.getCustomerView({ codeNo: 'TSELCreditApplyMain' })
    .then((res) => {
      menuList.value = res || []
    })
    .finally((_) => (loading.value = false))
}
getCustomerView()
</script>