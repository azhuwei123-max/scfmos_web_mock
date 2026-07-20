import request from '@/config/axios'



// 待处理申请api

export const applicationPenddingApi = {
  // 查询待处理申请分页
  getApplicationPenddingPage:async(params) => {
    return await request.get({url:`/system/credit-apply/todolist`,params})
  },
  // 授信续作
  creditQrySequelBusinessPage:async(params) => {
    return await request.get({url:`/system/creditLimitApply/qrySequelBusinessPage`,params})
  },
  // 待处理申请 详情
  getApplicationPenddingDetail:async(params) => {
    return await request.get({url:`/system/credit-apply/base-detail`,params})
  },
  
  // 关联白名单校验
  checkWhiteApply:(params) => {
    return request.get({url:`/system/credit-apply/checkWhiteApply`,params})
  },
  // 发生类型接口
  getOccurrenceTypeList:(params) => {
    return request.get({url:`/system/singleCreditApply/qryOccurrenceTypeList`,params})
  },

  // 客户编号-客户编号查询(公司) 核心
  getCustomerList:(params)=> {
    return request.get({url:`/system/singleCreditApply/qryCompangyCustomerPage`,params})
  },

  // 客户编号-客户编号查询(公司) 链属
  getlsCustomerList:(params)=> {
    return request.get({url:`/system/singleCreditApply/qrylsCompangyCustomerPage`,params})
  },
 // 客户编号-客户编号查询(个人)
  qryIndividualCustomerPage:(params)=> {
  return request.get({url:`/system/singleCreditApply/qryIndividualCustomerPage`,params})
},

  //业务品种
  getBusinessTypeTree:(params)=> {
    return request.get({url:`/system/singleCreditApply/getBusinessTypeTree`,params})
  },
 // 续作业务
  qrySequelBusinessPage:(params)=> {
    return request.get({url:`/system/singleCreditApply/qrySequelBusinessPage`,params})
  },
  // 提额业务
  qryIncreaseBusinessPage:(params)=> {
    return request.get({url:`/system/singleCreditApply/qryIncreaseBusinessPage`,params})
  },
  // 复议 业务类型 客户编号必传
  qryReconsiderationBusinessPage:(params)=> {
    return request.get({url:`/system/singleCreditApply/qryReconsiderationBusinessPage`,params})
  },

  // 关联展期业务
  qryRelatedExtensionBusinessPage:(params) => {
    return request.get({url:`/system/singleCreditApply/qryRelatedExtensionBusinessPage`,params})
  },
  // 关联白名单
  getWhiteApplyList:(params) => {
    return request.get({url:`/system/credit-apply/getWhiteApplyList`,params})
  },
 //  关联群授信(业务品种为一般经营性贷款时展示)
  qryRelatedGroupCreditGrantPage:(params) => {
    return request.get({url:`/system/singleCreditApply/qryRelatedGroupCreditGrantPage`,params})
  },
  // 关联重组方案（发生方式为重组时才展示）
  qryRelatedReorganizationPlanPage:(params) => {
    return request.get({url:`/system/singleCreditApply/qryRelatedReorganizationPlanPage`,params})
  },
  // 获取产品版本
  getProductVersion:(params) => {
    return request.get({url:`/system/singleCreditApply/getProductVersion`,params})
  },
  // 保存
  addSingleCreditApply:(data) => {
    return request.post({url:`/system/singleCreditApply/addSingleCreditApply`,data})
  },
  // 根据白名单获取关联群授信
  getCreditByWhite:(params) => {
    return request.get({url:`/system/creditLimitApply/getCreditByWhite`,params})
  }
}
