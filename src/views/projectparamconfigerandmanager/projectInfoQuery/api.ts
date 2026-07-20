import request from '@/config/axios'

/** 项目信息维护分页列表 */
export const projectInfoQryPage = (params) => {
  return request.get({ url: '/system/paramAdjust/projectInfoQryPage', params})
}


/** 项目信息维护分页列表 */
export const getMenuParamAdjust = (params) => {
  return request.get({ url: '/system/paramAdjust/getMenu', params})
}

/** 核心客户列表 */
export const getCustomerInfoEntPage = (params) => {
  return request.get({ url: '/system/customerinfo/getTeamWorkProjectCustomerListByProjectId', params })
}

/** 项目协审列表 */
export const getProjectCoreviewPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/getProjectCoreviewPageByProjectId', params})
}