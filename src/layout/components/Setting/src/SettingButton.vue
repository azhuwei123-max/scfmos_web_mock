<script lang="ts" setup>
import { ref } from 'vue'
// @ts-ignore
import Setting from './Setting.vue'

defineOptions({ name: 'SettingButton' })

const settingRef = ref()

const openSetting = () => {
  settingRef.value?.openSetting()
}

defineProps({
  color: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="setting-button" @click="openSetting">
    <Icon :color="color" :size="18" class="setting-icon" icon="ep:setting" />
    <Setting ref="settingRef" />
  </div>
</template>

<style lang="scss" scoped>
.setting-button {
  // display: inline-block;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    .setting-icon {
      animation: rotate 0.6s ease-in-out;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(90deg);
  }
}
</style>
