import request from '@/config/axios'

// 菜单
export const getPutOutOpinion = (params) => {
  return request.get({ url: '/system/bpmComment/getPutOutOpinion', params })
}
