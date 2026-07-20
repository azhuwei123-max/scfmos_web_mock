<template>
  <div class="mb-[10px] flex items-center">
    <!-- <div v-if="showTitle" class="text-lg font-bold"> 查询结果</div> -->
    <div class="flex items-center justify-between flex-wrap">
      <template v-for="btn in visibleButtons" :key="btn.key">
        <!-- v-if="hasPermission(btn.permission)" -->
        <el-button v-bind="getButtonProps(btn)"  @click="btn.onClick(btn)">
          <Icon v-if="btn.icon" :icon="btn.icon" class="mr-5px" />
          {{ btn.label }}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { checkPermi } from '@/utils/permission'
import { ActionButton } from './types'
import type { ButtonProps } from 'element-plus'
import { isBoolean, isFunction } from '@/utils/is'

defineOptions({
  name: 'ActionBar'
})

const props = withDefaults(
  defineProps<{
    buttons: ActionButton[]
    showTitle?: boolean
  }>(),
  {
    showTitle: false
  }
)

const hasPermission = (perm?: string[]): boolean => {
  return !perm || checkPermi(perm)
}

const getButtonProps = (btn: ActionButton): Partial<ButtonProps> => {
  const { key, label, icon, permission, onClick, ...buttonProps } = btn
  return buttonProps
}

const visibleButtons = computed(() => {
  return props.buttons.filter((btn) => {
    if (btn.show === undefined) return true
    if (isBoolean(btn.show)) return btn.show
    if (isFunction(btn.show)) return btn.show(btn)
    return true
  })
})
</script>
