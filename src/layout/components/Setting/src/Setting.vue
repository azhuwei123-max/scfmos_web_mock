<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
// @ts-ignore
import ColorRadioPicker from './components/ColorRadioPicker.vue'
// @ts-ignore
import LayoutRadioPicker from './components/LayoutRadioPicker.vue'
// @ts-ignore
import InterfaceDisplay from './components/InterfaceDisplay.vue'

defineOptions({ name: 'Setting' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('setting')

const appStore = useAppStore()

const drawer = ref(false)

const activeTab = ref('appearance')

const colorList = [
  '#409eff',
  '#ff5722',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#9c27b0',
  '#00bcd4',
  '#909399'
]

const themeColor = computed({
  get: () => appStore.getTheme.elColorPrimary,
  set: (val: string) => {
    appStore.applyPrimaryColor(val)
  }
})

const handleThemeChange = (color: string) => {
  themeColor.value = color
}

// 打开设置
const openSetting = () => {
  drawer.value = true
}

// 重置设置
const handleReset = () => {
  // 可以添加重置逻辑
  ElMessage.success('设置已重置')
}

defineExpose({
  openSetting
})
</script>

<template>
  <ElDrawer v-model="drawer" :class="prefixCls" :size="320" direction="rtl" title="系统设置">
    <template #header>
      <div class="flex items-center justify-between w-full pr-4">
        <span class="text-16px font-600">系统设置</span>
        <ElButton :icon="'RefreshLeft'" circle size="small" @click="handleReset" />
      </div>
    </template>

    <ElScrollbar class="h-[calc(100vh-120px)]">
      <ElTabs v-model="activeTab" class="setting-tabs">
        <!-- 外观设置 -->
        <ElTabPane label="外观" name="appearance">
          <div class="setting-section">
            <div class="setting-title">主题颜色</div>
            <ColorRadioPicker
              v-model="themeColor"
              :schema="colorList"
              @change="handleThemeChange"
            />
            <div class="custom-color">
              <span class="custom-color__label">自定义颜色</span>
              <ElColorPicker
                v-model="themeColor"
                :predefine="colorList"
                class="custom-color__picker"
                @change="handleThemeChange"
              />
            </div>
          </div>

          <ElDivider />

          <div class="setting-section">
            <div class="setting-title">主题模式</div>
            <div class="flex gap-2 mt-2">
              <ElButton
                :type="!appStore.getIsDark ? 'primary' : ''"
                @click="appStore.setIsDark(false)"
              >
                <Icon class="mr-1" icon="emojione-monotone:sun" />
                浅色
              </ElButton>
              <ElButton
                :type="appStore.getIsDark ? 'primary' : ''"
                @click="appStore.setIsDark(true)"
              >
                <Icon class="mr-1" icon="emojione-monotone:crescent-moon" />
                深色
              </ElButton>
            </div>
          </div>

          <ElDivider />

          <div class="setting-section">
            <div class="setting-title">灰色模式</div>
            <div class="setting-item">
              <span>灰色模式</span>
              <ElSwitch v-model="appStore.greyMode" />
            </div>
            <div class="setting-desc">用于特殊悼念日</div>
          </div>
        </ElTabPane>

        <!-- 布局设置 -->
        <ElTabPane label="布局" name="layout">
          <div class="setting-section">
            <div class="setting-title">导航模式</div>
            <LayoutRadioPicker />
          </div>

          <ElDivider />

          <div class="setting-section">
            <div class="setting-title">界面显示</div>
            <InterfaceDisplay />
          </div>

          <ElDivider />

          <div class="setting-section">
            <div class="setting-title">菜单设置</div>
            <div class="setting-item">
              <span>固定 Header</span>
              <ElSwitch v-model="appStore.fixedHeader" />
            </div>
            <div class="setting-item">
              <span>固定菜单</span>
              <ElSwitch v-model="appStore.fixedMenu" />
            </div>
            <div class="setting-item">
              <span>唯一打开</span>
              <ElSwitch v-model="appStore.uniqueOpened" />
            </div>
            <div class="setting-desc">只保持一个子菜单的展开</div>
          </div>
        </ElTabPane>

        <!-- 功能设置 -->
        <ElTabPane label="功能" name="features">
          <div class="setting-section">
            <div class="setting-title">页面功能</div>
            <div class="setting-item">
              <span>标签页</span>
              <ElSwitch v-model="appStore.tagsView" />
            </div>
            <div class="setting-item">
              <span>标签页图标</span>
              <ElSwitch v-model="appStore.tagsViewIcon" />
            </div>
            <div class="setting-item">
              <span>面包屑</span>
              <ElSwitch v-model="appStore.breadcrumb" />
            </div>
            <div class="setting-item">
              <span>面包屑图标</span>
              <ElSwitch v-model="appStore.breadcrumbIcon" />
            </div>
            <div class="setting-item">
              <span>页脚</span>
              <ElSwitch v-model="appStore.footer" />
            </div>
          </div>

          <ElDivider />

          <div class="setting-section">
            <div class="setting-title">工具栏功能</div>
            <div class="setting-item">
              <span>折叠菜单按钮</span>
              <ElSwitch v-model="appStore.hamburger" />
            </div>
            <div class="setting-item">
              <span>全屏按钮</span>
              <ElSwitch v-model="appStore.screenfull" />
            </div>
            <div class="setting-item">
              <span>尺寸选择</span>
              <ElSwitch v-model="appStore.size" />
            </div>
            <div class="setting-item">
              <span>多语言选择</span>
              <ElSwitch v-model="appStore.locale" />
            </div>
            <div class="setting-item">
              <span>消息提示</span>
              <ElSwitch v-model="appStore.message" />
            </div>
          </div>
        </ElTabPane>
      </ElTabs>
    </ElScrollbar>

    <template #footer>
      <div class="flex gap-2">
        <ElButton class="flex-1" @click="drawer = false">关闭</ElButton>
        <ElButton class="flex-1" tpye="" @click="handleReset">重置</ElButton>
      </div>
    </template>
  </ElDrawer>
</template>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-setting;

.#{$prefix-cls} {
  :deep(.el-drawer__header) {
    margin-bottom: 16px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-drawer__body) {
    padding: 0 20px;
  }

  :deep(.el-drawer__footer) {
    padding: 16px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.setting-tabs {
  :deep(.el-tabs__header) {
    margin: 0 0 20px 0;
  }

  :deep(.el-tabs__nav-wrap::after) {
    display: none;
  }
}

.setting-section {
  margin-bottom: 20px;
}

.custom-color {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;

  &__label {
    font-size: 13px;
    color: var(--el-text-color-secondary);
  }

  &__picker {
    :deep(.el-color-picker__trigger) {
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }
  }
}

.setting-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 14px;
  color: var(--el-text-color-regular);

  &:not(:last-child) {
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
}

.setting-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 8px;
  line-height: 1.5;
}
</style>
