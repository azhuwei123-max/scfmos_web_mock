import request from '@/config/axios'



export const getFRUrl = (data) => {
  return request.post({
    url:'/system/common/getFRUrl',
    data
  })
}