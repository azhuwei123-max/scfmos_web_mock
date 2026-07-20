import request from '@/config/axios'

// 获得字典
export const getRelativeTeamWorkList = (params) => {
  return request.get({ url: '/system/credit-apply/getRelativeTeamWorkList', params })
}

// 获得字典
export const custRelaTeamworkProjectItem = (params) => {
  return request.get({ url: '/system/customerinfo/ent/custRelaTeamworkProjectItem', params })
}