import request from '@/config/axios'

// 菜单
export const getCustomerView = (params) => {
  return request.get({ url: '/system/business/approveMenu/Menu', params })
}


/** 根据项目号获取决策模板页面 */
export const getTemplateInfo = (params) => {
  return request.get({ url: '/system/modelManage/apply/getTemplateInfo', params})
}

/** 根据项目号获取模板内容数据 */
export const getTemplateValue = (params) => {
  return request.get({ url: '/system/modelManage/apply/getTemplateValue', params})
}

/** 详情保存 */
export const paramAdjustSaveApply = (data) => {
  return request.post({ url: '/system/modelManage/apply/changeSave', data})
}

export const tempSave = (data) => {
  return request.post({ url: '/system/modelManage/apply/tempSave', data})
}



/** 查看模型申请详情附属表 */
export const modelDetailListReq = (params) => {
  return request.get({ url: '/system/modelManage/apply/getModelDetailListReq', params})
}




/** 附属表的模板 */
export const getSimpleTemplateInfo = (params) => {
  return request.get({ url: '/system/modelManage/apply/getSimpleTemplateInfo', params})
}



/** 附属表的模板 */
export const getApplyPartenterTemplateVO = (params) => {
  return request.get({ url: '/system/modelManage/apply/getTemplateValue', params})
}



/** 附属表的申请 */
export const dealApplyPartenterInfo = (data) => {
  return request.post({ url: '/system/modelManage/apply/relativeSave', data})
}


/** 附属表的删除接口 */
export const deleteModelRelativeReq = (data) => {
  return request.delete({ url: `/system/modelManage/apply/deleteModelRelativeReq`,data})
}
