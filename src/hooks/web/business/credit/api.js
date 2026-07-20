import request from '@/config/axios'

// 提交审批意见
export const getPreLoanAssetRiskClass =async (params) =>{
  return await request.get({ url: `/system/credit-apply/getPreLoanAssetRiskClass`, params })
}