import request from '@/config/axios'

// 获得字典
export const getCodeLibraryList = (params) => {
  return request.get({ url: '/system/codeLibrary/list', params })
}

// 获得客户详情数据
export const getDetailInfo = (params) => {
  return request.get({ url: '/system/business-approve/getDetailInfo', params })
}

// 获取客户详情表单字段配置
export const creditLineTemplateFiled = (params) => {
  return request.get({ url: '/system/customerinfo/ent/creditLineTemplateFiled', params })
}

// 获取客户详情表单字段配置
export const creditLineTemplateGroup = (params) => {
  return request.get({ url: '/system/customerinfo/ent/creditLineTemplateGroup', params })
}

// 菜单
export const getApproveTempFiled = (params) => {
  return request.get({ url: '/system/business-approve/getApproveTempFiled', params })
}

// 判断供应链字段是否只读
export const getDockUrl = (params) => {
  return request.get({ url: '/system/codeLibrary/getDockUrl', params })
}
