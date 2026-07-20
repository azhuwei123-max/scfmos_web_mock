<template>
  <div
    :class="{
      'toolbar-container': toolbarList.length > 1,
    }"
    class="toolbar-wrapper"
  >
    <!-- 颜色切换 - 仅在中等及以上屏幕显示 -->
    <div v-if="showColor" class="hidden md:flex">
      <ColorToggle />
    </div>
    
    <!-- 主题切换 -->
    <div v-if="showTheme" class="toolbar-item">
      <ThemeSwitch />
    </div>
    
    <!-- 语言切换 -->
    <div v-if="showLanguage" class="toolbar-item">
      <LocaleDropdown />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import ColorToggle from './ColorToggle.vue'

export type ToolbarType = 'color' | 'language' | 'theme'

interface Props {
  toolbarList?: ToolbarType[]
}

defineOptions({
  name: 'Toolbar',
})

const props = withDefaults(defineProps<Props>(), {
  toolbarList: () => ['theme', 'language'],
})

const showColor = computed(() => props.toolbarList.includes('color'))
const showLanguage = computed(() => props.toolbarList.includes('language'))
const showTheme = computed(() => props.toolbarList.includes('theme'))
</script>

<style lang="scss" scoped>
.toolbar-wrapper {
  position: absolute;
  right: 0.5rem;
  top: 1rem;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
}

.toolbar-container {
  background: var(--el-bg-color-overlay);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  padding: 0.25rem 0.75rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  border: 1px solid var(--el-border-color-lighter);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.toolbar-item {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
  
  // 语言切换图标优化
  :deep(.v-locale-dropdown) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0.4rem;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    border-radius: 50%;
    
    &:hover {
      background: var(--el-fill-color-light);
      transform: scale(1.1);
    }
    
    &:active {
      transform: scale(0.95);
    }
    
    .icon {
      font-size: 1.125rem;
    }
  }
  
  // 主题切换按钮
  :deep(.theme-toggle) {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease-in-out;

    svg {
      width: 1.125rem;
      height: 1.125rem;
    }

    &:hover {
      background: var(--el-fill-color-light);
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }
  
  // Element Plus 下拉菜单优化
  :deep(.el-dropdown) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  :deep(.el-dropdown__trigger) {
    border: none;
    background: transparent;
    outline: none;
  }
}

// 深色模式适配
.dark {
  .toolbar-container {
    background: rgba(0, 0, 0, 0.3);
    border-color: var(--el-border-color-darker);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
}

// 响应式优化
@media (max-width: 768px) {
  .toolbar-wrapper {
    right: 0.25rem;
    top: 0.5rem;
  }
  
  .toolbar-container {
    padding: 0.125rem 0.5rem;
  }
}
</style>

