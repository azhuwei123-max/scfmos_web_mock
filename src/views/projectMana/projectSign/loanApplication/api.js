import request from '@/config/axios'

// 菜单
export const getMenuList = (params) => {
  return request.get({ url: '/system/putout-info/getMenuList', params })
}