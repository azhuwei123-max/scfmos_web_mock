import request from '@/config/axios'

// 菜单
export const getBusiConByCreditCon = (params) => {
  return request.get({ url: '/system/bpmComment/getBusiConByCreditCon', params })
}