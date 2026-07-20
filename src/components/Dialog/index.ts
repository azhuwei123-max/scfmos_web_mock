import { ref } from 'vue'
import Dialog from './src/Dialog.vue'
import FuncDialog from './src/FuncDialog.vue'
import type {
  EventType,
  ArgsType,
  DialogProps,
  ButtonProps,
  DialogOptions,
  DialogResult
} from './src/type'

const dialogStore = ref<Array<DialogOptions>>([])

/** 生成唯一 ID */
const generateId = (): string => {
  return `dialog_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

/**
 * 打开弹框（Promise 版本）
 * @returns Promise<DialogResult> 返回用户操作结果
 * @example
 * const result = await addDialog({
 *   title: '确认删除',
 *   contentRenderer: () => <div>确定要删除吗？</div>
 * })
 * if (result.command === 'sure') {
 *   // 用户点击了确定
 * }
 */
const addDialog = (options: DialogOptions): Promise<DialogResult> => {
  return new Promise((resolve, reject) => {
    const dialogId = generateId()

    // 将 Promise 的 resolve/reject 存储到 options 中
    const dialogOptions: DialogOptions = {
      ...options,
      _id: dialogId,
      _resolve: resolve,
      _reject: reject,
      visible: true
    }

    const open = () => {
      dialogStore.value.push(dialogOptions)
    }

    if (options?.openDelay) {
      setTimeout(() => {
        open()
      }, options.openDelay)
    } else {
      open()
    }
  })
}

/** 根据 ID 查找对话框索引 */
const findDialogIndexById = (id: string): number => {
  return dialogStore.value.findIndex((dialog) => dialog._id === id)
}

/** 关闭弹框 */
const closeDialog = (options: DialogOptions, index: number, args?: any) => {
  const dialog = dialogStore.value[index]
  if (!dialog) return

  dialog.visible = false

  // 解析 Promise
  const result: DialogResult = {
    command: args?.command || 'close',
    data: args?.data
  }

  if (dialog._resolve) {
    dialog._resolve(result)
  }

  // 触发用户的 closeCallBack
  options.closeCallBack && options.closeCallBack({ options, index, args })

  setTimeout(() => {
    dialogStore.value.splice(index, 1)
  }, 200)
}

/**
 * 根据 ID 关闭对话框
 * @param dialogId 对话框唯一 ID
 * @param args 关闭参数
 */
const closeDialogById = (dialogId: string, args?: any) => {
  const index = findDialogIndexById(dialogId)
  if (index !== -1) {
    closeDialog(dialogStore.value[index], index, args)
  }
}

/**
 * @description 更改弹框自身属性值
 * @param value 属性值
 * @param key 属性，默认 `title`
 * @param index 弹框索引（默认 `0`，代表只有一个弹框，对于嵌套弹框要改哪个弹框的属性值就把该弹框索引赋给 `index`）
 */
const updateDialog = (value: any, key = 'title', index = 0) => {
  if (dialogStore.value[index]) {
    dialogStore.value[index][key] = value
  }
}

/**
 * 根据 ID 更新对话框属性
 * @param dialogId 对话框唯一 ID
 * @param key 属性名
 * @param value 属性值
 */
const updateDialogById = (dialogId: string, key: string, value: any) => {
  const index = findDialogIndexById(dialogId)
  if (index !== -1) {
    dialogStore.value[index][key] = value
  }
}

/** 关闭所有弹框 */
const closeAllDialog = () => {
  // 拒绝所有未关闭的 Promise
  dialogStore.value.forEach((dialog) => {
    if (dialog._reject) {
      dialog._reject(new Error('Dialog closed by closeAllDialog'))
    }
  })
  dialogStore.value = []
}

export type { EventType, ArgsType, DialogProps, ButtonProps, DialogOptions, DialogResult }
export {
  Dialog,
  FuncDialog,
  dialogStore,
  addDialog,
  closeDialog,
  closeDialogById,
  updateDialog,
  updateDialogById,
  closeAllDialog
}
