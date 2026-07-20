import request from '@/config/axios'

// 获取客户详情表单字段配置
export const getTemplateVO = (params) => {
  return request.get({ url: '/system/codeLibrary/getTemplateVO', params })
}

// 执行sql
export const executeSql = (data) => {
  return request.post({ url: '/system/codeLibrary/executeSql', data })
}

// 执行sql
export const executeBatchSql = (data) => {
  return request.post({ url: '/system/codeLibrary/executeBatchSql', data })
}

// 获得字典
export const getCodeLibraryList = (params) => {
  
  return request.get({ url: '/system/codeLibrary/list', params })
}

// 获得树结构通用接口
export const codeLibraryTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/codeLibraryTreeList', params })
}

// 获取模板
export const getTemplateValue = (params) => {
  return request.get({ url: '/system/common/getTemplateValue', params })
}





