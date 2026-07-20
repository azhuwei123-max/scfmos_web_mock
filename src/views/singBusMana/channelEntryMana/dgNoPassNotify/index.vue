
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
  name: 'dgNoPassNotify'
})

const menuList = ref([...defaultMenuList])

const menuSelect = (menu) => {
  return {
    objectType: menu.type1,
    status: menu.type2
  }
}
</script>
