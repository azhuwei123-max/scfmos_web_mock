import request from '@/config/axios'

// 列表接口
export const getPage = (params) => {
  return request.get({ url: '/system/big-supply/electron/page', params })
}

// 查询该客户未关联授信的待进件的大供申请信息
export const applyPage = (params) => {
  return request.get({ url: '/system/big-supply/electron/apply-page', params })
}

// 操作
export const opr = (data) => {
  return request.post({ url: '/system/big-supply/electron/opr', data })
}

// 发起申请详情
export const detail = (params) => {
  return request.get({ url: '/system/big-supply/electron/detail', params })
}

// 发起申请列表
export const detail1 = (params) => {
  return request.get({ url: '/system/big-supply/electron/detail', params })
}

// 关联群授信弹窗取数
export const qryRelatedGroupCreditGrantPage = (params) => {
  return request.get({ url: '/system/singleCreditApply/qryRelatedGroupCreditGrantPage', params })
}

// 导出
export const download = (params) => {
  return request.download({ url: '/system/big-supply/electron/export', params })
}