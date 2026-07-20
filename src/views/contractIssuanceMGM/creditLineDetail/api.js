import request from '@/config/axios'

// 菜单
export const creditLineMenu = (params) => {
  return request.get({ url: '/system/business-contract/getMenuList', params })
  // return request.get({ url: '/system/customerinfo/ent/creditLineMenu', params })
}
