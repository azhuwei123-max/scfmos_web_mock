/**
 * 上传文件校验工具
 * - 支持后端下发允许的扩展名 / accept 配置
 * - 支持 Element Plus ElUpload 的 before-upload 校验
 */

import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'


export type FileValidateOptions = {
  /**
   * 允许的扩展名（不带点），如：['xls', 'xlsx']
   * - 也支持带点：['.xls', '.xlsx']（会自动规范化）
   */
  allowedExts?: string[]
  /**
   * accept（后端下发）
   * - 字符串：".xls,.xlsx" 或 "application/pdf,.png"
   * - 数组：["xls","png"] / [".xls",".png"]（推荐后端下发这种结构，更清晰）
   */
  accept?: string | string[]
  /**
   * 最大文件大小（字节）
   */
  maxSize?: number
  /**
   * 自定义错误提示回调（比如 message.error）
   */
  onError?: (msg: string) => void
  /**
   * 提示文案里展示的“允许格式”名称
   * 默认从 allowedExts/accept 推导
   */
  label?: string
}

const normalizeExt = (ext: string) => ext.trim().toLowerCase().replace(/^\./, '')

export const parseExtsFromAccept = (accept?: string | string[]): string[] => {
  if (!accept) return []
  // accept 支持：
  // 1) string: ".xls,.xlsx" / ".xls, .xlsx" / "application/pdf,.png" / "image/*" 等
  // 2) string[]: ["xls","png"] / [".xls",".png"]
  // 我们只提取扩展名（mime 类型不可靠：浏览器/系统差异）
  if (Array.isArray(accept)) {
    return accept.map(normalizeExt).filter(Boolean)
  }
  return accept
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('.'))
    .map((s) => normalizeExt(s))
    .filter(Boolean)
}

export const buildAcceptByExts = (exts: string[]): string => {
  const normalized = Array.from(new Set(exts.map(normalizeExt).filter(Boolean)))
  return normalized.map((e) => `.${e}`).join(', ')
}

export const getFileExt = (fileName: string): string => {
  const idx = fileName.lastIndexOf('.')
  if (idx === -1) return ''
  return normalizeExt(fileName.slice(idx + 1))
}

export const validateUploadFile = (file: File, options: FileValidateOptions): boolean => {
  const allowedExts = Array.from(
    new Set([...(options.allowedExts ?? []).map(normalizeExt), ...parseExtsFromAccept(options.accept)])
  ).filter(Boolean)

  // size
  if (typeof options.maxSize === 'number' && options.maxSize > 0) {
    if (file.size / 1024 / 1024 > options.maxSize) {
      const msg = `文件过大，最大允许 ${options.maxSize}MB`
      options.onError?.(msg)
      return false
    }
  }

  // ext
  if (allowedExts.length > 0) {
    const ext = getFileExt(file.name)
    if (!ext || !allowedExts.includes(ext)) {
      const label = options.label || allowedExts.join('、')
      options.onError?.(`仅允许上传 ${label} 格式文件！`)
      return false
    }
  }

  return true
}

export const formatAcceptString = (str) => {
  if(!str) return ""
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s)=> {
      const normalized = normalizeExt(s)
      return normalized ? `.${normalized}` :''
    })
    .filter(Boolean)
    .join(', ')
}