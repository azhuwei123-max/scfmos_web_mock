<template>
  <el-menu class="customer-detail-menu" :default-active="activeMenu" @select="select">
    <el-menu-item v-for="menu in menuList" :key="menu.key" :index="menu.key">
      <template #title>{{ menu.title }}</template>
      <!-- <el-menu-item v-for="child in menu.childrens" :key="child.key" :index="child.key">
        {{ child.title }}
      </el-menu-item> -->
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import pendingApplication from '../pendingApplication/index.vue'

const emit = defineEmits(['menuSelect'])

const menuList = [
  {
    title: '待处理申请',
    key: '1',
    component: pendingApplication
  }
]

const getMenuByKey = (key) => {
  return menuList.find(v => v.key == key) ?? {}
}

const select = (index) => {
  emit(
    'menuSelect',
    getMenuByKey(index)
  )
}

const activeMenu = ref('1')

onMounted(() => {
  emit(
    'menuSelect',
    getMenuByKey(activeMenu.value)
  )
})
</script>

<style lang="scss">
.customer-detail-menu {
  border-radius: 8px !important;
  padding: 8px !important;
  background: var(--el-bg-color-overlay) !important;
  border: 1px solid var(--el-border-color-lighter) !important;

  .el-menu {
    border: none !important;
    background: transparent !important;
  }

  .el-menu-item,
  .el-sub-menu__title {
    height: 36px !important;
    line-height: 36px !important;
    // padding: 0 12px !important;
    border-radius: 6px !important;
    transition: all 0.2s ease !important;

    &:hover {
      background: var(--el-fill-color-light) !important;
      color: var(--el-color-primary) !important;
    }

    &.is-active {
      background: rgba(var(--el-color-primary-rgb), 0.15) !important;
      color: var(--el-color-primary) !important;
    }
  }

  .el-menu-item {
    margin: 4px 0 !important;
  }
}
</style>