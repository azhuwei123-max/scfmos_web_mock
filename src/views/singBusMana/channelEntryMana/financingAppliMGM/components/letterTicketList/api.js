import request from '@/config/axios'

// 列表接口
export const pagePutOutList = (data) => {
  return request.post({ url: '/system/sxctCreditApply/pagePutOutList', data })
}

// 购买
export const confirmBuy = (data) => {
  return request.post({ url: '/system/sxctCreditApply/confirmBuy', data })
}

// 
export const queryAcctInfoPage = (params) => {
  return request.get({ url: '/system/sxctCreditApply/queryAcctInfoPage', params })
}

// 进件审批
export const applyProcess = (data) => {
  return request.post({ url: '/system/sxctCreditApply/applyProcess', data })
}

// 修改收款账号
export const getAcctInfoPage = (data) => {
  return request.post({ url: '/system/sxctCreditApply/getAcctInfoPage', data })
}

// 修改确认
export const modifyAcctNoInfo = (data) => {
  return request.post({ url: '/system/sxctCreditApply/modifyAcctNoInfo', data })
}

// 修改状态
export const modifyStatus = (data) => {
  return request.post({ url: '/system/sxctCreditApply/modifyStatus', data })
}

// 获取模板
export const getTemplateValue = (params) => {
  return request.get({ url: '/system/common/getTemplateValue', params })
}