import request from '@/config/axios'

// 列表接口
export const getCoreAcctInfoPage = (data) => {
  return request.post({ url: '/system/sxctCreditApply/getCoreAcctInfoPage', data })
}

// 查询余额
export const queryBalance = (data) => {
  return request.post({ url: '/system/sxctCreditApply/queryBalance', data })
}