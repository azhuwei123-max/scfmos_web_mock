import request from '@/config/axios'

// 列表接口
export const pageQFDFList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/pageQFDFList', data })
}

// 详情列表
export const getQFDFDetailList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/getQFDFDetailList', data })
}

// 更新交易结果
export const updateResult = (data) => {
  return request.post({ url: '/system/sxctCreditApply/updateResult', data })
}

// 修改状态
export const modifyStatus = (data) => {
  return request.post({ url: '/system/sxctCreditApply/modifyStatus', data })
}

// 清分强制取消
export const noticToCT = (data) => {
  return request.post({ url: '/system/sxctCreditApply/noticToCT', data })
}