import request from '@/config/axios'

// 获得授权信息
export const goToIndebtCredit = (params) => {
  return request.get({ url: '/system/credit-apply/goToIndebtCredit', params })
}