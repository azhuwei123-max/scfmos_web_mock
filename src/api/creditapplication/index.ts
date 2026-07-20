import request from '@/config/axios'

// 待处理申请api

export const applicationPenddingApi = {
  // 查询待处理申请分页
  getApplicationPenddingPage:async(params) => {
    return await request.get({url:`/system/credit-apply/todolist`,params})
  },

  // 待处理申请 详情
  getApplicationPenddingDetail:async(params) => {
    return await request.get({url:`/system/credit-apply/base-detail`,params})
  },
  
  // 关联白名单校验
  checkWhiteApply:(params) => {
    return request.get({url:`/system/credit-apply/checkWhiteApply`,params})
  },
  /** 点击提交前校验是否已经保存签署意见 */
 checkComment:(params) => {
  return request.get({ url: 'system/modelManage/apply/checkComment', params })
}
  
}




