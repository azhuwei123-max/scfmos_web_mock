import request from '@/config/axios'

// 获得字典
export const getAcctInst = (params) => {
  return request.get({ url: '/system/codeLibrary/getAcctInst', params })
}