import request from '@/config/axios'

// 菜单
export const getContractOpinion = (params) => {
  return request.get({ url: '/system/bpmComment/getContractOpinion', params })
}
