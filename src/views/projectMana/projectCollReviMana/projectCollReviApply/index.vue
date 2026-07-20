
<template>
  <dynamicContainer
    :comp-modules="modules"
    :menu-list="menuList"
    :menu-select="menuSelect"
  />
</template>

<script setup>
import dynamicContainer from '@/components/dynamicContainer/index.vue'
const modules = import.meta.glob('./components/*/index.vue')
import { defaultMenuList } from './common.js'

defineOptions({
  name: 'projectCollReviApply'
})

const menuList = ref([...defaultMenuList])

const menuSelect = (menu) => {
  return {
    // phaseType: menu.type
  }
}
</script>
