import request from '@/config/axios'

// 菜单
export const getDetailMenuList = (params) => {
  return request.get({ url: '/system/business-contract/getMenuList', params })
}
