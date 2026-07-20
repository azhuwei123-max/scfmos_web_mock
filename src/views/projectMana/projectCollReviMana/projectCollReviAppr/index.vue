<template>
  <dynamicContainer2
    ref="dynamicContainer2Ref"
    :loading="loading"
    :menu-list-y="menuListY"
    :menu-list-n="menuListN"
    :component="workList"
    :menu-select="menuSelect"
    @reLoad="reLoad"
  />
</template>

<script setup>
import * as Api from './api.js'
import workList from './components/workList/index.vue'
import dynamicContainer2 from '@/components/dynamicContainer2/index.vue'

defineOptions({
  name: 'projectCollReviAppr'
})

// 取数回调前，保持数组为空
const menuListY = ref()
const menuListN = ref()

const menuSelect = () => {
  return {
    objectType: 'BusinessContract'
  }
}

// 获取当前
const loading = ref(false)
const aprrovalTreeList =async (type) => {
  const res =  await Api.aprrovalTreeList({ type })
  if (type === 'Y') menuListY.value = res || []
    else if (type === 'N') menuListN.value = res || []
}

const doFetch = async() => {
  loading.value = true
  await  Promise.all([aprrovalTreeList('Y'), aprrovalTreeList('N')]).finally(() => (loading.value = false))
}
doFetch()

const dynamicContainer2Ref = ref()
const reLoad = async() => {
  await doFetch()
  dynamicContainer2Ref.value.setMenuList([menuListN.value, menuListY.value])
  
}
</script>
