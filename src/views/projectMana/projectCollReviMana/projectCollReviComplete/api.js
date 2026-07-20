import request from '@/config/axios'

// 列表
export const qryCompletedPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/qryCompletedPage', params })
}

// 导出
export const qryCompletedExportExcel = (params) => {
  return request.download({ url: '/system/projectCoreviewApply/qryCompletedExportExcel', params })
}

// 流转记录
export const getFlowRecordPage = (params) => {
  return request.get({ url: '/system/credit-flow/getFlowRecordPage', params })
}