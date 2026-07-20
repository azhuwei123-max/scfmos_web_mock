export type WorkplaceTotal = {
  project: number
  access: number
  todo: number
}

export type Project = {
  name: string
  icon: string
  message: string
  personal: string
  time: Date | number | string
  color: string
}

export type Notice = {
  id?: string
  title: string
  type: string
  keys: string[]
  date: Date | number | string
  createTime: Date | number | string
}

export type Shortcut = {
  name: string
  icon: string
  url: string
  color: string
}

export type RadarData = {
  personal: number
  team: number
  max: number
  name: string
}
export type AnalysisTotalTypes = {
  users: number
  messages: number
  moneys: number
  shoppings: number
}

export type UserAccessSource = {
  value: number
  name: string
}

export type WeeklyUserActivity = {
  value: number
  name: string
}

export type MonthlySales = {
  name: string
  estimate: number
  actual: number
}

export interface NcbListData<T> {
  list: T[]
  total: number
} 

// New Interfaces for Dashboard
export interface TaskItem {
  name?: string
  count?: number
  icon?: string
  color?: string
  loading?: boolean
  iconColor?: string
  tagType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  attribute6: string
  backlogGroupName: string
  backlogGroupNum?: string
  itemNo: string
  itemName: string
  itemAttribute: string
  attribute2: string
  attribute3: string
  expand?: boolean
  itemList?: Recordable[]
  show?: boolean
}

export interface WorkReminder {
  businessRemindGroup: string
  businessRemindGroupNum: number
  attribute5?: string
  highlight?: boolean
}

export interface TipItem {
  title: string
  businessRemindGroup: string
  itemno?: string
}

export interface QuickAction {
  name: string
  icon: string
  bg: string
}

export interface SystemEntry {
  name: string
  icon: string
  count: number
  url: string
  tagType: 'primary' | 'warning'
}

export type DashboardTotal = number

export type TaskTab = {
  attribute6: string
  backlogGroupName: string
  backlogGroupNum: string
  itemNo?: string
  itemName?: string
  count?: number
  itemAttribute?: string
  loading?: boolean
}

export interface ShortcutEntry {
  name: string
  icon: string
  url?: string
}
