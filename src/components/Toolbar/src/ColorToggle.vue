<template>
  <div class="color-toggle-wrapper">
    <!-- 颜色预设列表 - 悬停时展开 -->
    <div class="color-list">
      <template v-for="preset in COLOR_PRESETS" :key="preset.color">
        <button
          class="color-item"
          :title="preset.name"
          @click="handleUpdate(preset.color)"
        >
          <div
            :style="{ backgroundColor: preset.color }"
            class="color-dot"
          >
            <!-- 选中标记 -->
            <svg
              v-if="currentColor === preset.color"
              class="check-icon"
              height="14"
              viewBox="0 0 15 15"
              width="14"
            >
              <path
                clip-rule="evenodd"
                d="M11.467 3.727c.289.189.37.576.181.865l-4.25 6.5a.625.625 0 0 1-.944.12l-2.75-2.5a.625.625 0 0 1 .841-.925l2.208 2.007l3.849-5.886a.625.625 0 0 1 .865-.181"
                fill="currentColor"
                fill-rule="evenodd"
              />
            </svg>
          </div>
        </button>
      </template>
    </div>

    <!-- 调色板图标 -->
    <button class="palette-button" title="主题颜色">
      <Icon icon="ep:menu" class="palette-icon" :style="{ color: currentColor }" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@/components/Icon'

defineOptions({
  name: 'ColorToggle',
})

// 颜色预设
const COLOR_PRESETS = [
  { color: '#409EFF', name: '默认蓝' },
  { color: '#67C23A', name: '成功绿' },
  { color: '#E6A23C', name: '警告橙' },
  { color: '#F56C6C', name: '危险红' },
  { color: '#909399', name: '信息灰' },
  { color: '#9C27B0', name: '紫色' },
  { color: '#FF5722', name: '深橙' },
  { color: '#00BCD4', name: '青色' },
]

const currentColor = ref('#409EFF')

// 更新主题颜色
function handleUpdate(color: string) {
  currentColor.value = color
  // 更新 CSS 变量
  document.documentElement.style.setProperty('--el-color-primary', color)
  
  // 生成主题色的各个级别
  for (let i = 1; i <= 9; i++) {
    const lightColor = getLightColor(color, i / 10)
    document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, lightColor)
  }
  
  const darkColor = getDarkColor(color, 0.2)
  document.documentElement.style.setProperty('--el-color-primary-dark-2', darkColor)
  
  // 保存到本地存储
  localStorage.setItem('theme-color', color)
}

// 获取浅色
function getLightColor(color: string, level: number) {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  const { r, g, b } = rgb
  const mixR = Math.round(r + (255 - r) * level)
  const mixG = Math.round(g + (255 - g) * level)
  const mixB = Math.round(b + (255 - b) * level)
  
  return `rgb(${mixR}, ${mixG}, ${mixB})`
}

// 获取深色
function getDarkColor(color: string, level: number) {
  const rgb = hexToRgb(color)
  if (!rgb) return color
  
  const { r, g, b } = rgb
  const mixR = Math.round(r * (1 - level))
  const mixG = Math.round(g * (1 - level))
  const mixB = Math.round(b * (1 - level))
  
  return `rgb(${mixR}, ${mixG}, ${mixB})`
}

// HEX 转 RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

// 初始化时从本地存储恢复颜色
onMounted(() => {
  const savedColor = localStorage.getItem('theme-color')
  if (savedColor) {
    handleUpdate(savedColor)
  }
})
</script>

<style lang="scss" scoped>
.color-toggle-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 0;
}

.color-list {
  display: flex;
  align-items: center;
  width: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  gap: 0.25rem;
  
  .color-toggle-wrapper:hover & {
    width: 15rem;
    padding-right: 0.5rem;
  }
}

.color-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.15);
    background: var(--el-fill-color-lighter);
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.color-dot {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  
  .color-item:hover & {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(0, 0, 0, 0.1);
  }
}

.check-icon {
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.palette-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.4rem;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background: var(--el-fill-color-light);
    transform: scale(1.1);
    
    .palette-icon {
      animation: wiggle 0.5s ease-in-out;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.palette-icon {
  width: 1rem;
  height: 1rem;
  transition: all 0.3s ease-in-out;
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(0deg);
  }
  25% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(10deg);
  }
}

// 深色模式适配
.dark {
  .color-dot {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    
    .color-item:hover & {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
  }
}
</style>

