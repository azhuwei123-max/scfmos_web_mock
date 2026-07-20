import request from '@/config/axios'

export const getMenuList = () => {
  return request.get({ url: '/system/ProjectWhiteList/getMenu' })
}

/** 获得供应链决策数据申请列表 */
export const getProjectWhiteList = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getProjectWhiteList', params })
}

/** 获得合作项目列表 */
export const getSelectAutoProjectList = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/selectAutoProject', params })
}

/** 获得客户列表 */
export const getSelectJcCustomerProject = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/selectJcCustomerProject', params })
}

/** 获得借款人类型列表 */
export const getBorrowerType = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getBorrowerType', params })
}

/**导出excel */
export const exportExcel = (params) => {
  return request.download({ url: '/system/ProjectWhiteList/export-excel', params })
}


/** 新增决策模型 */
export const addProjectWhite = (data) => {
  return request.post({ url: '/system/ProjectWhiteList/addProjectWhite', data })
}


/** 取消决策模型申请 */
export const cancelProjectWhite = (data) => {
  return request.post({ url: '/system/ProjectWhiteList/cancelProjectWhite', data })
}

/** 获得模型列表 */
export const getModelName = () => {
  return request.get({ url: '/system/ProjectWhiteList/getModelName' })
}

/** 导入excel */
export const importExcel = (data) => {
  return request.upload({ url: '/system/ProjectWhiteList/import-excel', data })
}

/** 根据项目号获取模板内容 */
export const getProjectTemplateVO = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getJcModelTemplateVO', params })
}

/** 根据项目号获取模板内容数据 */
export const getProjectTemplateValue = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getJcModelTemplateValue', params })
}

/** 获取企业名称列表 */
export const getSelectRelativeEntMsg = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/selectRelativeEntMsg', params })
}


/** 获取受托支付列表 */
export const selectProjectPay = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/selectProjectPay', params })
}



/** 保存模板内容数据 */
export const saveJcModelTemplateValue = (data) => {
  return request.post({ url: '/system/ProjectWhiteList/saveJcModelTemplateValue', data })
}

/** 获得供应链决策数据风险探测前置 没查到数据直接提交 不调风险探测接口 */
export const beforeRisk = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/beforeRisk', params })
}

/** 根据决策流水号还获取担保人列表模板 */
export const getGuarantyListemplateVO = () => {
  return request.get({ url: '/system/ProjectWhiteList/getGuarantyListemplateVO' })
}

/** 根据决策流水号还获取担保人列表模板 */
export const getGuarantyListValue = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getGuarantyListValue', params })
}

/** 根据决策流水号还获取担保人详情模板 */
export const getGuarantyInfoTemplateVO = () => {
  return request.get({ url: '/system/ProjectWhiteList/getGuarantyInfoTemplateVO' })
}

/** 根据决策流水号还获取担保人详情模板数据 */
export const getGuarantyInfoValue = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getGuarantyInfoValue', params })
}

/** 借款人姓名查询客户 */
export const selectBoCustomer = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/selectBoCustomer', params })
}
/** 用款企业查询客户 */
export const selectEntCustomer = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/selectEntCustomer', params })
}
/** 受托支付开户行 */
export const getBankList = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getBankList', params })
}
/** 处理担保人详情模板 */
export const dealGuarantyInfo = (data) => {
  return request.post({ url: '/system/ProjectWhiteList/dealGuarantyInfo', data })
}

/** 根据决策流水号获取合作商列表内容数据 */
export const getAutoApplyPartenterListValue = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getAutoApplyPartenterListValue', params })
}

/** 根据决策流水号还获取合作商列表模板 */
export const getAutoApplyPartenterListTemplateVO = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getAutoApplyPartenterListTemplateVO', params })
}

/** 根据决策流水号还获取合作商详情模板 */
export const getApplyPartenterTemplateVO = () => {
  return request.get({ url: '/system/ProjectWhiteList/getApplyPartenterTemplateVO' })
}

/** 根据决策流水号还获取合作商详情模板 */
export const getApplyPartenterInfoValue = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/getApplyPartenterInfoValue', params })
}

/** 处理合作商详情模板 */
export const dealApplyPartenterInfo = (data) => {
  return request.post({ url: '/system/ProjectWhiteList/dealApplyPartenterInfo', data })
}

/** 处理合作商详情模板 */
export const searchInDebtInfo = (params) => {
  return request.get({ url: '/system/ProjectWhiteList/searchInDebtInfo', params })
}


/** 跳转信贷 */
export const getIframeUrl = (params) => {
  return request.get({ url: '/system/codeLibrary/getIframeUrl', params })
}

/**导出excel */
export const autoApplyPartenterExport = (params) => {
  return request.download({ url: '/system/ProjectWhiteList/autoApplyPartenterExport', params })
}

/** 点击提交前校验是否已经保存签署意见 */
export const checkComment = (params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}

/**决策模型模板下载 */
export const templatesDownload = (modelNo) => {
  return request.download({ url: '/system/ProjectWhiteList/' + modelNo })
}
