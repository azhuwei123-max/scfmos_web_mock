import request from '@/config/axios'



export const getUserPassword = (params) => {
  return request.get({
    url:'/system/user/getPass',
    params
  })
}