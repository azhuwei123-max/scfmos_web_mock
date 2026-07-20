import request from '@/config/axios'

// 菜单
export const getCustomerView = (params) => {
  return request.get({ url: '/system/singleCreditApply/getMenuList', params })
}

// 根据授信编号查询关联项目是否支持快速发起
export const getQuickFlagBySerialNo = (params) => {
  return request.get({ url: '/system/singleCreditApply/getQuickFlagBySerialNo', params })
}
