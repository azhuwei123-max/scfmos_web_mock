import request from '@/config/axios'

export const getModelDevPage = (params) => {
  return request.get({ url: '/system/modelManage/apply/getModelDevPage', params})
}

export const saveGYLModelReqID = (data) => {
  return request.post({ url: '/system/modelManage/apply/saveGYLModelReqID', data})
}

export const queryModelDevProgress = (params) => {
  return request.get({ url: '/system/modelManage/apply/queryModelDevProgress', params})
}