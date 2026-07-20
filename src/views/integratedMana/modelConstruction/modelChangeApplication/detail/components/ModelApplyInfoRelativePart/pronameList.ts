import request from '@/config/axios'

/** 获取客户列表2 */
export const selectParticipantCustomerInfoPageVo = (data) => {
  return request.post({ url: '/system/paramAdjust/selectParticipantCustomerInfoPageVo', data})
}


/** 获取客户列表 */
export const selectCustomerInfoPage = (params) => {
  return request.get({ url: '/system/modelManage/apply/qryProjectCallScopeListPage', params})
}