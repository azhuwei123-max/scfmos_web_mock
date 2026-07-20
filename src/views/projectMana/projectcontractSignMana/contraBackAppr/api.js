import request from '@/config/axios'

// 菜单
export const getApprovePutOutApplyMenu = (data) => {
  return request.post({ url: '/system/putout-info/getApprovePutOutApplyMenu', data })
}