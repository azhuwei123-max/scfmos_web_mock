import request from '@/config/axios'

// 获得字典
export const getCodeLibraryList = (params) => {
  return request.get({ url: '/system/codeLibrary/list', params })
}

// 获得客户详情数据
export const creditLineDetail = (params) => {
  return request.get({ url: '/system/customerinfo/ent/creditLineDetail', params })
}

// 获取客户详情表单字段配置
export const creditLineTemplateFiled = (params) => {
  return request.get({ url: '/system/customerinfo/ent/creditLineTemplateFiled', params })
}

// 获取客户详情表单字段配置
export const creditLineTemplateGroup = (params) => {
  return request.get({ url: '/system/customerinfo/ent/creditLineTemplateGroup', params })
}

// 保存
export const save = (data) => {
  return request.post({ url: '/system/business-contract/save', data })
}

// 暂存
export const tempSave = (data) => {
  return request.post({ url: '/system/business-contract/temp-save', data })
}

// 获取文本合同编号
export const artificialNo = (params) => {
  return request.get({ url: '/system/business-contract/artificialNo', params })
}


