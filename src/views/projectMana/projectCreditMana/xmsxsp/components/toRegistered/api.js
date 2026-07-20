import request from '@/config/axios'

// 列表接口
export const getCustomerInfoEntPage = (data) => {
  return request.post({ url: '/system/business-approve/getBusinessApprovePage', data })
}

// 登记合同
export const bookInContract = (data) => {
  return request.post({ url: '/system/business-approve/bookInContract', data })
}

// 登记合同
export const bookInContract2 = (params) => {
  return request.get({ url: '/system/business-contract/get', params })
}

// 业务取消
export const cancelContract = (data) => {
  return request.post({ url: '/system/business-contract/cancelContract', data })
}