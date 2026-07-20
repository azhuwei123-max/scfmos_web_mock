<script lang="ts" setup>
import { isDark } from '@/utils/is'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import routerSearch from '@/components/RouterSearch/index.vue'
import { FuncDialog } from '@/components/Dialog'
import { useVersionCheck } from './composables/useVersionCheck'
import VerifyNotify from '@/components/VersionNotify/index.vue'
import {  getDictLabel } from '@/utils/dict'

defineOptions({ name: 'APP' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('app')
const appStore = useAppStore()
const currentSize = computed(() => appStore.getCurrentSize)
const greyMode = computed(() => appStore.getGreyMode)
const { wsCache } = useCache()
 


const checkVersionTime = getDictLabel('config','checkVersionTime') ?? 60 // 没配置的话默认30S
//版本检测（仅在非dev环境启用）
// const checkInterval = import.meta.env.DEV ? 100 * 1000 : 5 * 1 * 1000
const {hasUpdate} =import.meta.env.DEV ? { hasUpdate:ref(false) } : useVersionCheck(Number(checkVersionTime) * 1000)

// 根据浏览器当前主题设置系统主题色
const setDefaultTheme = () => {
  let isDarkTheme = wsCache.get(CACHE_KEY.IS_DARK)
  if (isDarkTheme === null) {
    isDarkTheme = isDark()
  }
  appStore.setIsDark(false)
}
setDefaultTheme()
</script>
<template>
  <ConfigGlobal :size="currentSize">
    <RouterView :class="greyMode ? `${prefixCls}-grey-mode` : ''" />
    <routerSearch />
    <FuncDialog />
    <VerifyNotify v-model="hasUpdate" />
  </ConfigGlobal>
</template>
<style lang="scss">
$prefix-cls: #{$namespace}-app;

.size {
  width: 100%;
  height: 100%;
}

html,
body {
  @extend .size;

  padding: 0 !important;
  margin: 0;
  overflow: hidden;

  #app {
    @extend .size;
  }
}

.#{$prefix-cls}-grey-mode {
  filter: grayscale(100%);
}
</style>
