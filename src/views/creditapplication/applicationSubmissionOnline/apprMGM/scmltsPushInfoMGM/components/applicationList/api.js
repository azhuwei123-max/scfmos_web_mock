import request from '@/config/axios'

// 列表接口
export const getList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/page', data })
}

// 进件通过
export const applyPass = (data) => {
  return request.post({ url: '/system/sxctCreditApply/applyPass', data })
}

// 进件审批
export const applyProcess = (data) => {
  return request.post({ url: '/system/sxctCreditApply/applyProcess', data })
}

// 选择用户
export const selectAllUser = (data) => {
  return request.post({ url: '/system/sxctCreditApply/selectAllUser', data })
}