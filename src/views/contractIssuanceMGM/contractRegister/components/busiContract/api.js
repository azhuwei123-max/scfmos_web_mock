import request from '@/config/axios'

// 列表接口
export const getYWCreditBusContraPage = (data) => {
  return request.post({ url: '/system/business-contract/getYWCreditBusContraPage', data })
}

// 登记合同
export const bookInContract = (data) => {
  return request.post({ url: '/system/business-approve/bookInContract', data })
}

// 取消合同
export const cancelContract = (data) => {
  return request.post({ url: '/system/business-contract/cancelContract', data })
}

// 退回网银
export const returnOnlineBank = (data) => {
  return request.post({ url: '/system/business-contract/returnOnlineBank', data })
}

// 同步视频系统
export const syncVideo = (data) => {
  return request.post({ url: '/system/business-contract/synVideo', data })
}

// 集中作业任务-挑选确认
export const concentratedWorkOption = (params) => {
  return request.get({ url: '/system/business-contract/concentratedWorkOption', params })
}

// 集中作业任务-退回
export const concentratedWorkBack = (params) => {
  return request.get({ url: '/system/business-contract/concentratedWorkBack', params })
}

/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: '/system/modelManage/apply/checkComment', params })
}

/** 判断当前提交逻辑是否需要进行风险探测强控 */
export const checkSubmitIsRisk = (params) => {
  return request.get({ url: '/system/bpmComment/checkSubmitIsRisk', params })
}
/** 判断业务合同或者放款的业务品种与供应链产品方案的业务边界 */
export const checkBusTypeAndLoanProductCategory = (params) => {
  return request.get({ url: '/system/bpmComment/checkBusTypeAndLoanProductCategory', params })
}