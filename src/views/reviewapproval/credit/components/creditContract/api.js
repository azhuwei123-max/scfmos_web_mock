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