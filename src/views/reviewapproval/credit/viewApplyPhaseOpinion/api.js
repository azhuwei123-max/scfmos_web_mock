import request from '@/config/axios'

// 菜单
export const getCreditOpinion = (params) => {
  return request.get({ url: '/system/bpmComment/getCreditOpinion', params })
}
