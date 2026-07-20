import request from '@/config/axios'

// 菜单
export const getCustomerView = (params) => {
  return request.get({ url: '/system/business/approveMenu/Menu', params })
}

export const getChannel = () => {
  return request.get({ url: '/system/big-supply/application/channel' })
}