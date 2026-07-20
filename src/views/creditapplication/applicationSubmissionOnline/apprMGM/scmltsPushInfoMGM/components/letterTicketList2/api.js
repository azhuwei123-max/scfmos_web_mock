import request from '@/config/axios'

// 列表接口
export const pageQFDFList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/pageQFDFList', data })
}

// 详情列表
export const getQFDFDetailList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/getQFDFDetailList', data })
}