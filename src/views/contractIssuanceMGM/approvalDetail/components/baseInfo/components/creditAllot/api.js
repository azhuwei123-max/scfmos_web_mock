import request from '@/config/axios'

// 获得授权信息
export const qryQuotaAllocationInfoPage = (params) => {
  return request.get({ url: '/system/customerinfo/qryQuotaAllocationInfoPage', params })
}