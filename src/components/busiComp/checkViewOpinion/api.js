import request from '@/config/axios'

// 菜单
export const getCreditStageFlow = (params) => {
  return request.get({ url: '/system/codeLibrary/getCreditStageFlow', params })
}
