import request from '@/config/axios'

// 菜单
export const getCustomerView = (params) => {
  return request.get({ url: '/system/creditReviewapproval/creditReviewAprrovalTreeList', params })
}


// 获取 授信审查审批分页列表
export const getList = (params) => {
  return request.get({ url: '/system/creditReviewapproval/page', params })
}

// 链属授信审批 Excel
export const approveExport = (params) => {
  return  request.download({ url: `/system/creditReviewapproval/exportExcel`, params })
}


