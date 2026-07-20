import request from '@/config/axios'

// 获得授权信息
export const qryBusinessAllocationInfoPage = (params) => {
  return request.get({ url: '/system/customerinfo/qryBusinessAllocationInfoPage', params })
}

// 获得授权信息详情
export const qryBusinessAllocationInfoItem = (params) => {
  return request.get({ url: '/system/customerinfo/qryBusinessAllocationInfoItem', params })
}

// 额度分配信息字段
export const saveBusinessAllot = (data) => {
  return request.post({ url: '/system/business-contract/saveBusinessAllotDetail', data })
}

// 额度分配信息字段
export const saveCreditAllot = (data) => {
  return request.post({ url: '/system/business-contract/saveCreditAllotDetail', data })
}
