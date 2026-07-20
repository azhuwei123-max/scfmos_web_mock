import request from '@/config/axios'

// 菜单
export const aprrovalTreeList = (params) => {
  return request.get({ url: '/system/modelManage/apply/aprrovalTreeList', params })
}