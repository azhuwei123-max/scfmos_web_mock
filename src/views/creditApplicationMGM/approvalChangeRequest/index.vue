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

<script setup>
  import { getApproveMenuList } from './api'
  import dynamicContainer from '@/components/dynamicContainer/index.vue'

  const modules = import.meta.glob('./components/*/index.vue')

  defineOptions({
    name: 'ApprovalChangeRequest'
  })
  const route = useRoute()

  // 默认展示客户概况
  const activeMenu = computed(()=> route.query?.key ?? '1010')

  const menuList = ref([])
  const loading = ref(false)

  // 获取菜单列表
  const getMenu = async () => {
    try {
      loading.value = true
      const res = await getApproveMenuList()
      menuList.value = res || []
    } finally {
      loading.value = false
    }
  }
  onBeforeMount(()=> {
    getMenu()
  })

  const getComponent = (menu) => {
    // if (menu.value === './components/toRegistered/index.vue') {
    //   return toRegistered
    // }
  }
  const menuSelect = (menu) => {
    return {
      // tpserialno: route.query.customerID
    }
  }
</script>