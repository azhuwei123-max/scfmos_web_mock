import {
  TaskItem,
  WorkReminder,
  Notice,
  TipItem,
  QuickAction,
  DashboardTotal,
  TaskTab,
  NcbListData
} from './types'
import { getNoticePage } from '@/api/system/notice'
import request from '@/config/axios'
import djrz from '@/assets/imgs/home/djrz.png'
import jxssjd from '@/assets/imgs/home/jxssjd.png'

// Mock Data
export const tasksConfig = [
  {
    icon: 'ep:bell',
    color: '#409eff',
    iconColor: '#0093FF',
    tagType: 'default'
  },
  {
    icon: 'ep:tickets',
    color: '#409eff',
    iconColor: '#0093FF',
    tagType: 'danger'
  },
  {
    icon: 'ep:document-copy',
    color: '#409eff',
    iconColor: '#0093FF',
    tagType: 'info'
  },
  {
    icon: 'ep:monitor',
    color: '#409eff',
    iconColor: '#0093FF',
    tagType: 'warning'
  },
  {
    icon: 'ep:lock',
    color: '#409eff',
    iconColor: '#0093FF',
    tagType: 'danger'
  },
  {
    icon: 'ep:trend-charts',
    color: '#409eff',
    iconColor: '#0093FF',
    tagType: 'info'
  }
]

const quickActions: QuickAction[] = [
  { name: '经销商数据贷', icon: jxssjd, bg: '#FFC107' },
  { name: '多级融资', icon: djrz, bg: '#2196F3' },
]

export const getDashboardTotal = async (): Promise<DashboardTotal> => {
  return request.get({ url:'/system/index/allCount'})
}

export const getPendingTasks = async (params): Promise<NcbListData<TaskItem>> => {
  return request.get({ url:'/system/index/getWaitDealQueryListByAttribute', params})
}

export const getWorkReminders = async (): Promise<WorkReminder[]> => {
  return request.get({ url:'/system/index/getWorkMessage'})
}

export const getNotifications = async (): Promise<NcbListData<Notice>> => {
  return getNoticePage({ pageNo: 1, pageSize: 9999, status: 0, type: 2 })
}

export const getTips = async (): Promise<TipItem[]> => {
  return request.get({ url:'/system/index/getNoticeMessage'})
}

export const getQuickActions = async (): Promise<QuickAction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(quickActions)
    }, 400)
  })
}

export const getTabs = async (): Promise<TaskTab[]> => {
  return request.get({ url:'/system/index/getWaitDealQueryListGroup'})
}

/**
 * 赋予用户快捷菜单
 */
export const putAssignUserMen = async (menuIdList: string) => {
  return request.put({ url:'/system/permission/assign-user-menu', data: {menuIdList}, headersType: 'application/x-www-form-urlencoded'})
}

/**
 * 删除用户快捷菜单
 */
export const delAssignUserMen = async (menuId: number) => {
  return request.get({ url:'/system/permission/unassign-user-menu', params: {menuId}, headersType: 'application/x-www-form-urlencoded'})
}

/**
 * 债项待办记录查询
 */
export const getIndebtNum = async () => {
  return request.get({ url:'/system/index/getIndebtNum'})
}

/**
 * 债项待办url获取
 */
export const getIndebtUrl = async () => {
  return request.get({ url:'/system/index/getPass'})
}

/**
 * 信贷待办url获取
 */
export const getCodeLibraryIframeUrl = async () => {
  return request.get({url: '/system/codeLibrary/getIframeUrl?tpopentype=Main'})
}

/**
 * 根据流程名称获取url
 */
export const getUrlBySimpleName = async (params) => {
  return request.get({ url:'/system/index/getUrlBySimpleName',params})
}

/**
 * 获取待办任务item count
 */
export const getWaitDealQueryListGroupWithCount = async (params): Promise<TaskTab> => {
  return request.get({ url:'/system/index/getWaitDealQueryListGroupWithCount', params})
}
