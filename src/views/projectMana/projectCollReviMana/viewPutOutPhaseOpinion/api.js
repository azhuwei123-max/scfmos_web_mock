import request from '@/config/axios'

// 菜单
export const getCoreviewApplyOpinion = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/getCoreviewApplyOpinion', params })
}
