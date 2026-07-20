import request from '@/config/axios'

// 获得字典
export const getCodeLibraryList = (params) => {
  return request.get({ url: '/system/codeLibrary/list', params })
}

// 获得客户详情数据
export const getPutOutDetailValue = (params) => {
  return request.get({ url: '/system/putout-info/getPutOutDetailValue', params })
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

// 获得城市树
export const getIndustryTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/industryTreeList', params })
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
  return request.get({ url: '/system/customerinfo/getCustomerPageVO', params })
}

// 获取客户详情表单字段配置
export const getPutOutTemplate = (params) => {
  return request.get({ url: '/system/putout-info/getPutOutTemplate', params })
}

// 获取客户详情表单字段配置
export const save = (data) => {
  return request.post({ url: '/system/putout-info/savePutOutDetailValue', data })
}


// 判断供应链字段是否只读
export const getDockUrl = (params) => {
  return request.get({ url: '/system/codeLibrary/getDockUrl', params })
}
