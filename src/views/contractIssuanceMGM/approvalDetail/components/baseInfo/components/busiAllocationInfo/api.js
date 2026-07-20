import request from '@/config/axios'

// 获得授权信息
export const qryBusinessAllocationInfoPage = (params) => {
  return request.get({ url: '/system/customerinfo/qryBusinessAllocationInfoPage', params })
}