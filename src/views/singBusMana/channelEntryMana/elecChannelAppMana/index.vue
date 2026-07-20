
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
  name: 'elecChannelAppMana'
})

const menuList = ref([...defaultMenuList])

const menuSelect = (menu) => {
  return {
    type: menu.type
  }
}
</script>
