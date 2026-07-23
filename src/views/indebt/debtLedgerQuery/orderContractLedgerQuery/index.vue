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
const activeMenu = computed(() => String(route.query?.key || 'valid'))
const modules = import.meta.glob('./components/*/index.vue')

const handleMenuSelect = (menu: { status: string }) => ({ status: menu.status })
</script>
