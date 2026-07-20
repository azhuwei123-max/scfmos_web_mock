import request from '@/config/axios'

// 菜单
export const getCustomerView = (params) => {
  return request.get({ url: '/system/business/approveMenu/Menu', params })
}

// 待进件授信
export const creditApplyPending = (params) => {
  return request.get({ url: '/system/big-supply/application/credit-apply-pending', params })
}

// 已进件授信
export const creditApplyProcessed = (params) => {
  return request.get({ url: '/system/big-supply/application/credit-apply-processed', params })
}
// 取消授信
export const creditApplyFailure = (params) => {
  return request.get({ url: '/system/big-supply/application/credit-apply-failure', params })
}
// 有效放贷
export const putOutApplyEffective = (params) => {
  return request.get({ url: '/system/big-supply/application/put-out-apply-effective', params })
}
// 失效放贷
export const putOutApplyFailure = (params) => {
  return request.get({ url: '/system/big-supply/application/put-out-apply-failure', params })
}
// 取消放贷
export const putOutApplyCancel = (params) => {
  return request.get({ url: '/system/big-supply/application/put-out-apply-cancel', params })
}

export const getApi = (type) => {
  return {
    1: creditApplyPending,
    2: creditApplyProcessed,
    3: creditApplyFailure,
    4: putOutApplyEffective,
    5: putOutApplyFailure,
    6: putOutApplyCancel,
  }[type]
}

// 待进件授信
export const creditApplyPendingExport = (params) => {
  return request.download({ url: '/system/big-supply/application/credit-apply-pending-export', params })
}
// 已进件授信
export const creditApplyProcessedExport = (params) => {
  return request.download({ url: '/system/big-supply/application/credit-apply-processed-export', params })
}
// 取消授信
export const creditApplyFailureExport = (params) => {
  return request.download({ url: '/system/big-supply/application/credit-apply-failure-export', params })
}
// 有效放贷
export const putOutApplyEffectiveExport = (params) => {
  return request.download({ url: '/system/big-supply/application/put-out-apply-effective-export', params })
}
// 失效放贷
export const putOutApplyFailureExport = (params) => {
  return request.download({ url: '/system/big-supply/application/put-out-apply-failure-export', params })
}
// 取消放贷
export const putOutApplyCancelExport = (params) => {
  return request.download({ url: '/system/big-supply/application/put-out-apply-cancel-export', params })
}

export const getExportApi = (type) => {
  return {
    1: creditApplyPendingExport,
    2: creditApplyProcessedExport,
    3: creditApplyFailureExport,
    4: putOutApplyEffectiveExport,
    5: putOutApplyFailureExport,
    6: putOutApplyCancelExport,
  }[type]
}

// 重新生成放贷
export const newPutout = (data) => {
  return request.post({ url: `/system/big-supply/application/new-put-out/${data.serialNo}`, data })
}