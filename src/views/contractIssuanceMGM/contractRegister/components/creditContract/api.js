import request from '@/config/axios'

// 列表接口
export const getCustomerInfoEntPage = (data) => {
  return request.post({ url: '/system/business-contract/getEDCreditBusContraPage', data })
}

// 登记合同
export const bookInContract = (data) => {
  return request.post({ url: '/system/business-approve/bookInContract', data })
}

// 取消合同
export const cancelContract = (data) => {
  return request.post({ url: '/system/business-contract/cancelContract', data })
}

// 同步视频系统
export const syncVideo = (data) => {
  return request.post({ url: '/system/business-contract/synVideo', data })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
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