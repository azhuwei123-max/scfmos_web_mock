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

// 获取授信申请加绿色金融字段的业务品种
export const getGreenTypes = (params) => {
  return request.get({ url: '/system/codeLibrary/getGreenTypes', params })
}


// 额度分配信息
export const creditAllotInfo = (params) => {
  return request.get({ url: '/system/singleCreditApply/creditAllotInfo', params })
}

// 业务分配信息
export const businessAllotList = (params) => {
  return request.get({ url: '/system/singleCreditApply/businessAllotList', params })
}

// 获取授信标识
export const getTempSaveFlag = (params) => {
  return request.get({ url: '/system/singleCreditApply/getTempSaveFlag', params })
}

// 分配信息初始化详情
export const initAllotDetail = (params) => {
  return request.get({ url: '/system/singleCreditApply/initAllotDetail', params })
}

// 业务分配信息字段
export const businessAllotField = (params) => {
  return request.get({ url: '/system/singleCreditApply/businessAllotField', params })
}

// 业务分配信息详情
export const businessAllotDetail = (params) => {
  return request.get({ url: '/system/singleCreditApply/businessAllotDetail', params })
}

// 额度分配信息详情
export const creditAllotDetail = (params) => {
  return request.get({ url: '/system/singleCreditApply/creditAllotDetail', params })
}

// 额度分配信息字段
export const creditAllotField = (params) => {
  return request.get({ url: '/system/singleCreditApply/creditAllotField', params })
}

// 额度分配信息字段
export const saveCreditAllot = (data) => {
  return request.post({ url: '/system/singleCreditApply/saveCreditAllotDetail', data })
}

// 额度分配信息字段
export const editCreditAllot = (data) => {
  return request.post({ url: '/system/singleCreditApply/editCreditAllotDetail', data })
}

export const deleteCreditAllot = (data) => {
  return request.post({ url: '/system/singleCreditApply/deleteCreditAllotDetail', data })
}


// 额度分配信息字段
export const saveBusinessAllot = (data) => {
  return request.post({ url: '/system/singleCreditApply/saveBusinessAllotDetail', data })
}

// 额度分配信息字段
export const editBusinessAllot = (data) => {
  return request.post({ url: '/system/singleCreditApply/editBusinessAllotDetail', data })
}

export const deleteBusinessAllot = (data) => {
  return request.post({ url: '/system/singleCreditApply/deleteBusinessAllotDetail', data })
}
// 获得业务树结构通用接口
export const businessTypeTreeList = (params) => {
  return request.get({ url: '/system/codeLibrary/businessTypeTreeList', params })
}

// 查看批复通知书
export const viewEdpfReport = (data) => {
  return request.post({ url: '/system/putout-info/viewEdpfReport', data })
}
// 获取文本合同编号
export const artificialNo = (params) => {
  return request.get({ url: '/system/singleCreditApply/artificialNo', params })
}

// 判断供应链字段是否只读
export const getDockUrl = (params) => {
  return request.get({ url: '/system/codeLibrary/getDockUrl', params })
}
