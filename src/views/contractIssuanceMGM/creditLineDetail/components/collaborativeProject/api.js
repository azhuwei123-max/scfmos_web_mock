import request from '@/config/axios'

// 数据获取
export const getRelativeTeamWorkList = (params) => {
  return request.get({ url: '/system/business-contract/getBusinessContractRelativeTeamWorkList', params })
}

// 获得字典
export const getRelativeTeamWorkInfo = (params) => {
  return request.get({ url: '/system/business-contract/getBusinessContractTeamWorkInfo', params })
}