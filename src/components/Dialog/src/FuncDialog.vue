<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { EventType, ButtonProps, DialogOptions } from './type'
import { closeDialog, dialogStore } from '../index'

defineOptions({
  name: 'FuncDialog'
})

// 使用 Map 存储全屏状态，key 为 dialog._id
const fullscreenStates = ref<Map<string, boolean>>(new Map())

const getFullscreen = (dialogId: string | undefined, options: DialogOptions) => {
  if (options?.fullscreen) return true
  if (!dialogId) return false
  return fullscreenStates.value.get(dialogId) ?? false
}

const toggleFullscreen = (dialogId: string | undefined, options: DialogOptions) => {
  if (!dialogId) return
  const current = fullscreenStates.value.get(dialogId) ?? false
  fullscreenStates.value.set(dialogId, !current)
  eventsCallBack(
    'fullscreenCallBack',
    options,
    dialogStore.value.findIndex((d) => d._id === dialogId),
    true
  )
}

const defaultButtonsCache = ref<Map<string, Array<ButtonProps>>>(new Map())

const getDefaultButtons = (options: DialogOptions): Array<ButtonProps> => {
  const dialogId = options._id || ''
  if (defaultButtonsCache.value.has(dialogId)) {
    return defaultButtonsCache.value.get(dialogId)!
  }

  const buttons = reactive<Array<ButtonProps>>([
    {
      label: '确定',
      type: 'primary',
      popconfirm: options?.popconfirm,
      btnClick: ({ button, dialog: { options, index } }) => {
        const done = () => closeDialog(options!, index!, { command: 'sure' })
        if (options?.beforeSure && typeof options.beforeSure === 'function') {
          options.beforeSure(done, { options, button, index: index! })
        } else {
          done()
        }
      }
    },
    {
      label: '取消',
      btnClick: ({ button, dialog: { options, index } }) => {
        const done = () => closeDialog(options!, index!, { command: 'cancel' })
        if (options?.beforeCancel && typeof options.beforeCancel === 'function') {
          options.beforeCancel(done, { options, button, index: index! })
        } else {
          done()
        }
      }
    }
  ])

  defaultButtonsCache.value.set(dialogId, buttons)
  return buttons
}

const footerButtons = computed(() => {
  return (options: DialogOptions) => {
    return options?.footerButtons?.length
      ? options.footerButtons
      : getDefaultButtons(options)
  }
})

function eventsCallBack(
  event: EventType,
  options: DialogOptions,
  index: number,
  isClickFullScreen = false
) {
  if (!isClickFullScreen && options._id) {
    fullscreenStates.value.set(options._id, options?.fullscreen ?? false)
  }
  const handler = options?.[event]
  if (handler && typeof handler === 'function') {
    return handler({ options, index })
  }
}

function handleClose(options: DialogOptions, index: number, args = { command: 'close' }) {
  closeDialog(options, index, args)
  eventsCallBack('close', options, index)

  // 清理全屏状态
  if (options._id) {
    setTimeout(() => {
      fullscreenStates.value.delete(options._id!)
    }, 300)
  }
}
</script>

<template>
  <ElDialog
    v-for="(options, index) in dialogStore"
    :key="options._id || index"
    v-bind="options"
    v-model="options.visible"
    class="func-dialog"
    :fullscreen="getFullscreen(options._id, options)"
    :show-close="options?.showClose ?? true"
    draggable
    :close-on-click-modal="false"
    @closed="handleClose(options, index)"
    @opened="eventsCallBack('open', options, index)"
    @open-auto-focus="eventsCallBack('openAutoFocus', options, index)"
    @close-auto-focus="eventsCallBack('closeAutoFocus', options, index)"
  >
    <!-- header -->
    <template
      v-if="options?.fullscreenIcon || options?.headerRenderer"
      #header="{ close, titleId, titleClass }"
    >
      <div v-if="options?.fullscreenIcon" class="flex items-center justify-between">
        <span :id="titleId" :class="titleClass">{{ options?.title }}</span>
        <div class="flex items-center">
          <Icon
            v-if="!options?.fullscreen"
            class="mr-2 cursor-pointer"
            :icon="
              getFullscreen(options._id, options)
                ? 'radix-icons:exit-full-screen'
                : 'radix-icons:enter-full-screen'
            "
            color="var(--el-color-info)"
            hover-color="var(--el-color-primary)"
            @click="toggleFullscreen(options._id, options)"
          />
        </div>
      </div>
      <component v-else :is="options?.headerRenderer?.({ close, titleId, titleClass })" />
    </template>

    <!-- content -->
    <component
      v-if="options?.contentRenderer"
      v-bind="options?.props"
      :is="options.contentRenderer({ options, index })"
      :onClose="(args: any) => handleClose(options, index, args)"
    />

    <!-- footer -->
    <template v-if="!options?.hideFooter" #footer>
      <template v-if="options?.footerRenderer">
        <component :is="options?.footerRenderer({ options, index })" />
      </template>
      <span v-else>
        <template v-for="(btn, key) in footerButtons(options)" :key="key">
          <ElPopconfirm
            v-if="btn.popconfirm"
            v-bind="btn.popconfirm"
            @confirm="
              btn.btnClick?.({
                dialog: { options, index },
                button: { btn, index: key }
              })
            "
          >
            <template #reference>
              <ElButton v-bind="btn" :loading="btn?.loading">{{ btn?.label }}</ElButton>
            </template>
          </ElPopconfirm>
          <ElButton
            v-else
            v-bind="btn"
            :loading="btn?.loading"
            @click="
              btn.btnClick?.({
                dialog: { options, index },
                button: { btn, index: key }
              })
            "
          >
            {{ btn?.label }}
          </ElButton>
        </template>
      </span>
    </template>
  </ElDialog>
</template>

<style lang="scss">
.func-dialog {
  .#{$elNamespace}-dialog {
    &__header {
      border-bottom: 1px solid var(--el-border-color);
    }

    &__body {
      padding: 15px !important;
    }

    &__footer {
      border-top: 1px solid var(--el-border-color);
    }
  }
}
</style>
