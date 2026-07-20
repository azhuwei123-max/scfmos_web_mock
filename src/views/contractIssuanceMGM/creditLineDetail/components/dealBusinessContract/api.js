import request from '@/config/axios'

// 列表接口
export const getCustomerInfoEntPage = (params) => {
  return request.get({ url: '/system/business-contract/dealBusinessContractList', params })
}

// 登记额度项下合同
export const dependentBusiness = (data) => {
  return request.post({ url: '/system/business-contract/dependentBusiness', data })
}

// 退回网银
export const returnOnlineBank = (data) => {
  return request.post({ url: '/system/business-contract/returnOnlineBank', data })
}

// 同步合同信息
export const syncContractInfo = (data) => {
  return request.post({ url: '/system/business-contract/syncContractInfo', data })
}
// 同步视频系统
export const syncVideo = (data) => {
  return request.post({ url: '/system/business-contract/synVideo', data })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 取消合同
export const cancelContract = (data) => {
  return request.post({ url: '/system/business-contract/cancelContract', data })
}
