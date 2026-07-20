/**
 * 字段值格式化工具函数
 * 根据 formatterType 自动应用对应的格式化逻辑
 */

import dayjs from 'dayjs'
import { floatToFixed2 } from '@/utils'

// 格式化金额【分转元】
// @ts-ignore
export const fenToYuanFormat = (_, __, cellValue: any, ___) => {
  return `${floatToFixed2(cellValue)}`
}

/**
 * 格式化类型枚举
 */
export enum FormatterType {
  /** 货币格式（¥1,000.00） */
  CURRENCY = 'currency',
  /** 百分比格式（10%） */
  PERCENTAGE = 'percentage',
  /** 千分位数字格式（1,000） */
  NUMBER = 'number',
  /** 日期格式（YYYY-MM-DD） */
  DATE = 'date',
  /** 日期时间格式（YYYY-MM-DD HH:mm:ss） */
  DATETIME = 'datetime',
  /** 文件大小格式 */
  FILESIZE = 'filesize',
  /** 手机号格式（138****8888） */
  PHONE = 'phone',
  /** 身份证格式（110101********1234） */
  IDCARD = 'idcard',
  /** 银行卡号格式（**** **** **** 1234） */
  BANKCARD = 'bankcard'
}

/**
 * 格式化配置接口
 */
export interface FormatterConfig {
  /** 货币符号，默认 ¥ */
  currencySymbol?: string
  /** 小数位数，默认 2 */
  decimals?: number
  /** 日期格式，默认 YYYY-MM-DD */
  dateFormat?: string
  /** 日期时间格式，默认 YYYY-MM-DD HH:mm:ss */
  datetimeFormat?: string
}

/**
 * 格式化函数映射表
 */
const formatterMap: Record<string, (value: any, config?: FormatterConfig) => string> = {
  // 货币格式
  [FormatterType.CURRENCY]: (value: any, config?: FormatterConfig) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) {
      return '-'
    }
    const symbol = config?.currencySymbol || ''
    const decimals = config?.decimals ?? 2
    return `${symbol}${num.toLocaleString('zh-CN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`
  },

  // 百分比格式
  [FormatterType.PERCENTAGE]: (value: any, config?: FormatterConfig) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) {
      return '-'
    }
    const decimals = config?.decimals ?? 2
    return `${num.toFixed(decimals)}%`
  },

  // 千分位数字格式
  [FormatterType.NUMBER]: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) {
      return '-'
    }
    return num.toLocaleString('zh-CN')
  },

  // 日期格式
  [FormatterType.DATE]: (value: any, config?: FormatterConfig) => {
    if (!value) {
      return '-'
    }
    const format = config?.dateFormat || 'YYYY-MM-DD'
    try {
      return dayjs(value).format(format)
    } catch (error) {
      console.error('日期格式化失败:', error)
      return String(value)
    }
  },

  // 日期时间格式
  [FormatterType.DATETIME]: (value: any, config?: FormatterConfig) => {
    if (!value) {
      return '-'
    }
    const format = config?.datetimeFormat || 'YYYY-MM-DD HH:mm:ss'
    try {
      return dayjs(value).format(format)
    } catch (error) {
      console.error('日期时间格式化失败:', error)
      return String(value)
    }
  },

  // 文件大小格式
  [FormatterType.FILESIZE]: (value: any) => {
    if (value === null || value === undefined || value === '') {
      return '-'
    }
    const size = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(size) || size < 0) {
      return '-'
    }
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let index = 0
    let fileSize = size
    while (fileSize >= 1024 && index < units.length - 1) {
      fileSize /= 1024
      index++
    }
    return `${fileSize.toFixed(2)} ${units[index]}`
  },

  // 手机号格式（脱敏）
  [FormatterType.PHONE]: (value: any) => {
    if (!value) {
      return '-'
    }
    const phone = String(value)
    if (phone.length === 11) {
      return `${phone.substring(0, 3)}****${phone.substring(7)}`
    }
    return phone
  },

  // 身份证格式（脱敏）
  [FormatterType.IDCARD]: (value: any) => {
    if (!value) {
      return '-'
    }
    const idcard = String(value)
    if (idcard.length === 18) {
      return `${idcard.substring(0, 6)}********${idcard.substring(14)}`
    }
    return idcard
  },

  // 银行卡号格式（脱敏）
  [FormatterType.BANKCARD]: (value: any) => {
    if (!value) {
      return '-'
    }
    const card = String(value).replace(/\s/g, '')
    if (card.length >= 4) {
      const last4 = card.substring(card.length - 4)
      const masked = '*'.repeat(Math.max(0, card.length - 4))
      // 每4位添加一个空格
      const formatted = (masked + last4).replace(/(.{4})/g, '$1 ').trim()
      return formatted
    }
    return card
  }
}

/**
 * 根据 formatterType 格式化值
 * @param value 原始值
 * @param formatterType 格式化类型
 * @param config 格式化配置
 * @returns 格式化后的字符串
 */
export const formatValue = (value: any, formatterType?: string, config?: FormatterConfig): string => {
  if (!formatterType) {
    return value === null || value === undefined || value === '' ? '-' : String(value)
  }

  const formatter = formatterMap[formatterType]
  if (!formatter) {
    console.warn(`未知的格式化类型: ${formatterType}`)
    return value === null || value === undefined || value === '' ? '-' : String(value)
  }

  try {
    return formatter(value, config)
  } catch (error) {
    console.error(`格式化失败 [${formatterType}]:`, error)
    return value === null || value === undefined || value === '' ? '-' : String(value)
  }
}

/**
 * 导出格式化类型枚举，方便使用
 */
export { FormatterType as default }
