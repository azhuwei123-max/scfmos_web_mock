<template>
  <dynamicContainer2
    ref="dynamicContainer2Ref"
    :menu-list-y="menuListY"
    :menu-list-n="menuListN"
    :loading="loading"
    :component="List"
    :menu-select="menuSelect"
    @re-load="reLoad"
  />
</template>

<script setup lang="ts">
  import { getMenuList } from './api'
  import List from './components/list/index.vue'
  import dynamicContainer2 from '@/components/dynamicContainer2/index.vue'

  defineOptions({
    name: 'ParamAdjustApprove'
  })

  const menuListY = ref<any[]>([])
  const menuListN = ref<any[]>([])
  const loading = ref(false)

  // 获取菜单列表
  const getMenu = async (type: 'Y' | 'N') => {
    loading.value = true
    const res = await getMenuList({type})
    if(type === 'Y') menuListY.value = res || []
    else if (type === 'N') menuListN.value = res || []
    
  }
  const getData = async () => {
    loading.value = true
    return Promise.allSettled([
      getMenu('Y'),
      getMenu('N')
    ]).finally(()=> loading.value = false)
  }
  onBeforeMount(()=> {
    getData()
  })

  const getComponent = () => {
    // if (menu.value === './components/toRegistered/index.vue') {
    //   return toRegistered
    // }
  }
  const menuSelect = () => {
    
  }

  const dynamicContainer2Ref = ref()
  const reLoad = () => {
    getData().then(res => {
      dynamicContainer2Ref.value.setMenuList()
    })
  }
</script>