import request from '@/config/axios'

// 获得字典
export const custRelaTeamworkProjectList = (params) => {
  return request.get({ url: '/system/customerinfo/ent/custRelaTeamworkProjectList', params })
}

// 获得字典
export const custRelaTeamworkProjectItem = (params) => {
  return request.get({ url: '/system/customerinfo/ent/custRelaTeamworkProjectItem', params })
}