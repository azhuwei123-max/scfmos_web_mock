
<template>
  <dynamicContainer
    :active-menu="activeMenu"
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
  name: 'pfbgsq'
})
const route = useRoute()
const activeMenu = computed(()=> route.query?.key ?? '010')

const menuList = ref([...defaultMenuList])

const menuSelect = (menu) => {
  return {
    type: menu.type
  }
}
</script>
