
<template>
  <dynamicContainer
    :comp-modules="modules"
    :menu-list="menuList"
    @menu-select="menuSelect"
    state-cache-key="modeApplication"
    :enable-state-cache="true"
  />
</template>

<script setup>
import dynamicContainer from '@/components/dynamicContainer/index.vue'
// import dynamicContainer from '@/components/dynamicContainer/index_cache.vue'
const modules = import.meta.glob('./components/*/index.vue')
import { defaultMenuList } from './common.js'

defineOptions({
  name: 'modeApplication'
})

const menuList = ref([...defaultMenuList])

const menuSelect = (menu) => {
  return {
    // phaseType: menu.type
    phaseNo:menu.phaseNo
  }
}
</script>
