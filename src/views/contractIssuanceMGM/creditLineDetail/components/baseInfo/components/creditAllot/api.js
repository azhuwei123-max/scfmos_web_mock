import request from '@/config/axios'

// 获得授权信息
export const qryQuotaAllocationInfoPage = (params) => {
  return request.get({ url: '/system/customerinfo/qryQuotaAllocationInfoPage', params })
}

// 获得授权信息详情
export const qryQuotaAllocationInfoItem = (params) => {
  return request.get({ url: '/system/customerinfo/qryQuotaAllocationInfoItem', params })
}


// 额度分配信息字段
export const saveBusinessAllot = (data) => {
  return request.post({ url: '/system/business-contract/saveBusinessAllotDetail', data })
}

// 额度分配信息字段
export const saveCreditAllot = (data) => {
  return request.post({ url: '/system/business-contract/saveCreditAllotDetail', data })
}
