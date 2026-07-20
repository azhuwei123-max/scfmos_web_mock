import request from '@/config/axios'

// 获得信贷iframeurl
export const getIframeUrl = (params) => {
  return request.get({ url: '/system/codeLibrary/getIframeUrl', params })
}
