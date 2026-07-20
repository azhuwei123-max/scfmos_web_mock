import request from '@/config/axios'

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}

// 判断填写放贷通知书提示
export const judgeFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/judgeFormatReport', data })
}

// 填写放贷通知书前置操作
export const preEditFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/preEditFormatReport', data })
}

// 填写放贷通知书
export const editFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/editFormatReport', data })
}

// 查看放贷通知书
export const viewFormatReport = (data) => {
  return request.post({ url: '/system/putout-info/viewFormatReport', data })
}

/** 根据项目号获取决策模板页面 */
export const getTemplateInfo = (params) => {
  return request.get({ url: '/system/paramAdjust/getTemplateInfo', params})
}

/** 获取参与维护列表值 */
export const getListValue = (data) => {
  return request.post({ url: '/system/paramAdjust/getTemplatePageValue', data})
}