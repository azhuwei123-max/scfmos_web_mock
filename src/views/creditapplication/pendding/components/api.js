import request from '@/config/axios'

// 白名单列表
export const getWhiteApplyList = (params) => {
  return request.get({ url: '/system/credit-apply/getWhiteApplyList', params })
}

// 客户变更取数
export const changeCustomerInfo = (params) => {
  return request.get({ url: '/system/customerinfo/ent/changeCustomerInfo', params })
}

// 关联白名单保存
export const addWhiteApply = (data) => {
  return request.post({ url: '/system/credit-apply/addWhiteApply', data })
}

// 获取分类数据
export const getApproveClassifyInfo = (data) => {
  return request.post({ url: '/system/credit-apply/getApproveClassifyInfo', data })
}
// 获取分类模板
export const getApproveClassifyDetail = (data) => {
  return request.post({ url: '/system/credit-apply/getApproveClassifyDetail', data })
}
// 获取分类提交
export const submitApproveClassifyInfo  = (data) => {
  return request.post({ url: '/system/credit-apply/submitApproveClassifyInfo', data })
}