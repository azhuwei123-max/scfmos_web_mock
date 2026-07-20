import request from '@/config/axios'

/** 项目信息维护分页列表 */
export const projectInfoMaintenancePage = (params) => {
  return request.get({ url: '/system/paramAdjust/projectInfoMaintenancePage', params})
}

/**  */
export const paramAdjustSetHis = (data) => {
  return request.post({ url: '/system/paramAdjust/set-his', data})
}