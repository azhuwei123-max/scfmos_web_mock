import request from '@/config/axios'

// 获得字典
export const getCodeLibraryList = (params) => {
  return request.get({ url: '/system/codeLibrary/list', params })
}

// 获得授信详情数据
export const getChangeCustomerInfo = (params) => {
  return request.get({ url: '/system/singleCreditApply/getDetailInfo', params })
}

// 获得城市树
export const getCityTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/orgTypeTreeList', params })
}

// 获得国家树
export const getCountryTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/countryTreeList', params })
}

// 客户详情保存
export const saveChangeCustomer = (params) => {
  return request.post({ url: '/system/customerinfo/ent/saveChangeCustomer', params })
}

// 获得城市树
export const getSurplusIndustryTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/surplusIndustryTreeList', params })
}

// 上级公司名称
export const getSuperEntPage = (params) => {
  return request.get({ url: '/system/customerinfo/ent/getSuperEntPage', params })
}

// 暂存按钮是否显示
export const entTempSaveFlag = (params) => {
  return request.get({ url: '/system/customerinfo/ent/entTempSaveFlag', params })
}

// ecif导入按钮显影
export const entImportFlag = (params) => {
  return request.get({ url: '/system/customerinfo/entImportFlag', params })
}

// ecif导入按钮显影
export const getEcifIndInfo = (params) => {
  return request.get({ url: '/system/custom-self-employed/getEcifIndInfo', params })
}

// 获取客户详情表单字段配置
export const getDock = (params) => {
  return request.get({ url: '/system/custom-self-employed/getDock', params })
}

// 获取客户详情表单字段配置
export const getTemplateVO = (params) => {
  // return request.get({ url: '/system/customerinfo/ent/getTemplateVO', params })
  return request.get({ url: '/system/singleCreditApply/getCreditTempFiled', params })
}

// 获取客户详情表单字段配置
export const getCustomerTemplateNo = (params) => {
  return request.get({ url: '/system/singleCreditApply/getCreditTempFiled', params })
}

// 保存
export const saveCustomer = (data) => {
  return request.post({ url: '/system/credit-apply/saveRecord', data })
}

// 获得城市树
export const getIndustryTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/industryTreeList', params })
}

// 获取授信申请加绿色金融字段的业务品种
export const getGreenTypes = (params) => {
  return request.get({ url: '/system/codeLibrary/getGreenTypes', params })
}

// 获取文本合同编号
export const artificialNo = (params) => {
  return request.get({ url: '/system/singleCreditApply/artificialNo', params })
}

// 判断供应链字段是否只读
export const getDockUrl = (params) => {
  return request.get({ url: '/system/codeLibrary/getDockUrl', params })
}

export const getProjectInfoByBS = (params) => {
  return request.get({ url: '/system/paramAdjust/getProjectInfoByBS', params })
}

export const getProductTermPara = (params) => {
  return request.get({ url: '/system/paramAdjust/getProductTermPara', params })
}