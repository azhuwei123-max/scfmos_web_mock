import request from '@/config/axios'

// 获取BC流水号
export const bcByProjectId = (params) => {
  return request.get({ url: '/system/big-supply/application/bc-by-projectId', params })
}
