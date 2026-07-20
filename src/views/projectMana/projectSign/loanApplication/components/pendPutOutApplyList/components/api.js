import request from '@/config/axios'

// 列表接口
export const getBusinessContractPage = (data) => {
  return request.post({ url: '/system/business-contract/getBusinessContractPage', data })
}

// 新增放贷
export const newApply = (data) => {
  data.creditSourceFlag='01'
  return request.post({ url: 'system/putout-info/newApply', data })
}
