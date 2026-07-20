import request from '@/config/axios'

// 列表接口
export const getProjectCoreviewPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/getProjectCoreviewPage', params})
}

// 新增
export const qryCoreviewApplyCustomerPage = (params) => {
  return request.get({ url: '/system/projectCoreviewApply/qryCoreviewApplyCustomerPage', params })
}

// 删除
export const deleteApply = (data) => {
  return request.post({ url: '/system/projectCoreviewApply/deleteApply', data })
}

/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}