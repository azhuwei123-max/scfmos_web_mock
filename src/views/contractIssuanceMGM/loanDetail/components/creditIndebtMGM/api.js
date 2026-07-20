import request from '@/config/axios'


export const goToIndebtPutOut = (params) => {
  return request.get({ url: '/system/putout-info/goToIndebtPutout', params })
}
