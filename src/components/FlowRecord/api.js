import request from '@/config/axios'



export const getFlowRecordPage = (params) => {
  return request.get({ url: '/system/credit-flow/getFlowRecordPage', params })
}