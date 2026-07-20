import request from '@/config/axios'

// 菜单
export const getWhiteProjectOp = (params) => {
  return request.get({ url: '/system/bpmComment/getWhiteProjectOp', params })
}
