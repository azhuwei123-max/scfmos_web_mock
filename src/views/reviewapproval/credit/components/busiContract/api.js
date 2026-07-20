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