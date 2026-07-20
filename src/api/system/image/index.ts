import request from '@/config/axios'

// 查影像链接
export const queryImgUrl = async (params) => {
  return request.get({ url: '/system/image/url', params })
}

// 查所有影像节点 只目录
export const queryImgDefault = async () => {
  return request.get({ url: '/system/image/default' })
}
