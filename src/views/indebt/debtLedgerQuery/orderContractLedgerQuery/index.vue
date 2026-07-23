<template>
  <dynamicContainer
    :active-menu="activeMenu"
    :comp-modules="modules"
    :menu-list="orderContractLedgerMenus"
    :menu-select="handleMenuSelect"
  />
</template>

<script setup lang="ts">
import dynamicContainer from '@/components/dynamicContainer/index.vue'
import { orderContractLedgerMenus } from './common'

defineOptions({ name: 'OrderContractLedgerQuery' })

const route = useRoute()
const routeDefaultMenu = computed(() => {
  const path = String(route.path || '')
  return path.includes('/pledge') ? 'pledge' : 'prepayment'
})
const activeMenu = computed(() => String(route.query?.key || routeDefaultMenu.value))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { productPlan: string }) => ({ productPlan: menu.productPlan })
</script>
