import request from '@/config/axios'

// 列表
export const preViewReport = (data) => {
  return request.post({ url: '/system/putout-info/preViewReport', data })
}

// 查看批复
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}
