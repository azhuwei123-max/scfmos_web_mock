import request from '@/config/axios'

// 挑选列表
export const selectReviewApply = (params) => {
  return request.get({ url: '/system/business-contract/select-review-apply', params })
}

export const selectPutOutReviewApply = (params) => {
  return request.get({ url: '/system/putout-info/select-review-apply', params })
}
