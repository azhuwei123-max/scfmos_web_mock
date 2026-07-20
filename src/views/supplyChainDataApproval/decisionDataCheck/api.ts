import request from '@/config/axios'

export const getMenuList = () => {
  return request.get({ url: '/system/ProjectWhiteList/getApproveMenu' })
}