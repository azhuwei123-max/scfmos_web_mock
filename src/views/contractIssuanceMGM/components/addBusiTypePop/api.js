import request from '@/config/axios'

// 列表接口
export const getOccurTypeCode = (params) => {
  return request.get({ url: '/system/codeLibrary/getOccurTypeCode', params })
}

// 客户编号
export const getCustomersByType = (params) => {
  return request.get({ url: '/system/customerinfo/getCustomersByType', params })
}

// 业务品种
export const getBusinessType = (params) => {
  return request.get({ url: '/system/business-type/getBusinessType', params })
}

// 综合
export const getCpmpreCreditLineNo = (params) => {
  return request.get({ url: '/system/business-contract/getCpmpreCreditLineNo', params })
}

// 登记额度保存
export const dependentBusiness = (data) => {
  return request.post({ url: '/system/business-contract/dependentBusiness', data })
}

// 登记合同
export const bookInContract2 = (params) => {
  return request.get({ url: '/system/business-contract/get', params })
}