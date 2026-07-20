import request from '@/config/axios'

// 列表接口
export const getPending = (params) => {
  return request.get({ url: '/system/big-supply/not-passed/notice', params })
}

// 新增列表
export const getCanAddCredit = (params) => {
  return request.get({ url: '/system/big-supply/not-passed/can-add-credit', params })
}

// 新增列表
export const getCanAddBp = (params) => {
  return request.get({ url: '/system/big-supply/not-passed/can-add-bp', params })
}

// 填写未通过原因
export const reason = (data) => {
  return request.post({ url: '/system/big-supply/not-passed/reason', data })
}

// 填写未通过原因
export const exportExcel = (params) => {
  return request.download({ url: '/system/big-supply/not-passed/export', params })
}

// 删除
export const delete1 = (data) => {
  return request.delete({ url: '/system/big-supply/not-passed/delete', data })
}

// 列表接口
export const notice = (objectNo) => {
  return request.post({ url: `/system/big-supply/not-passed/notice/${objectNo}` })
}

// 列表接口
export const addSave = (data) => {
  return request.post({ url: `/system/big-supply/not-passed/add`, data })
}
