<script lang="ts" setup>
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useAppStore } from '@/store/modules/app'
import { Footer } from '@/layout/components/Footer'

defineOptions({ name: 'AppView' })

const appStore = useAppStore()

const layout = computed(() => appStore.getLayout)

const fixedHeader = computed(() => appStore.getFixedHeader)

const footer = computed(() => appStore.getFooter)

const tagsViewStore = useTagsViewStore()

const getCaches = computed((): string[] => {
  return tagsViewStore.getCachedViews
})

const tagsView = computed(() => appStore.getTagsView)

const appViewRef = ref<HTMLElement | null>(null)
const route = useRoute()

const runPageTransition = async () => {
  await nextTick()
  const el = appViewRef.value
  if (!el) return
  el.classList.remove('page-fade-slide')
  // 强制重绘，确保动画可以重新触发
  void el.offsetHeight
  el.classList.add('page-fade-slide')
}

watch(
  () => route.fullPath,
  () => {
    runPageTransition()
  }
)

onMounted(() => {
  runPageTransition()
})

//region 无感刷新
const routerAlive = ref(true)
// 无感刷新，防止出现页面闪烁白屏
const reload = () => {
  routerAlive.value = false
  nextTick(() => (routerAlive.value = true))
}
// 为组件后代提供刷新方法
provide('reload', reload)
//endregion
</script>

<template>
  <section
    ref="appViewRef"
    :class="[
      'p-[var(--app-content-padding)] w-[calc(100%-var(--app-content-padding)-var(--app-content-padding))] bg-[var(--app-content-bg-color)] dark:bg-[var(--app-content-bg-color)]',
      {
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height))]':
          (fixedHeader &&
            (layout === 'classic' || layout === 'topLeft' || layout === 'top') &&
            footer) ||
          (!tagsView && layout === 'top' && footer),
        '!min-h-[calc(100%-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height)-var(--tags-view-height))]':
          tagsView && layout === 'top' && footer,

        '!min-h-[calc(100%-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-var(--top-tool-height)-var(--app-footer-height))]':
          !fixedHeader && layout === 'classic' && footer,

        '!min-h-[calc(100%-var(--tags-view-height)-var(--app-content-padding)-var(--app-content-padding)-var(--app-footer-height))]':
          !fixedHeader && layout === 'topLeft' && footer,

        '!min-h-[calc(100%-var(--top-tool-height)-var(--app-content-padding)-var(--app-content-padding))]':
          fixedHeader && layout === 'cutMenu' && footer,

        '!min-h-[calc(100%-var(--top-tool-height)-var(--app-content-padding)-var(--app-content-padding)-var(--tags-view-height))]':
          !fixedHeader && layout === 'cutMenu' && footer
      }
    ]"
  >
    <router-view v-if="routerAlive">
      <template #default="{ Component, route }">
        <keep-alive :include="getCaches">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </template>
    </router-view>
  </section>
  <Footer v-if="footer" />
</template>
