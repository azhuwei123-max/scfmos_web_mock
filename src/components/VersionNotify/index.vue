<template>
  <el-dialog
    v-model="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    title="版本更新通知"
    width="400px"
    align-center
  >
    <div class="version-notify-content">
      <div class="version-notify-icon">
        <Icon icon="ep:refresh" :size="48" />
      </div>
      <div class="version-notify-text">
        <p class="version-notify-title">检测到新版本已发布</p>
        <p class="version-notify-desc">为了获得更好的使用体验，请刷新页面以加载最新版本</p>
      </div>
    </div>
    <template #footer>
      <el-button @click="handleLater">稍后提醒</el-button>
      <el-button type="primary" @click="handleRefresh">立即刷新</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

defineOptions({ name: 'VersionNotify' })

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'refresh': []
  'later': []
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const handleRefresh = () => {
  emit('refresh')
  window.location.reload()
}

const handleLater = () => {
  visible.value = false
  emit('later')
  // 5分钟后再次提醒
  setTimeout(() => {
    visible.value = true
  }, 5 * 60 * 1000)
}
</script>

<style lang="scss" scoped>
.version-notify-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  text-align: center;
}

.version-notify-icon {
  margin-bottom: 20px;
  color: var(--el-color-primary);
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.version-notify-text {
  .version-notify-title {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }

  .version-notify-desc {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-regular);
  }
}
</style>
