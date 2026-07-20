import request from '@/config/axios'

// 菜单
export const approveLineMenu = (params) => {
  return request.get({ url: '/system/business-approve/approveLineMenu', params })
}

export const getCreditOpinion = (params) => {
  return request.get({ url: '/system/bpmComment/getCreditOpinion', params })
}