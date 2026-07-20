import request from '@/config/axios'


export const creditApplyJobApi  = {
  getList:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/qryApplyListPage`,params})
  },
  qryPeerCustomerPage:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/qryPeerCustomerPage`,params})
  },
  qrylsPeerCustomerPage:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/qrylsPeerCustomerPage`,params})
  },
  qryBusinessVarietyTree:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/qryBusinessVarietyTree`,params})
  },

  // 合作项目 :  当业务品种选择了供应链群额度(3030070)/供应链间接授信额度(3030030)时才展示，且必输。客户经理手动选择
  qryCooperativeProjectPage:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/qryCooperativeProjectPage`,params})
  },
  // 保存授信额度申请
  saveCreditLimitApply:async(data)=> {
    return await request.post({url:`/system/creditLimitApply/saveCreditLimitApply`, data})
  },
  // 尽职调查报告
  aa:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/qryBusinessVarietyTree`,params})
  },
  getFormatDocData:async(data) => {
    return await request.post({url:`/system/format-doc-data/get`,data})
  },
  // 获得格式化模板列表
  getTemplateList:async(data) => {
    return await request.post({url:`/system/format-doc-data/template-list`,data})
  },
  // 填写尽职报告
  createFormatDocData:async(data) => {
    return await request.post({url:`/system/format-doc-data/create`,data})
  },
  // 填写尽职报告
  formatDocDataDelete:async(data) => {
    return await request.delete({url:`/system/format-doc-data/delete`,data})
  },
  viewFormatDocData:async(data) => {
    return await request.post({url:`/system/format-doc-data/view`,data})
  },

  genReportCheck:async(data) => {
    return await request.post({url:`/system/format-doc-data/genReportCheck`,data})
  },
  viewEdpfReport:async (data) => {
    return request.post({ url: '/system/putout-info/viewEdpfReport', data })
  },
  // 取消业务
  cancelContract:async(data) => {
    return request.post({ url: '/system/business-contract/cancelContract', data })
  },
  //判断所关联的项目需要存在对应审批通过的新增或续作协审
  getProjectcoreviewApplyCount:async(params)=> {
    return await request.get({url:`/system/creditLimitApply/getProjectcoreviewApplyCount`,params})
  },
  
  //点击提交前校验是否已经保存签署意见
  checkComment:async(params)=> {
    return await request.get({url:`/system/modelManage/apply/checkComment`,params})
  },
  // 导出 Excel
  export :async (params) => {
    return await request.download({ url: `/system/creditLimitApply/exportExcel`, params })
  },
  // 单笔授信导出 Excel
  singleExport :async (params) => {
    return await request.download({ url: `/system/credit-apply/exportExcel`, params })
  },
}
