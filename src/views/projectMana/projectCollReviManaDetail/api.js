import request from '@/config/axios'

// 获得字典
export const getDetail = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/get', params })
}

// 保存
export const saveRecord = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/saveRecord', data })
}

// 暂存
export const tempSaveRecord = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/tempSaveRecord', data })
}
